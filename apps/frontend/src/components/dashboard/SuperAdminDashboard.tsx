"use client";

import React, { useState } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area
} from "recharts";
import { Users, Building2, TrendingUp, DollarSign, Calendar, ShieldCheck, Settings } from "lucide-react";

const data = [
  { name: "Ene", revenue: 4000, users: 2400 },
  { name: "Feb", revenue: 3000, users: 1398 },
  { name: "Mar", revenue: 2000, users: 9800 },
  { name: "Abr", revenue: 2780, users: 3908 },
  { name: "May", revenue: 1890, users: 4800 },
  { name: "Jun", revenue: 2390, users: 3800 },
];

export function SuperAdminDashboard({ stats }: { stats: any }) {
  const [activeTab, setActiveTab] = useState<"DASHBOARD" | "USUARIOS">("DASHBOARD");

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Super Admin Panel</h1>
          <p className="text-slate-500 mt-2 font-medium">Vista global del ecosistema CanchaSync.</p>
        </div>
        <div className="flex bg-slate-100 p-1.5 rounded-2xl">
          <button onClick={() => setActiveTab("DASHBOARD")} className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === "DASHBOARD" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>Resumen Global</button>
          <button onClick={() => setActiveTab("USUARIOS")} className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === "USUARIOS" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>Gestión de Usuarios</button>
        </div>
      </div>

      {activeTab === "DASHBOARD" && (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard icon={<Building2 />} title="Total Locales" value={stats.totalTenants.toString()} trend="+2" color="blue" />
            <StatCard icon={<Users />} title="Total Usuarios" value={stats.totalUsers.toString()} trend="+5" color="emerald" />
            <StatCard icon={<DollarSign />} title="Ingresos Totales" value={`S/ ${stats.totalRevenue.toFixed(2)}`} trend="+15%" color="amber" />
            <StatCard icon={<ShieldCheck />} title="Suscripciones Activas" value="32" trend="+5%" color="purple" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Chart 1 */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-slate-800">Crecimiento de Ingresos</h3>
                <span className="text-xs font-black bg-slate-100 text-slate-500 px-3 py-1 rounded-full uppercase">Últimos 6 meses</span>
              </div>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                    <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                    <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2 */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-slate-800">Nuevos Usuarios</h3>
                <span className="text-xs font-black bg-slate-100 text-slate-500 px-3 py-1 rounded-full uppercase">Mensual</span>
              </div>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                    <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                    <Bar dataKey="users" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === "USUARIOS" && (
        <SuperAdminUsersManager users={stats.allUsers} />
      )}
    </div>
  );
}

export function SuperAdminUsersManager({ users }: { users: any[] }) {
  const [loading, setLoading] = useState(false);

  const handleDeactivate = async (userId: string, tenantId: string | null) => {
    if (!confirm("¿Estás seguro de desactivar (eliminar) a este usuario y sus canchas permanentemente?")) return;
    setLoading(true);
    const { toggleUserAndTenantStatusAction } = await import("@/app/actions/admin");
    const res = await toggleUserAndTenantStatusAction(userId, tenantId, false);
    if (res.success) {
      alert("Usuario y canchas desactivados exitosamente.");
    } else {
      alert("Error: " + res.error);
    }
    setLoading(false);
  };

  return (
    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-2xl font-bold text-slate-800">Administración de Cuentas</h3>
          <p className="text-sm text-slate-500 mt-1 font-medium">Desde aquí puedes desactivar inquilinos (dueños de canchas) lo cual desactiva sus canchas automáticamente.</p>
        </div>
        <button className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20">
          + Nuevo Inquilino
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-100 mt-6">
        <table className="w-full text-left whitespace-nowrap">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-400">Usuario / Correo</th>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-400">Rol</th>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-400">Local Vinculado</th>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-400 text-right">Acciones Peligrosas</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users?.map(user => (
              <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-bold text-slate-900">{user.name}</div>
                  <div className="text-sm text-slate-500 font-medium">{user.email}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-lg text-xs font-black tracking-wide ${
                    user.role === 'SUPER_ADMIN' ? 'bg-purple-50 text-purple-700' :
                    user.role === 'TENANT_ADMIN' ? 'bg-emerald-50 text-emerald-700' :
                    'bg-slate-100 text-slate-600'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {user.tenant ? (
                    <div className="font-bold text-slate-800">{user.tenant.name}</div>
                  ) : (
                    <div className="text-slate-400 text-sm font-medium">Sin local</div>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  {user.role !== 'SUPER_ADMIN' && (
                    <button 
                      disabled={loading}
                      onClick={() => handleDeactivate(user.id, user.tenantId)}
                      className="bg-red-50 text-red-600 px-4 py-2 rounded-xl font-bold text-sm hover:bg-red-600 hover:text-white transition-colors border border-red-100 hover:border-red-600 disabled:opacity-50"
                    >
                      {user.role === 'TENANT_ADMIN' ? "Desactivar Usuario y Canchas" : "Bloquear Usuario"}
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {(!users || users.length === 0) && (
              <tr>
                <td colSpan={4} className="text-center py-8 text-slate-400">No hay usuarios.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, trend, color }: { icon: React.ReactNode, title: string, value: string, trend: string, color: string }) {
  const colorMap: any = {
    blue: "text-blue-600 bg-blue-50 border-blue-100",
    emerald: "text-emerald-600 bg-emerald-50 border-emerald-100",
    amber: "text-amber-600 bg-amber-50 border-amber-100",
    purple: "text-purple-600 bg-purple-50 border-purple-100",
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-2xl border ${colorMap[color]}`}>
          {React.cloneElement(icon as React.ReactElement, { className: "w-6 h-6" })}
        </div>
        <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">{trend}</span>
      </div>
      <h4 className="text-slate-500 font-bold text-sm uppercase tracking-wider">{title}</h4>
      <div className="text-3xl font-black text-slate-900 mt-1">{value}</div>
    </div>
  );
}
