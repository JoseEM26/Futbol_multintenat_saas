import { authClient } from "@/lib/auth-client";
import { headers } from "next/headers";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { TenantProfileManager } from "@/components/dashboard/TenantAdminDashboard";

export const dynamic = "force-dynamic";

export default async function PerfilPage() {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers()
    }
  });

  if (!session?.data?.user) redirect("/login");
  const role = (session.data.user as any).role;
  const tenantId = (session.data.user as any).tenantId;

  if (role !== "TENANT_ADMIN" || !tenantId) redirect("/dashboard");

  const profile = await prisma.tenant.findUnique({
    where: { id: tenantId }
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-black text-slate-900">Perfil del Local</h1>
      <p className="text-slate-500 font-medium">Actualiza la información de tu recinto deportivo.</p>
      <TenantProfileManager profile={profile} />
    </div>
  );
}
