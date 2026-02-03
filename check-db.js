const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const submission = await prisma.formSubmission.findFirst({
    where: { businessName: 'Test Coffee Shop' },
    orderBy: { createdAt: 'desc' },
    include: { generatedWebsite: true }
  });
  
  console.log('\n📋 Form Submission:');
  console.log('   ID:', submission?.id);
  console.log('   Status:', submission?.status);
  console.log('   Email:', submission?.email);
  
  if (submission?.socialLinks?._credentials) {
    console.log('\n🔑 Stored Credentials:');
    console.log('   Username:', submission.socialLinks._credentials.username);
    console.log('   Password:', submission.socialLinks._credentials.password);
  }
  
  if (submission?.generatedWebsite) {
    console.log('\n🌐 Generated Website:');
    console.log('   ID:', submission.generatedWebsite.id);
    console.log('   Status:', submission.generatedWebsite.status);
    console.log('   Preview URL:', submission.generatedWebsite.previewUrl);
  }
  
  const user = await prisma.user.findFirst({
    where: { email: 'testcustomer@example.com' }
  });
  
  if (user) {
    console.log('\n👤 User Account:');
    console.log('   ID:', user.id);
    console.log('   Username:', user.username);
    console.log('   Email:', user.email);
  }
  
  await prisma.$disconnect();
}

check().catch(console.error);
