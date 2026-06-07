import { prisma } from "@/lib/db";
import { authClient } from "@/lib/auth-client";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ReservationCalendar } from "@/components/admin/ReservationCalendar";

export const dynamic = "force-dynamic";

export default async function ReservasPage() {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers()
    }
  });

  if (!session?.data?.user) redirect("/login");

  const role = (session?.data?.user as any)?.role || "TENANT_ADMIN";
  const tenantId = (session?.data?.user as any)?.tenantId;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (role === "SUPER_ADMIN") {
    const allCanchas = await prisma.cancha.findMany({
      orderBy: { name: "asc" },
      include: { tenant: true }
    });
    const allReservations = await prisma.reservation.findMany({
      where: { startTime: { gte: today } },
      include: { cancha: true },
      orderBy: { startTime: "asc" }
    });
    return (
      <ReservationCalendar 
        canchas={allCanchas} 
        initialReservations={allReservations} 
        tenantId="SUPER_ADMIN"
      />
    );
  }

  if (!tenantId) redirect("/dashboard");

  const myCanchas = await prisma.cancha.findMany({
    where: { tenantId },
    orderBy: { createdAt: "asc" }
  });

  const endOfWeek = new Date(today);
  endOfWeek.setDate(endOfWeek.getDate() + 7);

  const reservations = await prisma.reservation.findMany({
    where: {
      cancha: { tenantId },
      startTime: { gte: today }
    },
    include: { cancha: true },
    orderBy: { startTime: "asc" }
  });

  return (
    <ReservationCalendar 
      canchas={myCanchas} 
      initialReservations={reservations} 
      tenantId={tenantId}
    />
  );
}
