# Email Testing & Verification Guide

## ✅ Current Email Setup

**Sales Email:** `nomansiddiqui872@gmail.com` (from `.env`)

**EmailJS Configuration:**
- Service ID: `service_snwo45n`
- Public Key: `P_2zeIDIAo3ndhsLD`
- Private Key: `vVHu93MUI_oBaTE0zu2tv`
- Sales Template: `template_wapvp5p`

---

## 📧 Who Gets Which Emails?

### When User Clicks "Publish":

1. **Sales Team** (`nomansiddiqui872@gmail.com`) receives:
   - ✅ Business name
   - ✅ Customer email & phone
   - ✅ Live website URL
   - ✅ Login username & password
   - ✅ Link to admin dashboard

2. **Customer** (form submission email) receives:
   - ✅ Their login username & password
   - ✅ Live website URL
   - ✅ Login page link
   - ✅ Welcome message

---

## 🧪 Test Email System

### Option 1: Use Test Endpoint

```bash
# Test sales email
curl "http://localhost:3000/api/test-email?type=sales"

# Test customer credentials email
curl "http://localhost:3000/api/test-email?type=credentials"
```

### Option 2: Complete Flow Test

1. Start server: `npm run dev`
2. Submit form at: `http://localhost:3000/get-started`
3. Wait 30 seconds for generation
4. Login with generated credentials
5. Go to: `http://localhost:3000/my-website`
6. Click **"Publish to Live"** button
7. Check both emails:
   - Sales: `nomansiddiqui872@gmail.com`
   - Customer: whatever email you used in the form

---

## 🔍 Check If Emails Are Sending

### View Server Logs

When you click "Publish", you should see:

```
📧 Sending email notifications...
✅ EmailJS initialized for server-side usage
   Service ID: service_snwo45n
   Template ID: template_wapvp5p
   To: nomansiddiqui872@gmail.com
✅ Sales notification email sent: 200 OK
✅ Credentials email sent to customer: 200 OK
📬 Email status: Emails sent to both sales team and customer
```

### Check EmailJS Dashboard

1. Go to: https://dashboard.emailjs.com/
2. Login with your EmailJS account
3. Go to **Email Log** tab
4. Look for recent emails (shows last 50)
5. Check status: ✅ Sent | ❌ Failed

---

## ❌ If Emails Are NOT Being Received

### Possible Issues:

1. **EmailJS Template Not Created**
   - Go to EmailJS dashboard → Templates
   - Create template with ID: `template_wapvp5p`
   - Use the HTML from `EMAILJS_SETUP.md`

2. **Wrong Email Service**
   - Check EmailJS dashboard → Services
   - Make sure service `service_snwo45n` exists
   - Verify it's connected to your email provider

3. **API Keys Wrong**
   - Double-check `.env` file
   - Make sure EMAILJS_PUBLIC_KEY and EMAILJS_PRIVATE_KEY match dashboard

4. **Template Variables Missing**
   - EmailJS templates need these variables:
   - `{{to_email}}`, `{{business_name}}`, `{{customer_email}}`, etc.
   - See `EMAILJS_SETUP.md` for complete list

5. **Server Not Restarted**
   - Kill server: `pkill -f "next dev"`
   - Restart: `npm run dev`

---

## 🚀 Quick Test Right Now

Run this command to test:

```bash
curl "http://localhost:3000/api/test-email?type=sales"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Sales email test completed",
  "result": {
    "success": true,
    "messageId": "..."
  }
}
```

**If you get an error:**
```json
{
  "success": false,
  "error": "Failed to send sales notification email"
}
```

Then check:
1. EmailJS dashboard → Email Log for error details
2. Server console for full error message
3. Make sure template exists with correct ID

---

## 📋 Checklist

- [ ] EmailJS account created
- [ ] Service added (Gmail/Outlook/etc.)
- [ ] Template created: `template_wapvp5p`
- [ ] Template created: `template_user_credentials`
- [ ] API keys in `.env` file
- [ ] Server restarted
- [ ] Test endpoint returns success
- [ ] Email appears in inbox (check spam!)

---

## 💡 Alternative: Send Credentials on Generation

If you want to send credentials immediately after generation (instead of waiting for publish), edit:

**File:** `services/queue.service.ts` (line ~165)

**Add after website generation:**

```typescript
// Send credentials to customer immediately
try {
  await emailService.sendCredentialsToUser({
    businessName: submission.businessName,
    customerEmail: submission.email,
    customerName: username,
    username: username,
    password: generatedPassword,
    liveUrl: previewResult.url,
    loginUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/login`,
  });
  console.log('📧 Credentials sent to customer');
} catch (error) {
  console.error('⚠️ Failed to send credentials:', error);
}
```

This will send credentials as soon as the website preview is ready, so users don't have to wait for you to publish.

---

## 📞 Support

If emails still aren't working:
1. Check EmailJS Email Log: https://dashboard.emailjs.com/admin/templates
2. Check spam folder
3. Verify template IDs match exactly
4. Try sending a test from EmailJS dashboard directly
