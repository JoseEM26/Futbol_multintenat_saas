const { PrismaClient } = require('@prisma/client');
const { scryptSync, randomBytes } = require('crypto');

const prisma = new PrismaClient();

// BetterAuth uses scrypt for password hashing. We need to replicate the same format.
// BetterAuth stores passwords in the `account` table, field `password`, 
// with providerId = "credential"

async function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

async function main() {
  const newPassword = '123456';
  const hashed = await hashPassword(newPassword);

  console.log('🔑 Hashed password generated for "123456"');

  // Get all users
  const users = await prisma.user.findMany();
  console.log(`\n📋 Found ${users.length} users:\n`);

  for (const user of users) {
    // Check if account exists for this user
    const account = await prisma.account.findFirst({
      where: { userId: user.id, providerId: 'credential' }
    });

    if (account) {
      // Update existing account password
      await prisma.account.update({
        where: { id: account.id },
        data: { password: hashed }
      });
      console.log(`✅ Updated: ${user.email} (${user.role}) - password → 123456`);
    } else {
      // Create credential account
      await prisma.account.create({
        data: {
          accountId: user.id,
          providerId: 'credential',
          userId: user.id,
          password: hashed,
        }
      });
      console.log(`🆕 Created account: ${user.email} (${user.role}) - password → 123456`);
    }
  }

  console.log('\n✅ All passwords set to "123456" successfully!');
  console.log('\n📊 Summary of users:');
  for (const u of users) {
    console.log(`   - ${u.email} | role: ${u.role} | tenantId: ${u.tenantId || 'none'}`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
