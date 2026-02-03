import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function resetPending() {
  // Reset all GENERATING status back to PENDING
  const result = await prisma.formSubmission.updateMany({
    where: { status: 'GENERATING' },
    data: { status: 'PENDING' }
  });
  
  console.log(`✅ Reset ${result.count} submissions back to PENDING`);
  await prisma.$disconnect();
}

resetPending().catch(console.error);
