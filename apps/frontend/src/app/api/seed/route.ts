import { NextResponse } from 'next/server';
import { prisma } from "@/lib/db";
import { Role } from '@prisma/client';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Limpiar datos antiguos para asegurar que se apliquen los nuevos detalles
    await prisma.cancha.deleteMany({});
    await prisma.tenant.deleteMany({});
    await prisma.user.deleteMany({});

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

    // 1. Create Tenant (El local / tienda principal)
    const tenant = await (prisma.tenant as any).create({
      data: { 
        name: 'Súper Canchas El Maracaná', 
        logo: '/logo.png',
        bgImage: '/defaults/sports_drinks.png',
        beverages: JSON.stringify(defaultBeverages),
        promotions: JSON.stringify(defaultPromotions),
        sponsorships: JSON.stringify(defaultSponsorships)
      }
    });

    // 2. Create Admin User directly
    const adminUser = await prisma.user.create({
      data: {
        email: "admin@canchapro.com",
        name: "Admin Maracaná",
        password: "password123456",
        role: "TENANT_ADMIN",
        tenantId: tenant.id,
        emailVerified: true
      }
    });
    
    // Create Customer User directly
    await prisma.user.create({
      data: {
        email: "jugador@canchapro.com",
        name: "Juan Jugador",
        password: "password123456",
        role: "TENANT_ADMIN",
        emailVerified: true
      }
    });

    // 4. Create many beautiful Canchas for this tenant with unique details
    const canchaData = [
      { 
        name: 'Cancha 1 - Césped Sintético (7 vs 7)', 
        pricePerHour: 80.0, 
        description: 'Césped sintético europeo de última generación con caucho. Ideal para partidos intensos.',
        details: {
          create: {
            surfaceType: 'Césped Sintético',
            gameType: 'Fútbol 7',
            playersPerSide: 7,
            hasLighting: true,
            hasShowers: true,
            hasParking: true,
            hasDressingRooms: true,
            amenities: 'Agua mineral gratis, Petos incluidos',
            rules: 'No usar chimpunes de metal. Máximo 14 jugadores.'
          }
        },
        openingHours: {
          create: [
            { dayOfWeek: 1, openTime: '14:00', closeTime: '22:00' }, // Lunes: Tarde
            { dayOfWeek: 2, openTime: '08:00', closeTime: '12:00' }, // Martes: Mañana
            { dayOfWeek: 3, openTime: '14:00', closeTime: '22:00' }, // Miércoles: Tarde
            { dayOfWeek: 4, openTime: '14:00', closeTime: '22:00' }, // Jueves: Tarde
            { dayOfWeek: 5, openTime: '08:00', closeTime: '23:00' }, // Viernes: Todo el día
            { dayOfWeek: 6, openTime: '07:00', closeTime: '23:59' }, // Sábado: Todo el día
            { dayOfWeek: 0, openTime: '08:00', closeTime: '20:00' }, // Domingo: Todo el día
          ]
        }
      },
      { 
        name: 'Cancha 2 - Losa Futsal', 
        pricePerHour: 40.0, 
        description: 'Losa deportiva pulida para futsal rápido. Techada y fresca.',
        details: {
          create: {
            surfaceType: 'Losa Pulida',
            gameType: 'Fútbol 5',
            playersPerSide: 5,
            hasLighting: true,
            hasShowers: false,
            hasParking: true,
            hasDressingRooms: false,
            amenities: 'Balón oficial de futsal incluido',
            rules: 'Zapatillas de suela de liga obligatorias.'
          }
        },
        openingHours: {
          create: [
            { dayOfWeek: 1, openTime: '16:00', closeTime: '23:00' },
            { dayOfWeek: 2, openTime: '16:00', closeTime: '23:00' },
            { dayOfWeek: 3, openTime: '16:00', closeTime: '23:00' },
            { dayOfWeek: 4, openTime: '16:00', closeTime: '23:00' },
            { dayOfWeek: 5, openTime: '16:00', closeTime: '23:00' },
            { dayOfWeek: 6, openTime: '08:00', closeTime: '23:00' },
            { dayOfWeek: 0, openTime: '08:00', closeTime: '21:00' },
          ]
        }
      },
      { 
        name: 'Cancha 3 - Grass Natural (11 vs 11)', 
        pricePerHour: 200.0, 
        description: 'Cancha oficial FIFA de césped natural. El sueño de todo jugador.',
        details: {
          create: {
            surfaceType: 'Césped Natural',
            gameType: 'Fútbol 11',
            playersPerSide: 11,
            hasLighting: true,
            hasShowers: true,
            hasParking: true,
            hasDressingRooms: true,
            amenities: 'Vestuarios profesionales, Zona de prensa',
            rules: 'Uso obligatorio de canilleras. Prohibido fumar en el campo.'
          }
        },
        openingHours: {
          create: [
            { dayOfWeek: 1, openTime: '09:00', closeTime: '18:00' },
            { dayOfWeek: 2, openTime: '09:00', closeTime: '18:00' },
            { dayOfWeek: 3, openTime: '09:00', closeTime: '18:00' },
            { dayOfWeek: 4, openTime: '09:00', closeTime: '18:00' },
            { dayOfWeek: 5, openTime: '09:00', closeTime: '21:00' },
            { dayOfWeek: 6, openTime: '08:00', closeTime: '22:00' },
            { dayOfWeek: 0, openTime: '08:00', closeTime: '18:00' },
          ]
        }
      },
      { 
        name: 'Cancha 4 - Sintética VIP (5 vs 5)', 
        pricePerHour: 60.0, 
        description: 'Cancha en jaula para juego rápido tipo Joga Bonito. Muy dinámica.',
        details: {
          create: {
            surfaceType: 'Césped Sintético',
            gameType: 'Fútbol 5',
            playersPerSide: 5,
            hasLighting: true,
            hasShowers: true,
            hasParking: false,
            hasDressingRooms: true,
            amenities: 'Cronómetro digital, Parlantes Bluetooth',
            rules: 'Juego continuo. No hay saques de banda.'
          }
        },
        openingHours: {
          create: [
            { dayOfWeek: 1, openTime: '17:00', closeTime: '00:00' },
            { dayOfWeek: 2, openTime: '17:00', closeTime: '00:00' },
            { dayOfWeek: 3, openTime: '17:00', closeTime: '00:00' },
            { dayOfWeek: 4, openTime: '17:00', closeTime: '00:00' },
            { dayOfWeek: 5, openTime: '15:00', closeTime: '01:00' },
            { dayOfWeek: 6, openTime: '12:00', closeTime: '02:00' },
            { dayOfWeek: 0, openTime: '10:00', closeTime: '22:00' },
          ]
        }
      },
      { 
        name: 'Cancha 5 - Estadio Principal', 
        pricePerHour: 150.0, 
        description: 'Gradería para 100 personas, marcadores electrónicos. Ambiente de final.',
        details: {
          create: {
            surfaceType: 'Césped Sintético PRO',
            gameType: 'Fútbol 9',
            playersPerSide: 9,
            hasLighting: true,
            hasShowers: true,
            hasParking: true,
            hasDressingRooms: true,
            amenities: 'Marcador electrónico, Árbitro incluido (opcional)',
            rules: 'Respetar los horarios de inicio y fin.'
          }
        },
        openingHours: {
          create: [
            { dayOfWeek: 1, openTime: '18:00', closeTime: '23:00' },
            { dayOfWeek: 2, openTime: '18:00', closeTime: '23:00' },
            { dayOfWeek: 3, openTime: '18:00', closeTime: '23:00' },
            { dayOfWeek: 4, openTime: '18:00', closeTime: '23:00' },
            { dayOfWeek: 5, openTime: '18:00', closeTime: '00:00' },
            { dayOfWeek: 6, openTime: '08:00', closeTime: '00:00' },
            { dayOfWeek: 0, openTime: '08:00', closeTime: '22:00' },
          ]
        }
      },
    ];

    for (const data of canchaData) {
      await prisma.cancha.create({
        data: {
          ...data,
          tenantId: tenant.id
        }
      });
    }


    return NextResponse.json({ message: '🔥 Base de datos poblada con éxito V2!' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
