import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

/**
 * Fix user password endpoint
 * POST /api/debug/fix-password
 * Body: { email: "xxx", newPassword: "xxx" }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, newPassword } = body;
    
    if (!email || !newPassword) {
      return NextResponse.json({ error: 'Email and newPassword required' }, { status: 400 });
    }
    
    // Find user
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email },
          { username: email }
        ]
      }
    });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Hash new password
    const passwordHash = await bcrypt.hash(newPassword, 10);
    
    // Update user
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash }
    });
    
    return NextResponse.json({
      success: true,
      message: `Password updated for ${user.email}`,
      username: user.username,
      email: user.email,
      newPassword: newPassword
    });
  } catch (error) {
    console.error('Fix password error:', error);
    return NextResponse.json({ error: 'Failed to update password' }, { status: 500 });
  }
}
