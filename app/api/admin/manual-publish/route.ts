import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateWebsiteId } from "@/lib/validation";
import { checkRateLimit, getClientIP, RateLimiters, rateLimitResponse } from "@/lib/rate-limiter";
import { netlifyDeploymentService } from "@/services/deployment-netlify.service";
import { sendGridEmailService } from "@/services/email-sendgrid.service";
import fs from 'fs';
import path from 'path';

// Admin secret MUST be set in environment - no fallback
const ADMIN_SECRET = process.env.ADMIN_SECRET;

export async function POST(request: NextRequest) {
  try {
    // Rate limiting for admin endpoints
    const clientIP = getClientIP(request);
    const rateLimitResult = checkRateLimit(clientIP, RateLimiters.api);
    
    if (!rateLimitResult.success) {
      return rateLimitResponse(rateLimitResult);
    }

    // SECURITY: Admin secret must be configured
    if (!ADMIN_SECRET) {
      console.error('ADMIN_SECRET environment variable is not set');
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { websiteId, adminSecret, salesPersonName } = body;

    // Verify admin access
    if (!adminSecret || adminSecret !== ADMIN_SECRET) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Validate website ID
    const validatedWebsiteId = validateWebsiteId(websiteId);
    if (!validatedWebsiteId) {
      return NextResponse.json(
        { error: "Invalid website ID format" },
        { status: 400 }
      );
    }

    // Find the website
    const website = await prisma.generatedWebsite.findUnique({
      where: { id: validatedWebsiteId },
      include: {
        formSubmission: true,
        user: true,
      }
    });

    if (!website) {
      return NextResponse.json(
        { error: "Website not found" },
        { status: 404 }
      );
    }

    // Check if already published
    if (website.status === 'PUBLISHED' && website.deploymentUrl) {
      return NextResponse.json({
        success: true,
        alreadyPublished: true,
        message: "Website is already published",
        website: {
          id: website.id,
          businessName: website.businessName,
          deploymentUrl: website.deploymentUrl,
        }
      });
    }

    console.log(`🚀 [ADMIN] Manual publish initiated for ${website.businessName} by ${salesPersonName || 'Admin'}`);

    // Read website files
    const filesPath = website.filesPath || path.join(process.cwd(), 'generated-sites', website.formSubmissionId);
    
    const files = new Map<string, string>();
    const fileNames = ['index.html', 'styles.css', 'script.js'];
    
    for (const fileName of fileNames) {
      const filePath = path.join(filesPath, fileName);
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf-8');
        files.set(fileName, content);
      }
    }

    if (files.size === 0) {
      return NextResponse.json(
        { error: "No website files found to deploy" },
        { status: 400 }
      );
    }

    // Deploy to Netlify
    const siteName = website.businessName.toLowerCase().replace(/[^a-z0-9]/g, '-').substring(0, 50);
    const deployResult = await netlifyDeploymentService.deploySite(
      `${siteName}-${website.formSubmissionId.substring(0, 8)}`,
      files
    );

    console.log(`✅ [ADMIN] Deployed to Netlify: ${deployResult.url}`);

    // Update website status - mark as PAID (manual override) and PUBLISHED
    const updatedWebsite = await prisma.generatedWebsite.update({
      where: { id: validatedWebsiteId },
      data: {
        status: 'PUBLISHED',
        paymentStatus: 'PAID',
        publishApproved: true,
        approvedAt: new Date(),
        approvedBy: `Manual: ${salesPersonName || 'Admin'}`,
        deploymentUrl: deployResult.url,
        deploymentProvider: 'netlify',
        deployedAt: new Date(),
        paidAt: new Date(),
      }
    });

    console.log(`🎉 [ADMIN] Website ${website.businessName} manually published by ${salesPersonName || 'Admin'}!`);

    // Send notification email to customer
    try {
      await sendGridEmailService.sendPublishedNotification({
        businessName: website.businessName,
        customerEmail: website.formSubmission.email,
        customerName: website.formSubmission.businessName,
        liveUrl: deployResult.url,
      });
      console.log('✅ [ADMIN] Published notification email sent to customer');
    } catch (emailError) {
      console.error('⚠️ [ADMIN] Failed to send published notification email:', emailError);
    }

    return NextResponse.json({
      success: true,
      message: `Website "${website.businessName}" has been published successfully!`,
      website: {
        id: updatedWebsite.id,
        businessName: updatedWebsite.businessName,
        customerEmail: website.formSubmission.email,
        deploymentUrl: deployResult.url,
        publishedBy: salesPersonName || 'Admin',
        publishedAt: updatedWebsite.deployedAt,
      }
    });

  } catch (error) {
    console.error("[ADMIN] Error in manual publish:", error);
    return NextResponse.json(
      { error: "Failed to publish website" },
      { status: 500 }
    );
  }
}
