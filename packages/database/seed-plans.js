const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Actualizando planes con límites de canchas...');

  const plans = [
    {
      id: 'trial',
      name: 'Prueba Gratis (1 Mes)',
      price: 0,
      oldPrice: 0,
      description: 'Ideal para probar la plataforma sin compromiso.',
      features: 'Gestión de 1 Cancha, Calendario de Reservas, Soporte por Correo, Panel de Control Básico',
      isTrial: true,
      durationDays: 30,
      maxCanchas: 1,
      status: 'ACTIVE'
    },
    {
      id: 'basico',
      name: 'Plan Básico',
      price: 30,
      oldPrice: 45,
      description: 'Todo lo necesario para digitalizar tu complejo deportivo.',
      features: 'Gestión de hasta 5 Canchas, Calendario Avanzado, Reportes de Ventas, Soporte Prioritario, Pagos con Yape/Plin',
      isTrial: false,
      durationDays: 30,
      maxCanchas: 5,
      status: 'ACTIVE'
    },
    {
      id: 'premium',
      name: 'Plan Premium (Próximamente)',
      price: 80,
      oldPrice: 120,
      description: 'Gestión masiva y automatización total para complejos grandes.',
      features: 'Canchas Ilimitadas, Pasarela de Pagos Automática, API para Integraciones, Reportes Financieros VIP, Marketing Digital',
      isTrial: false,
      durationDays: 30,
      maxCanchas: 999,
      status: 'COMING_SOON'
    }
  ];

  for (const plan of plans) {
    await prisma.plan.upsert({
      where: { id: plan.id },
      update: plan,
      create: plan,
    });
  }

  console.log('✅ Planes actualizados correctamente.');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
