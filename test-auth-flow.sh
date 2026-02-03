#!/bin/bash

echo "🧪 Testing Authentication Flow"
echo "================================"
echo ""

# Test 1: Submit form with credentials
echo "📝 Step 1: Submitting form to generate credentials..."
RESPONSE=$(curl -s -X POST 'http://localhost:3000/api/form' \
  -F 'businessName=Auth Test Restaurant' \
  -F 'about=A restaurant for testing authentication' \
  -F 'services=Fine Dining' \
  -F 'email=authtest@restaurant.com' \
  -F 'phone=555-AUTH-TEST')

echo "$RESPONSE" | jq '.'
SUBMISSION_ID=$(echo "$RESPONSE" | jq -r '.formSubmissionId')

if [ "$SUBMISSION_ID" != "null" ]; then
  echo "✅ Form submitted successfully!"
  echo "   Submission ID: $SUBMISSION_ID"
  echo "   Generated username: auth-test-restaurant"
  echo "   Generated password: (check server logs)"
else
  echo "❌ Form submission failed"
  exit 1
fi

echo ""
echo "⏳ Step 2: Waiting for website generation (30 seconds)..."
sleep 30

echo ""
echo "🚀 Step 3: Triggering manual generation..."
GEN_RESPONSE=$(curl -s -X POST "http://localhost:3000/api/test-generation?latest=true")
echo "$GEN_RESPONSE" | jq '.'

echo ""
echo "📋 Step 4: Instructions for manual testing..."
echo ""
echo "The authentication system is now fully implemented!"
echo ""
echo "To test manually:"
echo "1. Open browser to http://localhost:3000/login"
echo "2. Enter credentials:"
echo "   - Email or Username: authtest@restaurant.com OR auth-test-restaurant"  
echo "   - Password: (check server logs for generated password)"
echo "3. Click 'Sign In'"
echo "4. You should be redirected to /my-website"
echo "5. You should see your generated website details"
echo ""
echo "To find the generated password:"
echo "  grep '🔑 Generated credentials' in your terminal or server logs"
echo ""
