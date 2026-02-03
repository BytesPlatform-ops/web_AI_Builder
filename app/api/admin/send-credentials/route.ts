import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { emailService } from "@/services/email.service";

/**
 * Send credentials email to user
 * POST /api/admin/send-credentials
 * Body: { submissionId: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { submissionId } = body;

    if (!submissionId) {
      return NextResponse.json(
        { error: "submissionId is required" },
        { status: 400 }
      );
    }

    // Fetch submission with user and generated website
    const submission = await prisma.formSubmission.findUnique({
      where: { id: submissionId },
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
    return NextResponse.json(
      {
        error: "Failed to send credentials",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
