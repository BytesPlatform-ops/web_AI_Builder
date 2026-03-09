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

    const { phone, countryCode, code } = await request.json();

    if (!phone || !countryCode || !code) {
      return NextResponse.json(
        { success: false, error: 'Phone number, country code, and verification code are required' },
        { status: 400 }
      );
    }

    // Format phone number
    const cleanPhone = phone.replace(/[^\d]/g, '');
    const fullPhoneNumber = `${countryCode}${cleanPhone}`;

    // Validate code format (should be 6 digits)
    const cleanCode = code.replace(/\D/g, '');
    if (cleanCode.length !== 6) {
      return NextResponse.json(
        { success: false, error: 'Verification code must be 6 digits' },
        { status: 400 }
      );
    }

    const client = twilio(accountSid, authToken);

    // Verify the code via Twilio Verify
    const verificationCheck = await client.verify.v2
      .services(verifyServiceSid)
      .verificationChecks.create({
        to: fullPhoneNumber,
        code: cleanCode,
      });

    console.log(`OTP verification for ${fullPhoneNumber}: ${verificationCheck.status}`);

    if (verificationCheck.status === 'approved') {
      return NextResponse.json({
        success: true,
        message: 'Phone number verified successfully',
        verified: true,
      });
    } else {
      return NextResponse.json({
        success: false,
        error: 'Invalid verification code',
        verified: false,
      });
    }
  } catch (error) {
    console.error('Error verifying OTP:', error);

    // Handle specific Twilio errors
    if (error instanceof Error) {
      if (error.message.includes('not found') || error.message.includes('expired')) {
        return NextResponse.json(
          { success: false, error: 'Verification code expired. Please request a new code.' },
          { status: 400 }
        );
      }
      if (error.message.includes('Max check attempts')) {
        return NextResponse.json(
          { success: false, error: 'Too many attempts. Please request a new code.' },
          { status: 429 }
        );
      }
    }

    return NextResponse.json(
      { success: false, error: 'Verification failed. Please try again.' },
      { status: 500 }
    );
  }
}
