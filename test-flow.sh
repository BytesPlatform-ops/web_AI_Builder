#!/bin/bash
# Test script for form submission and publish flow

echo "=== Testing Website Generation Flow ==="
echo ""

# Submit form
echo "Step 1: Submitting form..."
RESPONSE=$(curl -s -X POST http://localhost:3000/api/form \
  -H "Content-Type: application/json" \
  -d '{
    "businessName": "Sunset Cafe Test",
    "tagline": "Where Every Sip Tells a Story",
    "about": "A cozy coffee shop with artisanal brews.",
    "industry": "Food & Beverage",
    "services": ["Espresso Drinks", "Fresh Pastries"],
    "email": "test@sunsetcafe.com",
    "phone": "+1 555 123 4567",
    "address": "123 Main Street",
    "socialLinks": {"instagram": "https://instagram.com/sunsetcafe"},
    "logoUrl": "https://jpmoucdgerlnvxbtkrzi.supabase.co/storage/v1/object/public/website-assets/logos/1770143567884-logo_gloria.png",
    "heroImageUrl": "https://jpmoucdgerlnvxbtkrzi.supabase.co/storage/v1/object/public/website-assets/images/hero/1770143569643-hero_gym.webp"
  }')

echo "Response: $RESPONSE"
echo ""

# Extract submission ID
SUBMISSION_ID=$(echo "$RESPONSE" | grep -o '"formSubmissionId":"[^"]*"' | cut -d'"' -f4)
echo "Submission ID: $SUBMISSION_ID"
echo ""

echo "Step 2: Waiting 30 seconds for website generation..."
sleep 30

# Check status
echo "Step 3: Checking submission status..."
STATUS=$(curl -s "http://localhost:3000/api/admin/submission/$SUBMISSION_ID")
echo "Status: $STATUS"
echo ""

echo "=== Test Complete ==="
echo "Now login as the user at http://localhost:3000/login"
echo "Then go to /my-website to see the preview and publish button"
