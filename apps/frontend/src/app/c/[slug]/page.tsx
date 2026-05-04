import { prisma } from "@cancha/database";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { 
  MapPin, Clock, Phone, DollarSign, User, ShieldCheck, 
  Calendar, Info, Trophy, Star, ArrowLeft 
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function TenantPublicPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;

  const tenant = await prisma.tenant.findFirst({
    where: {
      OR: [
        { slug: slug },
        { id: slug }
      ]
    },
    include: {
      canchas: true,
    }
  });

  if (!tenant) notFound();

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-emerald-500/30 pb-20">
      {/* Header / Navbar */}
      <nav className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-slate-900 font-bold transition-all">
             <ArrowLeft className="w-5 h-5" /> Volver al SIS
          </Link>
          <div className="flex items-center gap-3">
             {tenant.logo ? (
                <img src={tenant.logo} alt={tenant.name} className="w-10 h-10 rounded-xl" />
             ) : (
                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center font-black text-slate-400">🏢</div>
             )}
             <span className="text-xl font-black text-slate-900">{tenant.name}</span>
          </div>
          <a href={`https://wa.me/51${tenant.phone}`} target="_blank" className="bg-emerald-600 text-white px-6 py-2 rounded-full font-black text-sm shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all">
             Contactar WhatsApp
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-[40vh] md:h-[50vh] bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 opacity-40">
           <Image 
             src="/assets/landing_bg.png" 
             alt="Fondo cancha" 
             fill 
             className="object-cover"
           />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-transparent to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-6 pb-12">
           <div className="flex flex-col md:flex-row items-end gap-8">
              <div className="w-32 h-32 md:w-48 md:h-48 bg-white p-2 rounded-[40px] shadow-2xl relative z-10">
                 <div className="w-full h-full bg-slate-50 rounded-[32px] flex items-center justify-center text-6xl shadow-inner">
                    {tenant.logo ? <img src={tenant.logo} className="w-full h-full object-cover rounded-[32px]" /> : "🏢"}
                 </div>
              </div>
              <div className="flex-1 space-y-2 mb-4">
                 <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight">{tenant.name}</h1>
                 <div className="flex flex-wrap gap-4 text-slate-500 font-bold">
                    <div className="flex items-center gap-1"><MapPin className="w-4 h-4 text-emerald-500" /> {tenant.location || "Ubicación por confirmar"}</div>
                    <div className="flex items-center gap-1"><Clock className="w-4 h-4 text-emerald-500" /> {tenant.openingHours || "Horario por confirmar"}</div>
                    <div className="flex items-center gap-1 text-emerald-600"><Star className="w-4 h-4 fill-current" /> 4.9 (120 reseñas)</div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-12">
           <div className="space-y-4">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Sobre nosotros</h2>
              <p className="text-lg text-slate-600 leading-relaxed font-medium">
                 {tenant.description || "Bienvenidos a nuestro complejo deportivo. Ofrecemos las mejores canchas de la zona con iluminación profesional y césped de alta calidad. ¡Reserva tu hora y ven a jugar!"}
              </p>
           </div>

           <div className="space-y-8">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Nuestras Canchas</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {tenant.canchas.map(cancha => (
                   <div key={cancha.id} className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden group hover:shadow-xl transition-all">
                      <div className="aspect-video bg-slate-100 relative overflow-hidden">
                         {cancha.image ? <img src={cancha.image} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><Calendar className="w-12 h-12 text-slate-200" /></div>}
                         <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-4 py-1 rounded-full font-black text-emerald-600 shadow-sm">S/ {Number(cancha.pricePerHour).toFixed(0)}</div>
                      </div>
                      <div className="p-8">
                         <h3 className="text-2xl font-black text-slate-900 mb-2">{cancha.name}</h3>
                         <p className="text-slate-500 font-medium text-sm mb-6 line-clamp-2">{cancha.description}</p>
                         <button className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black hover:bg-slate-800 transition-all active:scale-95">
                            Reservar ahora
                         </button>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-8">
           <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm space-y-8">
              <h3 className="text-2xl font-black text-slate-900">Información de Pago</h3>
              <div className="space-y-6">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600"><DollarSign className="w-6 h-6" /></div>
                    <div>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Titular Yape/Plin</p>
                       <p className="font-black text-slate-800">{tenant.yapeName || tenant.ownerName || "Por confirmar"}</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600"><Phone className="w-6 h-6" /></div>
                    <div>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Número de Contacto</p>
                       <p className="font-black text-slate-800">{tenant.phone || "No registrado"}</p>
                    </div>
                 </div>
              </div>
              <div className="p-4 bg-slate-50 rounded-3xl border border-dashed border-slate-200 text-center">
                 <p className="text-xs text-slate-400 font-bold">Ubícanos en:</p>
                 <p className="text-sm text-slate-600 font-black mt-1">{tenant.location || "Dirección no disponible"}</p>
              </div>
           </div>

           <div className="bg-emerald-600 p-10 rounded-[48px] text-white shadow-2xl shadow-emerald-600/30 space-y-6 relative overflow-hidden">
              <ShieldCheck className="absolute -right-4 -bottom-4 w-32 h-32 text-white/10" />
              <h3 className="text-2xl font-black">Reserva Garantizada</h3>
              <p className="font-medium text-emerald-100">Al reservar con CanchaSync, tu cupo queda bloqueado automáticamente en el sistema del local.</p>
              <div className="flex items-center gap-2 bg-white/20 w-fit px-4 py-2 rounded-full text-xs font-black">
                 <ShieldCheck className="w-4 h-4" /> LOCAL VERIFICADO
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
