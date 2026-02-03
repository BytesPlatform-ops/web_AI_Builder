import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST() {
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
      { error: error.message },
      { status: 500 }
    );
  }
}
