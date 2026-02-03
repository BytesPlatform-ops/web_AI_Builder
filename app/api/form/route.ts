/**
 * Form Submission API Route
 * POST /api/form/submit
 * 
 * Handles:
 * 1. Form data validation
 * 2. File uploads (logo, images)
 * 3. Save to database
 * 4. Trigger background AI generation
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { imageProcessingService } from '@/services/image-processing.service';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

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

    // Process file uploads
    let logoUrl: string | null = null;
    let heroImageUrl: string | null = null;
    const additionalImages: string[] = [];

    // Process logo
    const logoFile = formData.get('logo') as File | null;
    if (logoFile) {
      const buffer = await logoFile.arrayBuffer();
      const result = await imageProcessingService.processLogo(
        Buffer.from(buffer),
        logoFile.name
      );
      logoUrl = result.originalUrl;
      console.log('✅ Logo processed:', logoUrl);
    }

    // Process hero image
    const heroFile = formData.get('heroImage') as File | null;
    if (heroFile) {
      const buffer = await heroFile.arrayBuffer();
      const result = await imageProcessingService.processImage(
        Buffer.from(buffer),
        heroFile.name,
        'images/hero'
      );
      heroImageUrl = result.webpUrl;
      console.log('✅ Hero image processed:', heroImageUrl);
    }

    // Process additional images
    const additionalFilesCount = parseInt(
      formData.get('additionalImagesCount') as string || '0'
    );
    for (let i = 0; i < additionalFilesCount; i++) {
      const file = formData.get(`additionalImage_${i}`) as File | null;
      if (file) {
        const buffer = await file.arrayBuffer();
        const result = await imageProcessingService.processImage(
          Buffer.from(buffer),
          file.name,
          'images/additional'
        );
        additionalImages.push(result.webpUrl);
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
        logoUrl,
        heroImageUrl,
        additionalImages,
        status: 'PENDING',
      },
    });

    console.log('✅ Form submission saved:', formSubmission.id);

    // Trigger website generation synchronously (not background queue)
    // This ensures the website is generated before the response is sent
    console.log('🚀 Triggering website generation...');
    
    try {
      // Import and use the generation service directly
      const { aiContentService } = await import('@/services/ai-content.service');
      const { premiumTemplateGenerator } = await import('@/services/template-generator.service');
      const { colorExtractionService } = await import('@/services/color-extraction.service');
      const { resendEmailService } = await import('@/services/email-resend.service');
      const fs = await import('fs');
      const path = await import('path');

      // Update status to GENERATING
      await prisma.formSubmission.update({
        where: { id: formSubmission.id },
        data: { status: 'GENERATING' }
      });

      // Step 1: Generate AI content
      console.log('✨ Step 1: Generating AI content...');
      const enhancedContent = await aiContentService.generateWebsiteContent({
        businessName,
        tagline: tagline || '',
        about,
        services,
        industry: industry || undefined,
        targetAudience: targetAudience || undefined,
      });

      // Step 2: Extract colors from logo
      console.log('🎨 Step 2: Extracting brand colors...');
      let extractedColors = {
        primary: '#6366f1',
        secondary: '#8b5cf6',
        accent: '#06b6d4',
      };

      if (logoUrl) {
        try {
          extractedColors = await colorExtractionService.extractFromLogo(logoUrl);
        } catch (colorError) {
          console.warn('Could not extract colors, using defaults:', colorError);
        }
      }

      // Step 3: Generate website template
      console.log('🎨 Step 3: Generating website template...');
      const generatedWebsite = await premiumTemplateGenerator.generate({
        businessName,
        content: enhancedContent,
        colors: extractedColors,
        logoUrl: logoUrl || undefined,
        heroImageUrl: heroImageUrl || undefined,
        contactInfo: {
          email,
          phone: phone || undefined,
          address: address || undefined,
          social: socialLinks,
        }
      });

      // Step 4: Save files locally
      console.log('💾 Step 4: Saving website files...');
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
      console.log('💾 Files saved to:', filesDir);

      // Step 5: Create user account
      console.log('🔑 Step 5: Creating user account...');
      const user = await prisma.user.upsert({
        where: { email },
        update: { passwordHash, username },
        create: {
          id: `user-${formSubmission.id.substring(0, 8)}`,
          username,
          email,
          passwordHash,
        }
      });

      // Step 6: Create generated website record
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
      const previewUrl = `${baseUrl}/api/preview/${formSubmission.id}`;
      const loginUrl = `${baseUrl}/login`;

      const generatedSite = await prisma.generatedWebsite.create({
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

      // Step 7: Update form submission status
      await prisma.formSubmission.update({
        where: { id: formSubmission.id },
        data: { status: 'GENERATED' }
      });

      // Step 8: Send email to sales person with credentials
      console.log('📧 Step 6: Sending email to sales person...');
      try {
        await resendEmailService.sendToSales({
          businessName,
          customerEmail: email,
          customerPhone: phone || undefined,
          previewUrl,
          loginUrl,
          submissionId: formSubmission.id,
          username,
          password: generatedPassword,
        });
        console.log('✅ Sales notification email sent!');
      } catch (emailError) {
        console.error('⚠️ Failed to send sales email:', emailError);
      }

      console.log('✅ Website generated successfully!');
      console.log('   Preview URL:', previewUrl);
      console.log('   Username:', username);
      console.log('   Password:', generatedPassword);

    } catch (generationError) {
      console.error('⚠️ Website generation error:', generationError);
      // Update status back to PENDING so it can be retried
      await prisma.formSubmission.update({
        where: { id: formSubmission.id },
        data: { status: 'PENDING' }
      });
    }

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
