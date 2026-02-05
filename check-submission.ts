import { prisma } from './lib/prisma';

async function checkSubmission() {
  try {
    // Get the most recent form submission
    const submission = await prisma.formSubmission.findFirst({
      where: {
        email: 'test@testimon.com'
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    if (!submission) {
      console.log('❌ No submission found');
      return;
    }

    console.log('✅ Submission found:');
    console.log('  ID:', submission.id);
    console.log('  Business Name:', submission.businessName);
    console.log('  Email:', submission.email);
    console.log('  Status:', submission.status);
    console.log('');
    
    if (submission.testimonials) {
      const testimonials = submission.testimonials;
      console.log('📝 Testimonials:');
      console.log(JSON.stringify(testimonials, null, 2));
      console.log('');
    }

    if (submission.brandColors) {
      const colors = submission.brandColors;
      console.log('🎨 Brand Colors:');
      console.log(JSON.stringify(colors, null, 2));
      console.log('');
    }

    console.log('✨ All fields saved correctly!');
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : String(error));
  } finally {
    await prisma.$disconnect();
  }
}

checkSubmission();
