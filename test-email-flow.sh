#!/bin/bash

echo "📧 Testing Email System Flow"
echo "================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Submit form
echo "📝 Step 1: Submitting form to generate website..."
RESPONSE=$(curl -s -X POST 'http://localhost:3000/api/form' \
  -F 'businessName=Email Test Bakery' \
  -F 'about=A delicious bakery for testing email notifications' \
  -F 'services=Fresh Bread' \
  -F 'services=Pastries' \
  -F 'email=customer@emailtest.com' \
  -F 'phone=555-EMAIL-01')

echo "$RESPONSE" | jq '.'
SUBMISSION_ID=$(echo "$RESPONSE" | jq -r '.formSubmissionId')

if [ "$SUBMISSION_ID" != "null" ]; then
  echo -e "${GREEN}✅ Form submitted successfully!${NC}"
  echo "   Submission ID: $SUBMISSION_ID"
  echo "   Generated username: email-test-bakery"
else
  echo -e "${RED}❌ Form submission failed${NC}"
  exit 1
fi

echo ""
echo -e "${YELLOW}⏳ Step 2: Waiting 5 seconds for background processing...${NC}"
sleep 5

# Test 2: Trigger generation manually
echo ""
echo "🚀 Step 3: Triggering website generation..."
GEN_RESPONSE=$(curl -s -X POST "http://localhost:3000/api/test-generation?latest=true")
echo "$GEN_RESPONSE" | jq '.'

SUCCESS=$(echo "$GEN_RESPONSE" | jq -r '.success')
LIVE_URL=$(echo "$GEN_RESPONSE" | jq -r '.data.liveUrl')

if [ "$SUCCESS" == "true" ]; then
  echo -e "${GREEN}✅ Website generated successfully!${NC}"
  echo "   Live URL: $LIVE_URL"
  echo ""
  echo -e "${GREEN}📧 Check your SALES_EMAIL inbox for:${NC}"
  echo "   - Subject: 🎉 New Website Generated - Email Test Bakery"
  echo "   - Contains: Login credentials (username + password)"
  echo "   - Contains: Live URL: $LIVE_URL"
else
  echo -e "${RED}❌ Website generation failed${NC}"
  echo "$GEN_RESPONSE"
  exit 1
fi

# Test 3: Wait and send credentials to user
echo ""
echo -e "${YELLOW}⏳ Step 4: Waiting 3 seconds before sending credentials to user...${NC}"
sleep 3

echo ""
echo "📨 Step 5: Sending credentials email to customer..."
SEND_RESPONSE=$(curl -s -X POST 'http://localhost:3000/api/admin/send-credentials' \
  -H 'Content-Type: application/json' \
  -d "{\"submissionId\": \"$SUBMISSION_ID\"}")

echo "$SEND_RESPONSE" | jq '.'

SEND_SUCCESS=$(echo "$SEND_RESPONSE" | jq -r '.success')

if [ "$SEND_SUCCESS" == "true" ]; then
  echo -e "${GREEN}✅ Credentials email sent to customer!${NC}"
  echo ""
  echo -e "${GREEN}📧 Check customer@emailtest.com inbox for:${NC}"
  echo "   - Subject: 🎉 Your Website is Ready - Email Test Bakery"
  echo "   - Contains: Username and Password"
  echo "   - Contains: Login button link"
  echo "   - Contains: Live website link"
else
  echo -e "${RED}❌ Failed to send credentials email${NC}"
  echo "$SEND_RESPONSE"
fi

echo ""
echo "================================"
echo "📋 Email Flow Test Summary"
echo "================================"
echo ""
echo -e "${GREEN}✅ Form Submission → Sales Email (automatic)${NC}"
echo "   Sales team receives notification with credentials"
echo ""
echo -e "${GREEN}✅ Sales → Customer Email (manual trigger from dashboard)${NC}"
echo "   Customer receives credentials and login instructions"
echo ""
echo -e "${YELLOW}📌 Next Steps:${NC}"
echo "1. Check SALES_EMAIL inbox (${FROM_EMAIL:-noreply@yourdomain.com})"
echo "2. Check customer@emailtest.com inbox"
echo "3. Test login at http://localhost:3000/login with credentials from email"
echo "4. Verify user can access /my-website dashboard"
echo ""
echo -e "${YELLOW}⚠️  Note: If using Resend's free tier, emails only send to verified addresses${NC}"
echo ""
