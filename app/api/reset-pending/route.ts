import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isDebugEnabled } from '@/lib/validation';

/**
 * Reset GENERATING submissions back to PENDING
 * 
 * SECURITY: This endpoint is DISABLED in production
 */
export async function POST() {
  // SECURITY: Block in production environment
  if (!isDebugEnabled()) {
    return NextResponse.json(
      { error: 'This endpoint is not available in production' },
      { status: 404 }
    );
  }

  try {
    // Reset all GENERATING status back to PENDING
    const result = await prisma.formSubmission.updateMany({
      where: { status: 'GENERATING' },
      data: { status: 'PENDING' }
    });
    
    return NextResponse.json({
      success: true,
      message: `Reset ${result.count} submissions back to PENDING`
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Operation failed' },
      { status: 500 }
    );
  }
}
