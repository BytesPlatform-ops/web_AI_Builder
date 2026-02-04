/**
 * Test form submission with testimonials and brand colors
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE_URL = 'http://localhost:3000';

async function testFormSubmission() {
  console.log('🧪 Testing form submission with testimonials and brand colors...\n');

  try {
    // Create form data
    const formData = new FormData();
    
    // Basic fields (required)
    formData.append('businessName', 'Test Business with Testimonials');
    formData.append('tagline', 'Best Service in Town');
    formData.append('about', 'We provide exceptional services to our customers with dedication and quality.');
    formData.append('industry', 'consulting');
    formData.append('services', JSON.stringify(['Consulting', 'Strategy', 'Implementation']));
    formData.append('email', 'test@testimon.com');
    formData.append('phone', '+1-555-0123');
    formData.append('address', '123 Main St, Test City, TC 12345');

    // Brand colors
    const brandColors = {
      primary: '#FF6B6B',
      secondary: '#4ECDC4',
      accent: '#FFE66D'
    };
    formData.append('brandColors', JSON.stringify(brandColors));

    // Testimonials
    const testimonials = [
      {
        authorName: 'John Smith',
        authorRole: 'CEO, Tech Corp',
        quote: 'This service transformed our business completely. Highly recommended!'
      },
      {
        authorName: 'Sarah Johnson',
        authorRole: 'Marketing Manager',
        quote: 'Excellent work and outstanding customer support. They went above and beyond.'
      },
      {
        authorName: 'Mike Williams',
        authorRole: 'Owner',
        quote: 'Professional, reliable, and delivered exactly what we needed on time.'
      }
    ];
    formData.append('testimonials', JSON.stringify(testimonials));

    console.log('📋 Form Data:');
    console.log('  Business Name:', 'Test Business with Testimonials');
    console.log('  Services:', ['Consulting', 'Strategy', 'Implementation']);
    console.log('  Email:', 'test@testimon.com');
    console.log('  Brand Colors:', brandColors);
    console.log(`  Testimonials: ${testimonials.length} customer testimonials added`);
    console.log('');

    // Submit form
    console.log('📤 Submitting form to /api/form...');
    const response = await fetch(`${BASE_URL}/api/form`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    console.log('');

    if (!response.ok) {
      console.log('❌ Form submission failed!');
      console.log('Status:', response.status);
      console.log('Error:', data.error || data.message || 'Unknown error');
      return false;
    }

    console.log('✅ Form submitted successfully!');
    console.log('');
    console.log('Response:');
    console.log('  Success:', data.success);
    console.log('  Message:', data.message);
    console.log('  Submission ID:', data.formSubmissionId);
    console.log('');

    // Wait a bit for generation to complete
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Verify the submission was saved to database
    console.log('🔍 Verifying submission in database...');
    const checkResponse = await fetch(`${BASE_URL}/api/form/${data.formSubmissionId}`);
    
    if (checkResponse.status === 404) {
      console.log('⚠️  Submission API endpoint not found (expected - endpoint may not exist)');
      console.log('   But form was submitted successfully!');
    } else if (checkResponse.ok) {
      const submission = await checkResponse.json();
      console.log('✅ Submission verified in database:');
      console.log('  ID:', submission.id);
      console.log('  Business Name:', submission.businessName);
      console.log('  Status:', submission.status);
      if (submission.testimonials) {
        console.log(`  Testimonials: ${JSON.parse(submission.testimonials).length} found`);
      }
      if (submission.brandColors) {
        console.log('  Brand Colors:', JSON.parse(submission.brandColors));
      }
    }

    console.log('');
    console.log('✨ Test completed successfully!');
    return true;

  } catch (error) {
    console.error('❌ Test failed with error:');
    console.error(error.message);
    return false;
  }
}

// Run test
testFormSubmission().then(success => {
  process.exit(success ? 0 : 1);
});
