/**
 * Force Regenerate Website API - For testing only
 * POST /api/debug/regenerate
 * 
 * SECURITY: This endpoint is disabled in production
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { aiContentService, GeneratedContent } from '@/services/ai-content.service';
import { premiumTemplateGenerator } from '@/services/template-generator.service';
import { validateSubmissionId, isDebugEnabled } from '@/lib/validation';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  // SECURITY: Block in production environment
  if (!isDebugEnabled()) {
    return NextResponse.json(
      { error: 'This endpoint is not available in production' },
      { status: 404 }
    );
  }

  try {
    const body = await request.json();
    const { submissionId } = body;

    // SECURITY: Validate submission ID to prevent path traversal
    const validatedId = validateSubmissionId(submissionId);
    if (!validatedId) {
      return NextResponse.json(
        { error: 'Invalid submission ID format' },
        { status: 400 }
      );
    }

    // Get submission with website - use validated ID
    const submission = await prisma.formSubmission.findUnique({
      where: { id: validatedId },
      include: { generatedWebsite: true }
    });

    if (!submission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    if (!submission.generatedWebsite) {
      return NextResponse.json({ error: 'No website found for this submission' }, { status: 404 });
    }

    console.log(`\n🔄 Force regenerating website for: ${submission.businessName}\n`);

    // Regenerate content using AI service
    console.log('✨ Regenerating AI content...');
    const generatedContent: GeneratedContent = await aiContentService.generateWebsiteContent({
      businessName: submission.businessName,
      tagline: submission.tagline || '',
      about: submission.about,
      services: submission.services || [],
      industry: submission.industry || undefined,
      targetAudience: submission.targetAudience || undefined,
    });

    // Get colors from website
    const colors = {
      primary: submission.generatedWebsite.primaryColor || '#6366f1',
      secondary: submission.generatedWebsite.secondaryColor || '#8b5cf6',
      accent: submission.generatedWebsite.accentColor || '#06b6d4',
    };

    // Parse additional images
    const additionalImages: string[] = submission.additionalImages || [];

    console.log(`🎨 Colors:`, colors);
    console.log(`🖼️ Additional images: ${additionalImages.length}`);

    // Generate new website files
    console.log('⚡ Generating with ULTIMATE template v3...');
    console.log(`   Template Type: ${submission.templateType || 'dark'}\n`);

    const generatedWebsite = await premiumTemplateGenerator.generate({
      businessName: submission.businessName,
      content: generatedContent,
      colors: colors,
      logoUrl: submission.logoUrl || undefined,
      heroImageUrl: submission.heroImageUrl || undefined,
      additionalImages: additionalImages,
      templateType: (submission.templateType as 'dark' | 'light') || 'dark',
      contactInfo: {
        email: submission.email,
        phone: submission.phone || undefined,
        address: submission.address || undefined,
        social: submission.socialLinks 
          ? (typeof submission.socialLinks === 'string' 
              ? JSON.parse(submission.socialLinks) 
              : submission.socialLinks as Record<string, string>)
          : undefined
      }
    });

    // Save files - use validated ID
    const siteDir = path.join(process.cwd(), 'generated-sites', validatedId);
    const htmlContent = generatedWebsite['index.html'];
    const cssContent = generatedWebsite['styles.css'] || '';
    const jsContent = generatedWebsite['script.js'] || '';

    // Save to filesystem (as backup)
    try {
      await fs.promises.mkdir(siteDir, { recursive: true });
      const fileStats: { [key: string]: number } = {};
      for (const [filename, content] of Object.entries(generatedWebsite)) {
        const filePath = path.join(siteDir, filename);
        await fs.promises.writeFile(filePath, content, 'utf8');
        fileStats[filename] = content.length;
        console.log(`   ✅ ${filename} (${content.length.toLocaleString()} bytes)`);
      }
    } catch (fsError) {
      console.warn('Filesystem save failed (non-critical):', fsError);
    }

    // Update database with new content (persistent storage)
    await prisma.generatedWebsite.updateMany({
      where: { formSubmissionId: validatedId },
      data: {
        htmlContent: htmlContent,
        cssContent: cssContent,
        jsContent: jsContent,
        updatedAt: new Date(),
      }
    });

    console.log(`\n✨ Website regenerated successfully!`);
    console.log(`📁 Files saved to: ${siteDir}`);
    console.log(`💾 Content stored in database (persistent)`);

    return NextResponse.json({
      success: true,
      message: 'Website regenerated with ULTIMATE template v3 (stored in DB)',
      previewUrl: `http://localhost:3000/api/preview/${validatedId}`,
      filesPath: siteDir,
    });

  } catch (error) {
    console.error('Error regenerating website:', error);
    // Don't expose internal error details
    return NextResponse.json({
      success: false,
      error: 'Failed to regenerate website'
    }, { status: 500 });
  }
}
