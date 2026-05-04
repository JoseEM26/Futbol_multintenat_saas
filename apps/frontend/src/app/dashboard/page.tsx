import { prisma } from "@cancha/database";
import { authClient } from "@/lib/auth-client";
import { headers } from "next/headers";
import { SuperAdminDashboard } from "@/components/dashboard/SuperAdminDashboard";
import { TenantAdminDashboard } from "@/components/dashboard/TenantAdminDashboard";

import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers()
    }
  });

  if (!session?.data?.user) {
    redirect("/login");
  }

  const role = session?.data?.user?.role || "TENANT_ADMIN";
  const userId = session?.data?.user?.id;
  const tenantId = session?.data?.user?.tenantId;

  // Fetch stats based on role
  let stats: any = {};

  if (role === "SUPER_ADMIN") {
    const [totalTenants, totalUsers, totalRevenue, allUsers] = await Promise.all([
      prisma.tenant.count(),
      prisma.user.count(),
      prisma.reservation.aggregate({
        where: { status: "CONFIRMADO" },
        _sum: { totalPrice: true }
      }),
      prisma.user.findMany({
        include: { tenant: true },
        orderBy: { createdAt: "desc" }
      })
    ]);
    stats = {
      totalTenants,
      totalUsers,
      totalRevenue: totalRevenue._sum.totalPrice || 0,
      allUsers
    };
  } else if (role === "TENANT_ADMIN" && tenantId) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [myCanchasCount, todayReservations, monthlyRevenue, myCanchas, tenantProfile] = await Promise.all([
      prisma.cancha.count({ where: { tenantId } }),
      prisma.reservation.count({
        where: {
          cancha: { tenantId },
          startTime: { gte: today, lt: tomorrow }
        }
      }),
      prisma.reservation.aggregate({
        where: {
          cancha: { tenantId },
          status: "CONFIRMADO",
          createdAt: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) }
        },
        _sum: { totalPrice: true }
      }),
      prisma.cancha.findMany({
        where: { tenantId },
        orderBy: { createdAt: "asc" }
      }),
      prisma.tenant.findUnique({
        where: { id: tenantId },
        include: { plan: true }
      })
    ]);
    stats = {
      myCanchasCount,
      todayReservations,
      monthlyRevenue: monthlyRevenue._sum.totalPrice || 0,
      myCanchas,
      tenantProfile
    };
  }

  return (
    <>
      {role === "SUPER_ADMIN" && <SuperAdminDashboard stats={stats} />}
      {role === "TENANT_ADMIN" && <TenantAdminDashboard stats={stats} />}
    </>
  );
}
