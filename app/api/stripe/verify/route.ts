import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { netlifyDeploymentService } from "@/services/deployment-netlify.service";
import { sendGridEmailService } from "@/services/email-sendgrid.service";
import Stripe from "stripe";
import fs from 'fs';
import path from 'path';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

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
    const { sessionId, websiteId } = body;

    if (!sessionId || !websiteId) {
      return NextResponse.json(
        { error: "Session ID and Website ID are required" },
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

    // If already published, no need to verify again
    if (website.status === "PUBLISHED") {
      return NextResponse.json({
        success: true,
        paid: true,
        published: true,
        deploymentUrl: website.deploymentUrl,
      });
    }

    // If already marked as paid but not published, try to deploy
    if (website.paymentStatus === "PAID") {
      // Deploy to Netlify
      return await deployWebsite(website);
    }

    // Verify with Stripe
    try {
      const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);
      
      if (checkoutSession.payment_status === "paid") {
        // Update payment status
        await prisma.generatedWebsite.update({
          where: { id: websiteId },
          data: {
            paymentStatus: "PAID",
            stripePaymentId: checkoutSession.payment_intent as string,
            paidAt: new Date(),
            publishApproved: true,
            approvedAt: new Date(),
            approvedBy: "Stripe Payment",
          }
        });

        // Fetch updated website
        const updatedWebsite = await prisma.generatedWebsite.findFirst({
          where: { id: websiteId },
          include: { formSubmission: true }
        });

        if (updatedWebsite) {
          // Deploy to Netlify
          return await deployWebsite(updatedWebsite);
        }
      }

      return NextResponse.json({
        success: true,
        paid: checkoutSession.payment_status === "paid",
        published: false,
        paymentStatus: checkoutSession.payment_status,
      });

    } catch (stripeError) {
      console.error("Error verifying Stripe session:", stripeError);
      return NextResponse.json(
        { error: "Failed to verify payment" },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error("Error verifying payment:", error);
    return NextResponse.json(
      { error: "Failed to verify payment" },
      { status: 500 }
    );
  }
}

interface WebsiteWithSubmission {
  id: string;
  businessName: string;
  filesPath: string | null;
  formSubmissionId: string;
  formSubmission: {
    email: string;
    businessName: string;
  };
}

async function deployWebsite(website: WebsiteWithSubmission) {
  try {
    console.log(`🚀 Deploying ${website.businessName} to Netlify...`);
    
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

    // Update website status to PUBLISHED
    await prisma.generatedWebsite.update({
      where: { id: website.id },
      data: {
        status: 'PUBLISHED',
        deploymentUrl: deployResult.url,
        deploymentProvider: 'netlify',
        deployedAt: new Date(),
      }
    });

    console.log(`🎉 Website ${website.businessName} published successfully!`);

    // Send notification email
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
    }

    return NextResponse.json({
      success: true,
      paid: true,
      published: true,
      deploymentUrl: deployResult.url,
    });

  } catch (deployError) {
    console.error("Deploy error:", deployError);
    return NextResponse.json(
      { error: "Failed to deploy website" },
      { status: 500 }
    );
  }
}
