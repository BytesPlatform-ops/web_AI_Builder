import { NextResponse } from 'next/server';
import { sendGridEmailService } from '@/services/email-sendgrid.service';

/**
 * Test endpoint to verify email is working
 * GET /api/test-email?type=sales|credentials
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'sales';

  try {
    if (type === 'sales') {
      const result = await sendGridEmailService.sendToSales({
        businessName: 'Test Business',
        customerEmail: 'customer@example.com',
        customerPhone: '+1 555-1234',
        previewUrl: 'http://localhost:3000/api/preview/test-123',
        loginUrl: 'http://localhost:3000/login',
        submissionId: 'test-123',
        username: 'test-user',
        password: 'TestPass123',
      });

      return NextResponse.json({
        success: result.success,
        message: 'Sales email test completed',
        result: result
      });
    } else if (type === 'credentials') {
      const result = await sendGridEmailService.sendCredentialsToUser({
        businessName: 'Test Business',
        customerEmail: process.env.SALES_EMAIL || 'test@example.com',
        customerName: 'Test User',
        username: 'test-user',
        password: 'TestPass123',
        loginUrl: 'http://localhost:3000/login',
      });

      return NextResponse.json({
        success: result.success,
        message: 'Credentials email test completed',
        result: result
      });
    }

    return NextResponse.json({ error: 'Invalid type. Use ?type=sales or ?type=credentials' }, { status: 400 });
  } catch (error) {
    console.error('Email test error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        details: error 
      },
      { status: 500 }
    );
  }
}
