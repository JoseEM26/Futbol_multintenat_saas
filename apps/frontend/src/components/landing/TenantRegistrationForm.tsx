"use client";

import { useState } from "react";
import Link from "next/link";
import { User, Mail, Building, Star, CheckCircle2, Lock, Loader2 } from "lucide-react";
import { registerTenantAction } from "@/app/actions/tenant";
import { CustomModal } from "@/components/ui/CustomModal";

export function TenantRegistrationForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [modal, setModal] = useState({ isOpen: false, title: "", message: "", type: "error" as any });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const result = await registerTenantAction(formData);
    
    if (result.success) {
      setSuccess(true);
    } else {
      setModal({
        isOpen: true,
        title: "Error en el Registro",
        message: result.error || "Ocurrió un error inesperado al procesar tu solicitud.",
        type: "error"
      });
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="bg-white p-10 rounded-[40px] shadow-2xl text-center animate-in zoom-in duration-500">
        <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-[30px] flex items-center justify-center mx-auto mb-8 shadow-inner">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        <h3 className="text-4xl font-black text-slate-900 mb-4">¡Todo listo!</h3>
        <p className="text-slate-600 font-medium mb-10 text-lg leading-relaxed">
          Tu complejo deportivo ha sido creado con éxito. Ahora tienes 30 días de acceso premium para configurar tus canchas y empezar a recibir reservas.
        </p>
        <Link href="/login" className="block w-full bg-slate-900 text-white font-black py-5 rounded-3xl text-xl shadow-xl shadow-slate-900/20 hover:bg-slate-800 transition-all active:scale-[0.98]">
          Ir al Panel de Control
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white p-10 rounded-[40px] shadow-2xl relative border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="absolute -top-6 -right-6 bg-amber-500 text-white p-5 rounded-3xl shadow-xl font-black rotate-12 flex items-center gap-2 z-10">
        <Star className="w-6 h-6 fill-current" /> S/ 0.00
      </div>
      <h3 className="text-3xl font-black text-slate-900 mb-8">Empieza tu Prueba Gratuita</h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-2 block">Tu Nombre</label>
          <div className="relative group">
            <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
            <input name="name" required placeholder="Ej. Juan Perez" className="w-full bg-slate-50 border-2 border-slate-50 p-5 pl-14 rounded-3xl focus:outline-none focus:border-emerald-500/50 focus:bg-white font-bold transition-all disabled:opacity-50" disabled={loading} />
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-2 block">DNI / Documento de Identidad</label>
          <div className="relative group">
            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
            <input name="email" type="text" required placeholder="Ej. 71234567 o tu@correo.com" className="w-full bg-slate-50 border-2 border-slate-50 p-5 pl-14 rounded-3xl focus:outline-none focus:border-emerald-500/50 focus:bg-white font-bold transition-all disabled:opacity-50" disabled={loading} />
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-2 block">Nombre de tu Complejo</label>
          <div className="relative group">
            <Building className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
            <input name="tenantName" required placeholder="Ej. Maracaná Fútbol Club" className="w-full bg-slate-50 border-2 border-slate-50 p-5 pl-14 rounded-3xl focus:outline-none focus:border-emerald-500/50 focus:bg-white font-bold transition-all disabled:opacity-50" disabled={loading} />
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-2 block">Contraseña</label>
          <div className="relative group">
            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
            <input name="password" type="password" required placeholder="Mínimo 8 caracteres" className="w-full bg-slate-50 border-2 border-slate-50 p-5 pl-14 rounded-3xl focus:outline-none focus:border-emerald-500/50 focus:bg-white font-bold transition-all disabled:opacity-50" disabled={loading} />
          </div>
        </div>
        <button type="submit" disabled={loading} className="w-full bg-emerald-600 text-white font-black py-6 rounded-3xl text-xl shadow-xl shadow-emerald-600/20 hover:bg-emerald-700 transition-all active:scale-[0.98] mt-4 disabled:opacity-50 flex items-center justify-center gap-3">
          {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Empezar ahora gratis"}
        </button>
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
