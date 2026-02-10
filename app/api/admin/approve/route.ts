import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateWebsiteId } from "@/lib/validation";
import { checkRateLimit, getClientIP, RateLimiters, rateLimitResponse } from "@/lib/rate-limiter";

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
      // Don't reveal whether secret was wrong or missing
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

    // Find the website - use validated ID
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

    // Check if already approved
    if (website.publishApproved) {
      return NextResponse.json({
        success: true,
        message: "Website is already approved for publishing",
        website: {
          id: website.id,
          businessName: website.businessName,
          publishApproved: website.publishApproved,
          approvedAt: website.approvedAt,
        }
      });
    }

    // Approve the website - use validated ID
    const updatedWebsite = await prisma.generatedWebsite.update({
      where: { id: validatedWebsiteId },
      data: {
        publishApproved: true,
        approvedAt: new Date(),
        approvedBy: salesPersonName || 'Sales Team',
        status: 'READY', // Reset to READY so user can publish
      }
    });

    console.log(`✅ Website ${website.businessName} approved for publishing by ${salesPersonName || 'Sales Team'}`);

    return NextResponse.json({
      success: true,
      message: `Website "${website.businessName}" has been approved! The customer can now publish their website.`,
      website: {
        id: updatedWebsite.id,
        businessName: updatedWebsite.businessName,
        customerEmail: website.formSubmission.email,
        publishApproved: updatedWebsite.publishApproved,
        approvedAt: updatedWebsite.approvedAt,
        approvedBy: updatedWebsite.approvedBy,
      }
    });

  } catch (error) {
    console.error("Error approving website:", error);
    return NextResponse.json(
      { error: "Failed to approve website" },
      { status: 500 }
    );
  }
}
