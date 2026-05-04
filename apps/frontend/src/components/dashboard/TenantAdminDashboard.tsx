"use client";

import React, { useState } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";
import { 
  Calendar, TrendingUp, DollarSign, Clock, Users, MapPin, 
  Image as ImageIcon, Settings, Save, CheckCircle2, X, Plus, 
  AlertTriangle, Phone, User as UserIcon, Building, Info, Globe, HelpCircle,
  ArrowRight
} from "lucide-react";
import { CustomModal } from "@/components/ui/CustomModal";
import { TourGuide } from "@/components/dashboard/TourGuide";
import Link from "next/link";

export function TenantAdminDashboard({ stats, user }: { stats: any, user: any }) {
  const [activeTab, setActiveTab] = useState<"DASHBOARD" | "CANCHAS" | "PERFIL">("DASHBOARD");
  const [showTour, setShowTour] = useState(!user?.hasSeenTour);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {showTour && (
        <TourGuide 
          userId={user?.id} 
          onComplete={() => setShowTour(false)} 
        />
      )}

      {/* Header and Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div id="dashboard-welcome">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Panel de Control</h1>
          <p className="text-slate-500 mt-2 font-medium">Gestión integral de {stats.tenantProfile?.name || "tu complejo"}.</p>
        </div>
        <div className="flex bg-slate-100 p-1.5 rounded-2xl shadow-inner">
          <button onClick={() => setActiveTab("DASHBOARD")} className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === "DASHBOARD" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>Resumen</button>
          <button id="dashboard-canchas-tab" onClick={() => setActiveTab("CANCHAS")} className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === "CANCHAS" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>Mis Canchas</button>
          <button id="dashboard-config-tab" onClick={() => setActiveTab("PERFIL")} className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === "PERFIL" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>Configuración</button>
        </div>
      </div>

      {activeTab === "DASHBOARD" && (
        <>
          <div id="dashboard-stats" className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900 p-8 rounded-3xl text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                <DollarSign className="w-24 h-24" />
              </div>
              <h4 className="text-slate-400 font-bold text-sm uppercase tracking-wider mb-2">Ingresos del Mes</h4>
              <div className="text-5xl font-black mb-4">S/ {stats.monthlyRevenue.toFixed(2)}</div>
              <div className="flex items-center gap-2 text-xs font-black bg-emerald-500/20 text-emerald-400 w-fit px-3 py-1 rounded-full border border-emerald-500/20">
                <TrendingUp className="w-3 h-3" /> DATOS REALES
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:border-emerald-500/30 transition-colors group">
              <h4 className="text-slate-500 font-bold text-sm uppercase tracking-wider mb-2">Reservas Hoy</h4>
              <div className="text-5xl font-black text-slate-900 mb-4">{stats.todayReservations}</div>
              <div className="flex items-center gap-2 text-xs font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full w-fit">
                <Calendar className="w-3 h-3" /> Ver Agenda
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:border-blue-500/30 transition-colors group">
              <h4 className="text-slate-500 font-bold text-sm uppercase tracking-wider mb-2">Capacidad Utilizada</h4>
              <div className="text-5xl font-black text-slate-900 mb-4">{stats.myCanchasCount} <span className="text-lg text-slate-300">/ {stats.tenantProfile?.plan?.maxCanchas || 1}</span></div>
              <div className="flex items-center gap-2 text-xs font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full w-fit">
                <Clock className="w-3 h-3" /> Límite de Plan: {stats.tenantProfile?.plan?.name || "Trial"}
              </div>
            </div>
          </div>

          <div id="dashboard-public-link" className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
             <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-emerald-50 rounded-3xl flex items-center justify-center text-emerald-600 shadow-inner">
                   <Globe className="w-8 h-8" />
                </div>
                <div>
                   <h3 className="text-xl font-black text-slate-900">Tu Página Web Pública</h3>
                   <p className="text-slate-500 font-medium">Comparte este link con tus clientes para que reserven.</p>
                </div>
             </div>
             <div className="flex gap-3 w-full md:w-auto">
                <input readOnly value={`http://localhost:3000/c/${stats.tenantProfile?.slug || stats.tenantProfile?.id}`} className="bg-slate-50 border border-slate-200 px-4 py-3 rounded-2xl font-bold text-slate-600 flex-1 md:w-80" />
                <Link href={`/c/${stats.tenantProfile?.slug || stats.tenantProfile?.id}`} className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-black hover:bg-slate-800 transition-all flex items-center gap-2">
                   Visitar <ArrowRight className="w-4 h-4" />
                </Link>
             </div>
          </div>
        </>
      )}

      {activeTab === "CANCHAS" && (
        <CanchasManager 
          canchas={stats.myCanchas || []} 
          tenantId={stats.tenantProfile?.id} 
          planLimit={stats.tenantProfile?.plan?.maxCanchas || 1}
        />
      )}

      {activeTab === "PERFIL" && (
        <TenantProfileManager profile={stats.tenantProfile} />
      )}
    </div>
  );
}

export function CanchasManager({ canchas, tenantId, planLimit }: { canchas: any[], tenantId: string, planLimit: number }) {
  const [editing, setEditing] = useState<any>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCreate = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    const { createCanchaAction } = await import("@/app/actions/admin");
    const res = await createCanchaAction(tenantId, {
      name: e.target.name.value,
      description: e.target.description.value,
      pricePerHour: Number(e.target.price.value)
    });
    setLoading(false);
    if(res.success) {
      setIsCreating(false);
    } else {
      alert("Error: " + res.error);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
        <div>
          <h3 className="text-2xl font-black text-slate-900">Mis Espacios Deportivos</h3>
          <p className="text-slate-500 font-medium">Tienes {canchas.length} de {planLimit} canchas permitidas.</p>
        </div>
        <button 
          onClick={() => setIsCreating(true)}
          disabled={canchas.length >= planLimit}
          className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-black text-lg transition-all shadow-xl ${
            canchas.length >= planLimit 
            ? "bg-slate-100 text-slate-400 cursor-not-allowed" 
            : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-600/20 active:scale-95"
          }`}
        >
          <Plus className="w-6 h-6" /> Nueva Cancha
        </button>
      </div>

      {canchas.length >= planLimit && (
        <div className="bg-amber-50 border border-amber-200 p-6 rounded-3xl flex items-center gap-4 text-amber-700 animate-pulse">
           <AlertTriangle className="w-8 h-8 flex-shrink-0" />
           <p className="font-bold">Has alcanzado el límite de tu plan actual. Para agregar más canchas, contacta a soporte para mejorar tu plan.</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {canchas.map(cancha => (
          <div key={cancha.id} className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden group hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-300">
            <div className="aspect-[4/3] w-full bg-slate-50 relative overflow-hidden">
              {cancha.image ? (
                <img src={cancha.image} alt={cancha.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                   <ImageIcon className="w-16 h-16 text-slate-200" />
                   <span className="text-slate-300 font-bold uppercase tracking-widest text-xs">Sin Foto</span>
                </div>
              )}
              <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-6">
                <button className="bg-white text-slate-900 px-6 py-3 rounded-2xl font-black text-sm shadow-xl hover:bg-slate-50 transition-all">Cambiar Imagen</button>
              </div>
            </div>
            <div className="p-8 space-y-4">
              <div className="flex justify-between items-start">
                <h4 className="font-black text-2xl text-slate-900">{cancha.name}</h4>
                <div className="bg-emerald-50 text-emerald-600 px-4 py-1 rounded-full font-black text-xs">S/ {Number(cancha.pricePerHour).toFixed(0)}/hr</div>
              </div>
              <p className="text-slate-500 font-medium line-clamp-3 leading-relaxed">{cancha.description}</p>
              
              <div className="flex gap-3 pt-6 border-t border-slate-50">
                <button onClick={() => setEditing(cancha)} className="flex-1 bg-slate-100 text-slate-800 font-black py-4 rounded-2xl text-sm hover:bg-slate-200 transition-all">Editar</button>
                <button 
                  onClick={async () => {
                    if(confirm("¿Seguro que deseas eliminar esta cancha?")) {
                      const { deleteCanchaAction } = await import("@/app/actions/admin");
                      await deleteCanchaAction(cancha.id);
                    }
                  }}
                  className="bg-red-50 text-red-500 p-4 rounded-2xl hover:bg-red-500 hover:text-white transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Nueva Cancha */}
      {isCreating && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[100] flex items-center justify-center p-6">
          <form className="bg-white rounded-[48px] w-full max-w-xl p-10 space-y-8 animate-in zoom-in duration-300" onSubmit={handleCreate}>
            <div className="flex justify-between items-center">
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">Nueva Cancha</h3>
              <button type="button" onClick={() => setIsCreating(false)} className="p-3 bg-slate-100 rounded-2xl hover:bg-slate-200 transition-all"><X className="w-6 h-6 text-slate-400" /></button>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                 <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-4">Nombre de la Cancha</label>
                 <input name="name" required placeholder="Ej. Cancha Principal N°1" className="w-full bg-slate-50 border-2 border-slate-50 p-5 rounded-3xl focus:outline-none focus:border-emerald-500/50 font-bold" />
              </div>
              <div className="space-y-2">
                 <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-4">Descripción / Características</label>
                 <textarea name="description" placeholder="Ej. Gras sintético premium, iluminación LED..." className="w-full bg-slate-50 border-2 border-slate-50 p-5 rounded-3xl focus:outline-none focus:border-emerald-500/50 font-bold h-32" />
              </div>
              <div className="space-y-2">
                 <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-4">Precio por Hora (S/)</label>
                 <div className="relative">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-slate-400">S/</span>
                    <input name="price" type="number" required placeholder="50" className="w-full bg-slate-50 border-2 border-slate-50 p-5 pl-12 rounded-3xl focus:outline-none focus:border-emerald-500/50 font-bold" />
                 </div>
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full bg-emerald-600 text-white font-black py-6 rounded-3xl text-xl shadow-2xl shadow-emerald-600/30 hover:bg-emerald-700 transition-all">
              {loading ? "Creando..." : "Registrar Cancha"}
            </button>
          </form>
        </div>
      )}

      {/* Modal Editar */}
      {editing && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[100] flex items-center justify-center p-6">
          <form 
            className="bg-white rounded-[48px] w-full max-w-xl p-10 space-y-8 animate-in zoom-in duration-300"
            onSubmit={async (e: any) => {
              e.preventDefault();
              setLoading(true);
              const { updateCanchaAction } = await import("@/app/actions/admin");
              const res = await updateCanchaAction(editing.id, {
                name: e.target.name.value,
                description: e.target.description.value,
                pricePerHour: Number(e.target.price.value)
              });
              setLoading(false);
              if(res.success) setEditing(null);
              else alert("Error: " + res.error);
            }}
          >
            <div className="flex justify-between items-center">
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">Editar Detalle</h3>
              <button type="button" onClick={() => setEditing(null)} className="p-3 bg-slate-100 rounded-2xl hover:bg-slate-200 transition-all"><X className="w-6 h-6 text-slate-400" /></button>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                 <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-4">Nombre</label>
                 <input name="name" required defaultValue={editing.name} className="w-full bg-slate-50 border-2 border-slate-50 p-5 rounded-3xl focus:outline-none focus:border-emerald-500/50 font-bold" />
              </div>
              <div className="space-y-2">
                 <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-4">Descripción</label>
                 <textarea name="description" defaultValue={editing.description} className="w-full bg-slate-50 border-2 border-slate-50 p-5 rounded-3xl focus:outline-none focus:border-emerald-500/50 font-bold h-32" />
              </div>
              <div className="space-y-2">
                 <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-4">Precio (S/)</label>
                 <input name="price" type="number" required defaultValue={editing.pricePerHour} className="w-full bg-slate-50 border-2 border-slate-50 p-5 rounded-3xl focus:outline-none focus:border-emerald-500/50 font-bold" />
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full bg-slate-900 text-white font-black py-6 rounded-3xl text-xl shadow-2xl shadow-slate-900/30 hover:bg-slate-800 transition-all">
               {loading ? "Guardando..." : "Actualizar Información"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export function TenantProfileManager({ profile }: { profile: any }) {
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({ isOpen: false, title: "", message: "", type: "success" as any });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    const { updateTenantProfileAction } = await import("@/app/actions/admin");
    
    const formData = {
      name: e.target.name.value,
      slug: e.target.slug.value,
      phone: e.target.phone.value,
      yapeName: e.target.yapeName.value,
      location: e.target.location.value,
      description: e.target.description.value,
      openingHours: e.target.openingHours.value,
      pricePerHour: e.target.pricePerHour.value,
      ownerName: e.target.ownerName.value,
      managerName: e.target.managerName.value,
    };

    const res = await updateTenantProfileAction(profile.id, formData);
    setLoading(false);
    
    if (res.success) {
      setModal({
        isOpen: true,
        title: "¡Perfil Actualizado!",
        message: "La información de tu complejo ha sido guardada correctamente y ya es visible para tus clientes.",
        type: "success"
      });
    } else {
      setModal({
        isOpen: true,
        title: "Error",
        message: res.error || "No se pudo actualizar el perfil.",
        type: "error"
      });
    }
  };

  return (
    <div className="max-w-5xl animate-in fade-in slide-in-from-right-8 duration-700">
      <form onSubmit={handleSubmit} className="space-y-12">
        {/* Basic Info Section */}
        <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm space-y-10">
          <div className="flex items-center gap-4">
             <Settings className="w-8 h-8 text-emerald-600" />
             <h3 className="text-3xl font-black text-slate-900 tracking-tight">Perfil de tu Complejo</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 block">Nombre Comercial</label>
              <div className="relative">
                 <Building className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                 <input name="name" required defaultValue={profile?.name} className="w-full bg-slate-50 border-2 border-slate-50 p-5 pl-14 rounded-[28px] focus:outline-none focus:border-emerald-500/50 font-bold" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 block">URL Personalizada (Slug)</label>
              <div className="relative">
                 <Globe className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                 <input name="slug" required defaultValue={profile?.slug} className="w-full bg-slate-50 border-2 border-slate-50 p-5 pl-14 rounded-[28px] focus:outline-none focus:border-emerald-500/50 font-bold" />
              </div>
              <p className="text-[10px] text-slate-400 ml-4 font-bold">ej: tu-complejo-deportivo</p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 block">Descripción del Local</label>
            <textarea name="description" defaultValue={profile?.description} placeholder="Cuéntales a tus clientes por qué elegir tu cancha..." className="w-full bg-slate-50 border-2 border-slate-50 p-6 rounded-[32px] focus:outline-none focus:border-emerald-500/50 font-bold h-32" />
          </div>
        </div>

        {/* Details & Location */}
        <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm space-y-10">
          <div className="flex items-center gap-4">
             <MapPin className="w-8 h-8 text-blue-600" />
             <h3 className="text-3xl font-black text-slate-900 tracking-tight">Detalles y Ubicación</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 block">Dirección Exacta</label>
              <div className="relative">
                 <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                 <input name="location" defaultValue={profile?.location} placeholder="Av. Siempre Viva 123, Lima" className="w-full bg-slate-50 border-2 border-slate-50 p-5 pl-14 rounded-[28px] focus:outline-none focus:border-emerald-500/50 font-bold" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 block">Horario de Atención</label>
              <div className="relative">
                 <Clock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                 <input name="openingHours" defaultValue={profile?.openingHours} placeholder="8:00 AM - 11:00 PM" className="w-full bg-slate-50 border-2 border-slate-50 p-5 pl-14 rounded-[28px] focus:outline-none focus:border-emerald-500/50 font-bold" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 block">Precio Base por Hora (S/)</label>
              <div className="relative">
                 <DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                 <input name="pricePerHour" type="number" defaultValue={profile?.pricePerHour} placeholder="50" className="w-full bg-slate-50 border-2 border-slate-50 p-5 pl-14 rounded-[28px] focus:outline-none focus:border-emerald-500/50 font-bold" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 block">Teléfono de Contacto</label>
              <div className="relative">
                 <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                 <input name="phone" defaultValue={profile?.phone} placeholder="987654321" className="w-full bg-slate-50 border-2 border-slate-50 p-5 pl-14 rounded-[28px] focus:outline-none focus:border-emerald-500/50 font-bold" />
              </div>
            </div>
          </div>
        </div>

        {/* Payments & Staff */}
        <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm space-y-10">
          <div className="flex items-center gap-4">
             <UserIcon className="w-8 h-8 text-amber-600" />
             <h3 className="text-3xl font-black text-slate-900 tracking-tight">Pagos y Personal</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 block">Titular del Yape / Plin</label>
              <div className="relative">
                 <UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                 <input name="yapeName" defaultValue={profile?.yapeName} placeholder="Nombre completo para pagos" className="w-full bg-slate-50 border-2 border-slate-50 p-5 pl-14 rounded-[28px] focus:outline-none focus:border-emerald-500/50 font-bold" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 block">Nombre del Dueño</label>
              <input name="ownerName" defaultValue={profile?.ownerName} placeholder="Dueño del negocio" className="w-full bg-slate-50 border-2 border-slate-50 p-5 rounded-[28px] focus:outline-none focus:border-emerald-500/50 font-bold" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 block">Nombre del Encargado (Opcional)</label>
              <input name="managerName" defaultValue={profile?.managerName} placeholder="Persona a cargo del local" className="w-full bg-slate-50 border-2 border-slate-50 p-5 rounded-[28px] focus:outline-none focus:border-emerald-500/50 font-bold" />
            </div>
          </div>
        </div>

        <div className="sticky bottom-8 z-10 flex justify-end animate-in slide-in-from-bottom-4 duration-500">
           <button 
             type="submit" 
             disabled={loading}
             className="bg-emerald-600 text-white font-black px-12 py-6 rounded-[32px] text-xl shadow-2xl shadow-emerald-600/40 hover:bg-emerald-700 transition-all active:scale-95 flex items-center gap-3 disabled:opacity-50"
           >
             {loading ? <Clock className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6" />}
             Guardar todos los cambios
           </button>
        </div>
      </form>

      <CustomModal 
        isOpen={modal.isOpen}
        onClose={() => setModal({ ...modal, isOpen: false })}
        title={modal.title}
        message={modal.message}
        type={modal.type}
      />
    </div>
  );
}
