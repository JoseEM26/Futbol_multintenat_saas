"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { CreditCard, Lock, LogIn, ArrowLeft, Loader2, ShieldCheck, UserPlus } from "lucide-react";
import { CustomModal } from "@/components/ui/CustomModal";

export default function LoginPage() {
  const router = useRouter();
  const [dni, setDni] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorModal, setErrorModal] = useState({ isOpen: false, title: "", message: "" });

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("error") === "inactive") {
        setErrorModal({
          isOpen: true,
          title: "Cuenta Inhabilitada",
          message: "Tu cuenta ha sido inhabilitada temporalmente. Contacta con soporte si crees que es un error."
        });
      }
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedDni = dni.trim();

    if (!trimmedDni || !password) {
      setErrorModal({ isOpen: true, title: "Campos Incompletos", message: "Ingresa tu DNI y contraseña para continuar." });
      return;
    }

    // Permitir super admin con email real, o login con DNI
    const isEmail = trimmedDni.includes("@");
    if (!isEmail && !/^\d{8}$/.test(trimmedDni)) {
      setErrorModal({ isOpen: true, title: "DNI Inválido", message: "El DNI debe tener exactamente 8 dígitos." });
      return;
    }

    const loginEmail = isEmail ? trimmedDni : `${trimmedDni}@canchasync.app`;

    setLoading(true);
    try {
      const { error } = await authClient.signIn.email({
        email: loginEmail,
        password,
        callbackURL: "/dashboard",
      });

      if (error) {
        setErrorModal({
          isOpen: true,
          title: "Acceso Denegado",
          message: "El DNI o la contraseña no son correctos. Verifica e intenta de nuevo."
        });
      } else {
        router.push("/dashboard");
      }
    } catch {
      setErrorModal({
        isOpen: true,
        title: "Error de Conexión",
        message: "No pudimos conectar con el servidor. Verifica tu internet e intenta de nuevo."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-6 font-sans overflow-hidden bg-slate-950">
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/login_bg.png"
          alt="Soccer Stadium Background"
          fill
          className="object-cover brightness-[0.4] scale-105"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-transparent to-slate-950/50" />
      </div>

      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 blur-[120px] rounded-full animate-pulse delay-700" />

      <Link
        href="/"
        className="absolute top-10 left-10 z-20 flex items-center gap-2 text-white/70 hover:text-white font-bold transition-all hover:-translate-x-1"
      >
        <ArrowLeft className="w-5 h-5" /> Volver al Inicio
      </Link>

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/95 backdrop-blur-xl rounded-[48px] shadow-2xl border border-white/20 overflow-hidden animate-in fade-in zoom-in duration-500">
          {/* Header */}
          <div className="bg-linear-to-br from-slate-900 to-slate-800 p-8 text-center">
            <div className="inline-flex p-3 rounded-[20px] bg-white/10 mb-4">
              <Image src="/logo.png" alt="CanchaSync Logo" width={48} height={48} className="rounded-xl" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">¡Bienvenido de nuevo!</h1>
            <p className="text-slate-400 text-sm font-medium mt-1">Accede con tu DNI y contraseña</p>
          </div>

          <form onSubmit={handleLogin} className="p-8 space-y-5">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 block">
                DNI
              </label>
              <div className="relative group">
                <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={8}
                  value={dni}
                  onChange={(e) => setDni(e.target.value.replace(/\D/g, "").slice(0, 8))}
                  placeholder="Tu DNI de 8 dígitos"
                  disabled={loading}
                  className="w-full bg-slate-50 border-2 border-slate-100 p-4 pl-11 rounded-2xl focus:outline-none focus:border-emerald-400 focus:bg-white transition-all font-bold text-slate-900 text-sm placeholder:text-slate-300 disabled:opacity-50"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  Contraseña
                </label>
                <Link href="#" className="text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:text-emerald-700 transition-colors">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={loading}
                  className="w-full bg-slate-50 border-2 border-slate-100 p-4 pl-11 rounded-2xl focus:outline-none focus:border-emerald-400 focus:bg-white transition-all font-bold text-slate-900 text-sm placeholder:text-slate-300 disabled:opacity-50"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white p-4 rounded-2xl font-black text-base shadow-lg shadow-emerald-600/25 hover:shadow-emerald-600/40 transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <><LogIn className="w-5 h-5" /> Iniciar Sesión</>
              )}
            </button>
          </form>

          <div className="px-8 pb-8 space-y-4">
            <div className="border-t border-slate-100 pt-6 text-center">
              <p className="text-slate-500 text-sm font-bold mb-3">¿Aún no tienes tu complejo registrado?</p>
              <Link
                href="/registro"
                className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-6 py-3 rounded-2xl font-black text-sm hover:bg-emerald-100 transition-all group"
              >
                <UserPlus className="w-4 h-4 group-hover:scale-110 transition-transform" />
                Crea tu complejo gratis
              </Link>
            </div>
            <div className="flex justify-center items-center gap-2 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">
              <ShieldCheck className="w-3.5 h-3.5" />
              Acceso Seguro SSL Encriptado
            </div>
          </div>
        </div>
      </div>

      <CustomModal
        isOpen={errorModal.isOpen}
        onClose={() => setErrorModal({ ...errorModal, isOpen: false })}
        title={errorModal.title}
        message={errorModal.message}
        type="error"
      />
    </div>
  );
}
