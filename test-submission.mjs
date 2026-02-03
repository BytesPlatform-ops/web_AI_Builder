import { PrismaClient } from '@prisma/client';

async function createTestSubmission() {
  const prisma = new PrismaClient();
  
  try {
    const submission = await prisma.formSubmission.create({
      data: {
        businessName: 'Test Pizza Place',
        tagline: 'Fresh authentic pizza',
        about: 'We make the best pizza in town with fresh local ingredients and traditional wood-fired ovens.',
        industry: 'Food & Beverage',
        services: ['Dine-in', 'Takeout', 'Catering'],
        email: 'test@pizzaplace.com',
        phone: '+1-555-1234',
        address: '123 Main St, Pizza City, CA 90210',
      }
    });
    
    console.log('Created submission:', submission.id);
    
    // Wait for background queue to process
    console.log('Waiting 15 seconds for background processing...');
    await new Promise(resolve => setTimeout(resolve, 15000));
    
    // Check status
    const updated = await prisma.formSubmission.findUnique({
      where: { id: submission.id },
      include: { generatedWebsite: true }
    });
    
    console.log('Status:', updated?.status);
    if (updated?.generatedWebsite) {
      console.log('✅ Website deployed to:', updated.generatedWebsite.deploymentUrl);
    } else {
      console.log('❌ No website generated yet');
    }
    
    await prisma.$disconnect();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

createTestSubmission();
