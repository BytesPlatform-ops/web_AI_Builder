/**
 * Generate Website API - Synchronous website generation
 * POST /api/form/generate
 * 
 * This endpoint is called after form submission to:
 * 1. Generate website using AI
 * 2. Save files locally (no deployment yet)
 * 3. Create user account with credentials
 * 4. Send email to sales person with login credentials
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { aiContentService } from '@/services/ai-content.service';
import { premiumTemplateGenerator } from '@/services/template-generator.service';
import { colorExtractionService } from '@/services/color-extraction.service';
import { resendEmailService } from '@/services/email-resend.service';
import { validateSubmissionId } from '@/lib/validation';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { formSubmissionId } = body;

    // SECURITY: Validate submission ID
    const validatedId = validateSubmissionId(formSubmissionId);
    if (!validatedId) {
      return NextResponse.json(
        { success: false, error: 'Invalid submission ID format' },
        { status: 400 }
      );
    }

    // Get the form submission using validated ID
    const submission = await prisma.formSubmission.findUnique({
      where: { id: validatedId }
    });

    if (!submission) {
      return NextResponse.json(
        { success: false, error: 'Form submission not found' },
        { status: 404 }
      );
    }

    // Check if already generated
    if (submission.status === 'GENERATED') {
      const existingWebsite = await prisma.generatedWebsite.findFirst({
        where: { formSubmissionId: validatedId }
      });
      
      if (existingWebsite) {
        return NextResponse.json({
          success: true,
          message: 'Website already generated',
          previewUrl: existingWebsite.previewUrl,
        });
      }
    }

    // Update status to GENERATING - use validated ID
    await prisma.formSubmission.update({
      where: { id: validatedId },
      data: { status: 'GENERATING' }
    });

    console.log(`🔄 Generating website for ${submission.businessName}...`);

    // Step 1: Generate AI content
    console.log(`✨ Step 1: Generating AI content...`);
    const enhancedContent = await aiContentService.generateWebsiteContent({
      businessName: submission.businessName,
      tagline: submission.tagline || '',
      about: submission.about,
      services: Array.isArray(submission.services) ? submission.services : [],
      industry: submission.industry || undefined,
      targetAudience: submission.targetAudience || undefined,
    });

    // Step 2: Extract colors from logo
    console.log(`🎨 Step 2: Extracting brand colors...`);
    let extractedColors = {
      primary: '#6366f1',
      secondary: '#8b5cf6',
      accent: '#06b6d4',
    };

    if (submission.logoUrl) {
      try {
        extractedColors = await colorExtractionService.extractFromLogo(submission.logoUrl);
      } catch (colorError) {
        console.warn('Could not extract colors, using defaults:', colorError);
      }
    }

    // Step 3: Generate website template
    console.log(`🎨 Step 3: Generating website template...`);
    const generatedWebsite = await premiumTemplateGenerator.generate({
      businessName: submission.businessName,
      content: enhancedContent,
      colors: extractedColors,
      logoUrl: submission.logoUrl || undefined,
      heroImageUrl: submission.heroImageUrl || undefined,
      contactInfo: {
        email: submission.email,
        phone: submission.phone || undefined,
        address: submission.address || undefined,
        social: submission.socialLinks ? JSON.parse(JSON.stringify(submission.socialLinks)) : undefined,
      }
    });

    // Step 4: Save files locally
    console.log(`💾 Step 4: Saving website files...`);
    const filesDir = path.join(process.cwd(), 'generated-sites', validatedId);
    await fs.promises.mkdir(filesDir, { recursive: true });

    const files = {
      'index.html': generatedWebsite['index.html'],
      'styles.css': generatedWebsite['styles.css'] || '',
      'script.js': generatedWebsite['script.js'] || '',
    };

    for (const [filename, content] of Object.entries(files)) {
      await fs.promises.writeFile(path.join(filesDir, filename), content, 'utf-8');
    }
    console.log(`💾 Files saved to: ${filesDir}`);

    // Step 5: Create user credentials
    console.log(`🔑 Step 5: Creating user credentials...`);
    
    // Get credentials from socialLinks if stored there, or generate new ones
    const socialLinksData = submission.socialLinks as Record<string, unknown> || {};
    const storedCredentials = (socialLinksData._credentials || {}) as { username?: string; password?: string };
    
    const username = storedCredentials.username || 
      submission.businessName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .substring(0, 30);
    
    const generatedPassword = storedCredentials.password || 
      Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-4);
    
    const passwordHash = await bcrypt.hash(generatedPassword, 10);

    // Create or update user
    const user = await prisma.user.upsert({
      where: { email: submission.email },
      update: {
        passwordHash: passwordHash,
        username: username,
      },
      create: {
        id: `user-${validatedId.substring(0, 8)}`,
        username: username,
        email: submission.email,
        passwordHash: passwordHash,
      }
    });
    console.log(`🔑 User created/updated: ${user.email} (username: ${username})`);

    // Step 6: Save generated website record
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const previewUrl = `${baseUrl}/api/preview/${validatedId}`;
    const loginUrl = `${baseUrl}/login`;

    const generatedSite = await prisma.generatedWebsite.create({
      data: {
        formSubmissionId: validatedId,
        userId: user.id,
        businessName: submission.businessName,
        templateId: 'universal-premium',
        primaryColor: extractedColors.primary,
        secondaryColor: extractedColors.secondary,
        accentColor: extractedColors.accent,
        filesPath: filesDir,
        previewUrl: previewUrl,
        deploymentUrl: null,      // NOT deployed yet
        deploymentProvider: null,
        deployedAt: null,
        status: 'READY',          // Ready for user to preview
      }
    });

    // Step 7: Update form submission status
    await prisma.formSubmission.update({
      where: { id: validatedId },
      data: { status: 'GENERATED' }
    });

    // Step 8: Send email to sales person with credentials
    console.log(`📧 Step 6: Sending email to sales person...`);
    try {
      await resendEmailService.sendToSales({
        businessName: submission.businessName,
        customerEmail: submission.email,
        customerPhone: submission.phone || undefined,
        previewUrl: previewUrl,
        loginUrl: loginUrl,
        submissionId: validatedId,
        username: username,
        password: generatedPassword,
      });
      console.log(`✅ Sales notification email sent!`);
    } catch (emailError) {
      console.error('⚠️ Failed to send sales email:', emailError);
      // Don't fail the whole process if email fails
    }

    console.log(`✅ Website generated successfully!`);
    console.log(`   Preview URL: ${previewUrl}`);
    console.log(`   Username: ${username}`);
    console.log(`   Password: ${generatedPassword}`);

    return NextResponse.json({
      success: true,
      message: 'Website generated successfully',
      websiteId: generatedSite.id,
      previewUrl: previewUrl,
      credentials: {
        username: username,
        password: generatedPassword,
        loginUrl: loginUrl,
      }
    });

  } catch (error) {
    console.error('❌ Website generation error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate website',
      },
      { status: 500 }
    );
  }
}
