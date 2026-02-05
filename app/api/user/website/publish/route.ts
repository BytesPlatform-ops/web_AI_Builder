import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { netlifyDeploymentService } from "@/services/deployment-netlify.service";
import { sendGridEmailService } from "@/services/email-sendgrid.service";
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { websiteId } = body;

    if (!websiteId) {
      return NextResponse.json(
        { error: "Website ID is required" },
        { status: 400 }
      );
    }

    // Get the user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Get the website and verify ownership
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
      return NextResponse.json(
        { error: "Website not found or access denied" },
        { status: 404 }
      );
    }

    // Check if already published
    if (website.status === 'PUBLISHED') {
      return NextResponse.json({
        success: true,
        message: "Website is already published",
        deploymentUrl: website.deploymentUrl,
        status: 'PUBLISHED'
      });
    }

    // ========================================
    // NEW FLOW: Check if publish is approved
    // ========================================
    
    if (!website.publishApproved) {
      // User is NOT approved yet - send notification to sales team
      console.log(`📧 User ${user.email} requested to publish ${website.businessName} - NOT APPROVED YET`);
      
      // Update status to PENDING_APPROVAL and record request time
      await prisma.generatedWebsite.update({
        where: { id: websiteId },
        data: {
          status: 'PENDING_APPROVAL',
          publishRequestedAt: new Date(),
        }
      });
      
      // Send email to sales team about publish request
      try {
        await sendGridEmailService.sendPublishRequest({
          businessName: website.businessName,
          customerEmail: website.formSubmission.email,
          customerPhone: website.formSubmission.phone || undefined,
          websiteId: website.id,
          previewUrl: website.previewUrl || `${process.env.NEXT_PUBLIC_APP_URL}/api/preview/${website.formSubmissionId}`,
          dashboardUrl: `${process.env.NEXT_PUBLIC_APP_URL}/admin/sales`,
        });
        console.log('✅ Publish request email sent to sales team');
      } catch (emailError) {
        console.error('⚠️ Failed to send publish request email:', emailError);
      }
      
      // Return response telling user that sales will contact them
      return NextResponse.json({
        success: true,
        status: 'PENDING_APPROVAL',
        message: "Your publish request has been received! Our sales team will contact you shortly to complete the process.",
        requiresApproval: true
      });
    }

    // ========================================
    // User IS APPROVED - Proceed with deployment
    // ========================================

    // NOW deploy to Netlify - this is when actual deployment happens!
    console.log(`🚀 Publishing website ${website.businessName} to Netlify...`);
    
    // Read the generated files from local storage
    const filesPath = website.filesPath || path.join(process.cwd(), 'generated-sites', website.formSubmissionId);
    
    const files = new Map<string, string>();
    
    // Read each file
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
    
    console.log(`✅ Deployed to Netlify: ${deployResult.url}`);

    const now = new Date();

    // Update website status to PUBLISHED with actual deployment URL
    const updatedWebsite = await prisma.generatedWebsite.update({
      where: { id: websiteId },
      data: {
        status: 'PUBLISHED',
        deploymentUrl: deployResult.url,    // Actual Netlify URL
        deploymentProvider: 'netlify',
        deployedAt: now,
      }
    });

    console.log(`🚀 Website ${website.businessName} published!`);
    console.log(`🔗 Live URL: ${deployResult.url}`);

    // Send notification email to the user that their site is published
    try {
      await sendGridEmailService.sendPublishedNotification({
        businessName: website.businessName,
        customerEmail: website.formSubmission.email,
        customerName: website.formSubmission.businessName,
        liveUrl: deployResult.url,
      });
      console.log('✅ Published notification email sent to user');
    } catch (emailError) {
      console.error('⚠️ Failed to send published notification email:', emailError);
      // Don't fail the whole process if email fails
    }

    return NextResponse.json({
      success: true,
      status: 'PUBLISHED',
      message: "Website published successfully to Netlify!",
      deploymentUrl: updatedWebsite.deploymentUrl,
      publishedAt: now.toISOString()
    });

  } catch (error) {
    console.error("Error publishing website:", error);
    return NextResponse.json(
      { error: "Failed to publish website" },
      { status: 500 }
    );
  }
}
