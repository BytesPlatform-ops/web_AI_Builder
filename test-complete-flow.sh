#!/bin/bash
# Test the complete website generation flow

echo "🧪 Testing AI Website Builder Flow"
echo "=================================="

# Test form submission
echo ""
echo "📝 Step 1: Submitting form..."
RESPONSE=$(curl -s -X POST "http://localhost:3000/api/form" \
  -F "businessName=Test Coffee Shop" \
  -F "tagline=Fresh Coffee Every Day" \
  -F "about=We are a local coffee shop serving premium coffee since 2010. Our mission is to provide the best coffee experience." \
  -F "industry=restaurant" \
  -F 'services=["Coffee", "Pastries", "Breakfast"]' \
  -F "email=testcustomer@example.com" \
  -F "phone=+1234567890" \
  -F "address=123 Main Street, City")

echo "Response: $RESPONSE"

# Extract form submission ID
SUBMISSION_ID=$(echo $RESPONSE | python3 -c "import sys, json; print(json.load(sys.stdin).get('formSubmissionId', ''))" 2>/dev/null)

if [ -z "$SUBMISSION_ID" ]; then
  echo "❌ Failed to get form submission ID"
  exit 1
fi

echo "✅ Form submitted! Submission ID: $SUBMISSION_ID"

# Check if files were generated
echo ""
echo "📁 Step 2: Checking generated files..."
sleep 2
FILES_DIR="/Users/bytes/Desktop/websites_builder/ai-website-builder/generated-sites/$SUBMISSION_ID"
if [ -d "$FILES_DIR" ]; then
  echo "✅ Generated files directory exists: $FILES_DIR"
  ls -la "$FILES_DIR"
else
  echo "⚠️ Files not found yet (generation may still be in progress)"
fi

# Check preview URL
echo ""
echo "👁️ Step 3: Testing preview URL..."
PREVIEW_URL="http://localhost:3000/api/preview/$SUBMISSION_ID"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$PREVIEW_URL")
if [ "$HTTP_CODE" = "200" ]; then
  echo "✅ Preview URL works: $PREVIEW_URL"
else
  echo "⚠️ Preview URL returned HTTP $HTTP_CODE"
fi

echo ""
echo "=================================="
echo "🎉 Test completed!"
echo ""
echo "To complete the flow:"
echo "1. Check email at nomansiddiqui872@gmail.com for sales notification"
echo "2. Login at http://localhost:3000/login with credentials from email"
echo "3. Preview and edit at http://localhost:3000/my-website"
echo "4. Click Publish to deploy to Netlify"
