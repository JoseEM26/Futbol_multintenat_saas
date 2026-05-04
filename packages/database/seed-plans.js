const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding plans...');

  const plans = [
    {
      name: 'Gratis (Prueba)',
      price: 0,
      oldPrice: null,
      description: 'Ideal para probar la plataforma por un mes.',
      features: 'Hasta 2 canchas, Calendario básico, 30 días de prueba',
      isTrial: true,
      durationDays: 30,
      status: 'ACTIVE',
    },
    {
      name: 'Básico',
      price: 30,
      oldPrice: 50,
      description: 'Gestión profesional para tu local deportivo.',
      features: 'Canchas ilimitadas, Calendario avanzado, Soporte prioritario',
      isTrial: false,
      durationDays: 30,
      status: 'ACTIVE',
    },
    {
      name: 'Premium',
      price: 80,
      oldPrice: null,
      description: 'Próximamente: Pagos automáticos y reportes financieros.',
      features: 'Múltiples locales, Pasarela de pagos, Reportes BI',
      isTrial: false,
      durationDays: 30,
      status: 'COMING_SOON',
    }
  ];

  for (const plan of plans) {
    await prisma.plan.upsert({
      where: { id: plan.name === 'Gratis (Prueba)' ? 'trial' : plan.name === 'Básico' ? 'basic' : 'premium' },
      update: plan,
      create: {
        id: plan.name === 'Gratis (Prueba)' ? 'trial' : plan.name === 'Básico' ? 'basic' : 'premium',
        ...plan,
      },
    });
  }

  console.log('✅ Plans seeded successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
