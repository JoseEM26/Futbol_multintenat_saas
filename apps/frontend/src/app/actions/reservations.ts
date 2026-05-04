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
