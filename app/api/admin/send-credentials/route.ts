import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { emailService } from "@/services/email.service";
import { validateSubmissionId } from "@/lib/validation";
import { checkRateLimit, getClientIP, RateLimiters, rateLimitResponse } from "@/lib/rate-limiter";

// Admin secret MUST be set in environment - no fallback
const ADMIN_SECRET = process.env.ADMIN_SECRET;

/**
 * Send credentials email to user
 * POST /api/admin/send-credentials
 * Body: { submissionId: string, adminSecret: string }
 */
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
    const { submissionId, adminSecret } = body;

    // Verify admin access
    if (!adminSecret || adminSecret !== ADMIN_SECRET) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Validate submission ID
    const validatedId = validateSubmissionId(submissionId);
    if (!validatedId) {
      return NextResponse.json(
        { error: "Invalid submission ID format" },
        { status: 400 }
      );
    }

    // Fetch submission with user and generated website
    const submission = await prisma.formSubmission.findUnique({
      where: { id: validatedId },
      include: {
        generatedWebsite: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!submission) {
      return NextResponse.json(
        { error: "Submission not found" },
        { status: 404 }
      );
    }

    if (!submission.generatedWebsite) {
      return NextResponse.json(
        { error: "Website not generated yet" },
        { status: 400 }
      );
    }

    const website = submission.generatedWebsite;
    const user = website.user;

    // Extract credentials from socialLinks JSON
    const socialLinksData = submission.socialLinks as any;
    const credentials = socialLinksData?._credentials || {};
    const username = credentials.username || user.username;
    const password = credentials.password;

    if (!password) {
      return NextResponse.json(
        { error: "Password not found in submission data" },
        { status: 400 }
      );
    }

    // Send credentials email to user
    const loginUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/login`;
    
    await emailService.sendCredentialsToUser({
      businessName: submission.businessName,
      customerEmail: submission.email,
      username: username,
      password: password,
      liveUrl: website.deploymentUrl || website.previewUrl || '',
      loginUrl: loginUrl,
    });

    console.log(`📧 Credentials email sent to ${submission.email}`);

    return NextResponse.json({
      success: true,
      message: `Credentials sent to ${submission.email}`,
    });
  } catch (error) {
    console.error("❌ Error sending credentials:", error);
    // Don't expose internal error details
    return NextResponse.json(
      { error: "Failed to send credentials" },
      { status: 500 }
    );
  }
}
