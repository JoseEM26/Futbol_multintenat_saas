"use client";

import { X, AlertCircle, CheckCircle2, Info, AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";

type ModalType = "error" | "success" | "info" | "warning";

interface CustomModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: ModalType;
}

export function CustomModal({ isOpen, onClose, title, message, type = "error" }: CustomModalProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShow(true);
    } else {
      const timer = setTimeout(() => setShow(false), 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen && !show) return null;

  const icons = {
    error: <AlertCircle className="w-12 h-12 text-red-500" />,
    success: <CheckCircle2 className="w-12 h-12 text-emerald-500" />,
    info: <Info className="w-12 h-12 text-blue-500" />,
    warning: <AlertTriangle className="w-12 h-12 text-amber-500" />,
  };

  const bgColors = {
    error: "bg-red-50",
    success: "bg-emerald-50",
    info: "bg-blue-50",
    warning: "bg-amber-50",
  };

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-300 ${
      isOpen ? "opacity-100" : "opacity-0"
    }`}>
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className={`relative bg-white rounded-[40px] w-full max-w-md p-8 shadow-2xl transition-all duration-300 transform ${
        isOpen ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
      }`}>
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 bg-slate-100 rounded-2xl hover:bg-slate-200 transition-all"
        >
          <X className="w-5 h-5 text-slate-500" />
        </button>

        <div className="text-center">
          <div className={`w-20 h-20 ${bgColors[type]} rounded-[30px] flex items-center justify-center mx-auto mb-6 shadow-inner`}>
            {icons[type]}
          </div>
          
          <h3 className="text-2xl font-black text-slate-900 mb-3">{title}</h3>
          <p className="text-slate-500 font-medium leading-relaxed mb-8">
            {message}
          </p>

          <button 
            onClick={onClose}
            className={`w-full py-4 rounded-2xl font-black text-white shadow-xl transition-all active:scale-[0.98] ${
              type === "error" ? "bg-red-500 shadow-red-500/20 hover:bg-red-600" : 
              type === "success" ? "bg-emerald-500 shadow-emerald-500/20 hover:bg-emerald-600" :
              type === "warning" ? "bg-amber-500 shadow-amber-500/20 hover:bg-amber-600" :
              "bg-blue-500 shadow-blue-500/20 hover:bg-blue-600"
            }`}
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}
