import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

/**
 * Test Generation API
 * 
 * This endpoint manually triggers website generation for testing
 * 
 * Usage:
 * POST /api/test-generation
 * Body: { formSubmissionId: "xxx" }
 * 
 * Or: POST /api/test-generation?latest=true
 * This will process the most recent PENDING submission
 */
export async function POST(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const useLatest = searchParams.get('latest') === 'true';
    
    let submissionId: string | null = null;

    if (useLatest) {
      // Find the latest PENDING submission
      const latestSubmission = await prisma.formSubmission.findFirst({
        where: { status: 'PENDING' },
        orderBy: { createdAt: 'desc' }
      });

      if (!latestSubmission) {
        return NextResponse.json(
          { error: 'No pending submissions found' },
          { status: 404 }
        );
      }

      submissionId = latestSubmission.id;
    } else {
      // Get from body
      const body = await req.json();
      submissionId = body.formSubmissionId;
    }

    if (!submissionId) {
      return NextResponse.json(
        { error: 'Missing formSubmissionId' },
        { status: 400 }
      );
    }

    const submission = await prisma.formSubmission.findUnique({
      where: { id: submissionId }
    });

    if (!submission) {
      return NextResponse.json(
        { error: 'Form submission not found' },
        { status: 404 }
      );
    }

    console.log(`🧪 Test: Manually triggering generation for ${submission.businessName}...`);

    // Update status
    await prisma.formSubmission.update({
      where: { id: submissionId },
      data: { status: 'GENERATING' }
    });

    // Import services dynamically to avoid bundling issues
    const { aiContentService } = await import('@/services/ai-content.service');
    const { premiumTemplateGenerator } = await import('@/services/template-generator.service');
    const { netlifyDeploymentService } = await import('@/services/deployment-netlify.service');
    const { colorExtractionService } = await import('@/services/color-extraction.service');

    // Step 1: Enhance content with AI
    console.log(`✨ Enhancing content for ${submission.businessName}...`);
    const enhancedContent = await aiContentService.generateWebsiteContent({
      businessName: submission.businessName,
      tagline: submission.tagline || '',
      about: submission.about,
      services: Array.isArray(submission.services) ? submission.services : [],
      industry: submission.industry || undefined,
      targetAudience: submission.targetAudience || undefined,
    });

    // Step 2: Extract logo colors
    console.log(`🎨 Extracting brand colors...`);
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

    // Step 3: Generate template with content
    console.log(`🎨 Generating template for ${submission.businessName}...`);
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

    // Step 4: Deploy to Netlify
    console.log(`🚀 Deploying ${submission.businessName} to Netlify...`);
    const files = new Map<string, string>();
    files.set('index.html', generatedWebsite['index.html']);
    files.set('styles.css', generatedWebsite['styles.css'] || '');
    files.set('script.js', generatedWebsite['script.js'] || '');
    
    const deploymentResult = await netlifyDeploymentService.deploySite(
      submissionId,
      files
    );

    // Step 5: Save generated website
    // Create or get user first (upsert based on email)
    const testPassword = 'TestPass123';
    const passwordHash = await bcrypt.hash(testPassword, 10);
    
    const user = await prisma.user.upsert({
      where: { email: submission.email },
      update: {
        passwordHash: passwordHash, // Always update password
      },
      create: {
        id: `user-${submissionId.substring(0, 8)}`,
        username: submission.email.split('@')[0] + '-' + Date.now(),
        email: submission.email,
        passwordHash: passwordHash,
      }
    });
    
    const generatedSite = await prisma.generatedWebsite.create({
      data: {
        formSubmissionId: submissionId,
        userId: user.id,
        businessName: submission.businessName,
        templateId: 'universal-premium',
        primaryColor: extractedColors.primary,
        secondaryColor: extractedColors.secondary,
        accentColor: extractedColors.accent,
        previewUrl: deploymentResult.url,
        deploymentUrl: deploymentResult.url,
        deploymentProvider: 'netlify',
        deployedAt: new Date(),
        status: 'READY',
      }
    });

    // Step 6: Update form submission
    await prisma.formSubmission.update({
      where: { id: submissionId },
      data: {
        status: 'GENERATED',
      }
    });

    console.log(`✅ Test complete: ${submission.businessName} generated and deployed!`);

    return NextResponse.json({
      success: true,
      message: `Website generated successfully for ${submission.businessName}`,
      data: {
        submissionId,
        websiteId: generatedSite.id,
        liveUrl: deploymentResult.url,
        previewUrl: deploymentResult.url,
        businessName: submission.businessName,
      }
    });

  } catch (error: any) {
    console.error('❌ Test generation failed:', error);

    return NextResponse.json(
      { 
        error: 'Generation failed',
        message: error.message,
        details: error.stack 
      },
      { status: 500 }
    );
  }
}

// GET endpoint to check if there are any pending submissions
export async function GET(req: NextRequest) {
  try {
    const pending = await prisma.formSubmission.findMany({
      where: { status: 'PENDING' },
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: {
        id: true,
        businessName: true,
        email: true,
        status: true,
        createdAt: true,
      }
    });

    return NextResponse.json({
      count: pending.length,
      submissions: pending,
      hint: 'Use POST /api/test-generation?latest=true to process the most recent one'
    });

  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to fetch pending submissions', message: error.message },
      { status: 500 }
    );
  }
}
