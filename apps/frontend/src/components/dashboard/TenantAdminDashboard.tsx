"use client";

import React, { useState, useEffect } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";
import { 
  Calendar, TrendingUp, DollarSign, Clock, Users, MapPin, 
  Image as ImageIcon, Settings, Save, CheckCircle2, X, Plus, Loader2,
  AlertTriangle, Phone, User as UserIcon, Building, Info, Globe, HelpCircle,
  ArrowRight, Download, Trash2, Coffee, Gift, Percent, Award, Sparkles
} from "lucide-react";
import { CustomModal } from "@/components/ui/CustomModal";
import { TourGuide } from "@/components/dashboard/TourGuide";
import { dashboardTourSteps, canchasTourSteps, perfilTourSteps } from "@/components/dashboard/tourSteps";
import Link from "next/link";

export function TenantAdminDashboard({ stats, user }: { stats: any, user: any }) {
  const [activeTab, setActiveTab] = useState<"DASHBOARD" | "CANCHAS" | "PERFIL" | "PERSONALIZAR">("DASHBOARD");
  const [showTour, setShowTour] = useState(!user?.hasSeenTour);
  const [activeTourModule, setActiveTourModule] = useState<"DASHBOARD" | "CANCHAS" | "PERFIL" | "PERSONALIZAR">("DASHBOARD");

  // Listen for "Ver Tutorial" button in sidebar
  useEffect(() => {
    const handler = () => {
      setActiveTourModule(activeTab);
      setShowTour(true);
    };
    window.addEventListener('replay-tour', handler);
    return () => window.removeEventListener('replay-tour', handler);
  }, [activeTab]);

  const currentTourSteps = activeTourModule === "CANCHAS" ? canchasTourSteps 
    : activeTourModule === "PERFIL" ? perfilTourSteps 
    : dashboardTourSteps;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {showTour && (
        <TourGuide 
          steps={currentTourSteps}
          userId={user?.id}
          persist={activeTourModule === "DASHBOARD"}
          onComplete={() => setShowTour(false)} 
        />
      )}


      {/* Header and Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div id="dashboard-welcome">
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Panel de Control</h1>
          <p className="text-slate-500 mt-1 md:mt-2 text-sm md:text-base font-medium">Gestión integral de {stats.tenantProfile?.name || "tu complejo"}.</p>
        </div>
        <div className="flex overflow-x-auto no-scrollbar bg-slate-100 p-1.5 rounded-2xl shadow-inner max-w-full whitespace-nowrap scrollbar-none">
          <button onClick={() => setActiveTab("DASHBOARD")} className={`px-4 md:px-6 py-2.5 rounded-xl font-bold text-xs md:text-sm transition-all flex-shrink-0 ${activeTab === "DASHBOARD" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>Resumen</button>
          <button id="dashboard-canchas-tab" onClick={() => setActiveTab("CANCHAS")} className={`px-4 md:px-6 py-2.5 rounded-xl font-bold text-xs md:text-sm transition-all flex-shrink-0 ${activeTab === "CANCHAS" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>Mis Canchas</button>
          <button id="dashboard-config-tab" onClick={() => setActiveTab("PERFIL")} className={`px-4 md:px-6 py-2.5 rounded-xl font-bold text-xs md:text-sm transition-all flex-shrink-0 ${activeTab === "PERFIL" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>Configuración</button>
          <button onClick={() => setActiveTab("PERSONALIZAR")} className={`px-4 md:px-6 py-2.5 rounded-xl font-bold text-xs md:text-sm transition-all flex-shrink-0 ${activeTab === "PERSONALIZAR" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>Personalizar Web</button>
        </div>
      </div>

      {activeTab === "DASHBOARD" && (
        <>
          <div id="dashboard-stats" className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900 p-6 md:p-8 rounded-3xl text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                <DollarSign className="w-20 h-20 md:w-24 md:h-24" />
              </div>
              <h4 className="text-slate-400 font-bold text-xs md:text-sm uppercase tracking-wider mb-2">Ingresos del Mes</h4>
              <div className="text-4xl md:text-5xl font-black mb-4">S/ {(stats.monthlyRevenue || 0).toFixed(2)}</div>
              <div className="flex items-center gap-2 text-[10px] md:text-xs font-black bg-emerald-500/20 text-emerald-400 w-fit px-3 py-1 rounded-full border border-emerald-500/20">
                <TrendingUp className="w-3 h-3" /> DATOS REALES
              </div>
            </div>

            <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm hover:border-emerald-500/30 transition-colors group">
              <h4 className="text-slate-500 font-bold text-xs md:text-sm uppercase tracking-wider mb-2">Reservas Hoy</h4>
              <div className="text-4xl md:text-5xl font-black text-slate-900 mb-4">{stats.todayReservations}</div>
              <div className="flex items-center gap-2 text-[10px] md:text-xs font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full w-fit">
                <Calendar className="w-3 h-3" /> Ver Agenda
              </div>
            </div>

            <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm hover:border-blue-500/30 transition-colors group">
              <h4 className="text-slate-500 font-bold text-xs md:text-sm uppercase tracking-wider mb-2">Capacidad Utilizada</h4>
              <div className="text-4xl md:text-5xl font-black text-slate-900 mb-4">{stats.myCanchasCount} <span className="text-base md:text-lg text-slate-300">/ {stats.tenantProfile?.plan?.maxCanchas || 1}</span></div>
              <div className="flex items-center gap-2 text-[10px] md:text-xs font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full w-fit">
                <Clock className="w-3 h-3" /> Límite de Plan: {stats.tenantProfile?.plan?.name || "Trial"}
              </div>
            </div>
          </div>

          <div id="dashboard-public-link" className="bg-white p-6 md:p-8 rounded-[32px] md:rounded-[40px] border border-slate-100 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-6">
             <div className="flex items-center gap-4 w-full lg:w-auto">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-emerald-50 rounded-2xl md:rounded-3xl flex items-center justify-center text-emerald-600 shadow-inner flex-shrink-0">
                   <Globe className="w-6 h-6 md:w-8 md:h-8" />
                </div>
                <div>
                   <h3 className="text-lg md:text-xl font-black text-slate-900">Tu Página Web Pública</h3>
                   <p className="text-xs md:text-sm text-slate-500 font-medium">Comparte este link con tus clientes para que reserven.</p>
                </div>
             </div>
             <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                <input readOnly value={`http://localhost:3000/c/${stats.tenantProfile?.slug || stats.tenantProfile?.id}`} className="bg-slate-50 border border-slate-200 px-4 py-3.5 rounded-2xl font-bold text-xs md:text-sm text-slate-600 w-full lg:w-80 truncate" />
                <Link href={`/c/${stats.tenantProfile?.slug || stats.tenantProfile?.id}`} className="bg-slate-900 text-white px-6 py-3.5 rounded-2xl font-black text-sm hover:bg-slate-800 transition-all flex items-center justify-center gap-2 w-full sm:w-auto flex-shrink-0">
                   Visitar <ArrowRight className="w-4 h-4" />
                </Link>
             </div>
          </div>
        </>
      )}

      {activeTab === "CANCHAS" && (
        <div>
          <div className="flex justify-end mb-4">
            <button onClick={() => { setActiveTourModule('CANCHAS'); setShowTour(true); }} className="flex items-center gap-2 text-sm font-bold text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 px-4 py-2 rounded-xl border border-dashed border-amber-200 transition-all">
              <HelpCircle className="w-4 h-4" /> Ver Tutorial de Canchas
            </button>
          </div>
          <CanchasManager 
            canchas={stats.myCanchas || []} 
            tenantId={stats.tenantProfile?.id} 
            planLimit={stats.tenantProfile?.plan?.maxCanchas || 1}
          />
        </div>
      )}

      {activeTab === "PERFIL" && (
        <TenantProfileManager profile={stats.tenantProfile} />
      )}

      {activeTab === "PERSONALIZAR" && (
        <TenantCustomizer profile={stats.tenantProfile} />
      )}
    </div>
  );
}

export function CanchasManager({ canchas, tenantId, planLimit }: { canchas: any[], tenantId: string, planLimit: number }) {
  const [editing, setEditing] = useState<any>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, isEdit = false) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("La imagen no debe pesar más de 2MB");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      if (isEdit) setEditImagePreview(base64);
      else setImagePreview(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleCreate = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    const { createCanchaAction } = await import("@/app/actions/admin");
    const res = await createCanchaAction(tenantId, {
      name: e.target.name.value,
      description: e.target.description.value,
      pricePerHour: Number(e.target.price.value),
      image: imagePreview || undefined,
      sede: e.target.sede?.value || undefined,
      sedeAddress: e.target.sedeAddress?.value || undefined
    });
    setLoading(false);
    if(res.success) {
      setIsCreating(false);
      setImagePreview(null);
    } else {
      alert("Error: " + res.error);
    }
  };

  const handleChangeImageDirect = async (canchaId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { alert("La imagen no debe pesar más de 2MB"); return; }
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      const { updateCanchaAction } = await import("@/app/actions/admin");
      const cancha = canchas.find(c => c.id === canchaId);
      if (!cancha) return;
      await updateCanchaAction(canchaId, {
        name: cancha.name,
        description: cancha.description || "",
        pricePerHour: cancha.pricePerHour,
        image: base64
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div id="canchas-header" className="flex flex-col sm:flex-row justify-between sm:items-center bg-white p-6 md:p-8 rounded-[32px] md:rounded-[40px] border border-slate-100 shadow-sm gap-6">
        <div>
          <h3 className="text-xl md:text-2xl font-black text-slate-900">Mis Espacios Deportivos</h3>
          <p className="text-xs md:text-sm text-slate-500 font-medium">Tienes {canchas.length} de {planLimit} canchas permitidas.</p>
        </div>
        <button 
          id="canchas-new-btn"
          onClick={() => setIsCreating(true)}
          disabled={canchas.length >= planLimit}
          className={`flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-black text-sm md:text-base transition-all shadow-xl w-full sm:w-auto ${
            canchas.length >= planLimit 
            ? "bg-slate-100 text-slate-400 cursor-not-allowed" 
            : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-600/20 active:scale-95"
          }`}
        >
          <Plus className="w-5 h-5" /> Nueva Cancha
        </button>
      </div>

      {canchas.length >= planLimit && (
        <div className="bg-amber-50 border border-amber-200 p-6 rounded-3xl flex items-center gap-4 text-amber-700 animate-pulse">
           <AlertTriangle className="w-8 h-8 flex-shrink-0" />
           <p className="font-bold">Has alcanzado el límite de tu plan actual. Para agregar más canchas, contacta a soporte para mejorar tu plan.</p>
        </div>
      )}

      <div id="canchas-list" className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
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
              <label className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-6 cursor-pointer">
                <span className="bg-white text-slate-900 px-6 py-3 rounded-2xl font-black text-sm shadow-xl hover:bg-slate-50 transition-all">Cambiar Imagen</span>
                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleChangeImageDirect(cancha.id, e)} />
              </label>
            </div>
            <div className="p-8 space-y-4">
              <div className="flex justify-between items-start">
                <h4 className="font-black text-2xl text-slate-900">{cancha.name}</h4>
                <div className="bg-emerald-50 text-emerald-600 px-4 py-1 rounded-full font-black text-xs">S/ {Number(cancha.pricePerHour).toFixed(0)}/hr</div>
              </div>
              <p className="text-slate-500 font-medium line-clamp-3 leading-relaxed">{cancha.description}</p>
              {cancha.sede && (
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-blue-500 flex-shrink-0" />
                  <span className="font-bold text-blue-600">{cancha.sede}</span>
                  {cancha.sedeAddress && <span className="text-slate-400">— {cancha.sedeAddress}</span>}
                </div>
              )}
              
              <div className="flex gap-3 pt-6 border-t border-slate-50">
                <button onClick={() => { setEditing(cancha); setEditImagePreview(cancha.image || null); }} className="flex-1 bg-slate-100 text-slate-800 font-black py-4 rounded-2xl text-sm hover:bg-slate-200 transition-all">Editar</button>
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
          <form className="bg-white rounded-[48px] w-full max-w-xl p-10 space-y-8 animate-in zoom-in duration-300 max-h-[90vh] overflow-y-auto" onSubmit={handleCreate}>
            <div className="flex justify-between items-center">
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">Nueva Cancha</h3>
              <button type="button" onClick={() => { setIsCreating(false); setImagePreview(null); }} className="p-3 bg-slate-100 rounded-2xl hover:bg-slate-200 transition-all"><X className="w-6 h-6 text-slate-400" /></button>
            </div>
            <div className="space-y-6">
              {/* Image Upload */}
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-4">Foto de la Cancha</label>
                <label className="block w-full aspect-video bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl overflow-hidden cursor-pointer hover:border-emerald-400 transition-colors relative">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                      <ImageIcon className="w-12 h-12 text-slate-300" />
                      <span className="text-slate-400 font-bold text-sm">Haz clic para subir una imagen</span>
                      <span className="text-slate-300 text-xs">Máx. 2MB • JPG, PNG, WEBP</span>
                    </div>
                  )}
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageChange(e, false)} />
                </label>
              </div>
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
              {planLimit > 1 && (
                <>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-4">Sede / Sucursal</label>
                    <div className="relative">
                      <Building className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                      <input name="sede" required placeholder="Ej. Sede Norte, Local Centro" className="w-full bg-slate-50 border-2 border-slate-50 p-5 pl-14 rounded-3xl focus:outline-none focus:border-emerald-500/50 font-bold" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-4">Dirección de la Sede</label>
                    <div className="relative">
                      <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                      <input name="sedeAddress" required placeholder="Ej. Av. Los Héroes 123, Distrito" className="w-full bg-slate-50 border-2 border-slate-50 p-5 pl-14 rounded-3xl focus:outline-none focus:border-emerald-500/50 font-bold" />
                    </div>
                  </div>
                </>
              )}
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
            className="bg-white rounded-[48px] w-full max-w-xl p-10 space-y-8 animate-in zoom-in duration-300 max-h-[90vh] overflow-y-auto"
            onSubmit={async (e: any) => {
              e.preventDefault();
              setLoading(true);
              const { updateCanchaAction } = await import("@/app/actions/admin");
              const res = await updateCanchaAction(editing.id, {
                name: e.target.name.value,
                description: e.target.description.value,
                pricePerHour: Number(e.target.price.value),
                image: editImagePreview || undefined,
                sede: e.target.sede?.value,
                sedeAddress: e.target.sedeAddress?.value
              });
              setLoading(false);
              if(res.success) { setEditing(null); setEditImagePreview(null); }
              else alert("Error: " + res.error);
            }}
          >
            <div className="flex justify-between items-center">
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">Editar Detalle</h3>
              <button type="button" onClick={() => { setEditing(null); setEditImagePreview(null); }} className="p-3 bg-slate-100 rounded-2xl hover:bg-slate-200 transition-all"><X className="w-6 h-6 text-slate-400" /></button>
            </div>
            <div className="space-y-6">
              {/* Image Upload */}
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-4">Foto de la Cancha</label>
                <label className="block w-full aspect-video bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl overflow-hidden cursor-pointer hover:border-emerald-400 transition-colors relative">
                  {editImagePreview ? (
                    <img src={editImagePreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                      <ImageIcon className="w-12 h-12 text-slate-300" />
                      <span className="text-slate-400 font-bold text-sm">Haz clic para subir o cambiar imagen</span>
                      <span className="text-slate-300 text-xs">Máx. 2MB • JPG, PNG, WEBP</span>
                    </div>
                  )}
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageChange(e, true)} />
                </label>
              </div>
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
              {planLimit > 1 && (
                <>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-4">Sede / Sucursal</label>
                    <div className="relative">
                      <Building className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                      <input name="sede" required defaultValue={editing.sede} placeholder="Ej. Sede Norte" className="w-full bg-slate-50 border-2 border-slate-50 p-5 pl-14 rounded-3xl focus:outline-none focus:border-emerald-500/50 font-bold" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-4">Dirección de la Sede</label>
                    <div className="relative">
                      <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                      <input name="sedeAddress" required defaultValue={editing.sedeAddress} placeholder="Ej. Av. Los Héroes 123" className="w-full bg-slate-50 border-2 border-slate-50 p-5 pl-14 rounded-3xl focus:outline-none focus:border-emerald-500/50 font-bold" />
                    </div>
                  </div>
                </>
              )}
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
        <div id="perfil-basic" className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm space-y-10">
          <div id="perfil-header" className="flex items-center gap-4">
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
        <div id="perfil-location" className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm space-y-10">
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
        <div id="perfil-payments" className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm space-y-10">
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

