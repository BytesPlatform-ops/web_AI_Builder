# Stripe Payment Integration Guide

This guide explains how to set up Stripe payment integration for the website publishing flow.

## Overview

The new flow works as follows:
1. User creates their website and previews it
2. When they click "Pay & Publish", they are redirected to Stripe Checkout
3. After successful payment, their website is automatically deployed to Netlify
4. User receives a confirmation email with their live URL

## Required Environment Variables

Add these to your `.env` file:

```bash
# Stripe API Keys (get from https://dashboard.stripe.com/apikeys)
STRIPE_SECRET_KEY=sk_live_xxxxx  # Use sk_test_xxxxx for testing
STRIPE_WEBHOOK_SECRET=whsec_xxxxx  # Get from webhook setup

# Website Price (in cents, e.g., 9900 = $99)
WEBSITE_PRICE_CENTS=9900
```

## Stripe Webhook Setup

1. Go to [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks)
2. Click "Add endpoint"
3. Enter your webhook URL: `https://yourdomain.com/api/stripe/webhook`
4. Select events to listen for:
   - `checkout.session.completed`
   - `checkout.session.expired`
   - `payment_intent.payment_failed`
5. Copy the "Signing secret" and add it as `STRIPE_WEBHOOK_SECRET`

### For Local Development

Use Stripe CLI to forward webhooks locally:

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login to Stripe
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Copy the webhook signing secret shown and use it as `STRIPE_WEBHOOK_SECRET`.

## API Endpoints

### POST `/api/stripe/checkout`
Creates a Stripe Checkout session for website publishing.

**Request:**
```json
{
  "websiteId": "uuid-of-website"
}
```

**Response:**
```json
{
  "success": true,
  "checkoutUrl": "https://checkout.stripe.com/...",
  "sessionId": "cs_xxxxx"
}
```

### POST `/api/stripe/webhook`
Handles Stripe webhook events. Called by Stripe when payment events occur.

### POST `/api/stripe/verify`
Verifies payment status after returning from Stripe Checkout.

**Request:**
```json
{
  "sessionId": "cs_xxxxx",
  "websiteId": "uuid-of-website"
}
```

### POST `/api/user/website/publish`
Publishing endpoint now checks payment status first.

**Response when payment required:**
```json
{
  "success": false,
  "status": "PAYMENT_REQUIRED",
  "message": "Please complete payment to publish your website.",
  "requiresPayment": true
}
```

## Database Changes

New fields added to `GeneratedWebsite` model:

```prisma
paymentStatus   PaymentStatus @default(UNPAID)
stripeSessionId String?       // Stripe Checkout Session ID
stripePaymentId String?       // Stripe Payment Intent ID
paymentAmount   Int?          // Amount in cents
paidAt          DateTime?     // When payment was completed
```

New enum:
```prisma
enum PaymentStatus {
  UNPAID
  PENDING
  PAID
  FAILED
  REFUNDED
}
```

## User Flow

1. **Website Ready**: User sees "Pay & Publish ($99)" button
2. **Click Payment**: User clicks button → redirected to Stripe Checkout
3. **Payment Success**: 
   - Stripe webhook updates payment status
   - Website is auto-deployed to Netlify
   - User receives email with live URL
4. **Return to App**: User sees "✓ Paid - Ready to Publish" and can click publish
5. **Published**: Website is live, user sees deployment URL

## Testing

Use Stripe test cards:
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- Requires auth: `4000 0025 0000 3155`

Any future expiry date and any CVC will work in test mode.
