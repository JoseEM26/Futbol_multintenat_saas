import Image from "next/image";
import Link from "next/link";
import { TenantRegistrationForm } from "@/components/landing/TenantRegistrationForm";
import { Trophy, Check, ArrowLeft } from "lucide-react";

export default function RegistroPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col lg:flex-row overflow-hidden font-sans">
      {/* Left Side: Info & Branding */}
      <div className="lg:w-5/12 relative hidden lg:flex flex-col p-16 justify-between overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src="/assets/landing_bg.png" 
            alt="Fútbol Premium" 
            fill 
            className="object-cover brightness-[0.3]"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 to-transparent" />
        </div>

        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-3 group mb-12">
            <Image src="/logo.png" alt="Logo" width={48} height={48} className="rounded-2xl shadow-2xl" />
            <span className="text-3xl font-black text-white tracking-tight">CanchaSync</span>
          </Link>

          <div className="space-y-8">
            <h1 className="text-5xl font-black text-white leading-tight">
              Lleva tu complejo al <span className="text-emerald-500">siguiente nivel.</span>
            </h1>
            <p className="text-xl text-slate-300 font-medium leading-relaxed">
              Únete a la red de gestión deportiva más avanzada. Registra tu local hoy y disfruta de todos los beneficios premium gratis por 30 días.
            </p>
          </div>
        </div>

        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-5 rounded-[32px] backdrop-blur-md">
            <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <p className="text-white font-bold">Plan Trial de 30 Días</p>
              <p className="text-slate-400 text-sm font-medium">Acceso total sin compromisos.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <FeatureItem text="Hasta 2 Canchas" />
            <FeatureItem text="Reservas 24/7" />
            <FeatureItem text="Control de Pagos" />
            <FeatureItem text="Soporte VIP" />
          </div>
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="flex-1 bg-white flex items-center justify-center p-6 lg:p-20 relative overflow-y-auto">
        <div className="absolute top-8 left-8 lg:hidden">
           <Link href="/" className="flex items-center gap-2 text-slate-900 font-black">
              <ArrowLeft className="w-5 h-5" /> Volver
           </Link>
        </div>
        
        <div className="w-full max-w-xl animate-in fade-in slide-in-from-right-8 duration-500">
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-4xl font-black text-slate-900 mb-4">Crea tu Complejo Deportivo</h2>
            <p className="text-slate-500 font-medium">Configura tu perfil de administrador y empieza a gestionar.</p>
          </div>
          
          <TenantRegistrationForm />

          <div className="mt-10 text-center">
            <p className="text-slate-500 font-bold">
              ¿Ya tienes una cuenta?{" "}
              <Link href="/login" className="text-emerald-600 hover:text-emerald-700 underline decoration-emerald-500/30">
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2 text-slate-400 font-medium">
      <Check className="w-4 h-4 text-emerald-500" />
      <span className="text-sm">{text}</span>
    </div>
  );
}
