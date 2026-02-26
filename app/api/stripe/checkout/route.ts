import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

// Initialize Stripe with secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Website publishing price in cents (e.g., $99 = 9900)
const WEBSITE_PRICE = parseInt(process.env.WEBSITE_PRICE_CENTS || "9900");

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

    // Check if already paid
    if (website.paymentStatus === "PAID") {
      return NextResponse.json(
        { error: "Website is already paid for", alreadyPaid: true },
        { status: 400 }
      );
    }

    // Check if already published
    if (website.status === "PUBLISHED") {
      return NextResponse.json(
        { error: "Website is already published", alreadyPublished: true },
        { status: 400 }
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    // Create Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: session.user.email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Website Publishing - ${website.businessName}`,
              description: `Professional website deployment for ${website.businessName}. Your website will be published live on the internet with SSL security.`,
            },
            unit_amount: WEBSITE_PRICE,
          },
          quantity: 1,
        },
      ],
      metadata: {
        websiteId: website.id,
        userId: user.id,
        businessName: website.businessName,
      },
      success_url: `${appUrl}/my-website?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/my-website?payment=cancelled`,
    });

    // Update website with stripe session ID
    await prisma.generatedWebsite.update({
      where: { id: websiteId },
      data: {
        stripeSessionId: checkoutSession.id,
        paymentStatus: "PENDING",
        paymentAmount: WEBSITE_PRICE,
      }
    });

    console.log(`💳 Stripe checkout session created for ${website.businessName}: ${checkoutSession.id}`);

    return NextResponse.json({
      success: true,
      checkoutUrl: checkoutSession.url,
      sessionId: checkoutSession.id,
    });

  } catch (error) {
    console.error("Error creating Stripe checkout session:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
