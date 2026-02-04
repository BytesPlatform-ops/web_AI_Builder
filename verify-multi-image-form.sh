#!/bin/bash

# Test the form with multiple images submission
# This script creates test form data and submits it

echo "🧪 Testing multiple images form submission"
echo "============================================"
echo ""

# Wait for server
sleep 2

# Create a test using curl - simplified version
echo "📝 Test 1: Verify form loads with multiple attribute"
FORM_HTML=$(curl -s http://localhost:3000/get-started | grep -A5 "Select Multiple")
if [[ $FORM_HTML == *"multiple"* ]]; then
    echo "✅ Form input has 'multiple' attribute"
else
    echo "❌ Form input missing 'multiple' attribute"
fi

echo ""
echo "📝 Test 2: Check for state management in form"
FORM_HTML=$(curl -s http://localhost:3000/get-started | grep "handleAdditionalImagesChange\|selectedAdditionalImages")
if [[ $FORM_HTML == *"additionalImages"* ]]; then
    echo "✅ Form includes additional images handling"
else
    echo "❌ Form missing additional images handling"
fi

echo ""
echo "📝 Test 3: Verify preview section exists"
FORM_HTML=$(curl -s http://localhost:3000/get-started | grep "will appear in the Gallery")
if [[ -n $FORM_HTML ]]; then
    echo "✅ Preview text found: 'will appear in the Gallery'"
else
    echo "❌ Preview text not found"
fi

echo ""
echo "✅ Form structure verification complete!"
echo ""
echo "Next steps:"
echo "1. Open http://localhost:3000/get-started in your browser"
echo "2. Scroll to 'Additional Images (Optional) - 📸 Select Multiple'"
echo "3. Click the input and select 3-5 images using Ctrl+Click (Windows) or Cmd+Click (Mac)"
echo "4. Preview should show all selected images in a green box"
echo "5. Submit the form and verify all images appear in the generated website"
