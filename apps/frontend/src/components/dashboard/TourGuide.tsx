"use client";

import React, { useState, useEffect } from "react";
import { X, ArrowRight, ArrowLeft, CheckCircle2, Info, Star, Settings, LayoutDashboard, Building } from "lucide-react";
import { markTourAsSeenAction } from "@/app/actions/admin";

interface Step {
  target: string;
  title: string;
  content: string;
  icon: React.ReactNode;
}

const steps: Step[] = [
  {
    target: "dashboard-welcome",
    title: "¡Bienvenido a CanchaSync!",
    content: "Este es tu nuevo centro de mando. Aquí verás un resumen rápido de cómo va tu negocio hoy.",
    icon: <LayoutDashboard className="w-8 h-8 text-emerald-500" />
  },
  {
    target: "dashboard-stats",
    title: "Tus Números en Tiempo Real",
    content: "Controla tus ingresos mensuales y las reservas del día de un vistazo. ¡Todo con datos reales de tus canchas!",
    icon: <Star className="w-8 h-8 text-amber-500" />
  },
  {
    target: "dashboard-canchas-tab",
    title: "Gestiona tus Canchas",
    content: "Aquí puedes agregar nuevos espacios o editar los precios. Recuerda que tu plan actual tiene un límite máximo de canchas.",
    icon: <Building className="w-8 h-8 text-blue-500" />
  },
  {
    target: "dashboard-config-tab",
    title: "Configuración Crucial",
    content: "¡ESTA ES LA PARTE MÁS IMPORTANTE! Necesitas completar tu perfil (Logo, Horarios, Descripción) para que tu página web pública se vea profesional y completa.",
    icon: <Settings className="w-8 h-8 text-slate-700" />
  },
  {
    target: "dashboard-public-link",
    title: "Tu Ventana al Mundo",
    content: "Este es el link que debes compartir con tus clientes. Todo lo que edites en 'Configuración' se verá reflejado aquí al instante.",
    icon: <CheckCircle2 className="w-8 h-8 text-emerald-600" />
  }
];

export function TourGuide({ userId, onComplete }: { userId: string, onComplete: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      updatePosition();
      setIsVisible(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, [currentStep]);

  const updatePosition = () => {
    const targetId = steps[currentStep].target;
    const element = document.getElementById(targetId);
    
    if (element) {
      const rect = element.getBoundingClientRect();
      const isMobile = window.innerWidth < 768;
      
      setPosition({
        top: rect.bottom + window.scrollY + 20,
        left: isMobile ? 20 : rect.left + window.scrollX
      });
      
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      element.classList.add('ring-4', 'ring-emerald-500', 'ring-offset-4', 'transition-all', 'duration-500', 'rounded-2xl');
    } else {
      // Fallback to center if element not found
      setPosition({
        top: window.innerHeight / 2 + window.scrollY - 100,
        left: window.innerWidth / 2 - 150
      });
    }
  };

  const nextStep = () => {
    const element = document.getElementById(steps[currentStep].target);
    if (element) element.classList.remove('ring-4', 'ring-emerald-500', 'ring-offset-4');
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const prevStep = () => {
    const element = document.getElementById(steps[currentStep].target);
    if (element) element.classList.remove('ring-4', 'ring-emerald-500', 'ring-offset-4');
    setCurrentStep(Math.max(0, currentStep - 1));
  };

  const handleComplete = async () => {
    const element = document.getElementById(steps[currentStep].target);
    if (element) element.classList.remove('ring-4', 'ring-emerald-500', 'ring-offset-4');
    setIsVisible(false);
    await markTourAsSeenAction(userId);
    onComplete();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[200] pointer-events-none">
      <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-[2px] pointer-events-auto" onClick={handleComplete} />
      
      <div 
        className="absolute w-[calc(100%-40px)] md:w-[350px] bg-white rounded-[32px] shadow-2xl p-8 pointer-events-auto animate-in zoom-in slide-in-from-top-4 duration-500 border border-slate-100"
        style={{ top: position.top, left: position.left }}
      >
        {/* Connector Arrow */}
        <div className="absolute -top-3 left-10 w-6 h-6 bg-white rotate-45 border-l border-t border-slate-100" />

        <div className="flex justify-between items-start mb-6">
          <div className="p-3 bg-slate-50 rounded-2xl">
            {steps[currentStep].icon}
          </div>
          <button onClick={handleComplete} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <h4 className="text-xl font-black text-slate-900 mb-3">{steps[currentStep].title}</h4>
        <p className="text-slate-500 font-medium text-sm leading-relaxed mb-8">
          {steps[currentStep].content}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            {steps.map((_, i) => (
              <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === currentStep ? "w-6 bg-emerald-500" : "w-1.5 bg-slate-200"}`} />
            ))}
          </div>
          
          <div className="flex gap-2">
            {currentStep > 0 && (
              <button onClick={prevStep} className="p-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-all">
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <button 
              onClick={nextStep}
              className="flex items-center gap-2 bg-slate-900 text-white px-5 py-3 rounded-xl font-black text-sm hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20"
            >
              {currentStep === steps.length - 1 ? "¡Entendido!" : "Siguiente"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-slate-50 flex justify-between items-center">
           <button onClick={handleComplete} className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-widest">Omitir Tutorial</button>
           <div className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md uppercase tracking-tighter">Paso {currentStep + 1} de {steps.length}</div>
        </div>
      </div>
    </div>
  );
}
