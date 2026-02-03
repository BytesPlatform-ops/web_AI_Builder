# EmailJS Setup Guide

We've switched from Resend to **EmailJS** for sending emails. Follow these steps to configure:

## ⚠️ CRITICAL: Enable API Access for Server-Side

EmailJS blocks server-side (non-browser) requests by default. You MUST configure this:

1. Go to [EmailJS Security Settings](https://dashboard.emailjs.com/admin/account/security)
2. In the **"Domains"** section:
   - Either **leave it empty** to allow all domains
   - Or add your production domain (e.g., `https://yourdomain.com`)
   - For local development, the allowlist may need to be cleared
3. Look for any **"API Access"** or **"Allow non-browser requests"** toggle and enable it
4. Save changes

**Error you'll see without this:** `API calls are disabled for non-browser applications`

**If emails still don't work:**
- Try clearing the domain allowlist completely
- Make sure your Private Key is correct in `.env`
- Check that your EmailJS service is connected properly

## 1. Create EmailJS Account

1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

## 2. Add Email Service

1. Go to **Email Services** in the dashboard
2. Click **Add New Service**
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the setup instructions
5. Copy your **Service ID**

## 3. Create Email Templates

Create 3 templates with the following template IDs:

### Template 1: Sales Notification (`template_sales_notification`)

**Template Variables:**
- `{{to_email}}` - Sales team email
- `{{business_name}}` - Customer's business name
- `{{customer_email}}` - Customer's email
- `{{customer_phone}}` - Customer's phone
- `{{live_url}}` - Live website URL
- `{{submission_id}}` - Submission ID
- `{{username}}` - Generated username
- `{{password}}` - Generated password
- `{{dashboard_url}}` - Link to admin dashboard

**Sample Template:**
```html
<h1>🎉 New Website Generated!</h1>

<h2>Business Details</h2>
<p><strong>Business Name:</strong> {{business_name}}</p>
<p><strong>Customer Email:</strong> {{customer_email}}</p>
<p><strong>Phone:</strong> {{customer_phone}}</p>
<p><strong>Submission ID:</strong> {{submission_id}}</p>

<h2>🔑 Login Credentials</h2>
<p><strong>Username:</strong> {{username}}</p>
<p><strong>Password:</strong> {{password}}</p>

<h2>🌐 Website</h2>
<p><strong>Live URL:</strong> <a href="{{live_url}}">{{live_url}}</a></p>

<p><a href="{{dashboard_url}}" style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">View in Dashboard</a></p>
```

### Template 2: User Credentials (`template_user_credentials`)

**Template Variables:**
- `{{to_email}}` - Customer's email
- `{{to_name}}` - Customer's name
- `{{business_name}}` - Business name
- `{{username}}` - Login username
- `{{password}}` - Login password
- `{{live_url}}` - Live website URL
- `{{login_url}}` - Login page URL

**Sample Template:**
```html
<h1>🎉 Your Website is Ready!</h1>

<p>Hi {{to_name}},</p>

<p>Great news! Your website for <strong>{{business_name}}</strong> has been successfully generated and is now live!</p>

<h2>🌐 Your Live Website</h2>
<p><a href="{{live_url}}" style="font-size: 18px;">{{live_url}}</a></p>

<h2>🔑 Your Login Credentials</h2>
<p><strong>Username:</strong> {{username}}<br>
<strong>Password:</strong> {{password}}</p>

<p><a href="{{login_url}}" style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Login to Your Dashboard</a></p>

<p>You can now:</p>
<ul>
  <li>✅ View your live website</li>
  <li>✅ Edit colors and content</li>
  <li>✅ Download website files</li>
</ul>
```

### Template 3: Published Notification (`template_published`)

**Template Variables:**
- `{{to_email}}` - Customer's email
- `{{to_name}}` - Customer's name
- `{{business_name}}` - Business name
- `{{live_url}}` - Live website URL

**Sample Template:**
```html
<h1>🚀 Your Website is Published!</h1>

<p>Hi {{to_name}},</p>

<p>Your website for <strong>{{business_name}}</strong> has been published and is now live for the world to see!</p>

<p><a href="{{live_url}}" style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-size: 18px;">View Your Live Website</a></p>

<p>Share your new website with customers and start growing your business!</p>
```

## 4. Get Your API Keys

1. Go to **Account** → **General**
2. Copy your **Public Key**
3. Go to **Account** → **API Keys**
4. Create a new **Private Key**
5. Copy the private key (you'll only see it once!)

## 5. Update .env File

Update your `.env` file with the actual values:

```bash
# EmailJS Configuration
EMAILJS_SERVICE_ID="service_xxxxxxx"
EMAILJS_PUBLIC_KEY="your_public_key_here"
EMAILJS_PRIVATE_KEY="your_private_key_here"
EMAILJS_TEMPLATE_SALES="template_sales_notification"
EMAILJS_TEMPLATE_CREDENTIALS="template_user_credentials"
EMAILJS_TEMPLATE_PUBLISHED="template_published"

# Keep this for fallback
SALES_EMAIL="nomansiddiqui872@gmail.com"
```

## 6. Test the Setup

Run the test script:

```bash
npm run test:email
```

## Why EmailJS?

| Feature | EmailJS | Resend |
|---------|---------|--------|
| **Free Tier** | 200 emails/month | 100 emails/month |
| **Setup** | No domain verification needed | Requires domain verification |
| **Templates** | Visual editor in dashboard | Code-based templates |
| **Pricing** | $0 - $15/month | $0 - $20/month |
| **Ease of Use** | Very easy | Requires more setup |

## EmailJS Features We Use

✅ **No domain verification** - Works instantly with any email
✅ **Template editor** - Create beautiful emails in the dashboard
✅ **Email tracking** - See delivery status
✅ **Multiple services** - Gmail, Outlook, SendGrid, etc.
✅ **Auto-reply** - Set up automatic responses

## Need Help?

- EmailJS Docs: https://www.emailjs.com/docs/
- Video Tutorial: https://www.youtube.com/watch?v=5EZsRnJpUzM
- Dashboard: https://dashboard.emailjs.com/

---

**Note:** Remember to never commit your `.env` file to version control!
