import { prisma } from "@cancha/database";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { 
  MapPin, Clock, Phone, DollarSign, User, ShieldCheck, 
  Calendar, Info, Trophy, Star, ArrowLeft, Coffee, Gift, Percent, Award, Sparkles 
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

  // Parse custom collections safely
  let beverages: any[] = [];
  try {
    beverages = (tenant as any).beverages ? JSON.parse((tenant as any).beverages) : [];
  } catch (err) {
    beverages = [];
  }

  let promotions: any[] = [];
  try {
    promotions = (tenant as any).promotions ? JSON.parse((tenant as any).promotions) : [];
  } catch (err) {
    promotions = [];
  }

  let sponsorships: any[] = [];
  try {
    sponsorships = (tenant as any).sponsorships ? JSON.parse((tenant as any).sponsorships) : [];
  } catch (err) {
    sponsorships = [];
  }

  const customBg = (tenant as any).bgImage || "/assets/landing_bg.png";

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-emerald-500/30 pb-24">
      {/* Header / Navbar */}
      <nav className="h-20 bg-gradient-to-r from-slate-900/90 to-slate-950/90 backdrop-blur-xl border-b border-slate-800 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-white font-black text-sm tracking-wide transition-all hover:-translate-x-1 uppercase">
             <ArrowLeft className="w-5 h-5 text-emerald-500" /> Volver al SIS
          </Link>
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-5 py-2.5 rounded-2xl backdrop-blur-md shadow-inner">
             {tenant.logo ? (
                <img src={tenant.logo} alt={tenant.name} className="w-9 h-9 rounded-xl object-cover shadow-md" />
             ) : (
                <div className="w-9 h-9 bg-slate-800 rounded-xl flex items-center justify-center font-black text-slate-400">🏢</div>
             )}
             <span className="text-lg font-black text-white tracking-tight">{tenant.name}</span>
          </div>
          <a href={`https://wa.me/51${tenant.phone}`} target="_blank" className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-7 py-3 rounded-2xl font-black text-sm shadow-xl shadow-emerald-500/20 hover:from-emerald-600 hover:to-teal-700 transition-all hover:scale-[1.03] active:scale-[0.97]">
             Contactar WhatsApp
          </a>
        </div>
      </nav>

      {/* Hero Section with Custom Background */}
      <section className="relative h-[40vh] md:h-[50vh] bg-slate-950 overflow-hidden">
        <div className="absolute inset-0 opacity-40">
           {customBg.startsWith("data:image") ? (
              <img src={customBg} alt={tenant.name} className="w-full h-full object-cover" />
           ) : (
              <Image 
                src={customBg} 
                alt="Fondo cancha" 
                fill 
                className="object-cover"
                priority
              />
           )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-slate-950/20 to-slate-950/50" />
        
        <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-6 pb-12">
           <div className="flex flex-col md:flex-row items-end gap-8">
              <div className="w-32 h-32 md:w-48 md:h-48 bg-white p-2 rounded-[40px] shadow-2xl relative z-10 animate-in zoom-in duration-500">
                 <div className="w-full h-full bg-slate-50 rounded-[32px] flex items-center justify-center text-6xl shadow-inner overflow-hidden">
                    {tenant.logo ? <img src={tenant.logo} className="w-full h-full object-cover" /> : "🏢"}
                 </div>
              </div>
              <div className="flex-1 space-y-2 mb-4 animate-in slide-in-from-left-8 duration-700">
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
           
           {/* Promociones de Alquiler */}
           {promotions.length > 0 && (
             <div className="space-y-6">
                <div className="flex items-center gap-2">
                   <Percent className="w-6 h-6 text-emerald-600" />
                   <h2 className="text-3xl font-black text-slate-900 tracking-tight">Descuentos y Ofertas Especiales</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   {promotions.map(promo => (
                     <div key={promo.id} className="bg-gradient-to-br from-emerald-50 to-white p-6 rounded-[32px] border border-emerald-100/60 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                        <div className="absolute right-4 top-4 bg-emerald-600 text-white font-black text-xs px-3.5 py-1.5 rounded-xl shadow-md">
                           {promo.discount || "PROMO"}
                        </div>
                        <h3 className="font-black text-xl text-slate-900 mb-2 mt-2">{promo.title}</h3>
                        <p className="text-slate-500 text-sm font-bold leading-relaxed">{promo.description}</p>
                     </div>
                   ))}
                </div>
             </div>
           )}

           {/* Sobre Nosotros */}
           <div className="space-y-4">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Sobre nosotros</h2>
              <p className="text-lg text-slate-600 leading-relaxed font-medium">
                 {tenant.description || "Bienvenidos a nuestro complejo deportivo. Ofrecemos las mejores canchas de la zona con iluminación profesional y césped de alta calidad. ¡Reserva tu hora y ven a jugar!"}
              </p>
           </div>

           {/* Nuestras Canchas */}
           <div className="space-y-8">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Nuestras Canchas</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {tenant.canchas.map(cancha => (
                   <div key={cancha.id} className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden group hover:shadow-xl transition-all">
                      <div className="aspect-video bg-slate-100 relative overflow-hidden">
                         {cancha.image ? <img src={cancha.image} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><Calendar className="w-12 h-12 text-slate-200" /></div>}
                         <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-xl font-black text-emerald-600 shadow-sm">S/ {Number(cancha.pricePerHour).toFixed(0)}</div>
                      </div>
                      <div className="p-8">
                         <h3 className="text-2xl font-black text-slate-900 mb-2">{cancha.name}</h3>
                         <p className="text-slate-500 font-medium text-sm mb-6 line-clamp-2">{cancha.description}</p>
                         <Link href={`/cancha/${cancha.id}`} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black hover:bg-slate-800 transition-all active:scale-[0.98] block text-center">
                            Reservar ahora
                         </Link>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           {/* Cafetería / Pikeos / Bebidas */}
           {beverages.filter(b => b.active !== false).length > 0 && (
             <div className="space-y-6">
                <div className="flex items-center gap-2">
                   <Coffee className="w-6 h-6 text-amber-600" />
                   <h2 className="text-3xl font-black text-slate-900 tracking-tight">La Cantina (Bebidas y Pikeos)</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   {beverages.filter(b => b.active !== false).map(bev => (
                     <div key={bev.id} className="flex items-center justify-between p-5 bg-white rounded-3xl border border-slate-100 shadow-sm hover:border-emerald-200 transition-colors">
                        <div className="flex items-center gap-3">
                           <div className="w-14 h-14 bg-slate-50 rounded-2xl overflow-hidden flex items-center justify-center relative flex-shrink-0 border border-slate-100">
                              {bev.image ? (
                                 <img src={bev.image} alt={bev.name} className="w-full h-full object-cover" />
                              ) : (
                                 <span className="text-3xl">{bev.icon || "🥤"}</span>
                              )}
                           </div>
                           <div>
                              <span className="font-black text-slate-800 text-base block">{bev.name}</span>
                              {bev.description && <span className="text-[11px] text-slate-400 font-bold block mt-0.5">{bev.description}</span>}
                           </div>
                        </div>
                        <span className="bg-amber-50 text-amber-700 font-black text-sm px-3.5 py-1.5 rounded-xl border border-amber-100 flex-shrink-0">
                           S/ {Number(bev.price).toFixed(2)}
                        </span>
                     </div>
                   ))}
                </div>
             </div>
           )}

           {/* Auspiciadores y Academias de Fútbol */}
           {sponsorships.length > 0 && (
             <div className="space-y-6">
                <div className="flex items-center gap-2">
                   <Award className="w-6 h-6 text-purple-600" />
                   <h2 className="text-3xl font-black text-slate-900 tracking-tight">Auspiciadores y Academias de Menores</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   {sponsorships.map(spon => (
                     <div key={spon.id} className="bg-white rounded-[32px] border border-slate-150 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-all">
                        {spon.image && (
                          <div className="aspect-[2/1] w-full bg-slate-50 relative overflow-hidden">
                             <img src={spon.image} alt={spon.title} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div className="p-6 space-y-3">
                           <h3 className="font-black text-lg text-slate-900 leading-tight">{spon.title}</h3>
                           <p className="text-slate-500 text-xs font-bold leading-relaxed">{spon.description}</p>
                           
                           {/* Price & Schedule display */}
                           <div className="flex flex-wrap gap-2 pt-1">
                              {spon.price && (
                                 <span className="bg-purple-50 text-purple-700 font-black text-[10px] px-3 py-1 rounded-xl border border-purple-100 flex items-center gap-1">
                                    💰 Costo: {spon.price}
                                 </span>
                              )}
                              {spon.schedule && (
                                 <span className="bg-blue-50 text-blue-700 font-black text-[10px] px-3 py-1 rounded-xl border border-blue-100 flex items-center gap-1">
                                    📅 Horario: {spon.schedule}
                                 </span>
                              )}
                           </div>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
           )}

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
