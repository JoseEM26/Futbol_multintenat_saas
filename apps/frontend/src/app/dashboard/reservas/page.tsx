import { prisma } from "@cancha/database";
import { authClient } from "@/lib/auth-client";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ReservationRow } from "@/components/admin/ReservationRow";

export const dynamic = "force-dynamic";

export default async function ReservasPage() {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers()
    }
  });

  if (!session?.data?.user) redirect("/login");

  const role = session.data.user.role;
  const tenantId = session.data.user.tenantId;

  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  
  // Limpieza automática de reservas vencidas (MVP style)
  await prisma.reservation.updateMany({
    where: {
      status: "PENDIENTE",
      createdAt: { lt: oneHourAgo },
      ...(role === "TENANT_ADMIN" && tenantId ? { cancha: { tenantId } } : {})
    },
    data: {
      status: "VENCIDO"
    }
  });

  const reservations = await prisma.reservation.findMany({
    where: {
      ...(role === "TENANT_ADMIN" && tenantId ? { cancha: { tenantId } } : {})
    },
    include: {
      cancha: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Gestión de Reservas</h1>
        <p className="text-slate-500 mt-2 font-medium">Revisa los pagos y confirma las reservas de tus clientes.</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-400">Cliente</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-400">Cancha</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-400">Fecha / Hora</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-400">Tipo</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-400">Estado</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-400">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reservations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400 font-medium">
                    No hay reservas registradas aún.
                  </td>
                </tr>
              ) : (
                reservations.map(res => (
                  <ReservationRow key={res.id} res={res} />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
