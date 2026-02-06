import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Simple admin auth check
const ADMIN_SECRET = process.env.ADMIN_SECRET || 'bytesadmin123';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const adminSecret = searchParams.get('secret');

    // Verify admin access
    if (adminSecret !== ADMIN_SECRET) {
      return NextResponse.json(
        { error: "Unauthorized - Invalid admin credentials" },
        { status: 401 }
      );
    }

    // Get all websites with their status
    const websites = await prisma.generatedWebsite.findMany({
      include: {
        formSubmission: {
          select: {
            email: true,
            phone: true,
          }
        },
        user: {
          select: {
            username: true,
            email: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    type WebsiteWithRelations = (typeof websites)[number];

    // Group by status for easier dashboard view
    const pendingApproval = websites.filter(w => w.status === 'PENDING_APPROVAL');
    const approved = websites.filter(w => w.publishApproved && w.status !== 'PUBLISHED');
    const published = websites.filter(w => w.status === 'PUBLISHED');
    const ready = websites.filter(w => w.status === 'READY' && !w.publishApproved);

    return NextResponse.json({
      success: true,
      summary: {
        total: websites.length,
        pendingApproval: pendingApproval.length,
        approved: approved.length,
        published: published.length,
        ready: ready.length,
      },
      websites: {
        pendingApproval: pendingApproval.map(w => ({
          id: w.id,
          businessName: w.businessName,
          customerEmail: w.formSubmission.email,
          customerPhone: w.formSubmission.phone,
          username: w.user.username,
          previewUrl: w.previewUrl,
          publishRequestedAt: w.publishRequestedAt,
          createdAt: w.createdAt,
        })),
        approved: approved.map(w => ({
          id: w.id,
          businessName: w.businessName,
          customerEmail: w.formSubmission.email,
          customerPhone: w.formSubmission.phone,
          approvedAt: w.approvedAt,
          approvedBy: w.approvedBy,
        })),
        published: published.map(w => ({
          id: w.id,
          businessName: w.businessName,
          customerEmail: w.formSubmission.email,
          deploymentUrl: w.deploymentUrl,
          deployedAt: w.deployedAt,
        })),
        ready: ready.map(w => ({
          id: w.id,
          businessName: w.businessName,
          customerEmail: w.formSubmission.email,
          customerPhone: w.formSubmission.phone,
          previewUrl: w.previewUrl,
          createdAt: w.createdAt,
        })),
      }
    });

  } catch (error) {
    console.error("Error fetching websites:", error);
    return NextResponse.json(
      { error: "Failed to fetch websites" },
      { status: 500 }
    );
  }
}
