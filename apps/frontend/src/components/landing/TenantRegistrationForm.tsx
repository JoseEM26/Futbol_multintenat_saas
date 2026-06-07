"use client";

import { useState } from "react";
import Link from "next/link";
import { User, Mail, Building, Star, CheckCircle2, Lock, Loader2, CreditCard, ArrowRight, ShieldCheck } from "lucide-react";
import { registerTenantAction } from "@/app/actions/tenant";
import { CustomModal } from "@/components/ui/CustomModal";

export function TenantRegistrationForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [modal, setModal] = useState({ isOpen: false, title: "", message: "", type: "error" as any });
  const [dniValue, setDniValue] = useState("");

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
        message: result.error || "Ocurrió un error inesperado.",
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
        <h3 className="text-4xl font-black text-slate-900 mb-3">¡Todo listo!</h3>
        <p className="text-slate-500 font-medium mb-8 text-base leading-relaxed">
          Tu complejo ha sido creado. Tienes <span className="text-emerald-600 font-black">30 días gratis</span> para configurar tus canchas y recibir reservas.
        </p>
        <Link href="/login" className="flex items-center justify-center gap-3 w-full bg-slate-900 text-white font-black py-5 rounded-2xl text-lg shadow-xl hover:bg-slate-800 transition-all active:scale-[0.98]">
          Ir al Panel de Control <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[40px] shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="bg-linear-to-br from-emerald-600 to-emerald-700 p-8 relative">
        <div className="absolute top-4 right-4 bg-amber-400 text-amber-900 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow">
          S/ 0.00 · Gratis
        </div>
        <div className="flex items-center gap-3 mb-1">
          <div className="bg-white/20 p-2 rounded-xl">
            <Star className="w-5 h-5 text-white fill-current" />
          </div>
          <span className="text-emerald-100 text-xs font-black uppercase tracking-widest">Prueba 30 días</span>
        </div>
        <h3 className="text-2xl font-black text-white">Empieza tu Prueba Gratuita</h3>
        <p className="text-emerald-100/80 text-sm mt-1 font-medium">Sin tarjeta de crédito. Sin compromisos.</p>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-5">
        {/* Sección: Tus datos */}
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
            <span className="bg-slate-100 text-slate-500 w-4 h-4 rounded-full flex items-center justify-center text-[9px]">1</span>
            Tus Datos Personales
          </p>
          <div className="space-y-3">
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
              <input
                name="name"
                required
                placeholder="Tu nombre completo"
                disabled={loading}
                className="w-full bg-slate-50 border-2 border-transparent p-4 pl-11 rounded-2xl focus:outline-none focus:border-emerald-400 focus:bg-white font-semibold text-slate-800 placeholder:text-slate-300 transition-all text-sm disabled:opacity-50"
              />
            </div>
            <div className="relative group">
              <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
              <input
                name="dni"
                required
                inputMode="numeric"
                maxLength={8}
                value={dniValue}
                onChange={(e) => setDniValue(e.target.value.replace(/\D/g, "").slice(0, 8))}
                placeholder="DNI (8 dígitos) — tu usuario de acceso"
                disabled={loading}
                className="w-full bg-slate-50 border-2 border-transparent p-4 pl-11 rounded-2xl focus:outline-none focus:border-emerald-400 focus:bg-white font-semibold text-slate-800 placeholder:text-slate-300 transition-all text-sm disabled:opacity-50"
              />
              {dniValue.length > 0 && dniValue.length < 8 && (
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-amber-500 font-black">{dniValue.length}/8</span>
              )}
              {dniValue.length === 8 && (
                <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
              )}
            </div>
          </div>
        </div>

        {/* Sección: Tu complejo */}
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
            <span className="bg-slate-100 text-slate-500 w-4 h-4 rounded-full flex items-center justify-center text-[9px]">2</span>
            Tu Complejo Deportivo
          </p>
          <div className="space-y-3">
            <div className="relative group">
              <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
              <input
                name="tenantName"
                required
                placeholder="Nombre del complejo (Ej. Maracaná FC)"
                disabled={loading}
                className="w-full bg-slate-50 border-2 border-transparent p-4 pl-11 rounded-2xl focus:outline-none focus:border-emerald-400 focus:bg-white font-semibold text-slate-800 placeholder:text-slate-300 transition-all text-sm disabled:opacity-50"
              />
            </div>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
              <input
                name="contactEmail"
                type="email"
                placeholder="Correo de contacto (opcional)"
                disabled={loading}
                className="w-full bg-slate-50 border-2 border-transparent p-4 pl-11 rounded-2xl focus:outline-none focus:border-emerald-400 focus:bg-white font-semibold text-slate-800 placeholder:text-slate-300 transition-all text-sm disabled:opacity-50"
              />
            </div>
          </div>
        </div>

        {/* Contraseña */}
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
            <span className="bg-slate-100 text-slate-500 w-4 h-4 rounded-full flex items-center justify-center text-[9px]">3</span>
            Seguridad
          </p>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
            <input
              name="password"
              type="password"
              required
              minLength={8}
              placeholder="Contraseña (mínimo 8 caracteres)"
              disabled={loading}
              className="w-full bg-slate-50 border-2 border-transparent p-4 pl-11 rounded-2xl focus:outline-none focus:border-emerald-400 focus:bg-white font-semibold text-slate-800 placeholder:text-slate-300 transition-all text-sm disabled:opacity-50"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || dniValue.length !== 8}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-5 rounded-2xl text-base shadow-lg shadow-emerald-600/25 transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>Crear mi complejo gratis <ArrowRight className="w-5 h-5" /></>
          )}
        </button>

        <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest pt-1">
          <ShieldCheck className="w-3.5 h-3.5" />
          Datos protegidos · Sin spam
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
