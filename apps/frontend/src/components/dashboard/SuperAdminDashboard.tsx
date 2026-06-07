"use client";

import React, { useState } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area
} from "recharts";
import { Users, Building2, TrendingUp, DollarSign, Calendar, ShieldCheck, Settings, Search, Plus, X, Lock, Trash2, Edit, Eye, Award, Check, Loader2, ChevronDown } from "lucide-react";

const data = [
  { name: "Ene", revenue: 4000, users: 2400 },
  { name: "Feb", revenue: 3000, users: 1398 },
  { name: "Mar", revenue: 2000, users: 9800 },
  { name: "Abr", revenue: 2780, users: 3908 },
  { name: "May", revenue: 1890, users: 4800 },
  { name: "Jun", revenue: 2390, users: 3800 },
];

export function SuperAdminDashboard({ stats, user }: { stats: any, user: any }) {
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
              <div className="h-80 w-full min-h-[320px]">
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
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
              <div className="h-80 w-full min-h-[320px]">
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
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
        <SuperAdminUsersManager users={stats.allUsers} currentUser={user} />
      )}
    </div>
  );
}

export function SuperAdminUsersManager({ users: initialUsers, tenants = [], currentUser }: { users: any[], tenants?: any[], currentUser?: any }) {
  const [users, setUsers] = useState(initialUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [loading, setLoading] = useState(false);
  const [activityLoading, setActivityLoading] = useState(false);

  const handleToggleActive = async (user: any) => {
    if (user.id === currentUser?.id) {
      alert("No puedes inhabilitar tu propia cuenta.");
      return;
    }

    const newActive = user.isActive === false ? true : false;
    const actionName = newActive ? "habilitar" : "inhabilitar";
    if (!confirm(`¿Estás seguro de que deseas ${actionName} a ${user.name}?`)) {
      return;
    }

    setLoading(true);
    try {
      const { toggleUserActiveAction } = await import("@/app/actions/admin");
      const res = await toggleUserActiveAction(user.id, newActive);
      if (res.success) {
        setUsers(prev => prev.map(u => u.id === user.id ? { ...u, isActive: newActive } : u));
      } else {
        alert("Error: " + res.error);
      }
    } catch (err) {
      alert("Ocurrió un error inesperado al cambiar el estado del usuario.");
    } finally {
      setLoading(false);
    }
  };

  // Modales
  const [showFormModal, setShowFormModal] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [openDropdownUserId, setOpenDropdownUserId] = useState<string | null>(null);

  // Form states
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [formName, setFormName] = useState("");
  const [formEmailOrDni, setFormEmailOrDni] = useState("");
  const [formRole, setFormRole] = useState<"SUPER_ADMIN" | "TENANT_ADMIN">("TENANT_ADMIN");
  const [formTenantId, setFormTenantId] = useState("");
  const [formPassword, setFormPassword] = useState("");

  // Activity/History state
  const [activeUserDetail, setActiveUserDetail] = useState<any>(null);

  // Acciones
  const handleOpenCreateModal = () => {
    setSelectedUser(null);
    setFormName("");
    setFormEmailOrDni("");
    setFormRole("TENANT_ADMIN");
    setFormTenantId("");
    setFormPassword("");
    setShowFormModal(true);
  };

  const handleOpenEditModal = (user: any) => {
    setSelectedUser(user);
    setFormName(user.name);
    
    let emailShow = user.email;
    if (emailShow.endsWith("@canchapro.local")) {
      emailShow = emailShow.split("@")[0];
    }
    setFormEmailOrDni(emailShow);
    setFormRole(user.role);
    setFormTenantId(user.tenantId || "");
    setFormPassword("");
    setShowFormModal(true);
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formEmailOrDni) {
      alert("Por favor, completa todos los campos requeridos.");
      return;
    }

    setLoading(true);
    const { createUserAction, updateUserAction } = await import("@/app/actions/admin");

    if (selectedUser) {
      const res = await updateUserAction(selectedUser.id, {
        name: formName,
        emailOrDni: formFormateDni(formEmailOrDni),
        role: formRole,
        tenantId: formRole === "SUPER_ADMIN" ? null : (formTenantId || null),
        password: formPassword || undefined
      });

      if (res.success) {
        setUsers(prev => prev.map(u => u.id === selectedUser.id ? {
          ...u,
          name: formName,
          email: formFormateDni(formEmailOrDni),
          role: formRole,
          tenantId: formRole === "SUPER_ADMIN" ? null : (formTenantId || null),
          tenant: tenants.find(t => t.id === formTenantId) || null
        } : u));
        setShowFormModal(false);
      } else {
        alert("Error al actualizar usuario: " + res.error);
      }
    } else {
      const res = await createUserAction({
        name: formName,
        emailOrDni: formFormateDni(formEmailOrDni),
        role: formRole,
        tenantId: formRole === "SUPER_ADMIN" ? null : (formTenantId || null),
        password: formPassword
      });

      if (res.success) {
        alert("Usuario creado exitosamente. Recarga el panel para ver los cambios.");
        window.location.reload();
      } else {
        alert("Error al crear usuario: " + res.error);
      }
    }
    setLoading(false);
  };

  const formFormateDni = (val: string) => {
    const trimmed = val.trim();
    if (/^\d+$/.test(trimmed)) {
      return `${trimmed}@canchapro.local`;
    }
    return trimmed;
  };

  const handleViewActivity = async (userId: string) => {
    setActivityLoading(true);
    const { getUserActivityAction } = await import("@/app/actions/admin");
    const res = await getUserActivityAction(userId);
    if (res.success && res.user) {
      setActiveUserDetail(res.user);
      setShowActivityModal(true);
    } else {
      alert("Error al cargar la actividad del usuario.");
    }
    setActivityLoading(false);
  };

  const handleDeleteUser = async (user: any) => {
    if (!confirm(`¿Estás completamente seguro de eliminar a ${user.name}? Esta acción borrará todas sus sesiones, cuentas vinculadas y canchas si es administrador de local. Esta acción NO se puede deshacer.`)) return;
    
    setLoading(true);
    const { deleteUserAction } = await import("@/app/actions/admin");
    const res = await deleteUserAction(user.id, user.tenantId);
    if (res.success) {
      setUsers(prev => prev.filter(u => u.id !== user.id));
      alert("Usuario eliminado correctamente.");
    } else {
      alert("Error al eliminar usuario: " + res.error);
    }
    setLoading(false);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === "ALL" || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex-1 w-full md:max-w-md relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Buscar por nombre, DNI o correo..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border-2 border-slate-50 p-3 pl-12 rounded-2xl focus:outline-none focus:border-emerald-500/50 font-bold transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <select 
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-slate-50 border-2 border-slate-50 p-3 rounded-2xl focus:outline-none focus:border-emerald-500/50 font-bold appearance-none pr-8 cursor-pointer"
          >
            <option value="ALL">Todos los Roles</option>
            <option value="SUPER_ADMIN">Super Admins</option>
            <option value="TENANT_ADMIN">Tenant Admins</option>
          </select>

          <button 
            onClick={handleOpenCreateModal}
            className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl font-black text-sm transition-all shadow-xl shadow-emerald-600/20 active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" /> Nuevo Usuario
          </button>
        </div>
      </div>

      {/* Vista de Tabla para Pantallas Medianas/Grandes */}
      <div className="hidden md:block bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-visible">
        <div className="overflow-visible">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-5 text-xs font-black uppercase tracking-wider text-slate-400">Usuario</th>
                <th className="px-6 py-5 text-xs font-black uppercase tracking-wider text-slate-400">DNI / Identificación</th>
                <th className="px-6 py-5 text-xs font-black uppercase tracking-wider text-slate-400">Rol</th>
                <th className="px-6 py-5 text-xs font-black uppercase tracking-wider text-slate-400">Local Vinculado</th>
                <th className="px-6 py-5 text-xs font-black uppercase tracking-wider text-slate-400 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers?.map(user => {
                const isDni = user.email.endsWith("@canchapro.local");
                const cleanId = isDni ? user.email.split("@")[0] : user.email;

                return (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 font-black text-slate-600 flex items-center justify-center shadow-inner">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-black text-slate-900 text-sm flex items-center gap-2">
                            {user.name}
                            <span className={`w-2 h-2 rounded-full ${user.isActive !== false ? 'bg-emerald-500' : 'bg-red-500'}`} title={user.isActive !== false ? 'Activo' : 'Inhabilitado'} />
                          </div>
                          <div className="text-xs text-slate-400 font-bold">{isDni ? "Acceso DNI" : "Acceso Correo"}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="font-bold text-slate-800">{cleanId}</div>
                      {isDni && <div className="text-[10px] text-emerald-600 font-black tracking-widest uppercase">DNI Verificado</div>}
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border ${
                        user.role === 'SUPER_ADMIN' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                        user.role === 'TENANT_ADMIN' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        'bg-slate-100 text-slate-600 border-slate-200'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      {user.tenant ? (
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                          <div className="font-black text-slate-800">{user.tenant.name}</div>
                        </div>
                      ) : (
                        <div className="text-slate-400 text-xs font-bold italic">Global / Sin local</div>
                      )}
                    </td>
                    <td className="px-6 py-5 text-right relative overflow-visible">
                      <div className="inline-block text-left">
                        <button
                          type="button"
                          onClick={() => setOpenDropdownUserId(openDropdownUserId === user.id ? null : user.id)}
                          className="inline-flex items-center gap-2 bg-slate-50 text-slate-700 px-4 py-2.5 rounded-xl font-bold text-xs hover:bg-slate-100 transition-colors border border-slate-200 active:scale-95"
                        >
                          Acciones
                          <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                        </button>

                        {openDropdownUserId === user.id && (
                          <>
                            <div className="fixed inset-0 z-30" onClick={() => setOpenDropdownUserId(null)} />
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl border border-slate-200 shadow-xl py-2 z-45 text-left animate-in fade-in slide-in-from-top-2 duration-150">
                              <button
                                type="button"
                                onClick={() => {
                                  setOpenDropdownUserId(null);
                                  handleViewActivity(user.id);
                                }}
                                disabled={activityLoading}
                                className="w-full px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2 disabled:opacity-50"
                              >
                                <Eye className="w-4 h-4 text-slate-400" />
                                Ver Actividad
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setOpenDropdownUserId(null);
                                  handleOpenEditModal(user);
                                }}
                                className="w-full px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2"
                              >
                                <Edit className="w-4 h-4 text-slate-400" />
                                Editar Datos
                              </button>

                              {user.role !== 'SUPER_ADMIN' && (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setOpenDropdownUserId(null);
                                      handleToggleActive(user);
                                    }}
                                    disabled={loading}
                                    className={`w-full px-4 py-2.5 text-xs font-bold transition-colors flex items-center gap-2 disabled:opacity-50 ${
                                      user.isActive !== false
                                        ? "text-amber-600 hover:bg-amber-50"
                                        : "text-emerald-600 hover:bg-emerald-50"
                                    }`}
                                  >
                                    <ShieldCheck className="w-4 h-4 text-slate-450" />
                                    {user.isActive !== false ? "Inhabilitar" : "Habilitar"}
                                  </button>

                                  <div className="border-t border-slate-150 my-1" />

                                  <button
                                    type="button"
                                    onClick={() => {
                                      setOpenDropdownUserId(null);
                                      handleDeleteUser(user);
                                    }}
                                    disabled={loading}
                                    className="w-full px-4 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                    Eliminar
                                  </button>
                                </>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {(!filteredUsers || filteredUsers.length === 0) && (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-slate-400 font-bold">
                    No se encontraron usuarios que coincidan con los filtros.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Vista de Tarjetas para Dispositivos Móviles */}
      <div className="md:hidden space-y-4">
        {filteredUsers?.map(user => {
          const isDni = user.email.endsWith("@canchapro.local");
          const cleanId = isDni ? user.email.split("@")[0] : user.email;

          return (
            <div key={user.id} className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm space-y-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 font-black text-slate-600 flex items-center justify-center shadow-inner">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-black text-slate-900 text-sm flex items-center gap-2">
                      {user.name}
                      <span className={`w-2 h-2 rounded-full ${user.isActive !== false ? 'bg-emerald-500' : 'bg-red-500'}`} />
                    </div>
                    <div className="text-[10px] text-slate-400 font-bold">{isDni ? "Acceso DNI" : "Acceso Correo"}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`inline-flex px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wider border ${
                    user.isActive !== false ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-700 border-red-100'
                  }`}>
                    {user.isActive !== false ? 'Activo' : 'Inactivo'}
                  </span>
                  <span className={`inline-flex px-2.5 py-1 rounded-xl text-[9px] font-black uppercase tracking-wider border ${
                    user.role === 'SUPER_ADMIN' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                    user.role === 'TENANT_ADMIN' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                    'bg-slate-100 text-slate-600 border-slate-200'
                  }`}>
                    {user.role}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs">
                <div>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Identificación</span>
                  <span className="font-bold text-slate-800 break-all">{cleanId}</span>
                  {isDni && <div className="text-[8px] text-emerald-600 font-black tracking-widest uppercase mt-0.5">DNI Verificado</div>}
                </div>
                <div>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Local Vinculado</span>
                  {user.tenant ? (
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="font-black text-slate-800 line-clamp-1">{user.tenant.name}</span>
                    </div>
                  ) : (
                    <span className="text-slate-400 font-bold italic block mt-0.5">Global / Sin local</span>
                  )}
                </div>
              </div>

              {/* Acciones */}
              <div className="flex flex-wrap items-center gap-2 pt-1 justify-end">
                <button 
                  onClick={() => handleViewActivity(user.id)}
                  disabled={activityLoading}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 bg-slate-50 text-slate-700 px-3 py-2.5 rounded-xl font-bold text-xs hover:bg-slate-100 transition-colors border border-slate-200 active:scale-95"
                >
                  <Eye className="w-3.5 h-3.5" /> Actividad
                </button>

                <button 
                  onClick={() => handleOpenEditModal(user)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 bg-white text-slate-700 px-3 py-2.5 rounded-xl font-bold text-xs hover:bg-slate-50 transition-colors border border-slate-200 active:scale-95"
                >
                  <Edit className="w-3.5 h-3.5" /> Editar
                </button>

                {user.role !== 'SUPER_ADMIN' && (
                  <>
                    <button 
                      onClick={() => handleToggleActive(user)}
                      disabled={loading}
                      className={`flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl font-bold text-xs transition-colors border active:scale-95 ${
                        user.isActive !== false
                          ? "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-600 hover:text-white"
                          : "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-600 hover:text-white"
                      }`}
                    >
                      {user.isActive !== false ? "Inhabilitar" : "Habilitar"}
                    </button>

                    <button 
                      onClick={() => handleDeleteUser(user)}
                      disabled={loading}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 bg-red-50 text-red-600 px-3 py-2.5 rounded-xl font-bold text-xs hover:bg-red-600 hover:text-white transition-colors border border-red-100 hover:border-red-600 active:scale-95"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Eliminar
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
        {(!filteredUsers || filteredUsers.length === 0) && (
          <div className="text-center py-12 text-slate-400 font-bold text-sm bg-white rounded-[32px] border border-slate-200">
            No se encontraron usuarios que coincidan con los filtros.
          </div>
        )}
      </div>

      {showFormModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 md:p-6 overflow-y-auto">
          <form 
            onSubmit={handleSaveUser}
            className="bg-white rounded-[32px] md:rounded-[48px] w-full max-w-lg p-8 md:p-10 space-y-6 md:space-y-8 animate-in zoom-in duration-300 my-auto shadow-2xl border border-white/20"
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                  {selectedUser ? "Editar Usuario" : "Nuevo Usuario"}
                </h3>
                <p className="text-slate-400 font-bold text-xs md:text-sm mt-1">
                  {selectedUser ? "Modifica los datos de acceso y perfil del usuario." : "Registra un nuevo usuario administrador en CanchaSync."}
                </p>
              </div>
              <button 
                type="button" 
                onClick={() => setShowFormModal(false)}
                className="p-2 md:p-3 bg-slate-100 rounded-2xl hover:bg-slate-200 transition-all active:scale-95"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 block">Nombre Completo</label>
                <input 
                  type="text" 
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  required 
                  placeholder="Ej. Juan Pérez" 
                  className="w-full bg-slate-50 border-2 border-slate-50 p-4 rounded-2xl focus:outline-none focus:border-emerald-500/50 font-bold text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 block">DNI o Correo de Acceso</label>
                <input 
                  type="text" 
                  value={formEmailOrDni}
                  onChange={(e) => setFormEmailOrDni(e.target.value)}
                  required 
                  placeholder="Ej. 74823901 o admin@gmail.com" 
                  className="w-full bg-slate-50 border-2 border-slate-50 p-4 rounded-2xl focus:outline-none focus:border-emerald-500/50 font-bold text-sm"
                />
                <span className="text-[9px] font-bold text-slate-400 block px-4 leading-relaxed">
                  Si ingresas un número de 8 dígitos, el sistema lo reconocerá como DNI automáticamente.
                </span>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 block">Rol del Sistema</label>
                <select 
                  value={formRole}
                  onChange={(e) => setFormRole(e.target.value as any)}
                  className="w-full bg-slate-50 border-2 border-slate-50 p-4 rounded-2xl focus:outline-none focus:border-emerald-500/50 font-bold text-sm appearance-none pr-8 cursor-pointer"
                >
                  <option value="TENANT_ADMIN">Administrador de Sede (TENANT_ADMIN)</option>
                  <option value="SUPER_ADMIN">Administrador Global (SUPER_ADMIN)</option>
                </select>
              </div>

              {formRole === "TENANT_ADMIN" && (
                <div className="space-y-1.5 animate-in slide-in-from-top-4 duration-300">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 block">Sede / Complejo Deportivo</label>
                  <select 
                    value={formTenantId}
                    onChange={(e) => setFormTenantId(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-slate-50 p-4 rounded-2xl focus:outline-none focus:border-emerald-500/50 font-bold text-sm appearance-none pr-8 cursor-pointer"
                  >
                    <option value="">-- Sin local vinculado --</option>
                    {tenants.map(tenant => (
                      <option key={tenant.id} value={tenant.id}>{tenant.name}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 block">
                  {selectedUser ? "Cambiar Contraseña (Opcional)" : "Contraseña de Acceso"}
                </label>
                <div className="relative">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5" />
                  <input 
                    type="password" 
                    value={formPassword}
                    onChange={(e) => setFormPassword(e.target.value)}
                    required={!selectedUser}
                    placeholder={selectedUser ? "•••••••• (Dejar en blanco para no cambiar)" : "Mínimo 6 caracteres"} 
                    className="w-full bg-slate-50 border-2 border-slate-50 p-4 pl-14 rounded-2xl focus:outline-none focus:border-emerald-500/50 font-bold text-sm"
                  />
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-emerald-600 text-white font-black py-5 rounded-3xl text-lg shadow-2xl shadow-emerald-600/30 hover:bg-emerald-700 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                selectedUser ? "Guardar Cambios" : "Crear Cuenta de Usuario"
              )}
            </button>
          </form>
        </div>
      )}

      {showActivityModal && activeUserDetail && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 md:p-6 overflow-y-auto">
          <div className="bg-white rounded-[32px] md:rounded-[48px] w-full max-w-2xl p-8 md:p-10 space-y-6 md:space-y-8 animate-in zoom-in duration-300 my-auto shadow-2xl border border-white/20">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full uppercase tracking-wider">
                  Historial e Info de Usuario
                </span>
                <h3 className="text-3xl font-black text-slate-900 tracking-tight mt-3">{activeUserDetail.name}</h3>
                <p className="text-slate-400 font-bold text-sm mt-1">
                  ID de Cuenta: {activeUserDetail.id}
                </p>
              </div>
              <button 
                type="button" 
                onClick={() => setShowActivityModal(false)}
                className="p-2 md:p-3 bg-slate-100 rounded-2xl hover:bg-slate-200 transition-all active:scale-95"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 text-center">
                <div className="text-2xl font-black text-slate-800">{activeUserDetail.totalReservations}</div>
                <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Reservas Totales</div>
              </div>
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 text-center">
                <div className="text-2xl font-black text-emerald-600">S/ {activeUserDetail.totalSpent.toFixed(0)}</div>
                <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Total Consumido</div>
              </div>
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 text-center">
                <div className="text-sm font-black text-slate-800 truncate mt-1">
                  {activeUserDetail.email.endsWith("@canchapro.local") 
                    ? activeUserDetail.email.split("@")[0] 
                    : activeUserDetail.email.substring(0, 10) + "..."
                  }
                </div>
                <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Usuario / DNI</div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Últimas Reservas de Canchas</h4>
              
              <div className="max-h-60 overflow-y-auto space-y-2 pr-2 scrollbar-thin">
                {activeUserDetail.reservations?.map((res: any) => {
                  const start = new Date(res.startTime);
                  const end = new Date(res.endTime);
                  const hoursDiff = Math.abs(end.getTime() - start.getTime()) / 36e5;

                  return (
                    <div key={res.id} className="bg-white p-4 rounded-2xl border border-slate-150 shadow-sm flex items-center justify-between gap-3 hover:border-emerald-200 transition-colors">
                      <div>
                        <div className="font-black text-slate-800 text-sm">
                          {res.cancha?.name || "Cancha Eliminada"}
                        </div>
                        <div className="text-xs text-slate-400 font-bold mt-0.5">
                          {start.toLocaleDateString("es-PE", { weekday: "short", day: "numeric", month: "short" })} — {start.getHours()}:00 a {end.getHours()}:00 ({hoursDiff} {hoursDiff === 1 ? 'hora' : 'horas'})
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="font-black text-slate-900 text-sm">S/ {res.totalPrice.toFixed(2)}</div>
                        <span className={`inline-block px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider mt-1 ${
                          res.status === 'CONFIRMADO' ? 'bg-emerald-50 text-emerald-700' :
                          res.status === 'PENDIENTE' ? 'bg-amber-50 text-amber-600' :
                          res.status === 'PALABRA' ? 'bg-blue-50 text-blue-700' :
                          'bg-slate-100 text-slate-500'
                        }`}>
                          {res.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
                {(!activeUserDetail.reservations || activeUserDetail.reservations.length === 0) && (
                  <div className="text-center py-8 bg-slate-50 rounded-2xl text-slate-400 text-xs font-bold border border-dashed border-slate-200">
                    Este usuario no ha registrado ninguna reserva todavía.
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-1 text-[10px] text-slate-400 font-bold leading-relaxed">
                * El historial incluye reservas rápidas asociadas a este DNI y reservas iniciadas desde su cuenta.
              </div>
              <button 
                type="button"
                onClick={() => setShowActivityModal(false)}
                className="bg-slate-900 text-white font-black px-6 py-3 rounded-2xl text-sm shadow-xl hover:bg-slate-800 transition-all active:scale-95"
              >
                Cerrar Ventana
              </button>
            </div>
          </div>
        </div>
      )}
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
          {React.cloneElement(icon as React.ReactElement<any>, { className: "w-6 h-6" })}
        </div>
        <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">{trend}</span>
      </div>
      <h4 className="text-slate-500 font-bold text-sm uppercase tracking-wider">{title}</h4>
      <div className="text-3xl font-black text-slate-900 mt-1">{value}</div>
    </div>
  );
}
