"use server";

import { prisma } from "@cancha/database";
import { revalidatePath } from "next/cache";

// ==========================================
// TENANT ADMIN ACTIONS
// ==========================================

export async function createCanchaAction(tenantId: string, data: { name: string; description: string; pricePerHour: number; image?: string }) {
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
        tenantId
      }
    });

    revalidatePath("/dashboard/canchas");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateCanchaAction(canchaId: string, data: { name: string; description: string; pricePerHour: number; image?: string }) {
  try {
    await prisma.cancha.update({
      where: { id: canchaId },
      data: {
        name: data.name,
        description: data.description,
        pricePerHour: data.pricePerHour,
        ...(data.image && { image: data.image })
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
export async function toggleUserAndTenantStatusAction(userId: string, tenantId: string | null, newStatus: boolean) {
  try {
    if (tenantId) {
      await prisma.cancha.deleteMany({
        where: { tenantId }
      });
    }
    await prisma.user.delete({
      where: { id: userId }
    });
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
