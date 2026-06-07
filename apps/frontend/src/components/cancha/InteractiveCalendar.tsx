"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession, authClient } from "@/lib/auth-client";
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
  const { data: session } = useSession();
  const [selectedSlots, setSelectedSlots] = useState<{ dayIndex: number; hour: number }[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [reservationType, setReservationType] = useState<"SIN_ADELANTO" | "CON_ADELANTO">("CON_ADELANTO");
  const [adelantoAmount, setAdelantoAmount] = useState<number>(0);
  
  const [bookingStep, setBookingStep] = useState<"SELECT" | "INFO" | "SUCCESS">("SELECT");
  const [lastBookingId, setLastBookingId] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [errorModal, setErrorModal] = useState<{ isOpen: boolean; message: string }>({ isOpen: false, message: "" });

  // Custom client auth states
  const [authTab, setAuthTab] = useState<"LOGIN" | "REGISTER">("LOGIN");
  const [dni, setDni] = useState("");
  const [regName, setRegName] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [activeDayMobile, setActiveDayMobile] = useState<number>(new Date().getDay());
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || "");
      if (session.user.image && !phone) {
        setPhone(session.user.image);
      }
    }
  }, [session, phone]);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (dni.length !== 8) {
      showError("El DNI debe tener exactamente 8 dígitos.");
      return;
    }
    if (authTab === "REGISTER" && !regName.trim()) {
      showError("El nombre completo es requerido.");
      return;
    }
    if (authTab === "REGISTER" && regPhone.length !== 9) {
      showError("El teléfono debe tener exactamente 9 dígitos.");
      return;
    }
    if (authTab === "REGISTER" && !acceptTerms) {
      showError("Debes aceptar las políticas de privacidad y los términos de servicio para poder crear tu cuenta.");
      return;
    }

    setAuthLoading(true);
    try {
      const email = `${dni}@canchapro.local`;

      if (authTab === "LOGIN") {
        const { data, error } = await authClient.signIn.email({
          email,
          password,
          rememberMe,
        });
        if (error) {
          showError(error.message || "DNI o contraseña incorrectos.");
        } else {
          if (data?.user) {
            setName(data.user.name || "");
            if (data.user.image) {
              setPhone(data.user.image);
            }
          }
        }
      } else {
        // REGISTER
        const { data, error } = await authClient.signUp.email({
          email,
          password,
          name: regName,
          image: regPhone, // Store phone number in image metadata as a fallback trick
        });

        if (error) {
          showError(error.message || "Error al crear tu cuenta. El DNI podría estar ya registrado.");
        } else {
          // Auto login after sign up
          const loginRes = await authClient.signIn.email({
            email,
            password,
            rememberMe,
          });
          if (loginRes.error) {
            showError("Cuenta creada con éxito, pero falló el inicio de sesión automático. Por favor, inicia sesión con tu DNI.");
          } else {
            setName(regName);
            setPhone(regPhone);
          }
        }
      }
    } catch (err) {
      showError("Ocurrió un error inesperado al procesar tus credenciales.");
    } finally {
      setAuthLoading(false);
    }
  };

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
    if (!openingHours || openingHours.length === 0) {
      // FALLBACK DE DISPONIBILIDAD: De 07:00 a 23:00 (11 PM) todos los días si no se han configurado horas
      return hour >= 7 && hour < 23;
    }
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
              {(!session?.user && bookingStep === "INFO") ? null : (
                <button 
                  disabled={isPending}
                  onClick={handleReserve}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-emerald-600/20 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
                >
                  {isPending ? "Procesando..." : (bookingStep === "INFO" ? "Confirmar Reserva" : "Continuar →")}
                </button>
              )}
            </div>
          )}
        </div>

        {bookingStep === "INFO" ? (
          <div className="p-8 max-w-lg mx-auto space-y-8">
            {!session?.user ? (
              // FORMULARIO DE INICIO DE SESIÓN / REGISTRO PARA CLIENTES CON DNI
              <div className="bg-white p-8 rounded-[36px] border border-slate-200 shadow-xl space-y-6 animate-in fade-in duration-300">
                <div className="flex bg-slate-100 p-1.5 rounded-2xl shadow-inner">
                  <button 
                    type="button"
                    onClick={() => setAuthTab("LOGIN")} 
                    className={`flex-1 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all ${authTab === "LOGIN" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                  >
                    Iniciar Sesión
                  </button>
                  <button 
                    type="button"
                    onClick={() => setAuthTab("REGISTER")} 
                    className={`flex-1 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all ${authTab === "REGISTER" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                  >
                    Crear Cuenta
                  </button>
                </div>

                <div className="text-center space-y-1">
                  <h3 className="text-xl font-black text-slate-900">
                    {authTab === "LOGIN" ? "Identifícate con tu DNI" : "Regístrate con tu DNI"}
                  </h3>
                  <p className="text-xs text-slate-400 font-bold">
                    {authTab === "LOGIN" 
                      ? "Accede rápidamente para agendar tu cancha." 
                      : "Regístrate una sola vez y mantén tu sesión activa."}
                  </p>
                </div>

                <form onSubmit={handleAuthSubmit} className="space-y-4">
                  {authTab === "REGISTER" && (
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 block">Nombre Completo</label>
                      <input 
                        type="text" 
                        required
                        placeholder="Ej. Juan Pérez" 
                        value={regName} 
                        onChange={(e) => setRegName(e.target.value)} 
                        className="w-full bg-white border border-slate-200 p-3.5 rounded-2xl focus:outline-none focus:border-emerald-500 font-bold text-sm shadow-sm"
                      />
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 block">Número de DNI</label>
                    <input 
                      type="text" 
                      required
                      maxLength={8}
                      placeholder="Ingresa tus 8 dígitos" 
                      value={dni} 
                      onChange={(e) => setDni(e.target.value.replace(/\D/g, ""))} 
                      className="w-full bg-white border border-slate-200 p-3.5 rounded-2xl focus:outline-none focus:border-emerald-500 font-bold text-sm shadow-sm"
                    />
                  </div>

                  {authTab === "REGISTER" && (
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 block">Teléfono de Contacto</label>
                      <input 
                        type="tel" 
                        required
                        maxLength={9}
                        placeholder="Ej. 987654321" 
                        value={regPhone} 
                        onChange={(e) => setRegPhone(e.target.value.replace(/\D/g, ""))} 
                        className="w-full bg-white border border-slate-200 p-3.5 rounded-2xl focus:outline-none focus:border-emerald-500 font-bold text-sm shadow-sm"
                      />
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 block">Contraseña</label>
                    <input 
                      type="password" 
                      required
                      placeholder="••••••••" 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                      className="w-full bg-white border border-slate-200 p-3.5 rounded-2xl focus:outline-none focus:border-emerald-500 font-bold text-sm shadow-sm"
                    />
                  </div>

                  <div className="flex flex-col gap-3 pt-2">
                    {/* Keep Session Open */}
                    <label className="flex items-center gap-3 cursor-pointer select-none">
                      <input 
                        type="checkbox" 
                        checked={rememberMe} 
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded-lg border-slate-300 text-emerald-600 focus:ring-emerald-500 accent-emerald-600 cursor-pointer"
                      />
                      <span className="text-xs text-slate-500 font-bold leading-none">Mantener sesión abierta en este dispositivo</span>
                    </label>

                    {/* Terms & Privacy Checkbox */}
                    {authTab === "REGISTER" && (
                      <label className="flex items-start gap-3 cursor-pointer select-none">
                        <input 
                          type="checkbox" 
                          required
                          checked={acceptTerms} 
                          onChange={(e) => setAcceptTerms(e.target.checked)}
                          className="w-4 h-4 rounded-lg border-slate-300 text-emerald-600 focus:ring-emerald-500 accent-emerald-600 cursor-pointer mt-0.5"
                        />
                        <span className="text-xs text-slate-500 font-medium leading-normal">
                          Acepto las <span className="font-bold text-emerald-600 hover:underline">políticas de privacidad</span> y el uso de mis datos según los términos del servicio.
                        </span>
                      </label>
                    )}
                  </div>

                  <button 
                    type="submit" 
                    disabled={authLoading}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-4 rounded-2xl text-sm transition-all shadow-lg shadow-slate-900/20 active:scale-95 disabled:opacity-50 mt-4 flex items-center justify-center gap-2"
                  >
                    {authLoading ? "Procesando..." : (authTab === "LOGIN" ? "Iniciar Sesión" : "Crear Cuenta y Reservar")}
                  </button>
                </form>
              </div>
            ) : (
              // FORMULARIO DE DETALLES DE RESERVA PARA USUARIOS LOGUEADOS
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4 shadow-inner">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-2">
                  <h3 className="font-bold text-slate-800 text-lg">Sesión Iniciada</h3>
                  <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 font-black text-[9px] px-2.5 py-1 rounded-lg uppercase tracking-wider">Cliente</span>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-1">Nombre Completo</label>
                  <div className="bg-white border border-slate-200 p-3.5 rounded-xl font-bold text-sm text-slate-700 shadow-sm">{name}</div>
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
            )}
            
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

            {session?.user && (
              <button 
                disabled={isPending}
                onClick={handleReserve}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-black text-base shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 mt-6"
              >
                {isPending ? "Procesando..." : `Confirmar y Reservar Ahora (S/ ${totalPrice})`}
              </button>
            )}

            <button onClick={() => setBookingStep("SELECT")} className="w-full py-3 rounded-xl border border-slate-200 text-slate-500 font-bold hover:bg-slate-50 hover:text-slate-700 transition-colors mt-4">← Volver a modificar horas</button>
          </div>
        ) : isMobile ? (
          /* VISTA ULTRA-RESPONSIVA PARA MÓVILES (Día por Día) */
          <div className="p-6 space-y-6 animate-in fade-in duration-300">
            <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100 shadow-inner">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3 text-center">Selecciona el día de juego</span>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none snap-x">
                {days.map((day, index) => {
                  const isActive = activeDayMobile === index;
                  // Count available slots for this day to show a helpful dot
                  let availableCount = 0;
                  for (let h = 0; h < 24; h++) {
                    if (isHourOpen(index, h)) availableCount++;
                  }

                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => setActiveDayMobile(index)}
                      className={`flex-shrink-0 px-4 py-3 rounded-2xl border-2 flex flex-col items-center justify-center min-w-[78px] snap-start transition-all active:scale-95 ${
                        isActive
                          ? "border-emerald-500 bg-emerald-50 text-emerald-800 shadow-sm font-black scale-[1.02]"
                          : "border-slate-200 bg-white text-slate-600 font-bold hover:border-slate-300"
                      }`}
                    >
                      <span className="text-[9px] uppercase tracking-wider leading-none opacity-60">{day.substring(0, 3)}</span>
                      <span className="text-sm mt-1">{day}</span>
                      {availableCount > 0 && (
                        <span className={`w-1.5 h-1.5 rounded-full mt-1.5 ${isActive ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Horarios Disponibles ({days[activeDayMobile]})</span>
                <span className="text-[10px] text-slate-400 font-bold">Toca para seleccionar</span>
              </div>
              
              <div className="grid grid-cols-3 gap-2.5">
                {allHours.map((hour) => {
                  const isOpen = isHourOpen(activeDayMobile, hour);
                  const selected = isSlotSelected(activeDayMobile, hour);
                  
                  return (
                    <button 
                      key={hour}
                      type="button"
                      onClick={() => toggleSlot(activeDayMobile, hour, isOpen)}
                      className={`
                        py-3.5 px-1 rounded-2xl text-xs font-bold transition-all flex flex-col items-center justify-center border-2 min-h-[68px]
                        ${!isOpen 
                          ? "bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed opacity-50" 
                          : selected
                            ? "bg-emerald-600 text-white border-emerald-600 shadow-md scale-[1.03] z-10 font-black"
                            : "bg-white text-emerald-700 border-emerald-100 hover:border-emerald-400 hover:bg-emerald-50 active:scale-95 shadow-sm"
                        }
                      `}
                    >
                      <span className="text-sm font-black">{hour.toString().padStart(2, '0')}:00</span>
                      <span className="text-[9px] font-bold mt-1 opacity-90">
                        {isOpen ? (selected ? "✓ Elegido" : "Libre") : "Cerrado"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          /* VISTA GRILLA COMPLETA PARA ESCRITORIO */
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
