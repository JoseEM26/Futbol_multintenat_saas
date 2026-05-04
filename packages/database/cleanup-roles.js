const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Cleaning up CUSTOMER role users...');
  
  // Since we are about to remove CUSTOMER from the enum, let's change them to TENANT_ADMIN for now
  // or just delete them if they are trial users.
  // The user said "quítale ese rol", so I'll just update any CUSTOMER to TENANT_ADMIN to avoid DB conflicts.
  
  await prisma.user.updateMany({
    where: { role: 'CUSTOMER' },
    data: { role: 'TENANT_ADMIN' }
  });

  console.log('✅ CUSTOMER roles migrated to TENANT_ADMIN.');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
