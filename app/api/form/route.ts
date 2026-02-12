/**
 * Form Submission API Route
 * POST /api/form/submit
 * 
 * Handles:
 * 1. Rate limiting (5 submissions per hour per IP)
 * 2. Input sanitization (XSS prevention)
 * 3. Form data validation
 * 4. File uploads (logo, images)
 * 5. Save to database
 * 6. Trigger background AI generation via Next.js after()
 */

import { NextRequest, NextResponse, after } from 'next/server';
import { prisma } from '@/lib/prisma';
import { imageProcessingService } from '@/services/image-processing.service';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { checkRateLimit, getClientIP, RateLimiters, rateLimitResponse } from '@/lib/rate-limiter';
import { sanitizeText, sanitizeEmail, sanitizePhone, sanitizeUrl, sanitizeColor, sanitizeRichText } from '@/lib/sanitize';

// Allow up to 5 minutes for generation (used by after() callback)
export const maxDuration = 300;

export async function POST(request: NextRequest) {
  try {
    // ========== RATE LIMITING ==========
    const clientIP = getClientIP(request);
    const rateLimitResult = checkRateLimit(clientIP, RateLimiters.formSubmission);
    
    if (!rateLimitResult.success) {
      console.warn(`🚫 Rate limit exceeded for IP: ${clientIP}`);
      return rateLimitResponse(rateLimitResult);
    }
    
    console.log(`✅ Rate limit check passed for IP: ${clientIP} (${rateLimitResult.remaining} remaining)`);

    const formData = await request.formData();

    // ========== EXTRACT & SANITIZE FORM FIELDS ==========
    // All user inputs are sanitized to prevent XSS attacks
    const businessName = sanitizeText(formData.get('businessName') as string);
    const tagline = sanitizeText(formData.get('tagline') as string | null);
    const about = sanitizeRichText(formData.get('about') as string); // Allow basic formatting
    const industry = sanitizeText(formData.get('industry') as string | null);
    const email = sanitizeEmail(formData.get('email') as string);
    const displayEmail = sanitizeEmail(formData.get('displayEmail') as string | null);
    const phone = sanitizePhone(formData.get('phone') as string | null);
    const address = sanitizeText(formData.get('address') as string | null);

    // Parse arrays - handle both JSON-serialized and multipart array formats
    // Then sanitize each service entry
    let services: string[] = [];
    const servicesField = formData.get('services');
    if (servicesField) {
      if (typeof servicesField === 'string' && servicesField.startsWith('[')) {
        // JSON array format
        services = JSON.parse(servicesField);
      } else {
        // Single string or first entry in multipart array
        services = [servicesField as string];
        // Check for additional service entries (formData.getAll for arrays)
        const allServices = formData.getAll('services');
        if (allServices.length > 1) {
          services = allServices.map(s => s.toString());
        }
      }
    }
    // Sanitize all service entries
    services = services.map(s => sanitizeText(s)).filter(s => s.length > 0);

    const targetAudience = sanitizeText(formData.get('targetAudience') as string | null);
    
    // Parse and sanitize social links
    const socialLinksField = formData.get('socialLinks');
    let socialLinks: Record<string, string> = {};
    if (socialLinksField && typeof socialLinksField === 'string' && socialLinksField.startsWith('{')) {
      const parsed = JSON.parse(socialLinksField);
      // Sanitize each social link URL
      for (const [key, value] of Object.entries(parsed)) {
        if (typeof value === 'string') {
          const sanitizedUrl = sanitizeUrl(value);
          if (sanitizedUrl) {
            socialLinks[sanitizeText(key)] = sanitizedUrl;
          }
        }
      }
    }

    // Parse and sanitize testimonials
    // Map from form format {authorName, authorRole, quote} to template format {quote, author, role}
    let testimonials: Array<{ quote: string; author: string; role: string }> = [];
    const testimonialsField = formData.get('testimonials');
    console.log(`[DEBUG] Raw testimonials field:`, testimonialsField);
    if (testimonialsField && typeof testimonialsField === 'string') {
      try {
        const parsed = JSON.parse(testimonialsField);
        console.log(`[DEBUG] Parsed testimonials:`, JSON.stringify(parsed, null, 2));
        if (Array.isArray(parsed)) {
          testimonials = parsed
            .filter(t => t && typeof t === 'object')
            .map(t => {
              const mapped = {
                // Map: authorName/name/author → author, quote/text → quote, authorRole/role → role
                quote: sanitizeText(t.quote || t.text),
                author: sanitizeText(t.authorName || t.name || t.author),
                role: sanitizeText(t.authorRole || t.role) || 'Customer',
              };
              console.log(`[DEBUG] Mapped testimonial:`, mapped);
              return mapped;
            })
            .filter(t => t.author && t.quote);
          console.log(`[DEBUG] Final testimonials after filter:`, JSON.stringify(testimonials, null, 2));
        }
      } catch (e) {
        console.warn('Failed to parse testimonials:', e);
      }
    }

    // Parse and sanitize brand colors
    let brandColors = {
      primary: '#3B82F6',
      secondary: '#1E40AF',
      accent: '#60A5FA',
    };
    const brandColorsField = formData.get('brandColors');
    if (brandColorsField && typeof brandColorsField === 'string') {
      try {
        const parsedColors = JSON.parse(brandColorsField);
        // Sanitize each color - ensures valid hex format only
        const sanitizedPrimary = sanitizeColor(parsedColors.primary);
        const sanitizedSecondary = sanitizeColor(parsedColors.secondary);
        const sanitizedAccent = sanitizeColor(parsedColors.accent);
        
        if (sanitizedPrimary && sanitizedSecondary && sanitizedAccent) {
          brandColors = {
            primary: sanitizedPrimary,
            secondary: sanitizedSecondary,
            accent: sanitizedAccent,
          };
        }
      } catch (e) {
        console.warn('Failed to parse brand colors:', e);
      }
    }

    // Parse and sanitize template type (only allow 'dark' or 'light')
    const rawTemplateType = formData.get('templateType') as string;
    const templateType = rawTemplateType === 'light' ? 'light' : 'dark';

    // Validate required fields
    if (!businessName || !about || !email || services.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: businessName, about, email, services',
        },
        { status: 400 }
      );
    }

    // Capture file uploads for background processing
    let logoUrl: string | null = null;
    let heroImageUrl: string | null = null;
    let additionalImages: string[] = [];

    let logoBuffer: Buffer | null = null;
    let logoFilename: string | null = null;

    let heroBuffer: Buffer | null = null;
    let heroFilename: string | null = null;

    const additionalFiles: Array<{ buffer: Buffer; filename: string }> = [];

    const logoFile = formData.get('logo') as File | null;
    if (logoFile) {
      const buffer = await logoFile.arrayBuffer();
      logoBuffer = Buffer.from(buffer);
      logoFilename = logoFile.name;
    }

    const heroFile = formData.get('heroImage') as File | null;
    if (heroFile) {
      const buffer = await heroFile.arrayBuffer();
      heroBuffer = Buffer.from(buffer);
      heroFilename = heroFile.name;
    }

    const additionalFilesCount = parseInt(
      (formData.get('additionalImagesCount') as string) || '0'
    );
    for (let i = 0; i < additionalFilesCount; i++) {
      const file = formData.get(`additionalImage_${i}`) as File | null;
      if (file) {
        const buffer = await file.arrayBuffer();
        additionalFiles.push({ buffer: Buffer.from(buffer), filename: file.name });
      }
    }

    // Generate credentials for the user
    // Username: lowercase business name with hyphens + random suffix (e.g., "gourmet-bistro-a3f2")
    const baseUsername = businessName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 25); // Limit to 25 chars to leave room for suffix
    
    // Add random suffix to ensure uniqueness
    const randomSuffix = crypto.randomBytes(2).toString('hex');
    const username = `${baseUsername}-${randomSuffix}`;
    
    // Password: secure random 12-character string (alphanumeric)
    const generatedPassword = crypto.randomBytes(9).toString('base64').slice(0, 12);
    const passwordHash = await bcrypt.hash(generatedPassword, 10);
    
    console.log('🔑 Generated credentials:', { username, password: generatedPassword });

    // Save to database
    const formSubmission = await prisma.formSubmission.create({
      data: {
        businessName,
        tagline: tagline || undefined,
        about,
        industry: industry || undefined,
        services,
        email,
        displayEmail: displayEmail || undefined,
        phone: phone || undefined,
        address: address || undefined,
        targetAudience: targetAudience || undefined,
        socialLinks: {
          ...socialLinks,
          _credentials: { username, password: generatedPassword } // Temporary storage in socialLinks JSON
        },
        testimonials: testimonials.length > 0 ? testimonials : undefined,
        brandColors: brandColors,
        templateType: templateType, // Store selected template type
        logoUrl,
        heroImageUrl,
        additionalImages,
        status: 'PENDING',
      },
    });

    console.log('✅ Form submission saved:', formSubmission.id);

    // Trigger website generation using Next.js after() API
    // This guarantees the callback runs after response is sent (even on Render)
    console.log('[FORM] Scheduling website generation via after()...');

    const forwardedHost = request.headers.get('x-forwarded-host');
    const host = forwardedHost || request.headers.get('host') || 'localhost:3000';
    const proto = request.headers.get('x-forwarded-proto') || 'http';
    const baseUrl = `${proto}://${host}`;

    after(async () => {
      console.log(`[GENERATE] Starting website generation for submission ${formSubmission.id}`);
      try {
        // Import services
        const { aiContentService } = await import('@/services/ai-content.service');
        const { premiumTemplateGenerator } = await import('@/services/template-generator.service');
        const { colorExtractionService } = await import('@/services/color-extraction.service');
        const { sendGridEmailService } = await import('@/services/email-sendgrid.service');
        const fs = await import('fs');
        const path = await import('path');

        // Update status to GENERATING
        await prisma.formSubmission.update({
          where: { id: formSubmission.id },
          data: { status: 'GENERATING' }
        });
        console.log(`[GENERATE] Status set to GENERATING`);

        // Step 1: Process images (one at a time, save to DB after each)
        console.log(`[GENERATE] Step 1: Processing images...`);

        // 1a: Logo
        if (logoBuffer && logoFilename) {
          try {
            console.log(`[GENERATE]   Processing logo: ${logoFilename} (${(logoBuffer.length / 1024 / 1024).toFixed(1)}MB)`);
            const result = await imageProcessingService.processLogo(logoBuffer, logoFilename);
            logoUrl = result.originalUrl;
            // Free memory immediately
            logoBuffer = null;
            // Save to DB right away so it's not lost if process crashes
            await prisma.formSubmission.update({
              where: { id: formSubmission.id },
              data: { logoUrl },
            });
            console.log(`[GENERATE]   Logo saved to DB`);
          } catch (logoError) {
            console.error(`[GENERATE]   Logo FAILED:`, (logoError as Error).message);
            logoBuffer = null;
          }
        }

        // 1b: Hero image
        if (heroBuffer && heroFilename) {
          try {
            console.log(`[GENERATE]   Processing hero: ${heroFilename} (${(heroBuffer.length / 1024 / 1024).toFixed(1)}MB)`);
            const result = await imageProcessingService.processImage(
              heroBuffer,
              heroFilename,
              'images/hero'
            );
            heroImageUrl = result.webpUrl;
            heroBuffer = null;
            await prisma.formSubmission.update({
              where: { id: formSubmission.id },
              data: { heroImageUrl },
            });
            console.log(`[GENERATE]   Hero saved to DB`);
          } catch (heroError) {
            console.error(`[GENERATE]   Hero FAILED:`, (heroError as Error).message);
            heroBuffer = null;
          }
        }

        // 1c: Additional images (one at a time, save after each)
        if (additionalFiles.length > 0) {
          console.log(`[GENERATE]   Processing ${additionalFiles.length} additional images...`);
          for (let i = 0; i < additionalFiles.length; i++) {
            try {
              const file = additionalFiles[i];
              console.log(`[GENERATE]     [${i + 1}/${additionalFiles.length}] ${file.filename} (${(file.buffer.length / 1024 / 1024).toFixed(1)}MB)`);
              const result = await imageProcessingService.processImage(
                file.buffer,
                file.filename,
                'images/additional'
              );
              additionalImages.push(result.webpUrl);
              // Free buffer
              additionalFiles[i] = { buffer: Buffer.alloc(0), filename: '' };
              // Save progress after each image
              await prisma.formSubmission.update({
                where: { id: formSubmission.id },
                data: { additionalImages },
              });
              console.log(`[GENERATE]     [${i + 1}/${additionalFiles.length}] Saved to DB`);
            } catch (addError) {
              console.error(`[GENERATE]     [${i + 1}] FAILED:`, (addError as Error).message);
              additionalFiles[i] = { buffer: Buffer.alloc(0), filename: '' };
            }
          }
        }
        console.log(`[GENERATE] Step 1 complete - logo=${!!logoUrl}, hero=${!!heroImageUrl}, additional=${additionalImages.length}`);

        // Step 2: Generate AI content
        console.log(`[GENERATE] Step 2: Generating AI content...`);
        let enhancedContent;
        try {
          enhancedContent = await aiContentService.generateWebsiteContent({
            businessName,
            tagline: tagline || '',
            about,
            services,
            industry: industry || undefined,
            targetAudience: targetAudience || undefined,
          });
          console.log(`[GENERATE] Step 2 complete - AI content generated`);
        } catch (aiError) {
          console.error(`[GENERATE] Step 2 FAILED - AI content error:`, aiError);
          throw aiError; // This is critical, can't continue without content
        }

        // Step 3: Extract colors from logo
        console.log(`[GENERATE] Step 3: Setting brand colors...`);
        let extractedColors = {
          primary: '#6366f1',
          secondary: '#8b5cf6',
          accent: '#06b6d4',
        };

        if (brandColors.primary && brandColors.secondary && brandColors.accent) {
          extractedColors = brandColors;
          console.log(`[GENERATE]   Using form brand colors: ${JSON.stringify(extractedColors)}`);
        } else if (logoUrl) {
          try {
            extractedColors = await colorExtractionService.extractFromLogo(logoUrl);
            console.log(`[GENERATE]   Extracted colors from logo: ${JSON.stringify(extractedColors)}`);
          } catch (colorError) {
            console.warn(`[GENERATE]   Color extraction failed, using defaults:`, colorError);
          }
        }

        // Step 4: Generate website template
        console.log(`[GENERATE] Step 4: Generating ${templateType} template...`);
        console.log(`[GENERATE] Testimonials to pass:`, JSON.stringify(testimonials, null, 2));
        let generatedWebsite;
        try {
          // Use displayEmail for the website contact, fallback to business email if not provided
          const websiteDisplayEmail = displayEmail || email;
          
          const contentWithTestimonials = {
            ...enhancedContent,
            testimonials: testimonials.length > 0 ? testimonials : [],
          };
          console.log(`[GENERATE] Final testimonials in content:`, JSON.stringify(contentWithTestimonials.testimonials, null, 2));
          
          generatedWebsite = await premiumTemplateGenerator.generate({
            businessName,
            content: contentWithTestimonials,
            colors: extractedColors,
            logoUrl: logoUrl || undefined,
            heroImageUrl: heroImageUrl || undefined,
            additionalImages: additionalImages || [],
            contactInfo: {
              email: websiteDisplayEmail,
              phone: phone || undefined,
              address: address || undefined,
              social: socialLinks,
            },
            templateType: templateType as 'dark' | 'light',
          });
          console.log(`[GENERATE] Step 4 complete - template generated`);
        } catch (templateError) {
          console.error(`[GENERATE] Step 4 FAILED - template error:`, templateError);
          throw templateError;
        }

        // Step 5: Save files locally
        console.log(`[GENERATE] Step 5: Saving website files...`);
        try {
          const filesDir = path.join(process.cwd(), 'generated-sites', formSubmission.id);
          await fs.promises.mkdir(filesDir, { recursive: true });

          const files = {
            'index.html': generatedWebsite['index.html'],
            'styles.css': generatedWebsite['styles.css'] || '',
            'script.js': generatedWebsite['script.js'] || '',
          };

          for (const [filename, content] of Object.entries(files)) {
            await fs.promises.writeFile(path.join(filesDir, filename), content, 'utf-8');
          }
          console.log(`[GENERATE] Step 5 complete - files saved to: ${filesDir}`);
        } catch (fsError) {
          console.error(`[GENERATE] Step 5 FAILED - filesystem error:`, fsError);
          // Don't throw - files can be regenerated, continue with user/email
        }

        // Step 6: Create user account
        console.log(`[GENERATE] Step 6: Creating user account...`);
        let user;
        try {
          user = await prisma.user.upsert({
            where: { email },
            update: { passwordHash, username },
            create: {
              id: `user-${formSubmission.id.substring(0, 8)}`,
              username,
              email,
              passwordHash,
            }
          });
          console.log(`[GENERATE] Step 6 complete - user created: ${user.id}`);
        } catch (userError) {
          console.error(`[GENERATE] Step 6 FAILED - user creation error:`, userError);
          throw userError;
        }

        // Step 7: Create generated website record
        console.log(`[GENERATE] Step 7: Creating website record...`);
        try {
          const previewUrl = `${baseUrl}/api/preview/${formSubmission.id}`;
          const loginUrl = `${baseUrl}/login`;
          const filesDir = path.join(process.cwd(), 'generated-sites', formSubmission.id);

          await prisma.generatedWebsite.create({
            data: {
              formSubmissionId: formSubmission.id,
              userId: user.id,
              businessName,
              templateId: 'universal-premium',
              primaryColor: extractedColors.primary,
              secondaryColor: extractedColors.secondary,
              accentColor: extractedColors.accent,
              filesPath: filesDir,
              previewUrl,
              deploymentUrl: null,
              deploymentProvider: null,
              deployedAt: null,
              status: 'READY',
            }
          });
          console.log(`[GENERATE] Step 7 complete - website record created`);
        } catch (webError) {
          console.error(`[GENERATE] Step 7 FAILED - website record error:`, webError);
          throw webError;
        }

        // Step 8: Update form submission status
        await prisma.formSubmission.update({
          where: { id: formSubmission.id },
          data: { status: 'GENERATED' }
        });
        console.log(`[GENERATE] Step 8 complete - status set to GENERATED`);

        // Step 9: Send emails
        const previewUrl = `${baseUrl}/api/preview/${formSubmission.id}`;
        const loginUrl = `${baseUrl}/login`;

        console.log(`[GENERATE] Step 9: Sending emails...`);
        try {
          await sendGridEmailService.sendCredentialsToUser({
            businessName,
            customerEmail: email,
            customerName: businessName,
            username,
            password: generatedPassword,
            loginUrl,
          });
          console.log(`[GENERATE]   Customer credentials email sent to ${email}`);
        } catch (emailError) {
          console.error(`[GENERATE]   FAILED to send customer email:`, emailError);
        }

        try {
          await sendGridEmailService.sendToSales({
            businessName,
            customerEmail: email,
            customerPhone: phone || undefined,
            previewUrl,
            loginUrl,
            submissionId: formSubmission.id,
            username,
            password: generatedPassword,
          });
          console.log(`[GENERATE]   Sales notification email sent`);
        } catch (emailError) {
          console.error(`[GENERATE]   FAILED to send sales email:`, emailError);
        }

        console.log(`[GENERATE] ===== GENERATION COMPLETE =====`);
        console.log(`[GENERATE]   Submission: ${formSubmission.id}`);
        console.log(`[GENERATE]   Business: ${businessName}`);
        console.log(`[GENERATE]   Preview: ${previewUrl}`);
        console.log(`[GENERATE]   Username: ${username}`);
        console.log(`[GENERATE]   Password: ${generatedPassword}`);
      } catch (generationError) {
        console.error(`[GENERATE] ===== GENERATION FAILED =====`);
        console.error(`[GENERATE]   Submission: ${formSubmission.id}`);
        console.error(`[GENERATE]   Error:`, generationError);
        console.error(`[GENERATE]   Stack: ${(generationError as Error).stack}`);
        // Update status to FAILED so we can see and retry
        try {
          await prisma.formSubmission.update({
            where: { id: formSubmission.id },
            data: { status: 'PENDING' }
          });
        } catch (updateError) {
          console.error(`[GENERATE]   Could not update status:`, updateError);
        }
      }
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Form submitted successfully. Your website is being generated.',
        formSubmissionId: formSubmission.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('❌ Form submission error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to submit form',
      },
      { status: 500 }
    );
  }
}
