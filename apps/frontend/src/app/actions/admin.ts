"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// ==========================================
// TENANT ADMIN ACTIONS
// ==========================================

export async function createCanchaAction(tenantId: string, data: { name: string; description: string; pricePerHour: number; image?: string; sede?: string; sedeAddress?: string }) {
  try {
    // 1. Check plan limit
    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
      include: { plan: true }
    });

    if (!tenant) throw new Error("Tenant no encontrado");

    const currentCanchasCount = await prisma.cancha.count({
      where: { tenantId }
    });

    const maxCanchas = tenant.plan?.maxCanchas || 1;

    if (currentCanchasCount >= maxCanchas) {
      throw new Error(`Has alcanzado el límite de tu plan (${maxCanchas} cancha/s). Mejora tu plan para agregar más.`);
    }

    // 2. Create Cancha
    await prisma.cancha.create({
      data: {
        name: data.name,
        description: data.description,
        pricePerHour: data.pricePerHour,
        image: data.image || null,
        sede: data.sede || null,
        sedeAddress: data.sedeAddress || null,
        tenantId
      }
    });

    revalidatePath("/dashboard/canchas");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateCanchaAction(canchaId: string, data: { name: string; description: string; pricePerHour: number; image?: string; sede?: string; sedeAddress?: string }) {
  try {
    await prisma.cancha.update({
      where: { id: canchaId },
      data: {
        name: data.name,
        description: data.description,
        pricePerHour: data.pricePerHour,
        ...(data.image && { image: data.image }),
        ...(data.sede !== undefined && { sede: data.sede || null }),
        ...(data.sedeAddress !== undefined && { sedeAddress: data.sedeAddress || null })
      }
    });
    revalidatePath("/dashboard/canchas");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteCanchaAction(canchaId: string) {
  try {
    await prisma.cancha.delete({
      where: { id: canchaId }
    });
    revalidatePath("/dashboard/canchas");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateTenantProfileAction(tenantId: string, data: any) {
  try {
    await prisma.tenant.update({
      where: { id: tenantId },
      data: {
        name: data.name,
        slug: data.slug,
        phone: data.phone,
        yapeName: data.yapeName,
        location: data.location,
        description: data.description,
        openingHours: data.openingHours,
        pricePerHour: parseFloat(data.pricePerHour) || 0,
        ownerName: data.ownerName,
        managerName: data.managerName,
        logo: data.logo || undefined,
      }
    });
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: any) {
    console.error("Error updating tenant profile:", error);
    return { success: false, error: error.message };
  }
}

// ==========================================
// SUPER ADMIN ACTIONS
// ==========================================
export async function createUserAction(data: {
  name: string;
  emailOrDni: string;
  role: "SUPER_ADMIN" | "TENANT_ADMIN";
  password?: string;
  tenantId?: string | null;
}) {
  try {
    let email = data.emailOrDni.trim();
    if (/^\d+$/.test(email)) {
      email = `${email}@canchapro.local`;
    }

    // Comprobar si el usuario ya existe
    const existing = await prisma.user.findUnique({
      where: { email }
    });
    if (existing) {
      return { success: false, error: "El correo o DNI ya está registrado en el sistema." };
    }

    const rawPassword = data.password || "123456789";

    // Crear usuario usando BetterAuth API
    const result = await auth.api.signUpEmail({
      body: {
        email,
        password: rawPassword,
        name: data.name,
      },
      headers: await headers(),
    });

    if (!result || !result.user) {
      throw new Error("No se pudo registrar la cuenta en el sistema de autenticación.");
    }

    const userId = result.user.id;

    // Actualizar el rol y el tenantId asignado
    await prisma.user.update({
      where: { id: userId },
      data: {
        role: data.role,
        tenantId: data.tenantId || null,
      }
    });

    revalidatePath("/dashboard/usuarios");
    return { success: true };
  } catch (error: any) {
    console.error("Error creating user:", error);
    return { success: false, error: error.message || "Error al crear el usuario." };
  }
}

export async function updateUserAction(
  userId: string,
  data: {
    name: string;
    emailOrDni: string;
    role: "SUPER_ADMIN" | "TENANT_ADMIN";
    tenantId?: string | null;
    password?: string;
  }
) {
  try {
    let email = data.emailOrDni.trim();
    if (/^\d+$/.test(email)) {
      email = `${email}@canchapro.local`;
    }

    // Actualizar datos del usuario
    await prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name,
        email: email,
        role: data.role,
        tenantId: data.tenantId || null,
      }
    });

    // Cambiar contraseña si es proporcionada
    if (data.password) {
      const { scryptSync, randomBytes } = require('crypto');
      const salt = randomBytes(16).toString('hex');
      const hash = scryptSync(data.password, salt, 64).toString('hex');
      const hashed = `${salt}:${hash}`;

      // Crear o actualizar en la tabla account de BetterAuth
      const account = await prisma.account.findFirst({
        where: { userId, providerId: 'credential' }
      });

      if (account) {
        await prisma.account.update({
          where: { id: account.id },
          data: { password: hashed }
        });
      } else {
        await prisma.account.create({
          data: {
            accountId: userId,
            providerId: 'credential',
            userId: userId,
            password: hashed,
          }
        });
      }
    }

    revalidatePath("/dashboard/usuarios");
    return { success: true };
  } catch (error: any) {
    console.error("Error updating user:", error);
    return { success: false, error: error.message || "Error al actualizar el usuario." };
  }
}

export async function deleteUserAction(userId: string, tenantId: string | null) {
  try {
    // Si es administrador de local, podemos desactivar/eliminar sus canchas
    if (tenantId) {
      await prisma.cancha.deleteMany({
        where: { tenantId }
      });
    }

    // Eliminar las sesiones y cuentas vinculadas para evitar errores de llave foránea en BetterAuth
    await prisma.session.deleteMany({
      where: { userId }
    });
    await prisma.account.deleteMany({
      where: { userId }
    });

    // Eliminar el registro del usuario
    await prisma.user.delete({
      where: { id: userId }
    });

    revalidatePath("/dashboard/usuarios");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting user:", error);
    return { success: false, error: error.message || "Error al eliminar el usuario." };
  }
}

export async function getUserActivityAction(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        reservations: {
          include: { cancha: true },
          orderBy: { startTime: "desc" }
        },
        tenant: true
      }
    });

    if (!user) throw new Error("Usuario no encontrado.");

    // Calcular estadísticas de actividad
    const totalReservations = user.reservations.length;
    const totalSpent = user.reservations.reduce((sum, res) => sum + res.totalPrice, 0);

    return { 
      success: true, 
      user: {
        ...user,
        totalReservations,
        totalSpent
      }
    };
  } catch (error: any) {
    console.error("Error getting user activity:", error);
    return { success: false, error: error.message };
  }
}

