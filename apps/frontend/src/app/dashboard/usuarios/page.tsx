import { authClient } from "@/lib/auth-client";
import { headers } from "next/headers";
import { prisma } from "@cancha/database";
import { redirect } from "next/navigation";
import { SuperAdminUsersManager } from "@/components/dashboard/SuperAdminDashboard";

export const dynamic = "force-dynamic";

export default async function UsuariosPage() {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers()
    }
  });

  if (!session?.data?.user) redirect("/login");
  if (session.data.user.role !== "SUPER_ADMIN") redirect("/dashboard");

  const users = await prisma.user.findMany({
    include: { tenant: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-black text-slate-900">Gestión de Usuarios</h1>
      <p className="text-slate-500 font-medium">Administra todos los usuarios de CanchaSync.</p>
      <SuperAdminUsersManager users={users} />
    </div>
  );
}
