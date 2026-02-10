/**
 * Debug API - Get submission details including credentials
 * GET /api/debug/submission/[id]
 * 
 * SECURITY: This endpoint is DISABLED in production
 */
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isDebugEnabled, validateSubmissionId } from '@/lib/validation';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // SECURITY: Block in production environment
  if (!isDebugEnabled()) {
    return NextResponse.json(
      { error: 'This endpoint is not available in production' },
      { status: 404 }
    );
  }

  try {
    const { id } = await params;
    
    // SECURITY: Validate submission ID
    const validatedId = validateSubmissionId(id);
    if (!validatedId) {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
    }
    
    const submission = await prisma.formSubmission.findUnique({
      where: { id: validatedId },
      include: { generatedWebsite: true }
    });
    
    if (!submission) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    
    // Get the user
    const user = await prisma.user.findFirst({
      where: { email: submission.email }
    });
    
    return NextResponse.json({
      submission: {
        id: submission.id,
        businessName: submission.businessName,
        email: submission.email,
        status: submission.status,
      },
      credentials: {
        username: user?.username || 'unknown',
        // SECURITY: Never expose passwords, even in debug mode
        loginUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/login`
      },
      website: submission.generatedWebsite ? {
        id: submission.generatedWebsite.id,
        status: submission.generatedWebsite.status,
        previewUrl: submission.generatedWebsite.previewUrl,
        deploymentUrl: submission.generatedWebsite.deploymentUrl,
      } : null,
      user: user ? {
        id: user.id,
        username: user.username,
        email: user.email,
      } : null
    });
  } catch (error) {
    console.error('Debug error:', error);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}
