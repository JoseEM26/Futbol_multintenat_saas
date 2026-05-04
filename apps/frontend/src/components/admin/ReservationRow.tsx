"use client";

import { useState } from "react";
import { updateReservationStatusAction } from "@/app/actions/reservations";
import { useRouter } from "next/navigation";

export function ReservationRow({ res }: { res: any }) {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const handleStatusUpdate = async (status: "CONFIRMADO" | "CANCELADO") => {
    setIsPending(true);
    try {
      const result = await updateReservationStatusAction(res.id, status);
      if (result.success) {
        router.refresh();
      } else {
        alert("Error: " + result.error);
      }
    } catch (err) {
      alert("Error de conexión");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <tr className="hover:bg-slate-50/50 transition-colors">
      <td className="px-6 py-4">
        <div className="font-bold text-slate-800">{res.userName || "Sin nombre"}</div>
        <div className="text-xs text-slate-500">{res.userPhone || "Sin teléfono"}</div>
      </td>
      <td className="px-6 py-4 text-slate-600 font-medium">{res.cancha.name}</td>
      <td className="px-6 py-4">
        <div className="text-sm font-bold text-slate-800">{new Date(res.startTime).toLocaleDateString()}</div>
        <div className="text-xs text-slate-500">
          {new Date(res.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - 
          {new Date(res.endTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
        </div>
      </td>
      <td className="px-6 py-4">
         <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase ${
          res.paymentType === "PALABRA" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
        }`}>
          {res.paymentType === "PALABRA" ? "Por Palabra" : "Con Adelanto"}
        </span>
      </td>
      <td className="px-6 py-4">
        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider shadow-sm border ${
          res.status === "CONFIRMADO" ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
          res.status === "PENDIENTE" ? "bg-amber-50 text-amber-700 border-amber-100" :
          res.status === "PALABRA" ? "bg-purple-50 text-purple-700 border-purple-100" :
          res.status === "CANCELADO" ? "bg-red-50 text-red-700 border-red-100" :
          "bg-slate-50 text-slate-700 border-slate-100"
        }`}>
          {res.status}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex gap-2">
          {(res.status === "PENDIENTE" || res.status === "PALABRA") && (
            <button 
              disabled={isPending}
              onClick={() => handleStatusUpdate("CONFIRMADO")}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-md shadow-emerald-600/20 transition-all disabled:opacity-50"
            >
              Confirmar
            </button>
          )}
          {res.status !== "CANCELADO" && (
            <button 
              disabled={isPending}
              onClick={() => handleStatusUpdate("CANCELADO")}
              className="text-red-500 font-bold text-xs hover:underline disabled:opacity-50"
            >
              Cancelar
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}
