import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, getClientIP, RateLimiters, rateLimitResponse } from "@/lib/rate-limiter";

type WebsiteWithRelations = {
  id: string;
  businessName: string;
  status: string;
  publishApproved: boolean;
  previewUrl: string | null;
  publishRequestedAt: Date | null;
  createdAt: Date;
  approvedAt: Date | null;
  approvedBy: string | null;
  deploymentUrl: string | null;
  deployedAt: Date | null;
  formSubmission: {
    email: string;
    phone: string | null;
  };
  user: {
    username: string;
    email: string;
  };
};

// Admin secret MUST be set in environment - no fallback
const ADMIN_SECRET = process.env.ADMIN_SECRET;

export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const adminSecret = searchParams.get('secret');

    // Verify admin access
    if (!adminSecret || adminSecret !== ADMIN_SECRET) {
      return NextResponse.json(
        { error: "Unauthorized" },
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
    }) as WebsiteWithRelations[];

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
