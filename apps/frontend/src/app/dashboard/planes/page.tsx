import { prisma } from "@/lib/db";
import { authClient } from "@/lib/auth-client";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { SuperAdminPlanesManager } from "@/components/dashboard/SuperAdminPlanesManager";

export const dynamic = "force-dynamic";

export default async function PlanesPage() {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers()
    }
  });

  if (!session?.data?.user || (session.data.user as any).role !== "SUPER_ADMIN") {
    redirect("/dashboard");
  }

  const planes = await prisma.plan.findMany({
    orderBy: { price: "asc" }
  });

  return (
    <div className="space-y-8">
      <SuperAdminPlanesManager initialPlanes={planes} />
    </div>
  );
}
