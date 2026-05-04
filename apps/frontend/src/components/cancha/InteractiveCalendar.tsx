"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { createReservationAction } from "@/app/actions/reservations";

interface OpeningHour {
  dayOfWeek: number;
  openTime: string;
  closeTime: string;
  isClosed: boolean;
}

interface CalendarProps {
  canchaId: string;
  pricePerHour: number;
  openingHours: OpeningHour[];
}

export default function InteractiveCalendar({ canchaId, pricePerHour, openingHours }: CalendarProps) {
  const [selectedSlots, setSelectedSlots] = useState<{ dayIndex: number; hour: number }[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [reservationType, setReservationType] = useState<"SIN_ADELANTO" | "CON_ADELANTO">("CON_ADELANTO");
  const [adelantoAmount, setAdelantoAmount] = useState<number>(0);
  
  const [bookingStep, setBookingStep] = useState<"SELECT" | "INFO" | "SUCCESS">("SELECT");
  const [lastBookingId, setLastBookingId] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [errorModal, setErrorModal] = useState<{ isOpen: boolean; message: string }>({ isOpen: false, message: "" });

  const days = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  const allHours = Array.from({ length: 24 }, (_, i) => i);
  const totalPrice = selectedSlots.length * pricePerHour;

  useEffect(() => {
    // Default adelanto to 50% of total
    setAdelantoAmount(totalPrice / 2);
  }, [totalPrice]);

  const isSlotSelected = (dayIndex: number, hour: number) => {
    return selectedSlots.some(slot => slot.dayIndex === dayIndex && slot.hour === hour);
  };

  const toggleSlot = (dayIndex: number, hour: number, isOpen: boolean) => {
    if (!isOpen) return;
    const slotIndex = selectedSlots.findIndex(slot => slot.dayIndex === dayIndex && slot.hour === hour);
    if (slotIndex > -1) {
      setSelectedSlots(selectedSlots.filter((_, i) => i !== slotIndex));
    } else {
      if (selectedSlots.length > 0 && selectedSlots[0].dayIndex !== dayIndex) {
        setSelectedSlots([{ dayIndex, hour }]);
      } else {
        setSelectedSlots([...selectedSlots, { dayIndex, hour }].sort((a, b) => a.hour - b.hour));
      }
    }
  };

  const isHourOpen = (dayIndex: number, hour: number) => {
    const dayConfig = openingHours.find(oh => oh.dayOfWeek === dayIndex);
    if (!dayConfig || dayConfig.isClosed) return false;
    const openH = parseInt(dayConfig.openTime.split(":")[0]);
    const closeH = parseInt(dayConfig.closeTime.split(":")[0]);
    if (closeH < openH) {
      return hour >= openH || hour < closeH;
    }
    return hour >= openH && hour < closeH;
  };

  const showError = (message: string) => {
    setErrorModal({ isOpen: true, message });
  };

  const handleReserve = async () => {
    if (bookingStep === "SELECT") {
      setBookingStep("INFO");
      return;
    }

    // Validation
    if (!name.trim()) {
      showError("El nombre completo no puede estar vacío.");
      return;
    }
    const phoneRegex = /^[0-9]{9}$/;
    if (!phoneRegex.test(phone)) {
      showError("El número de teléfono debe tener exactamente 9 dígitos y solo contener números.");
      return;
    }
    if (reservationType === "CON_ADELANTO") {
      if (adelantoAmount <= 0) {
        showError("El monto del adelanto debe ser mayor a cero.");
        return;
      }
      if (adelantoAmount > totalPrice) {
        showError(`El adelanto (S/ ${adelantoAmount}) no puede ser mayor al costo total (S/ ${totalPrice}).`);
        return;
      }
    }

    setIsPending(true);
    try {
      const now = new Date();
      const baseDate = new Date(now.setDate(now.getDate() + (selectedSlots[0].dayIndex - now.getDay())));
      const startTime = new Date(baseDate.setHours(selectedSlots[0].hour, 0, 0, 0));
      const endTime = new Date(baseDate.setHours(selectedSlots[selectedSlots.length - 1].hour + 1, 0, 0, 0));

      const result = await createReservationAction({
        canchaId,
        userName: name,
        userPhone: phone,
        startTime,
        endTime,
        totalPrice: totalPrice,
        paymentType: reservationType === "SIN_ADELANTO" ? "PALABRA" : "ADELANTO",
      });

      if (result.success) {
        setLastBookingId(result.id!);
        setBookingStep("SUCCESS");
      } else {
        showError("Error al crear reserva: " + result.error);
      }
    } catch (err) {
      showError("Ocurrió un error de conexión al procesar la reserva.");
    } finally {
      setIsPending(false);
    }
  };

  const getWhatsAppLink = () => {
    const message = reservationType === "CON_ADELANTO" 
      ? `Hola! Acabo de hacer una reserva (ID: ${lastBookingId}). Adjunto el comprobante por el adelanto de S/ ${adelantoAmount}.`
      : `Hola! Acabo de hacer una reserva sin adelanto (ID: ${lastBookingId}). Pago en puerta confirmado.`;
    return `https://wa.me/51900000000?text=${encodeURIComponent(message)}`;
  };

  if (bookingStep === "SUCCESS") {
    return (
      <div className="bg-white rounded-3xl p-12 border border-slate-200 shadow-xl text-center space-y-6 relative overflow-hidden">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-4xl shadow-inner">✓</div>
        <h2 className="text-3xl font-black text-slate-900">¡Reserva Registrada!</h2>
        <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 text-left shadow-sm">
          <p className="text-emerald-900 font-bold mb-2">Pasos para confirmar:</p>
          <ul className="text-emerald-800 text-sm space-y-2 list-disc list-inside font-medium">
            <li>Tu reserva está en estado <span className="font-black uppercase tracking-wider text-emerald-600">Pendiente</span>.</li>
            {reservationType === "CON_ADELANTO" ? (
              <>
                <li>Tienes 30 minutos para pagar el adelanto de <span className="font-black">S/ {adelantoAmount}</span>.</li>
                <li>Yape / Plin al número: <span className="font-black text-slate-900">900 000 000 (CanchaSync)</span>.</li>
                <li>Haz clic abajo para enviar tu comprobante por WhatsApp.</li>
              </>
            ) : (
              <>
                <li>Al elegir la opción sin adelanto, tu cancha no está 100% asegurada si alguien más la paga.</li>
                <li>Escríbenos al WhatsApp para confirmar tu asistencia o realiza el pago allí.</li>
              </>
            )}
          </ul>
        </div>
        <a 
          href={getWhatsAppLink()} 
          target="_blank" 
          rel="noreferrer"
          className="flex items-center justify-center gap-3 w-full bg-[#25D366] hover:bg-[#128C7E] text-white py-4 rounded-2xl font-black transition-all shadow-lg shadow-[#25D366]/30 hover:shadow-[#25D366]/50"
        >
          {reservationType === "CON_ADELANTO" ? "Enviar Comprobante por WhatsApp" : "Confirmar por WhatsApp"}
        </a>
        <button onClick={() => window.location.reload()} className="text-slate-400 font-bold hover:text-slate-600">Hacer otra reserva</button>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              {bookingStep === "INFO" ? "Detalles de la Reserva" : "Disponibilidad de la semana"}
            </h2>
            <p className="text-slate-500 mt-1 font-medium">
              {bookingStep === "INFO" 
                ? "Ingresa tu información y método de pago." 
                : "Selecciona una o varias horas para tu reserva."}
            </p>
          </div>
          
          {selectedSlots.length > 0 && (
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Costo Total</div>
                <div className="text-2xl font-black text-emerald-600">S/ {totalPrice}</div>
              </div>
              <button 
                disabled={isPending}
                onClick={handleReserve}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-emerald-600/20 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
              >
                {isPending ? "Procesando..." : (bookingStep === "INFO" ? "Confirmar Reserva" : "Continuar →")}
              </button>
            </div>
          )}
        </div>

        {bookingStep === "INFO" ? (
          <div className="p-8 max-w-lg mx-auto space-y-8">
            {/* Formulario de Datos */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4 shadow-inner">
              <h3 className="font-bold text-slate-800 text-lg">Tus Datos Personales</h3>
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-1">Nombre Completo <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  className="w-full rounded-xl border border-slate-200 bg-white p-3.5 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-sm"
                  placeholder="Ej. Juan Pérez"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-1">Teléfono Móvil (9 dígitos) <span className="text-red-500">*</span></label>
                <input 
                  type="tel" 
                  maxLength={9}
                  className="w-full rounded-xl border border-slate-200 bg-white p-3.5 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-sm"
                  placeholder="Ej. 987654321"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))} // Solo permite números
                />
              </div>
            </div>
            
            {/* Opciones de Reserva */}
            <div className="space-y-4">
              <h3 className="font-bold text-slate-800 text-lg">Opciones de Reserva</h3>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setReservationType("CON_ADELANTO")}
                  className={`p-4 rounded-xl border-2 text-left transition-all relative overflow-hidden ${reservationType === "CON_ADELANTO" ? "border-emerald-500 bg-emerald-50 shadow-md" : "border-slate-200 bg-white hover:border-emerald-300"}`}
                >
                  {reservationType === "CON_ADELANTO" && <div className="absolute top-0 right-0 w-8 h-8 bg-emerald-500 rounded-bl-xl flex items-center justify-center text-white font-bold">✓</div>}
                  <div className="font-black text-slate-800 mb-1">Con Adelanto</div>
                  <div className="text-xs text-slate-500 font-medium leading-tight">Asegura tu cancha al 100% y paga el resto en el local.</div>
                </button>
                <button 
                  onClick={() => setReservationType("SIN_ADELANTO")}
                  className={`p-4 rounded-xl border-2 text-left transition-all relative overflow-hidden ${reservationType === "SIN_ADELANTO" ? "border-amber-500 bg-amber-50 shadow-md" : "border-slate-200 bg-white hover:border-amber-300"}`}
                >
                  {reservationType === "SIN_ADELANTO" && <div className="absolute top-0 right-0 w-8 h-8 bg-amber-500 rounded-bl-xl flex items-center justify-center text-white font-bold">✓</div>}
                  <div className="font-black text-slate-800 mb-1">Sin Adelanto</div>
                  <div className="text-xs text-slate-500 font-medium leading-tight">Pagos en puerta. Sujeto a disponibilidad de la cancha.</div>
                </button>
              </div>

              {reservationType === "SIN_ADELANTO" && (
                <div className="p-4 bg-amber-100/50 border border-amber-200 rounded-xl flex gap-3 shadow-inner">
                  <div className="text-amber-500 text-xl">⚠️</div>
                  <div>
                    <span className="font-bold text-amber-900 text-sm block mb-1">Atención</span>
                    <p className="text-amber-800 text-xs font-medium">Hay probabilidad de que alguien que sí cancele un adelanto te gane la hora. Te recomendamos pagar con adelanto para asegurar tu espacio.</p>
                  </div>
                </div>
              )}

              {reservationType === "CON_ADELANTO" && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl shadow-inner mt-4">
                  <label className="block text-sm font-bold text-slate-700 mb-2 flex justify-between">
                    <span>Monto a adelantar</span>
                    <span className="text-slate-400">Total: S/ {totalPrice}</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-3.5 text-slate-400 font-bold">S/</span>
                    <input 
                      type="number"
                      min="1"
                      max={totalPrice}
                      value={adelantoAmount || ""}
                      onChange={(e) => setAdelantoAmount(Number(e.target.value))}
                      className={`w-full rounded-lg border ${adelantoAmount > totalPrice ? 'border-red-500 bg-red-50 focus:ring-red-500/20' : 'border-slate-200 bg-white focus:border-emerald-500 focus:ring-emerald-500/20'} p-3.5 pl-10 focus:outline-none focus:ring-2 transition-all font-bold text-slate-700 shadow-sm`}
                    />
                  </div>
                  {adelantoAmount > totalPrice && (
                    <p className="text-red-500 text-xs mt-2 font-bold flex items-center gap-1">❌ El adelanto no puede ser mayor al costo total.</p>
                  )}
                  {adelantoAmount <= 0 && (
                    <p className="text-red-500 text-xs mt-2 font-bold flex items-center gap-1">❌ El adelanto debe ser mayor a 0.</p>
                  )}
                </div>
              )}
            </div>

            <button onClick={() => setBookingStep("SELECT")} className="w-full py-3 rounded-xl border border-slate-200 text-slate-500 font-bold hover:bg-slate-50 hover:text-slate-700 transition-colors">← Volver a modificar horas</button>
          </div>
        ) : (
          <div className="p-8 overflow-x-auto">
            <div className="min-w-[800px]">
              {/* Header Días */}
              <div className="grid grid-cols-8 gap-2 mb-4">
                <div className="col-span-1"></div>
                {days.map((day) => (
                  <div key={day} className="text-center font-bold text-slate-400 text-sm uppercase tracking-wider">
                    {day}
                  </div>
                ))}
              </div>

              {/* Filas de Horas */}
              <div className="space-y-1.5">
                {allHours.map((hour) => (
                  <div key={hour} className="grid grid-cols-8 gap-2 items-center">
                    <div className="col-span-1 text-right pr-4 font-bold text-slate-400 text-sm">
                      {hour.toString().padStart(2, '0')}:00
                    </div>
                    
                    {days.map((day, dIndex) => {
                      const isOpen = isHourOpen(dIndex, hour);
                      const selected = isSlotSelected(dIndex, hour);
                      
                      return (
                        <button 
                          key={`${day}-${hour}`}
                          onClick={() => toggleSlot(dIndex, hour, isOpen)}
                          className={`
                            h-12 rounded-xl text-xs font-bold transition-all flex items-center justify-center border-2
                            ${!isOpen 
                              ? "bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed opacity-50" 
                              : selected
                                ? "bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-600/30 scale-[1.05] z-10"
                                : "bg-white text-emerald-700 border-emerald-100 hover:border-emerald-400 hover:bg-emerald-50 hover:-translate-y-0.5 cursor-pointer shadow-sm"
                            }
                          `}
                        >
                          {isOpen ? (selected ? "✓ Elegido" : "Libre") : "Cerrado"}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal de Error Hermoso */}
      {errorModal.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full transform transition-all animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl shadow-inner border border-red-200">
              !
            </div>
            <h3 className="text-xl font-black text-slate-900 text-center mb-3">Revisa tus datos</h3>
            <p className="text-slate-500 text-center font-medium leading-relaxed mb-8">
              {errorModal.message}
            </p>
            <button 
              onClick={() => setErrorModal({ isOpen: false, message: "" })}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl transition-colors shadow-lg shadow-slate-900/20"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </>
  );
}
