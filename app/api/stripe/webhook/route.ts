import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { netlifyDeploymentService } from "@/services/deployment-netlify.service";
import { sendGridEmailService } from "@/services/email-sendgrid.service";
import Stripe from "stripe";
import fs from 'fs';
import path from 'path';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
  try {
    // If no webhook secret configured, just return success
    // Payment verification will happen via /api/stripe/verify when user returns
    if (!webhookSecret || webhookSecret === "whsec_not_configured" || webhookSecret === "whsec_xxxxx") {
      console.log("⚠️ Webhook secret not configured, skipping webhook processing");
      console.log("💡 Payment will be verified when user returns to the site");
      return NextResponse.json({ received: true, message: "Webhook secret not configured" });
    }

    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Missing stripe signature" },
        { status: 400 }
      );
    }

    // Verify webhook signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error("⚠️ Webhook signature verification failed:", err);
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 400 }
      );
    }

    console.log(`📩 Stripe webhook received: ${event.type}`);

    // Handle the checkout.session.completed event
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      
      const websiteId = session.metadata?.websiteId;
      
      if (!websiteId) {
        console.error("⚠️ No websiteId in session metadata");
        return NextResponse.json(
          { error: "Missing websiteId in metadata" },
          { status: 400 }
        );
      }

      console.log(`✅ Payment completed for website: ${websiteId}`);

      // Update payment status
      const website = await prisma.generatedWebsite.update({
        where: { id: websiteId },
        data: {
          paymentStatus: "PAID",
          stripePaymentId: session.payment_intent as string,
          paidAt: new Date(),
          // Also approve for publishing since payment is done
          publishApproved: true,
          approvedAt: new Date(),
          approvedBy: "Stripe Payment",
        },
        include: {
          formSubmission: true,
          user: true,
        }
      });

      console.log(`💰 Payment recorded for ${website.businessName}`);

      // Auto-deploy to Netlify after payment
      try {
        console.log(`🚀 Auto-deploying ${website.businessName} to Netlify after payment...`);
        
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
          console.error("⚠️ No website files found to deploy");
        } else {
          // Deploy to Netlify
          const siteName = website.businessName.toLowerCase().replace(/[^a-z0-9]/g, '-').substring(0, 50);
          const deployResult = await netlifyDeploymentService.deploySite(
            `${siteName}-${website.formSubmissionId.substring(0, 8)}`,
            files
          );
          
          console.log(`✅ Deployed to Netlify: ${deployResult.url}`);

          // Update website status to PUBLISHED
          await prisma.generatedWebsite.update({
            where: { id: websiteId },
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
        }
      } catch (deployError) {
        console.error("⚠️ Auto-deploy failed:", deployError);
        // Don't fail the webhook - payment was successful, deploy can be done manually
      }
    }

    // Handle payment failed
    if (event.type === "checkout.session.expired" || event.type === "payment_intent.payment_failed") {
      const session = event.data.object as Stripe.Checkout.Session | Stripe.PaymentIntent;
      const websiteId = session.metadata?.websiteId;
      
      if (websiteId) {
        await prisma.generatedWebsite.update({
          where: { id: websiteId },
          data: {
            paymentStatus: "FAILED",
          }
        });
        console.log(`❌ Payment failed/expired for website: ${websiteId}`);
      }
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
