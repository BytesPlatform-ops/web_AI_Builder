/**
 * Email Service using EmailJS REST API
 * Handles all email communications:
 * 1. Notify sales when website is generated
 * 2. Send credentials to user
 * 3. Notify user when site is published
 * 
 * Using REST API directly for server-side compatibility
 */

// EmailJS Configuration
const EMAILJS_SERVICE_ID = process.env.EMAILJS_SERVICE_ID || '';
const EMAILJS_PUBLIC_KEY = process.env.EMAILJS_PUBLIC_KEY || '';
const EMAILJS_PRIVATE_KEY = process.env.EMAILJS_PRIVATE_KEY || '';

const SALES_EMAIL = process.env.SALES_EMAIL || 'sales@yourcompany.com';

// Template IDs - Create these in EmailJS dashboard
const TEMPLATE_SALES_NOTIFICATION = process.env.EMAILJS_TEMPLATE_SALES || 'template_sales';
const TEMPLATE_USER_CREDENTIALS = process.env.EMAILJS_TEMPLATE_CREDENTIALS || 'template_credentials';
const TEMPLATE_PUBLISHED = process.env.EMAILJS_TEMPLATE_PUBLISHED || 'template_published';

// EmailJS REST API endpoint
const EMAILJS_API_URL = 'https://api.emailjs.com/api/v1.0/email/send';

/**
 * Send email using EmailJS REST API (server-side compatible)
 */
async function sendEmailViaREST(serviceId: string, templateId: string, templateParams: Record<string, string>): Promise<{ status: number; text: string }> {
  const payload = {
    service_id: serviceId,
    template_id: templateId,
    user_id: EMAILJS_PUBLIC_KEY,
    template_params: templateParams,
    accessToken: EMAILJS_PRIVATE_KEY,
  };

  console.log('📧 Sending email via REST API...');
  console.log('   Service ID:', serviceId);
  console.log('   Template ID:', templateId);
  console.log('   To:', templateParams.to_email);
  console.log('   Payload:', JSON.stringify(payload, null, 2));

  const response = await fetch(EMAILJS_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const text = await response.text();
  console.log('   Response status:', response.status);
  console.log('   Response text:', text);
  
  if (!response.ok) {
    // Provide helpful error message for common issues
    let errorMessage = `EmailJS API Error: ${response.status} - ${text}`;
    
    if (text.includes('API calls are disabled for non-browser')) {
      errorMessage = 'EmailJS API calls blocked. Please go to EmailJS Dashboard → Account → Security and ENABLE "Allow non-browser applications" to allow server-side API calls.';
    }
    
    throw new Error(errorMessage);
  }

  return { status: response.status, text };
}

export interface SendToSalesParams {
  businessName: string;
  customerEmail: string;
  customerPhone?: string;
  liveUrl: string;
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
  liveUrl: string;
  loginUrl: string;
}

export interface SendPublishedNotificationParams {
  businessName: string;
  customerEmail: string;
  customerName?: string;
  liveUrl: string;
}

class EmailService {
  /**
   * Send notification to sales team when website is generated
   */
  async sendToSales(params: SendToSalesParams) {
    const {
      businessName,
      customerEmail,
      customerPhone,
      liveUrl,
      submissionId,
      username,
      password,
    } = params;

    try {
      const templateParams = {
        to_email: SALES_EMAIL,
        business_name: businessName,
        customer_email: customerEmail,
        customer_phone: customerPhone || 'N/A',
        live_url: liveUrl,
        submission_id: submissionId,
        username: username,
        password: password,
        dashboard_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/dashboard/${submissionId}`,
      };

      const response = await sendEmailViaREST(
        EMAILJS_SERVICE_ID,
        TEMPLATE_SALES_NOTIFICATION,
        templateParams
      );

      console.log('✅ Sales notification email sent:', response.status, response.text);
      return { success: true, messageId: response.text };
    } catch (error) {
      console.error('❌ Failed to send sales notification:', error);
      // Don't throw - allow process to continue even if email fails
      return { success: false, error: String(error) };
    }
  }

  /**
   * Send login credentials to the customer
   */
  async sendCredentialsToUser(params: SendCredentialsToUserParams) {
    const {
      businessName,
      customerEmail,
      customerName,
      username,
      password,
      liveUrl,
      loginUrl,
    } = params;

    try {
      const templateParams = {
        to_email: customerEmail,
        to_name: customerName || 'Valued Customer',
        business_name: businessName,
        username: username,
        password: password,
        live_url: liveUrl,
        login_url: loginUrl,
      };

      const response = await sendEmailViaREST(
        EMAILJS_SERVICE_ID,
        TEMPLATE_USER_CREDENTIALS,
        templateParams
      );

      console.log('✅ Credentials email sent to user:', response.status, response.text);
      return { success: true, messageId: response.text };
    } catch (error) {
      console.error('❌ Failed to send credentials email:', error);
      return { success: false, error: String(error) };
    }
  }

  /**
   * Send notification to user when their website is published
   */
  async sendPublishedNotification(params: SendPublishedNotificationParams) {
    const { businessName, customerEmail, customerName, liveUrl } = params;

    try {
      const templateParams = {
        to_email: customerEmail,
        to_name: customerName || 'Valued Customer',
        business_name: businessName,
        live_url: liveUrl,
      };

      const response = await sendEmailViaREST(
        EMAILJS_SERVICE_ID,
        TEMPLATE_PUBLISHED,
        templateParams
      );

      console.log('✅ Published notification email sent:', response.status, response.text);
      return { success: true, messageId: response.text };
    } catch (error) {
      console.error('❌ Failed to send published notification:', error);
      return { success: false, error: String(error) };
    }
  }
}

export const emailService = new EmailService();
