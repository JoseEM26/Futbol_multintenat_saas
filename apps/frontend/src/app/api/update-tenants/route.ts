import { NextResponse } from 'next/server';
import { prisma } from '@cancha/database';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const defaultBeverages = [
      { id: "1", name: "Gatorade Blue", price: 6.5, icon: "⚡", image: "/defaults/gatorade.png", active: true, description: "Bebida rehidratante de 500ml." },
      { id: "2", name: "Sporade Mandarina", price: 5.0, icon: "⚡", image: "/defaults/sporade.png", active: true, description: "Bebida isotónica sabor mandarina." },
      { id: "3", name: "Energizante Bolt", price: 4.0, icon: "⚡", image: "/defaults/bolt.png", active: true, description: "Bebida energizante de 250ml." },
      { id: "4", name: "Papas Lay's Clásicas", price: 4.0, icon: "🍿", image: "/defaults/lays.png", active: true, description: "Snack de papas clásicas." },
      { id: "5", name: "Coca-Cola Original", price: 4.5, icon: "🥤", image: "/defaults/cocacola.png", active: true, description: "Gaseosa helada de 500ml." }
    ];

    const defaultPromotions = [
      { id: "1", title: "Lunes de Fichaje", description: "Alquila cualquier cancha los días lunes y recibe un 20% de descuento automático en tu reserva.", discount: "20% OFF" },
      { id: "2", title: "Hora Extra Nocturna", description: "Juega a partir de las 10 PM y tu segunda hora tiene 30% de descuento.", discount: "30% OFF" }
    ];

    const defaultSponsorships = [
      { id: "1", title: "Academia Infantil Los Cracks", description: "Entrenamientos para niños de 5 a 12 años. Profesores calificados y metodología europea.", image: "/defaults/kids_academy.png", price: "S/ 150/mes", schedule: "Mar y Jue 4:00 PM" },
      { id: "2", title: "Patrocinador Oficial - Gatorade", description: "Recupera tu energía con Gatorade oficial en nuestra cantina.", image: "/defaults/sports_drinks.png", price: "Auspiciador", schedule: "Todo el año" }
    ];

    // Get all tenants
    const tenants = await prisma.tenant.findMany();
    
    // Update each tenant with default values
    const updatedCount = tenants.length;
    for (const tenant of tenants) {
      await (prisma.tenant as any).update({
        where: { id: tenant.id },
        data: {
          beverages: JSON.stringify(defaultBeverages),
          promotions: JSON.stringify(defaultPromotions),
          sponsorships: JSON.stringify(defaultSponsorships),
          bgImage: tenant.bgImage || '/defaults/sports_drinks.png',
          logo: tenant.logo || '/logo.png'
        }
      });
    }

    return NextResponse.json({ 
      success: true, 
      message: `Se actualizaron exitosamente ${updatedCount} locales con los snacks, promociones e imágenes por defecto.`,
      updatedCount
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
