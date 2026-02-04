import fetch from 'node-fetch';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testMultipleImages() {
  try {
    console.log('🧪 Testing multiple images submission...\n');

    // Create test form
    const form = new FormData();
    form.append('businessName', 'Multi Image Test Cafe');
    form.append('tagline', 'Testing multiple gallery images');
    form.append('about', 'A test café with multiple gallery images to showcase our work.');
    form.append('industry', 'restaurant');
    form.append('services', JSON.stringify(['Coffee', 'Pastries', 'Lunch', 'Events']));
    form.append('email', 'test-multi@example.com');
    form.append('phone', '+1 (555) 123-4567');
    form.append('address', '123 Gallery St, Photo City, PC 12345');

    // Add testimonials
    const testimonials = [
      { authorName: 'Sarah Johnson', authorRole: 'Regular Customer', quote: 'Best coffee in town!' },
      { authorName: 'Mike Davis', authorRole: 'Event Host', quote: 'Perfect venue for our wedding!' },
    ];
    form.append('testimonials', JSON.stringify(testimonials));

    // Add colors
    const colors = { primary: '#8B4513', secondary: '#D2691E', accent: '#DEB887' };
    form.append('brandColors', JSON.stringify(colors));

    // Create dummy image files (small PNG files for testing)
    const publicDir = path.join(__dirname, 'public');
    const testImages = [];
    
    // Create 3 test image files
    for (let i = 0; i < 3; i++) {
      const testImagePath = path.join(__dirname, `test-image-${i}.png`);
      
      // Create a minimal 1x1 PNG for testing
      const pngData = Buffer.from([
        0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, // PNG signature
        0x00, 0x00, 0x00, 0x0D, // IHDR chunk size
        0x49, 0x48, 0x44, 0x52, // IHDR
        0x00, 0x00, 0x00, 0x01, // width: 1
        0x00, 0x00, 0x00, 0x01, // height: 1
        0x08, 0x02, 0x00, 0x00, 0x00, // bit depth, color type, etc.
        0x90, 0x77, 0x53, 0xDE, // CRC
        0x00, 0x00, 0x00, 0x0C, // IDAT chunk size
        0x49, 0x44, 0x41, 0x54, // IDAT
        0x08, 0xD7, 0x63, 0xF8, 0x0F, 0x00, 0x00, 0x01, 0x01, 0x00, 0x05,
        0x18, 0x0D, 0xB4, // data + CRC
        0x00, 0x00, 0x00, 0x00, // IEND chunk size
        0x49, 0x45, 0x4E, 0x44, // IEND
        0xAE, 0x42, 0x60, 0x82 // CRC
      ]);
      
      fs.writeFileSync(testImagePath, pngData);
      testImages.push(testImagePath);
      console.log(`✅ Created test image ${i + 1}: ${testImagePath}`);
    }

    // Append all images to form
    console.log(`\n📝 Appending ${testImages.length} images to form...`);
    form.append('additionalImagesCount', testImages.length.toString());
    testImages.forEach((imgPath, index) => {
      const stream = fs.createReadStream(imgPath);
      form.append(`additionalImage_${index}`, stream, `test-image-${index}.png`);
      console.log(`  - Added additionalImage_${index}`);
    });

    // Submit form
    console.log('\n📤 Submitting form to /api/form...');
    const response = await fetch('http://localhost:3000/api/form', {
      method: 'POST',
      body: form,
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error(`❌ Error: ${response.status} ${response.statusText}`);
      console.error('Error details:', errorData);
      return;
    }

    const result = await response.json();
    console.log('\n✅ Form submitted successfully!');
    console.log('Website generated ID:', result.submissionId);
    console.log('Website URL:', result.websiteUrl);

    // Clean up test images
    console.log('\n🧹 Cleaning up test images...');
    testImages.forEach(imgPath => {
      fs.unlinkSync(imgPath);
      console.log(`  - Removed ${path.basename(imgPath)}`);
    });

    // Verify the submission in database
    console.log('\n📊 Verifying submission in database...');
    const getResponse = await fetch(`http://localhost:3000/api/form/${result.submissionId}`);
    if (getResponse.ok) {
      const submissionData = await getResponse.json();
      console.log('✅ Submission found in database');
      console.log(`   - Additional images count: ${submissionData.additionalImages?.length || 0}`);
      if (submissionData.additionalImages) {
        submissionData.additionalImages.forEach((img, i) => {
          console.log(`   - Image ${i + 1}: ${img.substring(0, 50)}...`);
        });
      }
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error);
  }
}

testMultipleImages();
