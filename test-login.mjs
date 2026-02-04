import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000';

async function testLogin() {
  console.log('🔐 Testing login with the newly created credentials...\n');
  
  const credentials = {
    email: 'urban-grind-caf-abf2', // username
    password: 'lvck5j2W4c1L'
  };

  console.log('📝 Attempting login with:');
  console.log(`  Username: ${credentials.email}`);
  console.log(`  Password: ${credentials.password}\n`);

  try {
    const response = await fetch(`${BASE_URL}/api/auth/callback/credentials`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials)
    });

    console.log(`Response Status: ${response.status}`);
    const text = await response.text();
    console.log(`Response: ${text.substring(0, 200)}...\n`);

    if (response.status === 200 || response.status === 302) {
      console.log('✅ Login endpoint is working!');
    } else {
      console.log('⚠️ Login returned a different status - check if user exists in DB');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testLogin();
