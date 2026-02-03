/**
 * Debug API - Get submission details including credentials
 * GET /api/debug/submission/[id]
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
      include: { generatedWebsite: true }
    });
    
    if (!submission) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    
    // Extract credentials from socialLinks
    const socialLinks = submission.socialLinks as Record<string, unknown> || {};
    const credentials = (socialLinks._credentials || {}) as { username?: string; password?: string };
    
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
        username: credentials.username || user?.username || 'unknown',
        password: credentials.password || 'unknown (check server logs)',
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
