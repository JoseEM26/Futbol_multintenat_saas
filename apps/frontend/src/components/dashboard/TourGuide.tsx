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
  const [isMoving, setIsMoving] = useState(false);

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
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const modalWidth = 350;
      const modalHeight = 250; // Approximate
      
      let top = rect.bottom + window.scrollY + 20;
      let left = rect.left + window.scrollX;

      // Adjust if it goes off-screen horizontally
      if (left + modalWidth > viewportWidth - 20) {
        left = viewportWidth - modalWidth - 20;
      }
      if (left < 20) {
        left = 20;
      }

      // Adjust if it goes off-screen vertically
      if (rect.bottom + modalHeight > viewportHeight - 20) {
        top = rect.top + window.scrollY - modalHeight - 20;
      }

      setPosition({ top, left });
      
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      element.classList.add('ring-4', 'ring-emerald-500', 'ring-offset-4', 'transition-all', 'duration-500', 'rounded-2xl', 'z-[150]', 'relative');
      
      // Unlock buttons after transition finishes
      setTimeout(() => setIsMoving(false), 600);
    } else {
      setPosition({
        top: window.innerHeight / 2 + window.scrollY - 100,
        left: Math.max(20, (window.innerWidth - 350) / 2)
      });
      setTimeout(() => setIsMoving(false), 600);
    }
  };

  const nextStep = () => {
    if (isMoving) return;
    setIsMoving(true);
    
    const element = document.getElementById(steps[currentStep].target);
    if (element) {
      element.classList.remove('ring-4', 'ring-emerald-500', 'ring-offset-4', 'z-[150]', 'relative');
    }
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const prevStep = () => {
    if (isMoving) return;
    setIsMoving(true);

    const element = document.getElementById(steps[currentStep].target);
    if (element) {
      element.classList.remove('ring-4', 'ring-emerald-500', 'ring-offset-4', 'z-[150]', 'relative');
    }
    setCurrentStep(Math.max(0, currentStep - 1));
  };

  const handleComplete = async () => {
    const element = document.getElementById(steps[currentStep].target);
    if (element) {
      element.classList.remove('ring-4', 'ring-emerald-500', 'ring-offset-4', 'z-[150]', 'relative');
    }
    setIsVisible(false);
    await markTourAsSeenAction(userId);
    onComplete();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[200] pointer-events-none">
      {/* Subtle overlay without blur to maintain dashboard readability */}
      <div className="absolute inset-0 bg-slate-900/40 pointer-events-auto" onClick={handleComplete} />
      
      <div 
        className="absolute w-[calc(100%-40px)] md:w-[400px] bg-white rounded-[48px] shadow-[0_30px_100px_-15px_rgba(0,0,0,0.4)] p-12 pointer-events-auto animate-in zoom-in slide-in-from-top-10 duration-700 ease-out border border-slate-100"
        style={{ 
          top: position.top, 
          left: position.left,
          transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)' 
        }}
      >
        <div className="flex justify-between items-center mb-10">
          <div className="w-16 h-16 bg-emerald-50 rounded-[24px] flex items-center justify-center text-emerald-600 shadow-inner">
            {steps[currentStep].icon}
          </div>
          <button onClick={handleComplete} className="p-3 hover:bg-slate-50 rounded-2xl transition-all hover:rotate-90 duration-300">
            <X className="w-6 h-6 text-slate-300" />
          </button>
        </div>

        <h4 className="text-3xl font-black text-slate-900 mb-5 tracking-tight leading-[1.1]">{steps[currentStep].title}</h4>
        <p className="text-slate-500 font-medium text-lg leading-relaxed mb-12">
          {steps[currentStep].content}
        </p>

        <div className="flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {steps.map((_, i) => (
                <div key={i} className={`h-2 rounded-full transition-all duration-700 ${i === currentStep ? "w-10 bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)]" : "w-2 bg-slate-100"}`} />
              ))}
            </div>
            
            <div className="flex gap-3">
              {currentStep > 0 && (
                <button 
                  onClick={prevStep} 
                  disabled={isMoving}
                  className="w-14 h-14 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center hover:bg-slate-100 hover:text-slate-900 transition-all disabled:opacity-30 active:scale-90"
                >
                  <ArrowLeft className="w-6 h-6" />
                </button>
              )}
              <button 
                onClick={nextStep}
                disabled={isMoving}
                className="group flex items-center gap-3 bg-slate-950 text-white px-8 h-14 rounded-2xl font-black text-lg hover:bg-slate-800 transition-all shadow-2xl shadow-slate-900/30 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>{currentStep === steps.length - 1 ? "Finalizar" : "Siguiente"}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-50 flex justify-between items-center">
             <button onClick={handleComplete} className="text-xs font-black text-slate-300 hover:text-slate-900 transition-colors uppercase tracking-[0.2em]">Omitir Tour</button>
             <div className="flex items-center gap-2.5">
                <div className="relative">
                   <div className={`w-2.5 h-2.5 bg-emerald-500 rounded-full ${isMoving ? 'animate-ping' : ''}`} />
                   {!isMoving && <div className="absolute inset-0 w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />}
                </div>
                <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest">GUÍA SINCRONIZADA</div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
