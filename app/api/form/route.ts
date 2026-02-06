/**
 * Form Submission API Route
 * POST /api/form/submit
 * 
 * Handles:
 * 1. Form data validation
 * 2. File uploads (logo, images)
 * 3. Save to database
 * 4. Trigger background AI generation via Next.js after()
 */

import { NextRequest, NextResponse, after } from 'next/server';
import { prisma } from '@/lib/prisma';
import { imageProcessingService } from '@/services/image-processing.service';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

// Allow up to 5 minutes for generation (used by after() callback)
export const maxDuration = 300;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // Extract form fields
    const businessName = formData.get('businessName') as string;
    const tagline = formData.get('tagline') as string | null;
    const about = formData.get('about') as string;
    const industry = formData.get('industry') as string | null;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string | null;
    const address = formData.get('address') as string | null;

    // Parse arrays - handle both JSON-serialized and multipart array formats
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

    const targetAudience = formData.get('targetAudience') as string | null;
    const socialLinksField = formData.get('socialLinks');
    const socialLinks = socialLinksField && typeof socialLinksField === 'string' && socialLinksField.startsWith('{')
      ? JSON.parse(socialLinksField)
      : {};

    // Parse testimonials
    let testimonials = [];
    const testimonialsField = formData.get('testimonials');
    if (testimonialsField && typeof testimonialsField === 'string') {
      try {
        testimonials = JSON.parse(testimonialsField);
      } catch (e) {
        console.warn('Failed to parse testimonials:', e);
      }
    }

    // Parse brand colors
    let brandColors = {
      primary: '#3B82F6',
      secondary: '#1E40AF',
      accent: '#60A5FA',
    };
    const brandColorsField = formData.get('brandColors');
    if (brandColorsField && typeof brandColorsField === 'string') {
      try {
        const parsedColors = JSON.parse(brandColorsField);
        if (parsedColors.primary && parsedColors.secondary && parsedColors.accent) {
          brandColors = parsedColors;
        }
      } catch (e) {
        console.warn('Failed to parse brand colors:', e);
      }
    }

    // Parse template type (default to 'dark')
    const templateType = (formData.get('templateType') as string) || 'dark';

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

        // Step 1: Process images
        console.log(`[GENERATE] Step 1: Processing images...`);
        try {
          if (logoBuffer && logoFilename) {
            console.log(`[GENERATE]   Processing logo: ${logoFilename} (${logoBuffer.length} bytes)`);
            const result = await imageProcessingService.processLogo(logoBuffer, logoFilename);
            logoUrl = result.originalUrl;
            console.log(`[GENERATE]   Logo uploaded: ${logoUrl}`);
          }

          if (heroBuffer && heroFilename) {
            console.log(`[GENERATE]   Processing hero: ${heroFilename} (${heroBuffer.length} bytes)`);
            const result = await imageProcessingService.processImage(
              heroBuffer,
              heroFilename,
              'images/hero'
            );
            heroImageUrl = result.webpUrl;
            console.log(`[GENERATE]   Hero uploaded: ${heroImageUrl}`);
          }

          if (additionalFiles.length > 0) {
            console.log(`[GENERATE]   Processing ${additionalFiles.length} additional images...`);
            for (const file of additionalFiles) {
              console.log(`[GENERATE]     Processing: ${file.filename} (${file.buffer.length} bytes)`);
              const result = await imageProcessingService.processImage(
                file.buffer,
                file.filename,
                'images/additional'
              );
              additionalImages.push(result.webpUrl);
              console.log(`[GENERATE]     Uploaded: ${result.webpUrl}`);
            }
          }

          // Update submission with image URLs
          await prisma.formSubmission.update({
            where: { id: formSubmission.id },
            data: {
              logoUrl,
              heroImageUrl,
              additionalImages,
            },
          });
          console.log(`[GENERATE] Step 1 complete - images saved to DB`);
        } catch (imgError) {
          console.error(`[GENERATE] Step 1 FAILED - image processing error:`, imgError);
          console.error(`[GENERATE]   Error name: ${(imgError as Error).name}`);
          console.error(`[GENERATE]   Error message: ${(imgError as Error).message}`);
          console.error(`[GENERATE]   Error stack: ${(imgError as Error).stack}`);
          // Continue with generation even if images fail
        }

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
        let generatedWebsite;
        try {
          generatedWebsite = await premiumTemplateGenerator.generate({
            businessName,
            content: {
              ...enhancedContent,
              testimonials: testimonials || [],
            },
            colors: extractedColors,
            logoUrl: logoUrl || undefined,
            heroImageUrl: heroImageUrl || undefined,
            additionalImages: additionalImages || [],
            contactInfo: {
              email,
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
