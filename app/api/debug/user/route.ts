import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

/**
 * Debug endpoint to check user credentials
 * GET /api/debug/user?email=xxx
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');
  const testPassword = searchParams.get('password');
  
  if (!email) {
    return NextResponse.json({ error: 'Email required' }, { status: 400 });
  }
  
  // Find user by email or username
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { email: email },
        { username: email }
      ]
    }
  });
  
  if (!user) {
    return NextResponse.json({ 
      found: false, 
      message: 'User not found',
      searchedFor: email 
    });
  }
  
  let passwordMatch = null;
  if (testPassword && user.passwordHash) {
    passwordMatch = await bcrypt.compare(testPassword, user.passwordHash);
  }
  
  return NextResponse.json({
    found: true,
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      hasPassword: !!user.passwordHash,
      passwordHashPrefix: user.passwordHash?.substring(0, 20) + '...',
    },
    passwordTestResult: passwordMatch !== null ? (passwordMatch ? 'MATCH ✅' : 'NO MATCH ❌') : 'Not tested'
  });
}
