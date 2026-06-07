"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function registerTenantAction(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const tenantName = formData.get("tenantName") as string;

  if (!name || !email || !password || !tenantName) {
    return { error: "Todos los campos son obligatorios" };
  }

  try {
    // 1. Check if tenant name exists (early exit)
    const existingTenant = await prisma.tenant.findUnique({ where: { name: tenantName } });
    if (existingTenant) return { error: "El nombre de este complejo ya existe. Elige otro nombre único." };

    // 2. Format DNI as email if purely numeric
    let formattedEmail = email.trim();
    if (/^\d+$/.test(formattedEmail)) {
      formattedEmail = `${formattedEmail}@canchapro.local`;
    }

    // 3. Use BetterAuth API to create user (handles hashing correctly)
    const result = await auth.api.signUpEmail({
      body: {
        email: formattedEmail,
        password,
        name,
      },
      headers: await headers(),
    });

    if (!result || !result.user) {
      return { error: "No se pudo crear el usuario administrador" };
    }

    const userId = result.user.id;

    // 3. Create Tenant
    const tenant = await prisma.tenant.create({
      data: {
        name: tenantName,
        planId: "trial",
        planExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      }
    });

    // 4. Update User with tenantId
    await prisma.user.update({
      where: { id: userId },
      data: {
        tenantId: tenant.id,
        role: "TENANT_ADMIN",
      }
    });

    return { success: true };
  } catch (error: any) {
    console.error("Error registering tenant:", error);
    if (error.message?.includes("already exists")) {
      return { error: "El correo ya está registrado" };
    }
    return { error: error.message || "Error interno al procesar el registro" };
  }
}
