import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verify() {
  try {
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
      console.log('📝 Testimonials saved:');
      console.log(JSON.stringify(submission.testimonials, null, 2));
      console.log('');
    } else {
      console.log('⚠️  No testimonials found');
    }

    if (submission.brandColors) {
      console.log('🎨 Brand Colors saved:');
      console.log(JSON.stringify(submission.brandColors, null, 2));
      console.log('');
    } else {
      console.log('⚠️  No brand colors found');
    }

    console.log('✨ Verification complete!');
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

verify();
