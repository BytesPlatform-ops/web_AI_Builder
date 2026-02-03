import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkStatus() {
  const submissions = await prisma.formSubmission.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
    include: { generatedWebsite: true }
  });
  
  console.log('\n📊 Recent Submissions:\n');
  submissions.forEach(sub => {
    console.log(`Business: ${sub.businessName}`);
    console.log(`Status: ${sub.status}`);
    console.log(`Email: ${sub.email}`);
    if (sub.generatedWebsite) {
      console.log(`✅ Website: ${sub.generatedWebsite.deploymentUrl}`);
    }
    console.log('---');
  });
  
  await prisma.$disconnect();
}

checkStatus().catch(console.error);
