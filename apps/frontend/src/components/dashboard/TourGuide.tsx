"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { X, ArrowRight, ArrowLeft } from "lucide-react";
import { markTourAsSeenAction } from "@/app/actions/admin";

export interface TourStep {
  target: string;
  title: string;
  content: string;
  icon: React.ReactNode;
}

interface TourGuideProps {
  steps: TourStep[];
  userId?: string;
  /** If true, persists "seen" to DB. If false, only local dismiss. */
  persist?: boolean;
  onComplete: () => void;
}

export function TourGuide({ steps, userId, persist = false, onComplete }: TourGuideProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const highlightTarget = useCallback((stepIndex: number, add: boolean) => {
    const el = document.getElementById(steps[stepIndex]?.target);
    if (!el) return;
    const classes = ['ring-4', 'ring-emerald-500', 'ring-offset-4', 'transition-all', 'duration-500', 'rounded-2xl', 'z-[201]', 'relative'];
    if (add) el.classList.add(...classes);
    else el.classList.remove(...classes);
  }, [steps]);

  const positionModal = useCallback(() => {
    const el = document.getElementById(steps[currentStep]?.target);
    const modal = modalRef.current;
    if (!modal) return;

    if (!el) {
      // Center in viewport if target not found
      modal.style.top = '50%';
      modal.style.left = '50%';
      modal.style.transform = 'translate(-50%, -50%)';
      setTimeout(() => setIsMoving(false), 400);
      return;
    }

    modal.style.transform = 'none';
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });

    setTimeout(() => {
      const targetRect = el.getBoundingClientRect();
      const modalRect = modal.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const modalW = modalRect.width || 400;
      const modalH = modalRect.height || 380;
      const gap = 16;

      let top: number;
      let left: number;

      // Prefer below
      if (targetRect.bottom + gap + modalH <= vh - 20) {
        top = targetRect.bottom + gap;
      }
      // Then above
      else if (targetRect.top - gap - modalH >= 20) {
        top = targetRect.top - gap - modalH;
      }
      // Fallback: center
      else {
        top = Math.max(20, (vh - modalH) / 2);
      }

      left = targetRect.left;
      if (left + modalW > vw - 20) left = vw - modalW - 20;
      if (left < 20) left = 20;

      modal.style.top = `${top}px`;
      modal.style.left = `${left}px`;

      highlightTarget(currentStep, true);
      setTimeout(() => setIsMoving(false), 400);
    }, 350);
  }, [currentStep, highlightTarget, steps]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
      positionModal();
    }, 600);
    return () => clearTimeout(timer);
  }, [currentStep, positionModal]);

  const goToStep = (direction: 'next' | 'prev') => {
    if (isMoving) return;
    setIsMoving(true);
    highlightTarget(currentStep, false);

    if (direction === 'next') {
      if (currentStep < steps.length - 1) setCurrentStep(s => s + 1);
      else handleComplete();
    } else {
      setCurrentStep(s => Math.max(0, s - 1));
    }
  };

  const handleComplete = async () => {
    highlightTarget(currentStep, false);
    setIsVisible(false);
    if (persist && userId) await markTourAsSeenAction(userId);
    onComplete();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[200]">
      <div className="absolute inset-0 bg-slate-900/40 cursor-pointer" onClick={handleComplete} />
      
      <div 
        ref={modalRef}
        className="fixed w-[calc(100vw-40px)] max-w-[400px] bg-white rounded-[40px] shadow-[0_30px_80px_-10px_rgba(0,0,0,0.35)] pointer-events-auto border border-slate-100 overflow-hidden"
        style={{ 
          top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          transition: 'top 0.5s cubic-bezier(0.22, 1, 0.36, 1), left 0.5s cubic-bezier(0.22, 1, 0.36, 1)' 
        }}
      >
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

          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-1.5">
              {steps.map((_, i) => (
                <div key={i} className={`h-2 rounded-full transition-all duration-500 ${i === currentStep ? "w-8 bg-emerald-500" : "w-2 bg-slate-100"}`} />
              ))}
            </div>
            
            <div className="flex gap-2">
              {currentStep > 0 && (
                <button onClick={() => goToStep('prev')} disabled={isMoving}
                  className="w-12 h-12 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center hover:bg-slate-100 hover:text-slate-900 transition-all disabled:opacity-30 active:scale-90">
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}
              <button onClick={() => goToStep('next')} disabled={isMoving}
                className="group flex items-center gap-2 bg-slate-950 text-white px-6 h-12 rounded-xl font-black text-sm hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 active:scale-95 disabled:opacity-50">
                <span>{currentStep === steps.length - 1 ? "¡Entendido!" : "Siguiente"}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>

          <div className="pt-5 border-t border-slate-100 flex justify-between items-center">
             <button onClick={handleComplete} className="text-[11px] font-black text-slate-300 hover:text-slate-900 transition-colors uppercase tracking-widest">Omitir</button>
             <div className="text-[11px] font-black text-slate-400">Paso {currentStep + 1} de {steps.length}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
