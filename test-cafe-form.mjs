import fs from 'fs';

const BASE_URL = 'http://localhost:3000';

async function test() {
  console.log('🧪 Testing real form flow with testimonials...\n');

  try {
    const formData = new FormData();
    
    // Business info
    formData.append('businessName', 'Urban Grind Café');
    formData.append('tagline', 'Premium Coffee & Culture');
    formData.append('about', 'Urban Grind Café is a specialty coffee shop focused on sustainable, ethically sourced beans.');
    formData.append('industry', 'restaurant');
    formData.append('services', JSON.stringify(['Espresso Drinks', 'Pour Over Coffee', 'Pastries', 'WiFi Workspace']));
    formData.append('email', 'urban@grind.coffee');
    formData.append('phone', '+1-555-COFFEE1');
    formData.append('address', '234 Main Street, Downtown District');

    // Brand colors - coffee brown tones
    formData.append('brandColors', JSON.stringify({
      primary: '#8B4513',
      secondary: '#D2691E',
      accent: '#DEB887'
    }));

    // Real testimonials
    formData.append('testimonials', JSON.stringify([
      {
        authorName: 'Sarah Mitchell',
        authorRole: 'Startup Founder',
        quote: 'Best workspace. The coffee is exceptional and vibe is perfect for focused work.'
      },
      {
        authorName: 'James Chen',
        authorRole: 'Freelance Designer',
        quote: 'My second office. Great pastries and amazing company!'
      }
    ]));

    console.log('📤 Submitting form...\n');
    
    const response = await fetch(`${BASE_URL}/api/form`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      console.log('❌ Failed:', data.error);
      return false;
    }

    console.log('✅ Form submitted successfully!');
    console.log('📝 Submission ID:', data.formSubmissionId);
    console.log('✨ Test completed!');
    return true;

  } catch (error) {
    console.error('❌ Error:', error.message);
    return false;
  }
}

test().then(success => process.exit(success ? 0 : 1));
