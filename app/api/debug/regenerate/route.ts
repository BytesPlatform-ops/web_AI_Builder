/**
 * Force Regenerate Website API - For testing only
 * POST /api/debug/regenerate
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { aiContentService, GeneratedContent } from '@/services/ai-content.service';
import { premiumTemplateGenerator } from '@/services/template-generator.service';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { submissionId } = body;

    if (!submissionId) {
      return NextResponse.json({ error: 'submissionId is required' }, { status: 400 });
    }

    // Get submission with website
    const submission = await prisma.formSubmission.findUnique({
      where: { id: submissionId },
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

    // Save files
    const siteDir = path.join(process.cwd(), 'generated-sites', submissionId);

    // Ensure directory exists
    await fs.promises.mkdir(siteDir, { recursive: true });

    // Write files
    const fileStats: { [key: string]: number } = {};
    for (const [filename, content] of Object.entries(generatedWebsite)) {
      const filePath = path.join(siteDir, filename);
      await fs.promises.writeFile(filePath, content, 'utf8');
      fileStats[filename] = content.length;
      console.log(`   ✅ ${filename} (${content.length.toLocaleString()} bytes)`);
    }

    console.log(`\n✨ Website regenerated successfully!`);
    console.log(`📁 Files saved to: ${siteDir}`);

    return NextResponse.json({
      success: true,
      message: 'Website regenerated with ULTIMATE template v3',
      previewUrl: `http://localhost:3000/api/preview/${submissionId}`,
      filesPath: siteDir,
      fileStats
    });

  } catch (error) {
    console.error('Error regenerating website:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
