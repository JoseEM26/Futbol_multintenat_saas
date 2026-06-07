import { authClient } from "@/lib/auth-client";
import { headers } from "next/headers";
import { prisma } from "@cancha/database";
import { redirect } from "next/navigation";
import { TenantCustomizer } from "@/components/dashboard/TenantAdminDashboard";

export const dynamic = "force-dynamic";

export default async function PersonalizarPage() {
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

  if (!profile) {
    redirect("/dashboard");
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Personalizar Web</h1>
        <p className="text-slate-500 font-medium">Administra los snacks (bebidas/comidas), las promociones y la publicidad/academias en tu página de presentación.</p>
      </div>
      <TenantCustomizer profile={profile} />
    </div>
  );
}
