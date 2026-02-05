import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Simple admin auth check - in production, use proper admin authentication
const ADMIN_SECRET = process.env.ADMIN_SECRET || 'bytesadmin123';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { websiteId, adminSecret, salesPersonName } = body;

    // Verify admin access
    if (adminSecret !== ADMIN_SECRET) {
      return NextResponse.json(
        { error: "Unauthorized - Invalid admin credentials" },
        { status: 401 }
      );
    }

    if (!websiteId) {
      return NextResponse.json(
        { error: "Website ID is required" },
        { status: 400 }
      );
    }

    // Find the website
    const website = await prisma.generatedWebsite.findUnique({
      where: { id: websiteId },
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

    // Approve the website
    const updatedWebsite = await prisma.generatedWebsite.update({
      where: { id: websiteId },
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
