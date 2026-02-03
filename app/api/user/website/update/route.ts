import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { aiContentService } from '@/services/ai-content.service';
import { premiumTemplateGenerator } from '@/services/template-generator.service';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    // Get session
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get request body
    const body = await request.json();
    const { websiteId, colors, content } = body;

    if (!websiteId) {
      return NextResponse.json({ error: 'Website ID is required' }, { status: 400 });
    }

    // Find user
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: session.user.email },
          { username: session.user.email }
        ]
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Find website and verify ownership
    const website = await prisma.generatedWebsite.findFirst({
      where: {
        id: websiteId,
        userId: user.id
      },
      include: {
        formSubmission: true
      }
    });

    if (!website) {
      return NextResponse.json({ error: 'Website not found' }, { status: 404 });
    }

    // Get form submission for website regeneration
    const submission = website.formSubmission;
    if (!submission) {
      return NextResponse.json({ error: 'Original submission not found' }, { status: 404 });
    }

    // Update website colors in database
    const newColors = {
      primary: colors?.primary || website.primaryColor || '#6366f1',
      secondary: colors?.secondary || website.secondaryColor || '#8b5cf6',
      accent: colors?.accent || website.accentColor || '#06b6d4',
    };

    console.log(`🔄 Regenerating website ${websiteId} with new colors...`);
    console.log(`   Primary: ${newColors.primary}`);
    console.log(`   Secondary: ${newColors.secondary}`);
    console.log(`   Accent: ${newColors.accent}`);

    // Step 1: Regenerate AI content (use cached if available, or regenerate)
    console.log('✨ Step 1: Generating AI content...');
    const enhancedContent = await aiContentService.generateWebsiteContent({
      businessName: submission.businessName,
      tagline: submission.tagline || '',
      about: submission.about,
      services: Array.isArray(submission.services) ? submission.services : [],
      industry: submission.industry || undefined,
      targetAudience: submission.targetAudience || undefined,
    });

    // Step 2: Regenerate template with new colors
    console.log('🎨 Step 2: Regenerating website template with new colors...');
    const generatedWebsite = await premiumTemplateGenerator.generate({
      businessName: submission.businessName,
      content: enhancedContent,
      colors: newColors,
      logoUrl: submission.logoUrl || undefined,
      heroImageUrl: submission.heroImageUrl || undefined,
      contactInfo: {
        email: submission.email,
        phone: submission.phone || undefined,
        address: submission.address || undefined,
        social: submission.socialLinks ? JSON.parse(JSON.stringify(submission.socialLinks)) : undefined,
      }
    });

    // Step 3: Save updated files
    console.log('💾 Step 3: Saving updated website files...');
    const filesDir = website.filesPath || path.join(process.cwd(), 'generated-sites', submission.id);
    await fs.promises.mkdir(filesDir, { recursive: true });

    const files = {
      'index.html': generatedWebsite['index.html'],
      'styles.css': generatedWebsite['styles.css'] || '',
      'script.js': generatedWebsite['script.js'] || '',
    };

    for (const [filename, fileContent] of Object.entries(files)) {
      await fs.promises.writeFile(path.join(filesDir, filename), fileContent, 'utf-8');
    }
    console.log('💾 Files updated at:', filesDir);

    // Step 4: Update database
    const updatedWebsite = await prisma.generatedWebsite.update({
      where: { id: websiteId },
      data: {
        primaryColor: newColors.primary,
        secondaryColor: newColors.secondary,
        accentColor: newColors.accent,
      }
    });

    console.log(`✅ Website ${websiteId} regenerated successfully!`);

    return NextResponse.json({
      success: true,
      message: 'Website updated and regenerated successfully',
      website: {
        id: updatedWebsite.id,
        primaryColor: updatedWebsite.primaryColor,
        secondaryColor: updatedWebsite.secondaryColor,
        accentColor: updatedWebsite.accentColor,
        previewUrl: updatedWebsite.previewUrl
      }
    });

  } catch (error) {
    console.error('Error updating website:', error);
    return NextResponse.json(
      { error: 'Failed to update website' },
      { status: 500 }
    );
  }
}
