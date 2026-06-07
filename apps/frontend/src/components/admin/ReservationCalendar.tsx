"use client";

import React, { useState } from "react";
import { 
  Calendar, ChevronLeft, ChevronRight, Plus, X, Clock, 
  User, Phone, DollarSign, Check, AlertTriangle, Building, MapPin
} from "lucide-react";
import { createReservationAction, updateReservationStatusAction } from "@/app/actions/reservations";
import { CustomModal } from "@/components/ui/CustomModal";

const HOURS = Array.from({ length: 16 }, (_, i) => i + 6); // 6AM to 9PM

function getDaysOfWeek(baseDate: Date) {
  const start = new Date(baseDate);
  start.setDate(start.getDate() - start.getDay()); // Sunday
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    return d;
  });
}

const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const statusColors: Record<string, string> = {
  PENDIENTE: "bg-amber-100 text-amber-700 border-amber-200",
  CONFIRMADO: "bg-emerald-100 text-emerald-700 border-emerald-200",
  CANCELADO: "bg-red-100 text-red-500 border-red-200",
  VENCIDO: "bg-slate-100 text-slate-400 border-slate-200",
  PALABRA: "bg-blue-100 text-blue-700 border-blue-200",
};

export function ReservationCalendar({ canchas, initialReservations, tenantId }: { canchas: any[], initialReservations: any[], tenantId: string }) {
  const [viewMode, setViewMode] = useState<"calendar" | "manual">("calendar");
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedCancha, setSelectedCancha] = useState(canchas[0]?.id || "");
  const [reservations, setReservations] = useState(initialReservations);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{ date: Date; hour: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({ isOpen: false, title: "", message: "", type: "success" as any });

  // Manual Form States
  const [manualDate, setManualDate] = useState(new Date().toISOString().split('T')[0]);
  const [manualHour, setManualHour] = useState("18");

  const baseDate = new Date();
  baseDate.setDate(baseDate.getDate() + weekOffset * 7);
  const days = getDaysOfWeek(baseDate);

  const canchaReservations = reservations.filter((r: any) => r.canchaId === selectedCancha);
  const selectedCanchaData = canchas.find((c: any) => c.id === selectedCancha);

  const getReservationForSlot = (date: Date, hour: number) => {
    return canchaReservations.find((r: any) => {
      const start = new Date(r.startTime);
      const end = new Date(r.endTime);
      
      // Crear la fecha exacta para el slot actual
      const slotTime = new Date(date);
      slotTime.setHours(hour, 0, 0, 0);
      
      // El slot está reservado si la hora cae dentro del rango de inicio (inclusive) y fin (exclusive)
      return slotTime.getTime() >= start.getTime() && slotTime.getTime() < end.getTime();
    });
  };

  const handleSlotClick = (date: Date, hour: number) => {
    const existing = getReservationForSlot(date, hour);
    if (existing) return; // already reserved
    const now = new Date();
    const slotDate = new Date(date);
    slotDate.setHours(hour, 0, 0, 0);
    if (slotDate < now) return; // past slot
    setSelectedSlot({ date, hour });
    setShowCreateModal(true);
  };

  const handleCreateReservation = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedCancha) return;
    setLoading(true);

    const form = e.currentTarget;
    const userName = (form.elements.namedItem("userName") as HTMLInputElement).value;
    const userPhone = (form.elements.namedItem("userPhone") as HTMLInputElement).value;
    const duration = parseInt((form.elements.namedItem("duration") as HTMLSelectElement).value);
    const paymentType = (form.elements.namedItem("paymentType") as HTMLSelectElement).value as "ADELANTO" | "PALABRA";

    let startTime: Date;
    if (selectedSlot) {
      startTime = new Date(selectedSlot.date);
      startTime.setHours(selectedSlot.hour, 0, 0, 0);
    } else {
      startTime = new Date(manualDate);
      startTime.setHours(parseInt(manualHour), 0, 0, 0);
    }

    const endTime = new Date(startTime);
    endTime.setHours(endTime.getHours() + duration);

    const pricePerHour = selectedCanchaData?.pricePerHour || 0;
    const totalPrice = pricePerHour * duration;

    const res = await createReservationAction({
      canchaId: selectedCancha,
      userName,
      userPhone,
      startTime,
      endTime,
      totalPrice,
      paymentType
    });

    setLoading(false);

    if (res.success) {
      setShowCreateModal(false);
      setSelectedSlot(null);
      setModal({ isOpen: true, title: "¡Reserva Creada!", message: `Reserva de ${userName} registrada exitosamente.`, type: "success" });
      // Add to local state
      setReservations((prev: any) => [...prev, {
        id: res.id,
        canchaId: selectedCancha,
        cancha: selectedCanchaData,
        userName,
        userPhone,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        totalPrice,
        paymentType,
        status: paymentType === "PALABRA" ? "PALABRA" : "PENDIENTE"
      }]);
    } else {
      setModal({ isOpen: true, title: "Error", message: res.error || "No se pudo crear la reserva.", type: "error" });
    }
  };

  const isToday = (d: Date) => {
    const now = new Date();
    return d.getDate() === now.getDate() && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  };

  const isPast = (d: Date, hour: number) => {
    const slotTime = new Date(d);
    slotTime.setHours(hour, 0, 0, 0);
    return slotTime < new Date();
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-700 max-w-full overflow-hidden pb-10">
      {/* Header */}
      <div id="reservas-header" className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 px-4 md:px-0">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Gestión de Reservas</h1>
          <p className="text-slate-500 mt-2 font-medium">Administra tus horarios y clientes de forma eficiente.</p>
        </div>
        
        <div className="flex bg-slate-100 p-1 rounded-2xl w-full lg:w-auto">
          <button 
            onClick={() => setViewMode("calendar")}
            className={`flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${viewMode === "calendar" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
          >
            <Calendar className="w-4 h-4" /> Calendario
          </button>
          <button 
            onClick={() => setViewMode("manual")}
            className={`flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${viewMode === "manual" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
          >
            <Plus className="w-4 h-4" /> Reserva Manual
          </button>
        </div>
      </div>

      {/* Cancha Selector - Scrollable on mobile */}
      <div id="reservas-filters" className="flex overflow-x-auto pb-2 gap-3 px-4 md:px-0 no-scrollbar">
        {canchas.map((cancha: any) => (
          <button
            key={cancha.id}
            onClick={() => setSelectedCancha(cancha.id)}
            className={`flex-shrink-0 flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm border-2 transition-all ${
              selectedCancha === cancha.id 
              ? "bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-600/20" 
              : "bg-white text-slate-600 border-slate-200 hover:border-emerald-300"
            }`}
          >
            <Building className="w-4 h-4" />
            <span className="whitespace-nowrap">{cancha.name}</span>
          </button>
        ))}
      </div>

      {canchas.length === 0 && (
        <div className="bg-amber-50 border border-amber-200 p-8 rounded-3xl text-center space-y-3 mx-4 md:mx-0">
          <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto" />
          <p className="font-bold text-amber-700">No tienes canchas creadas.</p>
        </div>
      )}

      {canchas.length > 0 && viewMode === "calendar" && (
        <>
          {/* Week Navigator */}
          <div className="flex items-center justify-between bg-white p-4 rounded-3xl border border-slate-100 shadow-sm mx-4 md:mx-0">
            <button onClick={() => setWeekOffset(w => w - 1)} className="p-2 md:p-3 hover:bg-slate-50 rounded-2xl transition-colors">
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-slate-600" />
            </button>
            <div className="text-center">
              <div className="font-black text-slate-900 text-sm md:text-lg">
                {days[0].toLocaleDateString("es-PE", { month: "short", year: "numeric" })}
              </div>
              <div className="text-[10px] md:text-sm font-bold text-slate-400">
                {days[0].getDate()} {dayNames[days[0].getDay()]} — {days[6].getDate()} {dayNames[days[6].getDay()]}
              </div>
            </div>
            <div className="flex gap-1 md:gap-2">
              <button onClick={() => setWeekOffset(0)} className="hidden sm:block px-3 py-2 bg-emerald-50 text-emerald-600 font-black text-[10px] rounded-xl hover:bg-emerald-100">HOY</button>
              <button onClick={() => setWeekOffset(w => w + 1)} className="p-2 md:p-3 hover:bg-slate-50 rounded-2xl transition-colors">
                <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-slate-600" />
              </button>
            </div>
          </div>

          {/* Calendar Grid - Mobile friendly */}
          <div id="reservas-list" className="bg-white rounded-[32px] md:rounded-[40px] border border-slate-100 shadow-sm overflow-hidden mx-4 md:mx-0">
            <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
              <table className="w-full border-collapse min-w-[700px] md:min-w-[800px]">
                <thead>
                  <tr>
                    <th className="w-16 md:w-20 p-2 md:p-3 bg-slate-50 border-b border-r border-slate-100 text-[10px] font-black text-slate-400 uppercase">Hora</th>
                    {days.map((day, i) => (
                      <th key={i} className={`p-2 md:p-3 border-b border-r border-slate-100 text-center ${isToday(day) ? "bg-emerald-50" : "bg-slate-50"}`}>
                        <div className={`text-[9px] md:text-xs font-black uppercase tracking-wider ${isToday(day) ? "text-emerald-600" : "text-slate-400"}`}>{dayNames[i]}</div>
                        <div className={`text-sm md:text-lg font-black ${isToday(day) ? "text-emerald-600" : "text-slate-900"}`}>{day.getDate()}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {HOURS.map(hour => (
                    <tr key={hour} className="group">
                      <td className="p-1 md:p-2 border-r border-b border-slate-50 text-center bg-slate-50/50">
                        <span className="text-[10px] md:text-xs font-black text-slate-400">{hour}:00</span>
                      </td>
                      {days.map((day, di) => {
                        const reservation = getReservationForSlot(day, hour);
                        const past = isPast(day, hour);
                        
                        return (
                          <td 
                            key={di} 
                            className={`border-r border-b border-slate-50 p-0.5 md:p-1 h-12 md:h-16 relative ${
                              past ? "bg-slate-50/50" : "hover:bg-emerald-50/50 cursor-pointer"
                            } ${isToday(day) ? "bg-emerald-50/20" : ""}`}
                            onClick={() => !past && handleSlotClick(day, hour)}
                          >
                            {reservation ? (
                              <div className={`absolute inset-0.5 rounded-lg md:rounded-xl border px-1 md:px-2 py-0.5 md:py-1 text-[9px] md:text-[11px] font-bold overflow-hidden ${statusColors[reservation.status] || statusColors.PENDIENTE}`}>
                                <div className="font-black truncate">{reservation.userName}</div>
                                <div className="opacity-70 truncate hidden md:block">{reservation.status}</div>
                              </div>
                            ) : !past ? (
                              <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                <Plus className="w-3 h-3 md:w-4 md:h-4 text-emerald-400" />
                              </div>
                            ) : null}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {canchas.length > 0 && viewMode === "manual" && (
        <div className="mx-4 md:mx-0 bg-white rounded-[32px] md:rounded-[40px] border border-slate-100 shadow-sm p-6 md:p-10">
          <form className="max-w-2xl mx-auto space-y-8" onSubmit={handleCreateReservation}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-4">Fecha</label>
                <input 
                  type="date" 
                  value={manualDate}
                  onChange={(e) => setManualDate(e.target.value)}
                  required 
                  className="w-full bg-slate-50 border-2 border-slate-50 p-4 rounded-2xl focus:outline-none focus:border-emerald-500/50 font-bold" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-4">Hora de Inicio</label>
                <select 
                  value={manualHour}
                  onChange={(e) => setManualHour(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-50 p-4 rounded-2xl focus:outline-none focus:border-emerald-500/50 font-bold appearance-none"
                >
                  {HOURS.map(h => (
                    <option key={h} value={h}>{h}:00</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-6 pt-4 border-t border-slate-50">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-4">Nombre del Cliente</label>
                <div className="relative">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                  <input name="userName" required placeholder="Ej. Juan Pérez" className="w-full bg-slate-50 border-2 border-slate-50 p-4 pl-14 rounded-2xl focus:outline-none focus:border-emerald-500/50 font-bold" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-4">Teléfono</label>
                <div className="relative">
                  <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                  <input name="userPhone" required placeholder="987654321" className="w-full bg-slate-50 border-2 border-slate-50 p-4 pl-14 rounded-2xl focus:outline-none focus:border-emerald-500/50 font-bold" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-4">Duración (Varias Horas)</label>
                  <select name="duration" className="w-full bg-slate-50 border-2 border-slate-50 p-4 rounded-2xl focus:outline-none focus:border-emerald-500/50 font-bold appearance-none">
                    <option value="1">1 hora</option>
                    <option value="2">2 horas</option>
                    <option value="3">3 horas</option>
                    <option value="4">4 horas</option>
                    <option value="5">5 horas</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-4">Tipo de Pago</label>
                  <select name="paymentType" className="w-full bg-slate-50 border-2 border-slate-50 p-4 rounded-2xl focus:outline-none focus:border-emerald-500/50 font-bold appearance-none">
                    <option value="ADELANTO">Con Adelanto</option>
                    <option value="PALABRA">De Palabra</option>
                  </select>
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-emerald-600 text-white font-black py-5 rounded-3xl text-lg shadow-2xl shadow-emerald-600/30 hover:bg-emerald-700 transition-all active:scale-[0.98] disabled:opacity-50">
              {loading ? "Reservando..." : "Registrar Reserva Manual"}
            </button>
          </form>
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap gap-2 md:gap-4 justify-center px-4">
        {Object.entries(statusColors).map(([status, classes]) => (
          <div key={status} className={`flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-xl border text-[9px] md:text-xs font-black ${classes}`}>
            <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-current" />
            {status}
          </div>
        ))}
      </div>

      {/* Create Reservation Modal (for calendar selection) */}
      {showCreateModal && selectedSlot && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 md:p-6 overflow-y-auto">
          <form className="bg-white rounded-[32px] md:rounded-[48px] w-full max-w-lg p-6 md:p-10 space-y-6 md:space-y-8 animate-in zoom-in duration-300 my-auto" onSubmit={handleCreateReservation}>
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Nueva Reserva</h3>
                <p className="text-slate-400 font-bold text-xs md:text-sm mt-1">
                  {selectedSlot.date.toLocaleDateString("es-PE", { weekday: "short", day: "numeric", month: "short" })} — {selectedSlot.hour}:00 hrs
                </p>
              </div>
              <button type="button" onClick={() => { setShowCreateModal(false); setSelectedSlot(null); }} className="p-2 md:p-3 bg-slate-100 rounded-2xl hover:bg-slate-200 transition-all">
                <X className="w-5 h-5 md:w-6 md:h-6 text-slate-400" />
              </button>
            </div>

            <div className="p-3 md:p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-3">
              <Building className="w-4 h-4 md:w-5 md:h-5 text-emerald-600 flex-shrink-0" />
              <span className="font-bold text-emerald-700 text-xs md:text-sm">{selectedCanchaData?.name} — S/{Number(selectedCanchaData?.pricePerHour || 0).toFixed(0)}/hora</span>
            </div>

            <div className="space-y-5 md:space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest ml-4">Nombre del Cliente</label>
                <div className="relative">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-slate-300" />
                  <input name="userName" required placeholder="Ej. Juan Pérez" className="w-full bg-slate-50 border-2 border-slate-50 p-4 pl-12 md:pl-14 rounded-2xl focus:outline-none focus:border-emerald-500/50 font-bold text-sm md:text-base" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest ml-4">Teléfono</label>
                <div className="relative">
                  <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-slate-300" />
                  <input name="userPhone" required placeholder="987654321" className="w-full bg-slate-50 border-2 border-slate-50 p-4 pl-12 md:pl-14 rounded-2xl focus:outline-none focus:border-emerald-500/50 font-bold text-sm md:text-base" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest ml-4">Duración</label>
                  <select name="duration" className="w-full bg-slate-50 border-2 border-slate-50 p-4 rounded-2xl focus:outline-none focus:border-emerald-500/50 font-bold appearance-none text-sm md:text-base">
                    <option value="1">1 hora</option>
                    <option value="2">2 horas</option>
                    <option value="3">3 horas</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest ml-4">Tipo de Pago</label>
                  <select name="paymentType" className="w-full bg-slate-50 border-2 border-slate-50 p-4 rounded-2xl focus:outline-none focus:border-emerald-500/50 font-bold appearance-none text-sm md:text-base">
                    <option value="ADELANTO">Con Adelanto</option>
                    <option value="PALABRA">De Palabra</option>
                  </select>
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-emerald-600 text-white font-black py-4 md:py-5 rounded-3xl text-base md:text-lg shadow-2xl shadow-emerald-600/30 hover:bg-emerald-700 transition-all active:scale-[0.98] disabled:opacity-50">
              {loading ? "Reservando..." : "Confirmar Reserva"}
            </button>
          </form>
        </div>
      )}

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
