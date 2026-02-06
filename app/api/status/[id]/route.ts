/**
 * Status Check API Route
 * GET /api/status/:id
 * 
 * Check the status of a form submission / website generation
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const submission = await prisma.formSubmission.findUnique({
      where: { id },
      select: {
        id: true,
        businessName: true,
        status: true,
        logoUrl: true,
        heroImageUrl: true,
        additionalImages: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!submission) {
      return NextResponse.json(
        { success: false, error: 'Submission not found' },
        { status: 404 }
      );
    }

    // Also check if GeneratedWebsite exists
    const website = await prisma.generatedWebsite.findFirst({
      where: { formSubmissionId: id },
      select: {
        id: true,
        status: true,
        previewUrl: true,
        deploymentUrl: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      submission,
      website: website || null,
    });
  } catch (error) {
    console.error('Status check error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to check status' },
      { status: 500 }
    );
  }
}
