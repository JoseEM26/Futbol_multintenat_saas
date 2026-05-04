"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { X, ArrowRight, ArrowLeft, CheckCircle2, Star, Settings, LayoutDashboard, Building } from "lucide-react";
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
    icon: <LayoutDashboard className="w-7 h-7" />
  },
  {
    target: "dashboard-stats",
    title: "Tus Números en Tiempo Real",
    content: "Controla tus ingresos mensuales y las reservas del día de un vistazo. ¡Todo con datos reales de tus canchas!",
    icon: <Star className="w-7 h-7" />
  },
  {
    target: "dashboard-canchas-tab",
    title: "Gestiona tus Canchas",
    content: "Aquí puedes agregar nuevos espacios o editar los precios. Recuerda que tu plan actual tiene un límite máximo de canchas.",
    icon: <Building className="w-7 h-7" />
  },
  {
    target: "dashboard-config-tab",
    title: "Configuración Crucial",
    content: "¡IMPORTANTE! Necesitas completar tu perfil (Logo, Horarios, Descripción) para que tu página web pública se vea profesional.",
    icon: <Settings className="w-7 h-7" />
  },
  {
    target: "dashboard-public-link",
    title: "Tu Ventana al Mundo",
    content: "Este es el link que debes compartir con tus clientes. Lo que edites en 'Configuración' se verá reflejado aquí.",
    icon: <CheckCircle2 className="w-7 h-7" />
  }
];

export function TourGuide({ userId, onComplete }: { userId: string, onComplete: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Highlight the current target element
  const highlightTarget = useCallback((stepIndex: number, add: boolean) => {
    const el = document.getElementById(steps[stepIndex].target);
    if (!el) return;
    const classes = ['ring-4', 'ring-emerald-500', 'ring-offset-4', 'transition-all', 'duration-500', 'rounded-2xl', 'z-[201]', 'relative'];
    if (add) {
      el.classList.add(...classes);
    } else {
      el.classList.remove(...classes);
    }
  }, []);

  // Position the modal relative to the target, always within viewport
  const positionModal = useCallback(() => {
    const el = document.getElementById(steps[currentStep].target);
    const modal = modalRef.current;
    if (!el || !modal) return;

    // Scroll target into view first
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Wait for scroll to settle, then position
    setTimeout(() => {
      const targetRect = el.getBoundingClientRect();
      const modalRect = modal.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const modalW = modalRect.width || 400;
      const modalH = modalRect.height || 400;
      const gap = 16;

      let top: number;
      let left: number;

      // Prefer placing below the target
      if (targetRect.bottom + gap + modalH <= vh - 20) {
        top = targetRect.bottom + gap;
      }
      // Otherwise place above the target
      else if (targetRect.top - gap - modalH >= 20) {
        top = targetRect.top - gap - modalH;
      }
      // Last resort: center vertically in viewport
      else {
        top = Math.max(20, (vh - modalH) / 2);
      }

      // Horizontal: try to align with target's left edge
      left = targetRect.left;
      // Clamp to viewport
      if (left + modalW > vw - 20) left = vw - modalW - 20;
      if (left < 20) left = 20;

      modal.style.top = `${top}px`;
      modal.style.left = `${left}px`;

      highlightTarget(currentStep, true);
      setTimeout(() => setIsMoving(false), 400);
    }, 350);
  }, [currentStep, highlightTarget]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
      positionModal();
    }, 800);
    return () => clearTimeout(timer);
  }, [currentStep, positionModal]);

  const goToStep = (direction: 'next' | 'prev') => {
    if (isMoving) return;
    setIsMoving(true);
    highlightTarget(currentStep, false);

    if (direction === 'next') {
      if (currentStep < steps.length - 1) {
        setCurrentStep(s => s + 1);
      } else {
        handleComplete();
      }
    } else {
      setCurrentStep(s => Math.max(0, s - 1));
    }
  };

  const handleComplete = async () => {
    highlightTarget(currentStep, false);
    setIsVisible(false);
    await markTourAsSeenAction(userId);
    onComplete();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[200]">
      {/* Overlay */}
      <div className="absolute inset-0 bg-slate-900/40 cursor-pointer" onClick={handleComplete} />
      
      {/* Modal - uses fixed positioning so it never leaves the viewport */}
      <div 
        ref={modalRef}
        className="fixed w-[calc(100vw-40px)] max-w-[400px] bg-white rounded-[40px] shadow-[0_30px_80px_-10px_rgba(0,0,0,0.35)] pointer-events-auto border border-slate-100 overflow-hidden"
        style={{ 
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          transition: 'top 0.5s cubic-bezier(0.22, 1, 0.36, 1), left 0.5s cubic-bezier(0.22, 1, 0.36, 1)' 
        }}
      >
        {/* Green accent bar at top */}
        <div className="h-1.5 bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-500" />

        <div className="p-10">
          <div className="flex justify-between items-center mb-8">
            <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
              {steps[currentStep].icon}
            </div>
            <button onClick={handleComplete} className="w-10 h-10 flex items-center justify-center hover:bg-slate-50 rounded-xl transition-all hover:rotate-90 duration-300">
              <X className="w-5 h-5 text-slate-300" />
            </button>
          </div>

          <h4 className="text-2xl font-black text-slate-900 mb-3 tracking-tight leading-tight">{steps[currentStep].title}</h4>
          <p className="text-slate-500 font-medium text-[15px] leading-relaxed mb-8">
            {steps[currentStep].content}
          </p>

          {/* Progress + Buttons */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-1.5">
              {steps.map((_, i) => (
                <div key={i} className={`h-2 rounded-full transition-all duration-500 ${i === currentStep ? "w-8 bg-emerald-500" : "w-2 bg-slate-100"}`} />
              ))}
            </div>
            
            <div className="flex gap-2">
              {currentStep > 0 && (
                <button 
                  onClick={() => goToStep('prev')} 
                  disabled={isMoving}
                  className="w-12 h-12 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center hover:bg-slate-100 hover:text-slate-900 transition-all disabled:opacity-30 active:scale-90"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}
              <button 
                onClick={() => goToStep('next')}
                disabled={isMoving}
                className="group flex items-center gap-2 bg-slate-950 text-white px-6 h-12 rounded-xl font-black text-sm hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 active:scale-95 disabled:opacity-50"
              >
                <span>{currentStep === steps.length - 1 ? "¡Entendido!" : "Siguiente"}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>

          <div className="pt-5 border-t border-slate-100 flex justify-between items-center">
             <button onClick={handleComplete} className="text-[11px] font-black text-slate-300 hover:text-slate-900 transition-colors uppercase tracking-widest">Omitir</button>
             <div className="text-[11px] font-black text-slate-400">
                Paso {currentStep + 1} de {steps.length}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
