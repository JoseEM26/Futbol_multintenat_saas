import { prisma } from "@cancha/database";
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

  const role = session?.data?.user?.role || "TENANT_ADMIN";
  const tenantId = session?.data?.user?.tenantId;

  if (role === "SUPER_ADMIN") redirect("/dashboard");
  if (!tenantId) redirect("/dashboard");

  const myCanchas = await prisma.cancha.findMany({
    where: { tenantId },
    orderBy: { createdAt: "asc" }
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);
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
