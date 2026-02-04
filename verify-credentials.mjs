/**
 * Verify credentials are stored correctly in the database
 */
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function verifyCredentials() {
  console.log('🔍 Verifying stored credentials...\n');

  try {
    // Find the most recent user (Urban Grind)
    const user = await prisma.user.findFirst({
      where: {
        username: {
          contains: 'urban-grind'
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    if (!user) {
      console.log('❌ No Urban Grind user found in database');
      await prisma.$disconnect();
      return;
    }

    console.log('✅ User found in database:');
    console.log(`  ID: ${user.id}`);
    console.log(`  Username: ${user.username}`);
    console.log(`  Email: ${user.email}`);
    console.log(`  Password Hash: ${user.passwordHash.substring(0, 20)}...\n`);

    // Test password verification
    const testPassword = 'lvck5j2W4c1L';
    const isValid = await bcrypt.compare(testPassword, user.passwordHash);
    
    console.log(`🔑 Testing password '${testPassword}':`);
    console.log(`  Valid: ${isValid ? '✅ YES' : '❌ NO'}\n`);

    if (!isValid) {
      console.log('⚠️  Password mismatch! This is why login is failing.');
      console.log('   The password hash doesn\'t match the generated password.\n');
    } else {
      console.log('✅ Password verification successful!');
      console.log('   Login should work. Try:');
      console.log(`   Username: ${user.username}`);
      console.log(`   Password: ${testPassword}\n`);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

verifyCredentials();
