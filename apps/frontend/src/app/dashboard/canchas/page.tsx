import { authClient } from "@/lib/auth-client";
import { headers } from "next/headers";
import { prisma } from "@cancha/database";
import { redirect } from "next/navigation";
import { CanchasManager } from "@/components/dashboard/TenantAdminDashboard";

export const dynamic = "force-dynamic";

export default async function CanchasPage() {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers()
    }
  });

  if (!session?.data?.user) redirect("/login");
  const role = session.data.user.role;
  const tenantId = session.data.user.tenantId;

  if (role !== "TENANT_ADMIN" || !tenantId) redirect("/dashboard");

  const [myCanchas, tenant] = await Promise.all([
    prisma.cancha.findMany({
      where: { tenantId },
      orderBy: { createdAt: "asc" }
    }),
    prisma.tenant.findUnique({
      where: { id: tenantId },
      include: { plan: true }
    })
  ]);

  const planLimit = tenant?.plan?.maxCanchas || 1;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-black text-slate-900">Gestión de Canchas</h1>
      <p className="text-slate-500 font-medium">Agrega, edita y administra tus espacios deportivos.</p>
      <CanchasManager canchas={myCanchas} tenantId={tenantId} planLimit={planLimit} />
    </div>
  );
}
