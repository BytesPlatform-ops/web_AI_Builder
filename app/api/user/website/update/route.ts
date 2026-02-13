import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { aiContentService } from '@/services/ai-content.service';
import { premiumTemplateGenerator } from '@/services/template-generator.service';
import fs from 'fs';
import path from 'path';
import { checkRateLimit, getClientIP, RateLimiters, rateLimitResponse } from '@/lib/rate-limiter';
import { sanitizeText, sanitizeColor } from '@/lib/sanitize';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting - prevent abuse
    const clientIP = getClientIP(request);
    const rateLimitResult = checkRateLimit(clientIP, RateLimiters.regenerate);
    
    if (!rateLimitResult.success) {
      console.warn(`🚫 Rate limit exceeded for website update from IP: ${clientIP}`);
      return rateLimitResponse(rateLimitResult);
    }

    // Get session
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get request body
    const body = await request.json();
    const { websiteId, colors, content } = body;

    // Sanitize colors if provided
    const sanitizedColors = colors ? {
      primary: sanitizeColor(colors.primary) || colors.primary,
      secondary: sanitizeColor(colors.secondary) || colors.secondary,
      accent: sanitizeColor(colors.accent) || colors.accent,
    } : undefined;

    // Sanitize content if provided
    const sanitizedContent = content ? {
      headline: content.headline ? sanitizeText(content.headline) : undefined,
      subheadline: content.subheadline ? sanitizeText(content.subheadline) : undefined,
      aboutText: content.aboutText ? sanitizeText(content.aboutText) : undefined,
      ctaHeadline: content.ctaHeadline ? sanitizeText(content.ctaHeadline) : undefined,
      ctaSubtext: content.ctaSubtext ? sanitizeText(content.ctaSubtext) : undefined,
      ctaButtonText: content.ctaButtonText ? sanitizeText(content.ctaButtonText) : undefined,
    } : undefined;

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

    // Step 1: Generate base AI content (for services, testimonials, etc that user can't edit)
    console.log('✨ Step 1: Generating base AI content...');
    const baseContent = await aiContentService.generateWebsiteContent({
      businessName: submission.businessName,
      tagline: submission.tagline || '',
      about: submission.about,
      services: Array.isArray(submission.services) ? submission.services : [],
      industry: submission.industry || undefined,
      targetAudience: submission.targetAudience || undefined,
    });

    // Step 1b: If user provided content edits, merge them into the base content
    let enhancedContent = baseContent;
    if (content && Object.keys(content).length > 0) {
      console.log('📝 Step 1b: Merging user-provided content edits...');
      // User sends flat structure, merge into nested structure
      enhancedContent = {
        ...baseContent,
        hero: {
          ...baseContent.hero,
          headline: content.headline || baseContent.hero.headline,
          subheadline: content.subheadline || baseContent.hero.subheadline,
          ctaPrimary: content.ctaPrimary || baseContent.hero.ctaPrimary,
          ctaSecondary: content.ctaSecondary || baseContent.hero.ctaSecondary,
        },
        about: {
          ...baseContent.about,
          headline: content.aboutHeadline || baseContent.about.headline,
          paragraphs: content.aboutText 
            ? [content.aboutText] 
            : baseContent.about.paragraphs,
        },
        cta: {
          ...baseContent.cta,
          headline: content.ctaHeadline || baseContent.cta.headline,
          subheadline: content.ctaSubheadline || baseContent.cta.subheadline,
        },
      };
    }

    // Step 2: Regenerate template with new colors
    console.log('🎨 Step 2: Regenerating website template with new colors...');
    
    // Parse additional images
    let additionalImages: string[] = [];
    if (submission.additionalImages) {
      if (typeof submission.additionalImages === 'string') {
        try {
          additionalImages = JSON.parse(submission.additionalImages);
        } catch {
          additionalImages = [];
        }
      } else if (Array.isArray(submission.additionalImages)) {
        additionalImages = submission.additionalImages as string[];
      }
    }
    
    // Get the original template type (light or dark)
    const templateType = (submission.templateType as 'dark' | 'light') || 'dark';
    console.log(`   Template Type: ${templateType}`);
    
    const generatedWebsite = await premiumTemplateGenerator.generate({
      businessName: submission.businessName,
      content: enhancedContent,
      colors: newColors,
      logoUrl: submission.logoUrl || undefined,
      heroImageUrl: submission.heroImageUrl || undefined,
      additionalImages: additionalImages,
      templateType: templateType,
      contactInfo: {
        email: submission.email,
        phone: submission.phone || undefined,
        address: submission.address || undefined,
        social: submission.socialLinks ? JSON.parse(JSON.stringify(submission.socialLinks)) : undefined,
      }
    });

    // Step 3: Save updated files to filesystem AND database
    console.log('💾 Step 3: Saving updated website files...');
    const filesDir = website.filesPath || path.join(process.cwd(), 'generated-sites', submission.id);
    
    const htmlContent = generatedWebsite['index.html'];
    const cssContent = generatedWebsite['styles.css'] || '';
    const jsContent = generatedWebsite['script.js'] || '';
    
    // Save to filesystem (backup)
    try {
      await fs.promises.mkdir(filesDir, { recursive: true });
      const files = {
        'index.html': htmlContent,
        'styles.css': cssContent,
        'script.js': jsContent,
      };
      for (const [filename, fileContent] of Object.entries(files)) {
        await fs.promises.writeFile(path.join(filesDir, filename), fileContent, 'utf-8');
      }
      console.log('💾 Files updated at:', filesDir);
    } catch (fsError) {
      console.warn('Filesystem save failed (non-critical):', fsError);
    }

    // Step 4: Update database with new content and colors (PERSISTENT STORAGE)
    const updatedWebsite = await prisma.generatedWebsite.update({
      where: { id: websiteId },
      data: {
        primaryColor: newColors.primary,
        secondaryColor: newColors.secondary,
        accentColor: newColors.accent,
        // Update website content in database
        htmlContent: htmlContent,
        cssContent: cssContent,
        jsContent: jsContent,
      }
    });

    console.log(`✅ Website ${websiteId} regenerated and stored in DB!`);

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
