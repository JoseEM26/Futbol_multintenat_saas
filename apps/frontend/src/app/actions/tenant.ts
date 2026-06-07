"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function registerTenantAction(formData: FormData) {
  const name = formData.get("name") as string;
  const dni = (formData.get("dni") as string)?.trim();
  const contactEmail = (formData.get("contactEmail") as string)?.trim();
  const password = formData.get("password") as string;
  const tenantName = formData.get("tenantName") as string;

  if (!name || !dni || !password || !tenantName) {
    return { error: "Todos los campos son obligatorios" };
  }

  if (!/^\d{8}$/.test(dni)) {
    return { error: "El DNI debe tener exactamente 8 dígitos numéricos" };
  }

  if (contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) {
    return { error: "El correo de contacto no tiene un formato válido" };
  }

  // Email interno de BetterAuth — nunca se muestra al usuario
  const internalEmail = `${dni}@canchasync.app`;

  try {
    const existingTenant = await prisma.tenant.findUnique({ where: { name: tenantName } });
    if (existingTenant) return { error: "El nombre de este complejo ya existe. Elige otro nombre único." };

    const existingUser = await prisma.user.findFirst({ where: { dni } });
    if (existingUser) return { error: "Este DNI ya está registrado en el sistema." };

    const result = await auth.api.signUpEmail({
      body: {
        email: internalEmail,
        password,
        name,
      },
      headers: await headers(),
    });

    if (!result || !result.user) {
      return { error: "No se pudo crear el usuario administrador" };
    }

    const userId = result.user.id;

    const tenant = await prisma.tenant.create({
      data: {
        name: tenantName,
        contactEmail: contactEmail || null,
        planId: "trial",
        planExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      }
    });

    await prisma.user.update({
      where: { id: userId },
      data: {
        tenantId: tenant.id,
        role: "TENANT_ADMIN",
        dni,
      }
    });

    return { success: true };
  } catch (error: any) {
    console.error("Error registering tenant:", error);
    if (error.message?.includes("already exists")) {
      return { error: "Este DNI ya está registrado." };
    }
    return { error: error.message || "Error interno al procesar el registro" };
  }
}
