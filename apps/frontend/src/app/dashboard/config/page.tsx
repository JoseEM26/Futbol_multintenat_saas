import { authClient } from "@/lib/auth-client";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ConfigPage() {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers()
    }
  });

  if (!session?.data?.user) redirect("/login");
  if (session.data.user.role !== "SUPER_ADMIN") redirect("/dashboard");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900">Configuración Global</h1>
        <p className="text-slate-500 font-medium mt-2">Ajustes generales del ecosistema CanchaSync.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-4">🔧 Configuración General</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-bold text-slate-700 block mb-1">Nombre de la Plataforma</label>
              <input type="text" defaultValue="CanchaSync" className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:outline-emerald-500 font-medium" readOnly />
            </div>
            <div>
              <label className="text-sm font-bold text-slate-700 block mb-1">Moneda del Sistema</label>
              <input type="text" defaultValue="Soles (S/)" className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:outline-emerald-500 font-medium" readOnly />
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-4">📊 Estado del Sistema</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="text-sm font-medium text-slate-600">Base de Datos</span>
              <span className="text-xs font-black bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full">Conectada</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="text-sm font-medium text-slate-600">Autenticación</span>
              <span className="text-xs font-black bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full">BetterAuth Activo</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm font-medium text-slate-600">Versión</span>
              <span className="text-xs font-black bg-slate-100 text-slate-600 px-3 py-1 rounded-full">v1.0.0-beta</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
