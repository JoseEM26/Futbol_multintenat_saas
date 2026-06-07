"use server";

import { prisma } from "@cancha/database";
import { ReservationStatus } from "@prisma/client";

export async function createReservationAction(data: {
  canchaId: string;
  userName: string;
  userPhone: string;
  startTime: Date;
  endTime: Date;
  totalPrice: number;
  paymentType: "ADELANTO" | "PALABRA";
}) {
  try {
    // Validar cruce de horarios para la misma cancha (excluyendo canceladas)
    const overlapping = await prisma.reservation.findFirst({
      where: {
        canchaId: data.canchaId,
        status: { not: "CANCELADO" },
        OR: [
          {
            // Caso 1: La reserva existente empieza durante la nueva reserva
            startTime: { gte: data.startTime, lt: data.endTime }
          },
          {
            // Caso 2: La reserva existente termina durante la nueva reserva
            endTime: { gt: data.startTime, lte: data.endTime }
          },
          {
            // Caso 3: La reserva existente contiene por completo la nueva reserva
            startTime: { lte: data.startTime },
            endTime: { gte: data.endTime }
          }
        ]
      }
    });

    if (overlapping) {
      return { success: false, error: "Ya existe una reserva que se cruza con el horario solicitado." };
    }

    const reservation = await prisma.reservation.create({
      data: {
        canchaId: data.canchaId,
        userName: data.userName,
        userPhone: data.userPhone,
        startTime: data.startTime,
        endTime: data.endTime,
        totalPrice: data.totalPrice,
        paymentType: data.paymentType,
        status: data.paymentType === "PALABRA" ? "PALABRA" : "PENDIENTE",
      },
    });
    return { success: true, id: reservation.id };
  } catch (error: any) {
    console.error("Error creating reservation:", error);
    return { success: false, error: error.message };
  }
}

export async function updateReservationStatusAction(id: string, status: "CONFIRMADO" | "CANCELADO") {
  try {
    await prisma.reservation.update({
      where: { id },
      data: { status },
    });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
