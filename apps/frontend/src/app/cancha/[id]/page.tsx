import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, MapPin, Clock, Star, Share2, CheckCircle2, Users } from "lucide-react";
import InteractiveCalendar from "@/components/cancha/InteractiveCalendar";

export const dynamic = "force-dynamic";

export default async function CanchaDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const cancha = await prisma.cancha.findUnique({
    where: { id: params.id },
    include: { 
      tenant: true,
      details: true,
      openingHours: true
    },
  });

  if (!cancha) {
    notFound();
  }

  // Obtener horario de hoy
  const today = new Date().getDay();
  const todaySchedule = cancha.openingHours.find(oh => oh.dayOfWeek === today);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Navbar Minimalista */}
      <nav className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-slate-600 hover:text-emerald-600 transition-colors font-semibold">
            <ArrowLeft className="w-5 h-5" /> Volver al inicio
          </Link>
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="CanchaSync Logo" width={32} height={32} className="rounded-lg shadow-sm" />
            <span className="text-xl font-extrabold tracking-tight text-slate-900">
              Cancha<span className="text-emerald-600">Sync</span>
            </span>
          </div>
        </div>
      </nav>

      {/* Header Visual */}
      <div className="relative h-[40vh] min-h-[300px] w-full">
        <Image 
          src="/assets/hero_pitch.png" 
          alt={cancha.name} 
          fill 
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/50 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-6 pb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="text-white">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-sm">
                  {cancha.details?.surfaceType || 'Premium'}
                </span>
                <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-sm flex items-center gap-1">
                  <Users className="w-3 h-3" /> {cancha.details?.gameType || 'Multiuso'}
                </span>
                <div className="flex items-center gap-1 text-amber-400">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-sm font-bold text-white ml-1">4.9 <span className="text-slate-300 font-normal">(128 reseñas)</span></span>
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-black mb-2">{cancha.name}</h1>
              <div className="flex items-center gap-4 text-slate-300 text-sm font-medium">
                <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-emerald-400" /> {cancha.tenant?.name || 'Local'}</span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-emerald-400" /> 
                  {todaySchedule 
                    ? `Abierto hoy: ${todaySchedule.openTime} - ${todaySchedule.closeTime}`
                    : 'Cerrado hoy'
                  }
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-4 py-3 rounded-xl font-semibold transition-colors flex items-center gap-2 border border-white/20">
                <Share2 className="w-4 h-4" /> Compartir
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Columna Izquierda: Información */}
        <div className="lg:col-span-1 space-y-8">
          {/* Info Card */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Sobre la cancha</h3>
            <p className="text-slate-600 leading-relaxed mb-6">
              {cancha.description}
            </p>
            
            <div className="space-y-4">
              {cancha.details?.playersPerSide && (
                <div className="flex items-start gap-3">
                  <div className="bg-emerald-100 p-2 rounded-lg">
                    <Users className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">Formato: {cancha.details.playersPerSide} vs {cancha.details.playersPerSide}</h4>
                    <p className="text-sm text-slate-500">Recomendado para un juego óptimo.</p>
                  </div>
                </div>
              )}
              
              {cancha.details?.hasLighting && (
                <div className="flex items-start gap-3">
                  <div className="bg-emerald-100 p-2 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">Iluminación LED</h4>
                    <p className="text-sm text-slate-500">Perfecta visibilidad nocturna.</p>
                  </div>
                </div>
              )}

              {cancha.details?.hasShowers && (
                <div className="flex items-start gap-3">
                  <div className="bg-emerald-100 p-2 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">Duchas</h4>
                    <p className="text-sm text-slate-500">Instalaciones limpias incluidas.</p>
                  </div>
                </div>
              )}
            </div>

            {cancha.details?.amenities && (
              <div className="mt-8 pt-8 border-t border-slate-100">
                <h4 className="font-bold text-slate-900 mb-3">Servicios adicionales</h4>
                <div className="flex flex-wrap gap-2">
                  {cancha.details.amenities.split(',').map((item, i) => (
                    <span key={i} className="bg-slate-100 text-slate-600 px-3 py-1.5 rounded-xl text-xs font-bold">
                      {item.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Pricing Card */}
          <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-3xl p-8 text-white shadow-xl shadow-emerald-600/20">
            <h3 className="text-xl font-bold mb-2">Precio por hora</h3>
            <div className="text-5xl font-black mb-6">S/ {Number(cancha.pricePerHour).toFixed(2)}</div>
            <p className="text-emerald-100 text-sm mb-6">Selecciona una o más horas en el calendario para reservar. El sistema calculará el total automáticamente.</p>
          </div>
        </div>

        {/* Columna Derecha: Calendario Interactivo */}
        <div className="lg:col-span-2">
          <InteractiveCalendar 
            canchaId={cancha.id} 
            pricePerHour={cancha.pricePerHour} 
            openingHours={cancha.openingHours}
          />
        </div>
        
      </main>
    </div>
  );
}

