import { NextResponse } from 'next/server';
import { prisma } from '@cancha/database';
import { auth } from '@/lib/auth';

export async function GET() {
  try {
    // 1. Create Super Admin via Better Auth to ensure hashing
    const superAdminRes = await auth.api.signUpEmail({
      body: { email: "superadmin@canchapro.com", password: "password123456", name: "Super Admin" },
      asResponse: false
    });
    
    // Update role to SUPER_ADMIN
    await prisma.user.update({
      where: { email: "superadmin@canchapro.com" },
      data: { role: "SUPER_ADMIN" }
    });

    // 2. Fix the previous users (hash their passwords using Better Auth)
    // We will just recreate them or update their password via BetterAuth if possible, 
    // but the easiest is to delete and recreate them using Better Auth so the hash is perfect.
    
    await prisma.user.deleteMany({
      where: { email: { in: ["admin@canchapro.com", "jugador@canchapro.com"] } }
    });

    // Recreate Admin
    await auth.api.signUpEmail({
      body: { email: "admin@canchapro.com", password: "password123456", name: "Admin Maracaná" },
      asResponse: false
    });
    
    const tenant = await prisma.tenant.findFirst();

    await prisma.user.update({
      where: { email: "admin@canchapro.com" },
      data: { role: "TENANT_ADMIN", tenantId: tenant?.id }
    });

    // Recreate Jugador
    await auth.api.signUpEmail({
      body: { email: "jugador@canchapro.com", password: "password123456", name: "Juan Jugador" },
      asResponse: false
    });

    await prisma.user.update({
      where: { email: "jugador@canchapro.com" },
      data: { role: "CUSTOMER" }
    });

    return NextResponse.json({ message: 'Usuarios arreglados. Contraseñas hasheadas y SuperAdmin creado.' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
