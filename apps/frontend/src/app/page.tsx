import Image from "next/image";
import Link from "next/link";
import { prisma } from "@cancha/database";
import { CalendarCheck, Shield, Zap, Trophy, MapPin, Star, Check, Phone, Mail, User, Building, ArrowRight } from "lucide-react";
import { TenantRegistrationForm } from "@/components/landing/TenantRegistrationForm";

export const dynamic = "force-dynamic";

export default async function LandingPage() {
  const canchas = await prisma.cancha.findMany({
    include: { 
      tenant: true,
      details: true
    },
    orderBy: { createdAt: 'desc' },
    take: 6
  });

  const planes = await prisma.plan.findMany({
    orderBy: { price: "asc" }
  });

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-emerald-500/30 font-sans scroll-smooth">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 z-50 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <Image src="/logo.png" alt="CanchaSync Logo" width={40} height={40} className="rounded-xl shadow-sm group-hover:scale-105 transition-transform" />
            <span className="text-2xl font-extrabold tracking-tight text-slate-900">
              Cancha<span className="text-emerald-600">Sync</span>
            </span>
          </Link>
          <div className="flex items-center gap-6">
            <a href="#planes" className="hidden md:block text-sm font-bold text-slate-600 hover:text-emerald-600 transition-colors">Planes</a>
            <a href="#registro" className="hidden md:block text-sm font-bold text-slate-600 hover:text-emerald-600 transition-colors">Prueba Gratis</a>
            <div className="h-6 w-px bg-slate-200 hidden md:block"></div>
            <Link href="/login" className="text-sm font-bold text-slate-600 hover:text-emerald-600 transition-colors">
              Iniciar Sesión
            </Link>
            <Link href="/login" className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/40 transition-all hover:-translate-y-0.5">
              Administrar
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden min-h-[90vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <Image 
            src="/assets/landing_bg.png" 
            alt="Cancha de fútbol premium" 
            fill 
            className="object-cover object-center brightness-[0.5]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/40 to-transparent" />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-sm mb-8 border border-emerald-500/30 backdrop-blur-md">
              <Trophy className="w-4 h-4" />
              SaaS N°1 para Complejos Deportivos en Perú
            </div>
            <h1 className="text-5xl md:text-8xl font-black text-white tracking-tight mb-8 leading-[1]">
              Domina la cancha, <span className="text-emerald-500">digitaliza tu éxito.</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 mb-10 font-medium leading-relaxed">
              La plataforma Multitena más potente para gestionar tus canchas de fútbol. Reservas en tiempo real, pagos seguros y control total de tu negocio.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <a href="#registro" className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-10 py-5 rounded-2xl text-lg font-black shadow-2xl shadow-emerald-600/40 transition-all hover:-translate-y-1 flex items-center justify-center gap-2">
                Empieza Gratis un Mes <ArrowRight className="w-5 h-5" />
              </a>
              <a href="#canchas" className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-md px-10 py-5 rounded-2xl text-lg font-black transition-all hover:-translate-y-1 text-center">
                Ver Complejos
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-emerald-600 relative z-10 -mt-10 mx-6 rounded-3xl shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          <StatCard number="50+" label="Complejos" />
          <StatCard number="5000+" label="Jugadores" />
          <StatCard number="10k+" label="Reservas" />
          <StatCard number="100%" label="Seguro" />
        </div>
      </section>

      {/* Social Proof / Complexes Section */}
      <section id="canchas" className="py-32 bg-slate-50 animate-in fade-in duration-1000">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Complejos que confían en nosotros</h2>
              <p className="text-slate-500 mt-4 text-xl font-medium">Únete a la red más grande de canchas digitalizadas en todo el país.</p>
            </div>
            <Link href="/registro" className="text-emerald-600 font-black flex items-center gap-2 hover:gap-3 transition-all">
              Registrar mi complejo <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {complexes.map((complex) => (
              <Link href={`/c/${complex.slug || complex.id}`} key={complex.id} className="group bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 hover:-translate-y-2">
                <div className="aspect-[16/10] bg-slate-100 relative overflow-hidden">
                  {complex.logo ? (
                    <img src={complex.logo} alt={complex.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-500/10 to-blue-500/10">
                       <Building className="w-16 h-16 text-slate-200" />
                    </div>
                  )}
                  <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-1 rounded-full font-black text-xs text-slate-900 shadow-sm flex items-center gap-1">
                     <ShieldCheck className="w-3 h-3 text-emerald-500" /> VERIFICADO
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-black text-slate-900 group-hover:text-emerald-600 transition-colors">{complex.name}</h3>
                  <div className="flex items-center gap-2 text-slate-500 font-bold text-sm mt-2">
                    <MapPin className="w-4 h-4 text-emerald-500" />
                    {complex.location || "Perú"}
                  </div>
                  <div className="mt-8 flex items-center justify-between">
                     <div className="flex items-center gap-1 text-amber-500">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-slate-900 font-black text-sm">4.9</span>
                        <span className="text-slate-400 font-medium text-xs">(120 reserv.)</span>
                     </div>
                     <span className="text-slate-900 font-black text-sm group-hover:translate-x-2 transition-transform">Ver perfil →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Planes Section */}
      <section id="planes" className="py-32 bg-white animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Planes hechos a tu medida</h2>
            <p className="text-slate-500 mt-4 text-xl font-medium">Escala tu negocio deportivo con CanchaSync.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {planes.map((plan) => (
              <div key={plan.id} className={`relative rounded-3xl border p-8 flex flex-col transition-all hover:shadow-2xl ${
                plan.price === 30 ? "border-emerald-500 ring-4 ring-emerald-500/10 bg-emerald-50/30 scale-105 z-10" : "border-slate-200 bg-white"
              }`}>
                {plan.price === 30 && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-600 text-white px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">
                    Más Popular
                  </div>
                )}
                <h3 className="text-2xl font-black text-slate-900 mb-2">{plan.name}</h3>
                <p className="text-slate-500 font-medium mb-8 text-sm">{plan.description}</p>
                
                <div className="flex items-baseline gap-2 mb-8">
                  <span className="text-5xl font-black text-slate-900">S/ {plan.price}</span>
                  {plan.oldPrice && <span className="text-slate-400 line-through font-bold">S/ {plan.oldPrice}</span>}
                  <span className="text-slate-500 font-bold">/mes</span>
                </div>

                <div className="space-y-4 mb-10 flex-1">
                  {plan.features?.split(",").map((f, i) => (
                    <div key={i} className="flex items-center gap-3 text-slate-700 font-medium">
                      <div className="bg-emerald-100 p-1 rounded-full">
                        <Check className="w-3 h-3 text-emerald-600" />
                      </div>
                      <span className="text-sm">{f.trim()}</span>
                    </div>
                  ))}
                </div>

                {plan.status === "COMING_SOON" ? (
                  <button disabled className="w-full bg-slate-200 text-slate-500 font-black py-4 rounded-2xl cursor-not-allowed">
                    Próximamente
                  </button>
                ) : (
                  <a href="#registro" className={`w-full py-4 rounded-2xl font-black text-center transition-all ${
                    plan.price === 0 ? "bg-slate-100 text-slate-900 hover:bg-slate-200" : "bg-emerald-600 text-white shadow-xl shadow-emerald-600/20 hover:bg-emerald-700"
                  }`}>
                    {plan.price === 0 ? "Empieza Ahora" : "Seleccionar Plan"}
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Registro Section */}
      <section id="registro" className="py-32 bg-slate-900 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-emerald-600/10 blur-[120px] rounded-full translate-x-1/2" />
        <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col lg:flex-row gap-20">
          <div className="lg:w-1/2 text-white">
            <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">Registra tu local y juega <span className="text-emerald-500 underline decoration-emerald-500/30">gratis un mes.</span></h2>
            <div className="space-y-8">
              <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-md">
                <h4 className="text-emerald-400 font-black mb-2 flex items-center gap-2">
                  <Zap className="w-5 h-5" /> Importante
                </h4>
                <p className="text-slate-400 font-medium">
                  Tu cuenta estará activa por 30 días con todas las funciones. Antes de expirar, nos pondremos en contacto contigo para ayudarte a elegir el mejor plan para tu crecimiento.
                </p>
              </div>
              
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-600/20">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Soporte Directo</p>
                    <p className="text-xl font-bold text-white">975026835</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-600/20">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Atención por</p>
                    <p className="text-xl font-bold text-white">José Ángel Espinoza</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:w-1/2">
            <TenantRegistrationForm />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 border-t border-slate-200 py-20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <Image src="/logo.png" alt="Logo" width={40} height={40} className="rounded-xl shadow-sm" />
              <span className="text-2xl font-black tracking-tight text-slate-900">CanchaSync</span>
            </Link>
            <p className="text-slate-500 font-medium leading-relaxed">
              La plataforma definitiva para la gestión de complejos deportivos en Latinoamérica. Innovación y pasión por el fútbol.
            </p>
          </div>
          <div className="col-span-1">
            <h4 className="text-lg font-black text-slate-900 mb-6">Contacto</h4>
            <ul className="space-y-4 font-medium text-slate-600">
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-emerald-600" />
                975026835 (José Ángel)
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-emerald-600" />
                contacto@canchasync.pe
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-emerald-600" />
                Lima, Perú
              </li>
            </ul>
          </div>
          <div className="col-span-1">
            <h4 className="text-lg font-black text-slate-900 mb-6">Síguenos</h4>
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center hover:bg-emerald-50 transition-colors cursor-pointer">
                <Zap className="w-5 h-5 text-slate-600" />
              </div>
              <div className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center hover:bg-emerald-50 transition-colors cursor-pointer">
                <Shield className="w-5 h-5 text-slate-600" />
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 border-t border-slate-200 mt-16 pt-8 text-center">
          <p className="text-slate-400 text-sm font-bold">
            © {new Date().getFullYear()} CanchaSync. Todos los derechos reservados. Desarrollado con pasión en Perú.
          </p>
        </div>
      </footer>
    </div>
  );
}

function StatCard({ number, label }: { number: string, label: string }) {
  return (
    <div className="text-center text-white">
      <div className="text-4xl md:text-5xl font-black mb-1">{number}</div>
      <div className="text-emerald-100 font-bold uppercase tracking-widest text-xs opacity-70">{label}</div>
    </div>
  );
}