export function TenantCustomizer({ profile }: { profile: any }) {
  const [loading, setLoading] = useState(false);
  const [logo, setLogo] = useState(profile.logo || "");
  const [bgImage, setBgImage] = useState(profile.bgImage || "");
  
  const [beverages, setBeverages] = useState<any[]>(() => {
    try {
      return profile.beverages ? JSON.parse(profile.beverages) : [];
    } catch {
      return [];
    }
  });

  const [promotions, setPromotions] = useState<any[]>(() => {
    try {
      return profile.promotions ? JSON.parse(profile.promotions) : [];
    } catch {
      return [];
    }
  });

  const [sponsorships, setSponsorships] = useState<any[]>(() => {
    try {
      return profile.sponsorships ? JSON.parse(profile.sponsorships) : [];
    } catch {
      return [];
    }
  });

  const [modal, setModal] = useState({ isOpen: false, title: "", message: "", type: "success" as any });

  // Form States
  const [bevName, setBevName] = useState("");
  const [bevPrice, setBevPrice] = useState("");
  const [bevIcon, setBevIcon] = useState("🥤");
  const [bevDesc, setBevDesc] = useState("");
  const [bevImage, setBevImage] = useState("");

  const [promoTitle, setPromoTitle] = useState("");
  const [promoDesc, setPromoDesc] = useState("");
  const [promoDiscount, setPromoDiscount] = useState("");

  const [sponTitle, setSponTitle] = useState("");
  const [sponDesc, setSponDesc] = useState("");
  const [sponImage, setSponImage] = useState("");
  const [sponPrice, setSponPrice] = useState("");
  const [sponSchedule, setSponSchedule] = useState("");

  const publicUrl = typeof window !== "undefined" 
    ? `${window.location.protocol}//${window.location.host}/c/${profile.slug || profile.id}`
    : `http://localhost:3000/c/${profile.slug || profile.id}`;

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(publicUrl)}`;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, setter: (val: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("La imagen no debe pesar más de 2MB");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setter(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAddBeverage = () => {
    if (!bevName || !bevPrice) return;
    const newBev = { 
      id: Date.now().toString(), 
      name: bevName, 
      price: parseFloat(bevPrice) || 0, 
      icon: bevIcon,
      image: bevImage || undefined,
      active: true,
      description: bevDesc
    };
    setBeverages(prev => [...prev, newBev]);
    setBevName("");
    setBevPrice("");
    setBevDesc("");
    setBevImage("");
  };

  const handleToggleBeverageActive = (id: string) => {
    setBeverages(prev => prev.map(b => b.id === id ? { ...b, active: b.active === undefined ? false : !b.active } : b));
  };

  const handleRemoveBeverage = (id: string) => {
    setBeverages(prev => prev.filter(b => b.id !== id));
  };

  const handleAddPromo = () => {
    if (!promoTitle || !promoDesc) return;
    const newPromo = { id: Date.now().toString(), title: promoTitle, description: promoDesc, discount: promoDiscount };
    setPromotions(prev => [...prev, newPromo]);
    setPromoTitle("");
    setPromoDesc("");
    setPromoDiscount("");
  };

  const handleRemovePromo = (id: string) => {
    setPromotions(prev => prev.filter(p => p.id !== id));
  };

  const handleAddSponsorship = () => {
    if (!sponTitle || !sponDesc) return;
    const newSpon = { 
      id: Date.now().toString(), 
      title: sponTitle, 
      description: sponDesc, 
      image: sponImage,
      price: sponPrice || undefined,
      schedule: sponSchedule || undefined
    };
    setSponsorships(prev => [...prev, newSpon]);
    setSponTitle("");
    setSponDesc("");
    setSponImage("");
    setSponPrice("");
    setSponSchedule("");
  };

  const handleRemoveSponsorship = (id: string) => {
    setSponsorships(prev => prev.filter(s => s.id !== id));
  };

  const handleSaveAll = async () => {
    setLoading(true);
    const { updateTenantCustomizationsAction } = await import("@/app/actions/admin");
    const res = await updateTenantCustomizationsAction(profile.id, {
      logo: logo || undefined,
      bgImage: bgImage || undefined,
      beverages: JSON.stringify(beverages),
      promotions: JSON.stringify(promotions),
      sponsorships: JSON.stringify(sponsorships),
    });
    setLoading(false);

    if (res.success) {
      setModal({
        isOpen: true,
        title: "¡Diseño Guardado!",
        message: "Las personalizaciones se han guardado con éxito. Tus clientes ya pueden ver los nuevos servicios en tu página web.",
        type: "success"
      });
    } else {
      setModal({
        isOpen: true,
        title: "Error al Guardar",
        message: res.error || "Ocurrió un error inesperado al guardar la personalización.",
        type: "error"
      });
    }
  };

  const downloadQR = async () => {
    try {
      // Create a canvas element
      const canvas = document.createElement("canvas");
      canvas.width = 800;
      canvas.height = 1100;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Could not get canvas context");

      // 1. Background Gradient (Sleek dark sports gradient)
      const grad = ctx.createLinearGradient(0, 0, 0, 1100);
      grad.addColorStop(0, "#0f172a"); // slate-900
      grad.addColorStop(0.5, "#022c22"); // dark emerald
      grad.addColorStop(1, "#090d16"); // near black
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 800, 1100);

      // 2. Decorative elements (Sports lines / Pitch overlay)
      ctx.strokeStyle = "rgba(16, 185, 129, 0.12)"; // emerald-500 with opacity
      ctx.lineWidth = 6;
      
      // Diagonal pitch lines
      ctx.beginPath();
      ctx.moveTo(-100, 300);
      ctx.lineTo(900, 1300);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-100, 500);
      ctx.lineTo(900, 1500);
      ctx.stroke();

      // Pitch circles
      ctx.beginPath();
      ctx.arc(800, 0, 250, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, 1100, 350, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(400, 550, 150, 0, 2 * Math.PI);
      ctx.stroke();

      // 3. Header text
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // Tenant Name
      ctx.fillStyle = "#10b981"; // neon green
      ctx.font = "bold 26px sans-serif";
      ctx.fillText(profile.name.toUpperCase(), 400, 100);

      // Main Slogan (Big, bold, athletic typography)
      ctx.fillStyle = "#ffffff";
      ctx.font = "900 56px sans-serif";
      ctx.fillText("ESCANEA", 400, 185);
      ctx.fillText("Y RESERVA TU CANCHA", 400, 260);

      // Subtitle
      ctx.fillStyle = "#94a3b8"; // slate-400
      ctx.font = "bold 20px sans-serif";
      ctx.fillText("¡RÁPIDO, FÁCIL Y 100% GARANTIZADO!", 400, 330);

      // 4. White Card for QR Code with border & shadow
      const cardX = 180;
      const cardY = 380;
      const cardW = 440;
      const cardH = 440;
      const radius = 48;

      // Card Background
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.roundRect(cardX, cardY, cardW, cardH, radius);
      ctx.fill();

      // Load QR Image
      const qrImg = new Image();
      qrImg.crossOrigin = "anonymous";
      qrImg.src = qrUrl;

      await new Promise((resolve, reject) => {
        qrImg.onload = resolve;
        qrImg.onerror = reject;
      });

      // Draw QR Image inside the card (adding safety margin)
      ctx.drawImage(qrImg, cardX + 40, cardY + 40, cardW - 80, cardH - 80);

      // Draw QR card border
      ctx.strokeStyle = "#10b981";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.roundRect(cardX, cardY, cardW, cardH, radius);
      ctx.stroke();

      // 5. Footer instruction
      ctx.fillStyle = "#10b981";
      ctx.font = "bold 24px sans-serif";
      ctx.fillText("ESCANEA CON LA CÁMARA DE TU CELULAR", 400, 900);

      // Web link (clean and highlighted)
      ctx.fillStyle = "#ffffff";
      ctx.font = "900 36px sans-serif";
      ctx.fillText(publicUrl.replace("http://", "").replace("https://", ""), 400, 960);

      // Brand Logo CanchaSync
      ctx.fillStyle = "#475569"; // slate-600
      ctx.font = "bold 16px sans-serif";
      ctx.fillText("POTENCIADO POR CANCHASYNC.PRO", 400, 1030);

      // Trigger download
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `Flyer-QR-${profile.name.replace(/\s+/g, "-")}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Flyer QR generation failed, falling back to direct download...", err);
      // Fallback: download raw QR image
      try {
        const response = await fetch(qrUrl);
        const blob = await response.blob();
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `QR-${profile.name.replace(/\s+/g, "-")}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (fallbackErr) {
        alert("No se pudo descargar el QR. Haz clic derecho en el QR de la pantalla y guárdalo.");
      }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start animate-in fade-in duration-500 pb-16">
      
      {/* LEFT COLUMN: Customizer Form */}
      <div className="lg:col-span-2 space-y-8">
        
        {/* Appearance (Logo & Background) */}
        <div className="bg-white p-8 rounded-[36px] border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <Sparkles className="w-7 h-7 text-emerald-600" />
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Apariencia y Multimedia</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Logo upload */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 block">Logotipo del Local</label>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden flex items-center justify-center text-3xl shadow-inner relative flex-shrink-0">
                  {logo ? <img src={logo} className="w-full h-full object-cover" /> : "🏢"}
                  {logo && (
                    <button type="button" onClick={() => setLogo("")} className="absolute -top-1.5 -right-1.5 p-1 bg-red-100 hover:bg-red-200 text-red-600 rounded-full transition-colors">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <label className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-5 py-3 rounded-xl font-bold text-xs cursor-pointer transition-colors flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-slate-500" /> Subir Logo
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageChange(e, setLogo)} />
                </label>
              </div>
            </div>

            {/* Custom background image */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 block">Fondo de Portada Web</label>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden flex items-center justify-center text-3xl shadow-inner relative flex-shrink-0">
                  {bgImage ? <img src={bgImage} className="w-full h-full object-cover" /> : "🏟️"}
                  {bgImage && (
                    <button type="button" onClick={() => setBgImage("")} className="absolute -top-1.5 -right-1.5 p-1 bg-red-100 hover:bg-red-200 text-red-600 rounded-full transition-colors">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <label className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-5 py-3 rounded-xl font-bold text-xs cursor-pointer transition-colors flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-slate-500" /> Subir Portada
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageChange(e, setBgImage)} />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Beverages and Snacks (Cantina) */}
        <div className="bg-white p-8 rounded-[36px] border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <Coffee className="w-7 h-7 text-amber-600" />
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Bar & Cafetería (Bebidas y Pikeos)</h3>
          </div>
          
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2 block">Nombre del Producto</label>
                <input type="text" placeholder="Ej. Gatorade Fresa" value={bevName} onChange={(e) => setBevName(e.target.value)} className="w-full bg-white border border-slate-200 p-3.5 rounded-xl focus:outline-none font-bold text-sm" />
              </div>
              
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2 block">Precio (S/)</label>
                <input type="number" placeholder="Ej. 6.00" value={bevPrice} onChange={(e) => setBevPrice(e.target.value)} className="w-full bg-white border border-slate-200 p-3.5 rounded-xl focus:outline-none font-bold text-sm" />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2 block">Icono / Categoría</label>
                <select value={bevIcon} onChange={(e) => setBevIcon(e.target.value)} className="w-full bg-white border border-slate-200 p-3.5 rounded-xl focus:outline-none font-bold text-sm appearance-none cursor-pointer">
                  <option value="🥤">🥤 Bebida fría</option>
                  <option value="💧">💧 Agua pura</option>
                  <option value="🍿">🍿 Snacks / Pikeos</option>
                  <option value="🍪">🍪 Galletas</option>
                  <option value="🍕">🍕 Fast Food</option>
                  <option value="⚡">⚡ Energizante</option>
                  <option value="🍺">🍺 Cerveza / Caja</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
              <div className="sm:col-span-2 space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2 block">Descripción del Producto (Opcional)</label>
                <input type="text" placeholder="Ej. Presentación helada de 750ml o caja de 12 unidades." value={bevDesc} onChange={(e) => setBevDesc(e.target.value)} className="w-full bg-white border border-slate-200 p-3.5 rounded-xl focus:outline-none font-bold text-sm" />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2 block">Foto del Producto (Opcional)</label>
                <label className="bg-white border border-slate-200 p-3.5 rounded-[12px] border-slate-200 border-2 p-3 rounded-xl font-bold text-xs cursor-pointer transition-colors flex items-center justify-between">
                  <span className="text-slate-400 truncate max-w-[120px]">{bevImage ? "Foto Cargada" : "Subir Foto"}</span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageChange(e, setBevImage)} />
                  <ImageIcon className="w-4 h-4 text-slate-400" />
                </label>
              </div>
            </div>

            <div className="flex justify-end">
              <button type="button" onClick={handleAddBeverage} className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-emerald-600/10 active:scale-95 flex items-center gap-2">
                <Plus className="w-5 h-5" /> Agregar Producto
              </button>
            </div>
          </div>

          <div className="space-y-2">
            {beverages.map(item => (
              <div key={item.id} className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white rounded-2xl border ${item.active === false ? 'border-dashed border-slate-200 opacity-60' : 'border-slate-100'} shadow-sm hover:border-emerald-200 transition-colors gap-4`}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-slate-50 rounded-xl overflow-hidden flex items-center justify-center relative flex-shrink-0 border border-slate-100">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-2xl">{item.icon}</span>
                    )}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-black text-slate-800 text-sm">{item.name}</span>
                      {item.active === false ? (
                        <span className="bg-slate-100 text-slate-500 font-black text-[8px] px-2 py-0.5 rounded uppercase tracking-wider">Inactivo</span>
                      ) : (
                        <span className="bg-emerald-50 text-emerald-600 font-black text-[8px] px-2 py-0.5 rounded uppercase tracking-wider">Activo</span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-400 font-medium mt-0.5">{item.description || "Sin descripción"}</div>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-50">
                  <span className="font-black text-slate-900 text-sm">S/ {Number(item.price).toFixed(2)}</span>
                  <div className="flex items-center gap-2">
                    <button 
                      type="button" 
                      onClick={() => handleToggleBeverageActive(item.id)} 
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-colors ${
                        item.active === false 
                          ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600' 
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                      }`}
                    >
                      {item.active === false ? "Activar" : "Desactivar"}
                    </button>
                    <button type="button" onClick={() => handleRemoveBeverage(item.id)} className="p-1.5 text-slate-400 hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {beverages.length === 0 && (
              <p className="text-center py-6 text-slate-400 text-xs font-bold border border-dashed border-slate-200 rounded-2xl">No has agregado bebidas ni pikeos aún.</p>
            )}
          </div>
        </div>

        {/* Discounts & Promotions */}
        <div className="bg-white p-8 rounded-[36px] border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <Percent className="w-7 h-7 text-blue-600" />
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Descuentos y Promociones Activas</h3>
          </div>
          
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2 block">Título de la Promoción</label>
                <input type="text" placeholder="Ej. Lunes de 2x1" value={promoTitle} onChange={(e) => setPromoTitle(e.target.value)} className="w-full bg-white border border-slate-200 p-3.5 rounded-xl focus:outline-none font-bold text-sm" />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2 block">Descuento Destacado</label>
                <input type="text" placeholder="Ej. 20% OFF o S/ 40/hora" value={promoDiscount} onChange={(e) => setPromoDiscount(e.target.value)} className="w-full bg-white border border-slate-200 p-3.5 rounded-xl focus:outline-none font-bold text-sm" />
              </div>
            </div>
            
            <div className="flex gap-2 items-end">
              <div className="flex-1 space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2 block">Descripción / Condiciones</label>
                <input type="text" placeholder="Ej. Válido los lunes de 8 AM a 2 PM reservando hoy" value={promoDesc} onChange={(e) => setPromoDesc(e.target.value)} className="w-full bg-white border border-slate-200 p-3.5 rounded-xl focus:outline-none font-bold text-sm" />
              </div>
              <button type="button" onClick={handleAddPromo} className="bg-emerald-600 hover:bg-emerald-700 text-white p-3.5 rounded-xl font-bold transition-all shadow-lg shadow-emerald-600/10 active:scale-95 flex-shrink-0">
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="space-y-2">
            {promotions.map(item => (
              <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:border-emerald-200 transition-colors gap-3">
                <div>
                  <div className="font-black text-slate-800 text-sm">{item.title}</div>
                  <div className="text-[10px] text-slate-500 font-bold mt-0.5">{item.description}</div>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-50">
                  {item.discount && <span className="bg-blue-50 text-blue-600 border border-blue-100 px-3 py-1 rounded-lg text-xs font-black">{item.discount}</span>}
                  <button type="button" onClick={() => handleRemovePromo(item.id)} className="p-1 text-slate-400 hover:text-red-500 transition-colors ml-auto sm:ml-0">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            {promotions.length === 0 && (
              <p className="text-center py-6 text-slate-400 text-xs font-bold border border-dashed border-slate-200 rounded-2xl">No has configurado promociones aún.</p>
            )}
          </div>
        </div>

        {/* Sponsorships & Academy Ads */}
        <div className="bg-white p-8 rounded-[36px] border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <Award className="w-7 h-7 text-purple-600" />
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Publicidad, Academias y Menores</h3>
          </div>
          
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2 block">Título del Anuncio / Academia</label>
                <input type="text" placeholder="Ej. Escuela de Fútbol de Menores" value={sponTitle} onChange={(e) => setSponTitle(e.target.value)} className="w-full bg-white border border-slate-200 p-3.5 rounded-xl focus:outline-none font-bold text-sm" />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2 block">Banner / Imagen del Auspicio (Opcional)</label>
                <label className="bg-white border border-slate-200 p-3 rounded-xl font-bold text-xs cursor-pointer transition-colors flex items-center justify-between">
                  <span className="text-slate-400 truncate max-w-[150px]">{sponImage ? "Imagen Cargada" : "Seleccionar Foto"}</span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageChange(e, setSponImage)} />
                  <ImageIcon className="w-4 h-4 text-slate-400" />
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2 block">Precio / Mensualidad / Matrícula (Opcional)</label>
                <input type="text" placeholder="Ej. S/ 50 por mes o S/ 15 la clase" value={sponPrice} onChange={(e) => setSponPrice(e.target.value)} className="w-full bg-white border border-slate-200 p-3.5 rounded-xl focus:outline-none font-bold text-sm" />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2 block">Horario / Días de Entrenamiento (Opcional)</label>
                <input type="text" placeholder="Ej. Martes y Jueves 4:00 PM - 6:00 PM" value={sponSchedule} onChange={(e) => setSponSchedule(e.target.value)} className="w-full bg-white border border-slate-200 p-3.5 rounded-xl focus:outline-none font-bold text-sm" />
              </div>
            </div>
            
            <div className="flex gap-2 items-end">
              <div className="flex-1 space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2 block">Descripción / Condiciones de la Academia / Auspicio</label>
                <input type="text" placeholder="Ej. Entrenamientos para niños de 6 a 14 años. Descuento del 10% para socios." value={sponDesc} onChange={(e) => setSponDesc(e.target.value)} className="w-full bg-white border border-slate-200 p-3.5 rounded-xl focus:outline-none font-bold text-sm" />
              </div>
              <button type="button" onClick={handleAddSponsorship} className="bg-emerald-600 hover:bg-emerald-700 text-white p-3.5 rounded-xl font-bold transition-all shadow-lg shadow-emerald-600/10 active:scale-95 flex-shrink-0">
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {sponsorships.map(item => (
              <div key={item.id} className="bg-white rounded-3xl border border-slate-150 shadow-sm overflow-hidden flex flex-col hover:border-emerald-300 transition-all">
                {item.image && (
                  <div className="aspect-[2/1] w-full bg-slate-50 relative overflow-hidden">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="font-black text-slate-800 text-sm">{item.title}</div>
                    <div className="text-[10px] text-slate-500 font-bold line-clamp-3">{item.description}</div>
                    
                    {/* Price & Schedule badges */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      {item.price && (
                        <span className="bg-purple-50 text-purple-700 font-black text-[9px] px-2.5 py-1 rounded-lg border border-purple-100">
                          💰 Costo: {item.price}
                        </span>
                      )}
                      {item.schedule && (
                        <span className="bg-blue-50 text-blue-700 font-black text-[9px] px-2.5 py-1 rounded-lg border border-blue-100">
                          📅 Horario: {item.schedule}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-end mt-4 pt-3 border-t border-slate-50">
                    <button type="button" onClick={() => handleRemoveSponsorship(item.id)} className="inline-flex items-center gap-1 text-xs font-bold text-red-500 hover:text-red-600 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" /> Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {sponsorships.length === 0 && (
              <div className="col-span-full text-center py-6 text-slate-400 text-xs font-bold border border-dashed border-slate-200 rounded-2xl">No has cargado banners publicitarios ni academias aún.</div>
            )}
          </div>
        </div>

        {/* Global Save Button */}
        <div className="flex justify-end pt-4">
          <button 
            type="button" 
            onClick={handleSaveAll}
            disabled={loading}
            className="w-full sm:w-auto bg-emerald-600 text-white font-black px-12 py-6 rounded-[30px] text-xl shadow-2xl shadow-emerald-600/40 hover:bg-emerald-700 transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6" />}
            Guardar todo y Actualizar Web
          </button>
        </div>

      </div>

      {/* RIGHT COLUMN: Marketing QR Center */}
      <div className="space-y-8">
        
        {/* QR Code Center */}
        <div className="bg-slate-900 p-8 rounded-[40px] text-white shadow-2xl relative overflow-hidden group border border-slate-800 flex flex-col items-center text-center space-y-6">
          <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl" />
          
          <div className="space-y-2">
            <span className="text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 px-3 py-1.5 rounded-full uppercase tracking-wider">
              Centro de Marketing QR
            </span>
            <h3 className="text-2xl font-black tracking-tight mt-3">QR de tu Página Web</h3>
            <p className="text-xs text-slate-400 font-bold max-w-xs leading-relaxed">
              Tus clientes podrán escanear este código con su celular para abrir tu web de reservas al instante.
            </p>
          </div>

          {/* QR Image visual wrapper */}
          <div className="bg-white p-5 rounded-[32px] shadow-2xl relative group-hover:scale-[1.02] transition-transform duration-300">
            <img src={qrUrl} alt="Código QR CanchaSync" className="w-48 h-48 rounded-xl" />
          </div>

          <div className="space-y-3 w-full">
            <button 
              onClick={downloadQR}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-black text-sm transition-all shadow-xl shadow-emerald-600/20 flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" /> Descargar QR Impresora
            </button>
            
            <a 
              href={publicUrl} 
              target="_blank" 
              className="w-full border-2 border-slate-800 hover:border-slate-700 hover:bg-slate-800 text-slate-300 py-3.5 rounded-2xl font-black text-xs transition-all flex items-center justify-center gap-2"
            >
              <Globe className="w-4 h-4" /> Ver Página en Vivo
            </a>
          </div>
        </div>

        {/* Marketing tip card */}
        <div className="bg-white p-8 rounded-[36px] border border-slate-200 shadow-sm space-y-4">
          <h4 className="font-black text-slate-900 text-lg">💡 Consejo de Marketing</h4>
          <p className="text-xs text-slate-500 leading-relaxed font-medium">
            Imprime tu código QR y colócalo en la recepción de tu local, en el bar o en los chalecos. De esta manera, tus clientes habituales podrán reservar por sí mismos su cancha la próxima vez sin tener que llamarte.
          </p>
        </div>

      </div>

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
