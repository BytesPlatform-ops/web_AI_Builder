/**
 * Email Service using Resend
 * Handles all email communications:
 * 1. Notify sales when website is generated (with user credentials)
 * 2. Send credentials to user (when sales person triggers it)
 * 3. Notify user when site is published
 */

const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
const FROM_EMAIL = process.env.FROM_EMAIL || 'onboarding@resend.dev';
const SALES_EMAIL = process.env.SALES_EMAIL || 'sales@yourcompany.com';

export interface SendToSalesParams {
  businessName: string;
  customerEmail: string;
  customerPhone?: string;
  previewUrl: string;
  loginUrl: string;
  submissionId: string;
  username: string;
  password: string;
}

export interface SendCredentialsToUserParams {
  businessName: string;
  customerEmail: string;
  customerName?: string;
  username: string;
  password: string;
  loginUrl: string;
}

export interface SendPublishedNotificationParams {
  businessName: string;
  customerEmail: string;
  customerName?: string;
  liveUrl: string;
}

class ResendEmailService {
  private async sendEmail(to: string, subject: string, html: string) {
    if (!RESEND_API_KEY) {
      console.warn('⚠️ RESEND_API_KEY not configured - email will not be sent');
      return { success: false, error: 'API key not configured' };
    }

    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: FROM_EMAIL,
          to: [to],
          subject,
          html,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('❌ Resend API error:', data);
        return { success: false, error: data };
      }