export async function markTourAsSeenAction(userId: string) {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { hasSeenTour: true }
    });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateTenantCustomizationsAction(
  tenantId: string,
  data: {
    beverages?: string;
    promotions?: string;
    sponsorships?: string;
    bgImage?: string;
    logo?: string;
  }
) {
  try {
    await (prisma.tenant as any).update({
      where: { id: tenantId },
      data: {
        ...(data.beverages !== undefined && { beverages: data.beverages }),
        ...(data.promotions !== undefined && { promotions: data.promotions }),
        ...(data.sponsorships !== undefined && { sponsorships: data.sponsorships }),
        ...(data.bgImage !== undefined && { bgImage: data.bgImage }),
        ...(data.logo !== undefined && { logo: data.logo }),
      }
    });
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/personalizar");
    revalidatePath(`/c/${tenantId}`);
    return { success: true };
  } catch (error: any) {
    console.error("Error updating tenant customizations:", error);
    return { success: false, error: error.message || "Error al guardar la personalización." };
  }
}

export async function toggleUserActiveAction(userId: string, active: boolean) {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { isActive: active }
    });
    revalidatePath("/dashboard/usuarios");
    return { success: true };
  } catch (error: any) {
    console.error("Error toggling user active status:", error);
    return { success: false, error: error.message || "Error al cambiar estado de usuario." };
  }
}
