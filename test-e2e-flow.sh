#!/bin/bash
# Complete End-to-End Flow Test
# This script tests the entire flow from form submission to publish

echo "🧪 Complete E2E Flow Test"
echo "========================="
echo ""

BASE_URL="http://localhost:3000"

# Step 1: Submit a new form
echo "📝 Step 1: Submitting business form..."
RESPONSE=$(curl -s -X POST "$BASE_URL/api/form" \
  -F "businessName=E2E Test Bakery $(date +%s)" \
  -F "tagline=Fresh Baked Daily" \
  -F "about=We are a family-owned bakery with over 20 years of experience. We bake everything fresh daily using traditional recipes." \
  -F "industry=restaurant" \
  -F 'services=["Cakes", "Bread", "Pastries", "Custom Orders"]' \
  -F "email=e2etest@example.com" \
  -F "phone=+1234567890" \
  -F "address=456 Baker Street")

echo "Response: $RESPONSE"
echo ""

# Extract submission ID
SUBMISSION_ID=$(echo $RESPONSE | python3 -c "import sys, json; print(json.load(sys.stdin).get('formSubmissionId', ''))" 2>/dev/null)

if [ -z "$SUBMISSION_ID" ]; then
  echo "❌ Failed to get submission ID"
  exit 1
fi
echo "✅ Submission ID: $SUBMISSION_ID"

# Step 2: Wait for generation and get credentials
echo ""
echo "⏳ Step 2: Waiting for website generation..."
sleep 3

DETAILS=$(curl -s "$BASE_URL/api/debug/submission/$SUBMISSION_ID")
echo "Submission Details: $DETAILS" | python3 -m json.tool 2>/dev/null

USERNAME=$(echo $DETAILS | python3 -c "import sys, json; print(json.load(sys.stdin).get('credentials', {}).get('username', ''))" 2>/dev/null)
PASSWORD=$(echo $DETAILS | python3 -c "import sys, json; print(json.load(sys.stdin).get('credentials', {}).get('password', ''))" 2>/dev/null)
PREVIEW_URL=$(echo $DETAILS | python3 -c "import sys, json; print(json.load(sys.stdin).get('website', {}).get('previewUrl', ''))" 2>/dev/null)
WEBSITE_STATUS=$(echo $DETAILS | python3 -c "import sys, json; print(json.load(sys.stdin).get('website', {}).get('status', ''))" 2>/dev/null)

echo ""
echo "🔑 Credentials:"
echo "   Username: $USERNAME"
echo "   Password: $PASSWORD"
echo ""
echo "🌐 Website Status: $WEBSITE_STATUS"
echo "👁️ Preview URL: $PREVIEW_URL"

# Step 3: Test preview URL
echo ""
echo "📺 Step 3: Testing preview URL..."
PREVIEW_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$PREVIEW_URL")
if [ "$PREVIEW_STATUS" = "200" ]; then
  echo "✅ Preview URL returns HTTP 200"
else
  echo "❌ Preview URL returned HTTP $PREVIEW_STATUS"
fi

# Step 4: Check generated files
echo ""
echo "📁 Step 4: Checking generated files..."
FILES_DIR="/Users/bytes/Desktop/websites_builder/ai-website-builder/generated-sites/$SUBMISSION_ID"
if [ -d "$FILES_DIR" ]; then
  echo "✅ Generated files exist:"
  ls -la "$FILES_DIR"
else
  echo "❌ Generated files not found at $FILES_DIR"
fi

# Step 5: Summary
echo ""
echo "========================="
echo "📊 FLOW TEST SUMMARY"
echo "========================="
echo ""
echo "1. Form Submission: ✅ Success (ID: $SUBMISSION_ID)"
echo "2. Website Generation: $([[ "$WEBSITE_STATUS" == "READY" ]] && echo "✅ Success" || echo "⚠️ Status: $WEBSITE_STATUS")"
echo "3. User Account Created: $([[ -n "$USERNAME" ]] && echo "✅ Username: $USERNAME" || echo "❌ Failed")"
echo "4. Preview Available: $([[ "$PREVIEW_STATUS" == "200" ]] && echo "✅ Working" || echo "❌ Failed")"
echo ""
echo "📧 Email Status: Check bytesuite@bytesplatform.com for sales notification"
echo "   (Note: External emails require domain verification in Resend)"
echo ""
echo "🔐 TO TEST LOGIN MANUALLY:"
echo "   1. Go to: $BASE_URL/login"
echo "   2. Enter Username: $USERNAME"
echo "   3. Enter Password: $PASSWORD"
echo "   4. After login, go to: $BASE_URL/my-website"
echo "   5. Edit colors and click 'Publish' to deploy to Netlify"
echo ""