      console.log('✅ Email sent successfully:', data);
      return { success: true, data };
    } catch (error) {
      console.error('❌ Failed to send email:', error);
      return { success: false, error: String(error) };
    }
  }

  /**
   * Send notification to sales team when website is generated
   * This includes the customer login credentials so sales can share with customer
   */
  async sendToSales(params: SendToSalesParams) {
    const {
      businessName,
      customerEmail,
      customerPhone,
      previewUrl,
      loginUrl,
      submissionId,
      username,
      password,
    } = params;

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Website Generated - ${businessName}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
    <h1 style="color: white; margin: 0; font-size: 24px;">🎉 New Website Generated!</h1>
    <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">A new customer website is ready for review</p>
  </div>
  
  <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef;">
    <h2 style="color: #667eea; margin-top: 0;">📋 Customer Details</h2>
    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef;"><strong>Business Name:</strong></td>
        <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef;">${businessName}</td>
      </tr>
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef;"><strong>Customer Email:</strong></td>
        <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef;"><a href="mailto:${customerEmail}" style="color: #667eea;">${customerEmail}</a></td>
      </tr>
      ${customerPhone ? `
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef;"><strong>Phone:</strong></td>
        <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef;"><a href="tel:${customerPhone}" style="color: #667eea;">${customerPhone}</a></td>
      </tr>
      ` : ''}
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef;"><strong>Submission ID:</strong></td>
        <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef; font-family: monospace; font-size: 12px;">${submissionId}</td>
      </tr>
    </table>

    <h2 style="color: #667eea; margin-top: 30px;">🔑 Customer Login Credentials</h2>
    <div style="background: #fff; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea; margin: 15px 0;">
      <p style="margin: 5px 0;"><strong>Login URL:</strong></p>
      <p style="margin: 5px 0;"><a href="${loginUrl}" style="color: #667eea; word-break: break-all;">${loginUrl}</a></p>
      <hr style="border: none; border-top: 1px solid #e9ecef; margin: 15px 0;">
      <p style="margin: 5px 0;"><strong>Username:</strong> <code style="background: #e8f4f8; padding: 4px 12px; border-radius: 4px; font-size: 14px;">${username}</code></p>
      <p style="margin: 5px 0;"><strong>Password:</strong> <code style="background: #e8f4f8; padding: 4px 12px; border-radius: 4px; font-size: 14px;">${password}</code></p>
    </div>
    <p style="font-size: 14px; color: #666; margin-top: 10px;">
      👆 Share these credentials with the customer so they can login, preview their website, make edits, and publish it.
    </p>

    <h2 style="color: #667eea; margin-top: 30px;">👁️ Preview Website</h2>
    <div style="text-align: center; margin: 20px 0;">
      <a href="${previewUrl}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">Preview Website →</a>
    </div>
    <p style="text-align: center; font-size: 14px; color: #666;">
      <a href="${previewUrl}" style="color: #667eea; text-decoration: none; word-break: break-all;">${previewUrl}</a>
    </p>

    <div style="background: #e3f2fd; border: 1px solid #2196f3; padding: 15px; border-radius: 8px; margin-top: 30px;">
      <p style="margin: 0; color: #1565c0;"><strong>📝 Customer Flow:</strong></p>
      <ol style="margin: 10px 0 0 0; color: #1565c0; padding-left: 20px;">
        <li>Customer logs in using the credentials above</li>
        <li>They can preview their generated website</li>
        <li>They can edit colors and content</li>
        <li>When ready, they click "Publish" to go live</li>
      </ol>
    </div>
  </div>

  <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
    <p>This is an automated notification from AI Website Builder</p>
  </div>
</body>
</html>
    `;

    const result = await this.sendEmail(
      SALES_EMAIL,
      `🎉 New Website Generated - ${businessName}`,
      html
    );

    if (result.success) {
      console.log(`✅ Sales notification sent to ${SALES_EMAIL}`);
    }

    return result;
  }

  /**
   * Send login credentials to customer (triggered by sales person)
   */
  async sendCredentialsToUser(params: SendCredentialsToUserParams) {
    const {
      businessName,
      customerEmail,
      customerName,
      username,
      password,
      loginUrl,
    } = params;

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Website is Ready - ${businessName}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
    <h1 style="color: white; margin: 0; font-size: 24px;">🎉 Your Website is Ready!</h1>
    <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Login to preview and publish your ${businessName} website</p>
  </div>
  
  <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef;">
    <p style="font-size: 16px;">Hi ${customerName || 'there'},</p>
    <p style="font-size: 16px;">Great news! Your website for <strong>${businessName}</strong> has been generated and is ready for your review.</p>
    
    <h2 style="color: #10b981; margin-top: 30px;">🔑 Your Login Credentials</h2>
    <div style="background: #fff; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981; margin: 15px 0;">
      <p style="margin: 5px 0;"><strong>Username:</strong> <code style="background: #e8f8f3; padding: 4px 12px; border-radius: 4px; font-size: 14px;">${username}</code></p>
      <p style="margin: 5px 0;"><strong>Password:</strong> <code style="background: #e8f8f3; padding: 4px 12px; border-radius: 4px; font-size: 14px;">${password}</code></p>
    </div>

    <div style="text-align: center; margin: 30px 0;">
      <a href="${loginUrl}" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">Login to Your Website →</a>
    </div>

    <div style="background: #fff; padding: 20px; border-radius: 8px; margin-top: 30px;">
      <p style="margin: 0 0 15px 0;"><strong>What you can do:</strong></p>
      <ul style="margin: 0; padding-left: 20px; color: #666;">
        <li style="margin-bottom: 8px;">✨ Preview your complete website</li>
        <li style="margin-bottom: 8px;">🎨 Customize colors and content</li>
        <li style="margin-bottom: 8px;">🚀 Publish your website to go live</li>
      </ul>
    </div>
  </div>

  <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
    <p>If you have any questions, please contact our support team.</p>
  </div>
</body>
</html>
    `;

    const result = await this.sendEmail(
      customerEmail,
      `🎉 Your Website is Ready - ${businessName}`,
      html
    );

    return result;
  }

  /**
   * Send notification to user when their website is published
   */
  async sendPublishedNotification(params: SendPublishedNotificationParams) {
    const { businessName, customerEmail, customerName, liveUrl } = params;

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Website is Live! - ${businessName}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
    <h1 style="color: white; margin: 0; font-size: 24px;">🚀 Your Website is Live!</h1>
    <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Congratulations! Your website is now available to the world</p>
  </div>
  
  <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef;">
    <p style="font-size: 16px;">Hi ${customerName || 'there'},</p>
    <p style="font-size: 16px;">Great news! Your website for <strong>${businessName}</strong> has been published and is now live!</p>
    
    <h2 style="color: #667eea; margin-top: 30px;">🌐 Your Live Website</h2>
    <div style="text-align: center; margin: 20px 0;">
      <a href="${liveUrl}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">Visit Your Website →</a>
    </div>
    <p style="text-align: center; font-size: 14px; color: #666;">
      <a href="${liveUrl}" style="color: #667eea; text-decoration: none; word-break: break-all;">${liveUrl}</a>
    </p>

    <div style="background: #e8f5e9; border: 1px solid #4caf50; padding: 15px; border-radius: 8px; margin-top: 30px;">
      <p style="margin: 0; color: #2e7d32;"><strong>🎉 You're all set!</strong></p>
      <p style="margin: 10px 0 0 0; color: #2e7d32;">Your website is now accessible to anyone on the internet. Share your URL with customers, add it to your social media profiles, and start growing your online presence!</p>
    </div>
  </div>

  <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
    <p>Thank you for choosing AI Website Builder!</p>
  </div>
</body>
</html>
    `;

    const result = await this.sendEmail(
      customerEmail,
      `🚀 Your Website is Live! - ${businessName}`,
      html
    );

    return result;
  }
}

export const resendEmailService = new ResendEmailService();
