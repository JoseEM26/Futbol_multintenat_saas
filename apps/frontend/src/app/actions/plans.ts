"use server";

import { prisma } from "@cancha/database";

export async function createPlanAction(data: any) {
  try {
    const plan = await prisma.plan.create({
      data: {
        name: data.name,
        price: data.price,
        oldPrice: data.oldPrice,
        description: data.description,
        features: data.features,
        isTrial: data.isTrial,
        durationDays: data.durationDays || 30,
        status: data.status,
      }
    });
    return { success: true, plan };
  } catch (error) {
    console.error("Error creating plan:", error);
    return { success: false };
  }
}

export async function updatePlanAction(id: string, data: any) {
  try {
    await prisma.plan.update({
      where: { id },
      data: {
        name: data.name,
        price: data.price,
        oldPrice: data.oldPrice,
        description: data.description,
        features: data.features,
        isTrial: data.isTrial,
        durationDays: data.durationDays || 30,
        status: data.status,
      }
    });
    return { success: true };
  } catch (error) {
    console.error("Error updating plan:", error);
    return { success: false };
  }
}

export async function deletePlanAction(id: string) {
  try {
    await prisma.plan.delete({
      where: { id }
    });
    return { success: true };
  } catch (error) {
    console.error("Error deleting plan:", error);
    return { success: false };
  }
}
