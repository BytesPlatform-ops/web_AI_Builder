/**
 * Queue Service - SIMPLIFIED for MVP
 * 
 * For production use, integrate Bull + Redis or implement actual job processing
 * For MVP, we've simplified to database polling that can be triggered separately
 * 
 * The actual website generation workflow is:
 * 1. Form submitted → FormSubmission created with PENDING status
 * 2. User sees success page with their submission ID
 * 3. Background worker (separate service) periodically checks for PENDING submissions
 * 4. When found, it runs: AI → Template → Deploy
 * 5. Updates FormSubmission status to GENERATED and saves GeneratedWebsite
 * 6. User can check dashboard to see progress and live URL
 */

import { aiContentService } from './ai-content.service';
import { premiumTemplateGenerator } from './template-generator.service';
import { netlifyDeploymentService } from './deployment-netlify.service';
import { colorExtractionService } from './color-extraction.service';
import { imageProcessingService } from './image-processing.service';
import { emailService } from './email.service';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// Define job data interface
export interface WebsiteGenerationJobData {
  formSubmissionId: string;
  businessName: string;
  tagline: string;
  about: string;
  services: string[];
  email: string;
  phone?: string;
  address?: string;
  websiteType: 'services' | 'product' | 'digital-product';
  templateId?: string;
  sectionVisibility?: Record<string, boolean>;
  logoUrl?: string;
  heroImageUrl?: string;
  additionalMetadata?: Record<string, any>;
}

let processingInProgress = new Set<string>();

// Initialize queue - starts background processing
export const initializeQueue = async () => {
  console.log('✅ Job queue initialized (database-backed)');
  
  // Start background processing if not already running
  if (typeof window === 'undefined') {
    // Only on server
    processQueuedJobs();
  }
};

// Process queued jobs periodically
const processQueuedJobs = async () => {
  // This runs every 10 seconds to check for pending jobs
  setInterval(async () => {
    try {
      const pendingSubmissions = await prisma.formSubmission.findMany({
        where: { status: 'PENDING' },
        take: 1, // Process one at a time
      });

      for (const submission of pendingSubmissions) {
        // Skip if already processing
        if (processingInProgress.has(submission.id)) continue;

        processingInProgress.add(submission.id);

        try {
          await processWebsiteGeneration(submission.id);
        } finally {
          processingInProgress.delete(submission.id);
        }
      }
    } catch (error) {
      console.error('Queue processing error:', error);
    }
  }, 10000); // Check every 10 seconds
};

