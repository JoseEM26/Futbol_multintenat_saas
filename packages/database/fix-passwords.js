const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Los usuarios que necesitamos recrear (ya fueron borrados)
const usersToCreate = [
  { email: 'joseangelespinozamorales@gmail.com', name: 'Jose Angel', role: 'CUSTOMER', tenantId: null },
  { email: 'superadmin@canchapro.com', name: 'Super Admin', role: 'SUPER_ADMIN', tenantId: null },
  { email: 'admin@canchapro.com', name: 'Admin Maracaná', role: 'TENANT_ADMIN', tenantId: 'cmoqau4yh001isyt094p5smit' },
  { email: 'jugador@canchapro.com', name: 'Juan Jugador', role: 'CUSTOMER', tenantId: null },
];

async function main() {
  console.log('🔄 Recreando usuarios via BetterAuth API con Origin header...\n');

  for (const u of usersToCreate) {
    try {
      const res = await fetch('http://localhost:3000/api/auth/sign-up/email', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Origin': 'http://localhost:3000',
          'Referer': 'http://localhost:3000/',
        },
        body: JSON.stringify({
          email: u.email,
          password: '123456789',
          name: u.name,
        }),
      });

      const result = await res.json();

      if (res.ok && result.user) {
        // Restaurar role y tenantId
        await prisma.user.update({
          where: { id: result.user.id },
          data: { role: u.role, tenantId: u.tenantId },
        });
        console.log(`✅ ${u.email} → role: ${u.role} | password: 123456789`);
      } else {
        console.log(`❌ Error con ${u.email}:`, JSON.stringify(result));
      }
    } catch (err) {
      console.log(`❌ Fetch failed for ${u.email}: ${err.message}`);
    }
  }

  // Verificar
  const allUsers = await prisma.user.findMany();
  console.log(`\n📊 Total usuarios en BD: ${allUsers.length}`);
  allUsers.forEach(u => console.log(`   ${u.email} | ${u.role} | tenant: ${u.tenantId || 'ninguno'}`));
  
  const allAccounts = await prisma.account.findMany();
  console.log(`\n🔐 Total cuentas (accounts): ${allAccounts.length}`);
  allAccounts.forEach(a => console.log(`   userId: ${a.userId} | provider: ${a.providerId} | hasPassword: ${!!a.password}`));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
