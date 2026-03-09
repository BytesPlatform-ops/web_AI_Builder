# Twilio OTP Verification Setup Guide

## Overview
This guide explains how to set up Twilio Verify for phone number OTP verification on the website builder form.

## Prerequisites
1. A Twilio account (free trial available at https://www.twilio.com/try-twilio)
2. Access to Twilio Console

## Setup Steps

### 1. Create a Twilio Account
- Go to https://www.twilio.com/try-twilio
- Sign up for a free trial account
- Verify your email and phone number

### 2. Create a Verify Service
1. Go to Twilio Console → Verify → Services
2. Or direct link: https://console.twilio.com/us1/develop/verify/services
3. Click **"Create new"**
4. Enter a friendly name (e.g., "Website Builder OTP")
5. Keep default settings and click **Create**
6. Copy the **Service SID** (starts with `VA...`)

### 3. Get Your Credentials
From Twilio Console Dashboard:
- **Account SID**: Found on the main dashboard (starts with `AC...`)
- **Auth Token**: Found on the main dashboard (click to reveal)
- **Verify Service SID**: From step 2 above (starts with `VA...`)

### 4. Add Environment Variables
Add these to your `.env` file:

```env
# Twilio OTP Verification
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_VERIFY_SERVICE_SID=VAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 5. Verify Setup
1. Start the development server
2. Go to the form and fill out steps 1 & 2
3. Click "Verify Phone" button
4. You should receive an SMS with a 6-digit code

## Pricing

### Free Trial
- $15.50 free credit on signup
- ~150-300 OTP messages depending on country

### Pay As You Go
- **SMS Verification**: ~$0.05 per verification (varies by country)
- **Pakistan**: ~$0.05 per SMS
- **USA**: ~$0.05 per SMS

### Cost Example
At $19.99 per website sale:
- OTP cost per customer: ~$0.05
- That's just 0.25% of revenue!

## Supported Countries
The form includes 50+ country codes including:
- 🇵🇰 Pakistan (+92)
- 🇺🇸 USA/Canada (+1)
- 🇬🇧 UK (+44)
- 🇮🇳 India (+91)
- 🇦🇪 UAE (+971)
- And many more...

## Flow Diagram

```
User enters phone → Clicks "Verify Phone"
       ↓
[API: /api/otp/send]
       ↓
Twilio sends SMS with 6-digit code
       ↓
OTP Modal appears
       ↓
User enters code → Clicks "Verify Code"
       ↓
[API: /api/otp/verify]
       ↓
If valid → Phone verified ✅ → Proceed to Step 3
If invalid → Show error → Try again
```

## Troubleshooting

### "SMS service not configured"
- Check that all 3 environment variables are set
- Restart the development server after adding env vars

### "Invalid phone number format"
- Ensure the phone number doesn't include country code (user selects from dropdown)
- Phone should be digits only, without spaces or dashes

### "Phone number cannot receive SMS"
- Twilio trial accounts can only send to verified numbers
- Upgrade to paid account for full functionality
- Or verify the test number in Twilio Console

### "Verification code expired"
- Codes expire after 10 minutes
- Click "Resend" to get a new code

## Testing in Development

### Test without Twilio (Bypass Mode)
For development testing, you can temporarily bypass OTP by modifying the `sendOtp` function in `business-form.tsx`:

```typescript
// TEMPORARY - Remove in production!
const sendOtp = async () => {
  // Bypass for testing
  setPhoneVerified(true);
  setDirection(1);
  setStep(3);
  return;
  // ... rest of function
};
```

### Twilio Test Credentials
Twilio provides test credentials for development:
- Account SID: `ACtest...`
- These won't send real SMS but will simulate the flow

## Production Checklist
- [ ] Twilio account upgraded from trial (for unrestricted SMS)
- [ ] Environment variables set in production (Render/Vercel)
- [ ] Test with real phone number
- [ ] Monitor Twilio dashboard for delivery rates