// Process a single website generation
const processWebsiteGeneration = async (formSubmissionId: string) => {
  try {
    const submission = await prisma.formSubmission.findUnique({
      where: { id: formSubmissionId }
    });

    if (!submission) {
      console.error(`Form submission not found: ${formSubmissionId}`);
      return;
    }

    console.log(`🔄 Processing ${submission.businessName}...`);

    // Update status
    await prisma.formSubmission.update({
      where: { id: formSubmissionId },
      data: { status: 'GENERATING' }
    });

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

    // Step 4: Save generated files locally (NO DEPLOYMENT - user will publish later)
    console.log(`💾 Saving generated website files for ${submission.businessName}...`);
    
    // Store the generated HTML files in the database or file system
    // These will be deployed when user clicks "Publish"
    const files = {
      'index.html': generatedWebsite['index.html'],
      'styles.css': generatedWebsite['styles.css'] || '',
      'script.js': generatedWebsite['script.js'] || '',
    };
    
    // Save files to local storage path (not deploying to Netlify yet!)
    const fs = await import('fs');
    const path = await import('path');
    const filesDir = path.join(process.cwd(), 'generated-sites', formSubmissionId);
    
    // Create directory if it doesn't exist
    await fs.promises.mkdir(filesDir, { recursive: true });
    
    // Save each file
    for (const [filename, content] of Object.entries(files)) {
      await fs.promises.writeFile(path.join(filesDir, filename), content, 'utf-8');
    }
    
    console.log(`💾 Files saved to: ${filesDir}`);
    
    // Create local preview URL (user can preview via our dashboard)
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const previewUrl = `${baseUrl}/api/preview/${formSubmissionId}`;
    console.log(`👁️ Preview URL: ${previewUrl}`);

    // Create or get user with credentials from form submission socialLinks JSON
    const socialLinksData = submission.socialLinks as any;
    const credentials = socialLinksData?._credentials || {};
    const username = credentials.username || submission.email.split('@')[0];
    const generatedPassword = credentials.password || 'changeme123';
    const passwordHash = await bcrypt.hash(generatedPassword, 10);
    
    // Always update password when upserting - so new password from generation takes effect
    const user = await prisma.user.upsert({
      where: { email: submission.email },
      update: {
        // Update password hash so new credentials work
        passwordHash: passwordHash,
        username: username,
      },
      create: {
        id: `user-${formSubmissionId.substring(0, 8)}`,
        username: username,
        email: submission.email,
        passwordHash: passwordHash,
      }
    });
    
    console.log(`🔑 User credentials created/updated: username=${username}, password=${generatedPassword}`);
    
    // Save the website with READY status (not PUBLISHED yet)
    // Files saved locally, no Netlify deployment until user clicks Publish
    const generatedSite = await prisma.generatedWebsite.create({
      data: {
        formSubmissionId: formSubmissionId,
        userId: user.id,
        businessName: submission.businessName,
        templateId: 'universal-premium',
        primaryColor: extractedColors.primary,
        secondaryColor: extractedColors.secondary,
        accentColor: extractedColors.accent,
        filesPath: filesDir,                // Local path where files are saved
        previewUrl: previewUrl,             // Preview URL (served from our API)
        deploymentUrl: null,                // NOT deployed yet - will be set on publish
        deploymentProvider: null,           // Will be 'netlify' after publish
        deployedAt: null,                   // Will be set after publish
        status: 'READY',                    // Ready for user to preview and publish
      }
    });

    // Step 6: Update form submission
    await prisma.formSubmission.update({
      where: { id: formSubmissionId },
      data: {
        status: 'GENERATED',
      }
    });

    console.log(`✅ Website for ${submission.businessName} generated and ready for preview!`);
    console.log(`👁️ Preview URL: ${previewUrl}`);
    console.log(`📁 Files saved at: ${filesDir}`);
    console.log(`⚠️ NOT deployed yet - user needs to click Publish`);
    
    // Send email to sales team immediately after generation
    console.log(`📧 Sending notification to sales team...`);
    try {
      await emailService.sendToSales({
        businessName: submission.businessName,
        customerEmail: submission.email,
        customerPhone: submission.phone || undefined,
        liveUrl: previewUrl,              // Send preview URL, not deployment URL
        submissionId: formSubmissionId,
        username: username,
        password: generatedPassword,
      });
      console.log('✅ Sales notification email sent successfully');
      console.log('📞 Sales team will manually contact the customer with credentials');
    } catch (emailError) {
      console.error('⚠️ Failed to send sales notification email:', emailError);
      // Don't fail the whole process if email fails
    }

  } catch (error) {
    console.error(`❌ Error processing ${formSubmissionId}:`, error);

    // Update status to failed
    await prisma.formSubmission.update({
      where: { id: formSubmissionId },
      data: { 
        status: 'PENDING'
      }
    }).catch(() => {
      // Silently fail
    });
  }
};

// Enqueue a website generation job
export const enqueueWebsiteGeneration = async (
  jobData: WebsiteGenerationJobData
): Promise<any | null> => {
  try {
    await initializeQueue();
    // Job is already saved in database as a FormSubmission with PENDING status
    // The background processor will pick it up automatically
    console.log(`📬 Job enqueued for ${jobData.businessName}`);
    return { id: jobData.formSubmissionId };
  } catch (error) {
    console.error('Failed to enqueue job:', error);
    return null;
  }
};

// Get job status
export const getJobStatus = async (jobId: string) => {
  try {
    const submission = await prisma.formSubmission.findUnique({
      where: { id: jobId },
      include: { generatedWebsite: true }
    });

    if (!submission) return null;

    return {
      id: jobId,
      state: submission.status,
      progress: submission.status === 'GENERATED' ? 100 : (submission.status === 'GENERATING' ? 50 : 0),
      data: {
        formSubmissionId: submission.id,
        businessName: submission.businessName,
      },
      result: submission.generatedWebsite ? { 
        websiteId: submission.generatedWebsite.id,
        liveUrl: submission.generatedWebsite.deploymentUrl,
      } : null,
      error: null,
    };
  } catch (error) {
    console.error('Failed to get job status:', error);
    return null;
  }
};

export default {
  initializeQueue,
  enqueueWebsiteGeneration,
  getJobStatus,
};
