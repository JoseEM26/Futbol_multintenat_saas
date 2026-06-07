"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Mail, Lock, LogIn, ArrowLeft, Loader2, ShieldCheck, UserPlus } from "lucide-react";
import { CustomModal } from "@/components/ui/CustomModal";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
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
          message: "Tu cuenta ha sido inhabilitada temporalmente por el administrador. Ponte en contacto con soporte si crees que esto es un error."
        });
      }
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorModal({
        isOpen: true,
        title: "Campos Incompletos",
        message: "Por favor, ingresa tu DNI o correo electrónico y contraseña para continuar."
      });
      return;
    }

    setLoading(true);
    try {
      let loginEmail = email.trim();
      if (/^\d+$/.test(loginEmail)) {
        loginEmail = `${loginEmail}@canchapro.local`;
      }

      const { data, error } = await authClient.signIn.email({
        email: loginEmail,
        password,
        callbackURL: "/dashboard",
      });

      if (error) {
        setErrorModal({
          isOpen: true,
          title: "Acceso Denegado",
          message: error.message || "El DNI/correo o la contraseña no coinciden con nuestros registros."
        });
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      setErrorModal({
        isOpen: true,
        title: "Error de Conexión",
        message: "No pudimos conectar con el servidor. Por favor, verifica tu internet e inténtalo de nuevo."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-6 font-sans overflow-hidden bg-slate-950">
      {/* 4K Background Image */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/assets/login_bg.png" 
          alt="Soccer Stadium Background" 
          fill 
          className="object-cover brightness-[0.4] scale-105"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/50" />
      </div>

      {/* Floating Elements for "Fluid" feel */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 blur-[120px] rounded-full animate-pulse delay-700" />

      <Link 
        href="/" 
        className="absolute top-10 left-10 z-20 flex items-center gap-2 text-white/70 hover:text-white font-bold transition-all hover:-translate-x-1"
      >
        <ArrowLeft className="w-5 h-5" /> Volver al Inicio
      </Link>

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/95 backdrop-blur-xl rounded-[48px] p-10 shadow-2xl border border-white/20 animate-in fade-in zoom-in duration-500">
          <div className="text-center mb-10">
            <div className="inline-flex p-4 rounded-[28px] bg-emerald-50 mb-6 shadow-inner">
              <Image src="/logo.png" alt="CanchaSync Logo" width={56} height={56} className="rounded-2xl shadow-sm" />
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">¡Bienvenido de nuevo!</h1>
            <p className="text-slate-500 font-medium">Gestiona tu complejo deportivo con CanchaSync.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-4 mb-2 block">
                DNI o Correo Electrónico
              </label>
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <input 
                  type="text" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Ej. 71234567 o tu@correo.com"
                  className="w-full bg-slate-50 border-2 border-slate-100 p-5 pl-14 rounded-[24px] focus:outline-none focus:border-emerald-500/50 focus:bg-white transition-all font-bold text-slate-900"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center px-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  Contraseña
                </label>
                <Link href="#" className="text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:text-emerald-700 transition-colors">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border-2 border-slate-100 p-5 pl-14 rounded-[24px] focus:outline-none focus:border-emerald-500/50 focus:bg-white transition-all font-bold text-slate-900"
                  disabled={loading}
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white p-5 rounded-[24px] font-black text-lg shadow-xl shadow-slate-900/20 hover:shadow-slate-900/40 transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  <LogIn className="w-6 h-6" />
                  Iniciar Sesión
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-10 border-t border-slate-100 text-center">
            <p className="text-slate-500 font-bold mb-4">¿Aún no tienes tu complejo registrado?</p>
            <Link 
              href="/registro" 
              className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-8 py-3 rounded-2xl font-black hover:bg-emerald-100 transition-all group"
            >
              <UserPlus className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Crea tu complejo deportivo gratis
            </Link>
          </div>

          <div className="mt-8 flex justify-center items-center gap-2 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">
            <ShieldCheck className="w-4 h-4" />
            Acceso Seguro SSL Encriptado
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
