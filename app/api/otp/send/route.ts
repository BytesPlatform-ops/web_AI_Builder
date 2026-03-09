import { NextRequest, NextResponse } from 'next/server';
import twilio from 'twilio';

// Initialize Twilio client
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

export async function POST(request: NextRequest) {
  try {
    // Check if Twilio is configured
    if (!accountSid || !authToken || !verifyServiceSid) {
      console.error('Twilio credentials not configured');
      return NextResponse.json(
        { success: false, error: 'SMS service not configured' },
        { status: 500 }
      );
    }

    const { phone, countryCode } = await request.json();

    if (!phone || !countryCode) {
      return NextResponse.json(
        { success: false, error: 'Phone number and country code are required' },
        { status: 400 }
      );
    }

    // Format phone number (remove any non-digit characters except +)
    const cleanPhone = phone.replace(/[^\d]/g, '');
    const fullPhoneNumber = `${countryCode}${cleanPhone}`;

    // Basic validation
    if (cleanPhone.length < 6 || cleanPhone.length > 15) {
      return NextResponse.json(
        { success: false, error: 'Invalid phone number format' },
        { status: 400 }
      );
    }

    const client = twilio(accountSid, authToken);

    // Send verification code via Twilio Verify
    const verification = await client.verify.v2
      .services(verifyServiceSid)
      .verifications.create({
        to: fullPhoneNumber,
        channel: 'sms',
      });

    console.log(`OTP sent to ${fullPhoneNumber}, status: ${verification.status}`);

    return NextResponse.json({
      success: true,
      message: 'Verification code sent successfully',
      status: verification.status,
    });
  } catch (error) {
    console.error('Error sending OTP:', error);
    
    // Handle specific Twilio errors
    if (error instanceof Error) {
      if (error.message.includes('Invalid parameter')) {
        return NextResponse.json(
          { success: false, error: 'Invalid phone number format' },
          { status: 400 }
        );
      }
      if (error.message.includes('unverified')) {
        return NextResponse.json(
          { success: false, error: 'Phone number cannot receive SMS' },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { success: false, error: 'Failed to send verification code. Please try again.' },
      { status: 500 }
    );
  }
}
