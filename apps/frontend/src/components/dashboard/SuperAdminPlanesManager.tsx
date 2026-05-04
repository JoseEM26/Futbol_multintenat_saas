"use client";

import { useState } from "react";
import { CreditCard, Check, Tag, Plus, Trash2, Edit2, X, Save } from "lucide-react";
import { createPlanAction, updatePlanAction, deletePlanAction } from "@/app/actions/plans";

export function SuperAdminPlanesManager({ initialPlanes }: { initialPlanes: any[] }) {
  const [planes, setPlanes] = useState(initialPlanes);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    oldPrice: "",
    description: "",
    features: "",
    isTrial: false,
    durationDays: 30,
    status: "ACTIVE"
  });

  const handleOpenModal = (plan?: any) => {
    if (plan) {
      setEditingPlan(plan);
      setFormData({
        name: plan.name,
        price: plan.price,
        oldPrice: plan.oldPrice || "",
        description: plan.description || "",
        features: plan.features || "",
        isTrial: plan.isTrial,
        durationDays: plan.durationDays,
        status: plan.status
      });
    } else {
      setEditingPlan(null);
      setFormData({
        name: "",
        price: 0,
        oldPrice: "",
        description: "",
        features: "",
        isTrial: false,
        durationDays: 30,
        status: "ACTIVE"
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const data = {
      ...formData,
      price: Number(formData.price),
      oldPrice: formData.oldPrice ? Number(formData.oldPrice) : null,
    };

    if (editingPlan) {
      const result = await updatePlanAction(editingPlan.id, data);
      if (result.success) {
        setPlanes(planes.map(p => p.id === editingPlan.id ? { ...p, ...data } : p));
        setIsModalOpen(false);
      }
    } else {
      const result = await createPlanAction(data);
      if (result.success && result.plan) {
        setPlanes([...planes, result.plan]);
        setIsModalOpen(false);
      }
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este plan?")) return;
    const result = await deletePlanAction(id);
    if (result.success) {
      setPlanes(planes.filter(p => p.id !== id));
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Gestión de Planes de Suscripción</h1>
          <p className="text-slate-500 font-medium mt-2">Configura los precios, beneficios y estados de los planes del sistema.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-emerald-600 text-white font-black px-6 py-3 rounded-2xl hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" /> Nuevo Plan
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {planes.map((plan) => (
          <div key={plan.id} className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden flex flex-col group hover:shadow-xl transition-all duration-300">
            <div className="p-8 border-b border-slate-100 bg-slate-50/50 relative">
              <div className="flex justify-between items-start mb-6">
                <div className={`p-3 rounded-2xl ${plan.price === 0 ? "bg-blue-100 text-blue-600" : "bg-emerald-100 text-emerald-600 shadow-inner"}`}>
                  <CreditCard className="w-6 h-6" />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleOpenModal(plan)} className="p-2 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-emerald-600 hover:border-emerald-200 transition-all">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(plan.id)} className="p-2 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-red-600 hover:border-red-200 transition-all">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-2xl font-black text-slate-900">{plan.name}</h3>
                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                  plan.status === "ACTIVE" ? "bg-emerald-500 text-white" : "bg-amber-500 text-white"
                }`}>
                  {plan.status === "ACTIVE" ? "Activo" : "Próximamente"}
                </span>
              </div>
              <p className="text-slate-500 text-sm font-medium leading-relaxed">{plan.description}</p>
            </div>
            
            <div className="p-8 flex-1 space-y-8">
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black text-slate-900">S/ {plan.price}</span>
                {plan.oldPrice && (
                  <span className="text-slate-400 line-through font-bold text-xl">S/ {plan.oldPrice}</span>
                )}
                <span className="text-slate-400 text-sm font-black uppercase tracking-widest ml-1">/ mes</span>
              </div>

              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Incluye</p>
                {plan.features?.split(",").map((feature: string, i: number) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-slate-700 font-bold">
                    <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-emerald-600" />
                    </div>
                    <span>{feature.trim()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[40px] w-full max-w-2xl p-10 shadow-2xl animate-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-black text-slate-900">
                {editingPlan ? "Editar Plan" : "Nuevo Plan de Suscripción"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-3 bg-slate-100 rounded-2xl hover:bg-slate-200 transition-all">
                <X className="w-6 h-6 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-xs font-black text-slate-400 uppercase ml-2">Nombre del Plan</label>
                <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl focus:outline-emerald-500 font-bold" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-black text-slate-400 uppercase ml-2">Precio Mensual (S/)</label>
                <input type="number" required value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl focus:outline-emerald-500 font-bold" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-black text-slate-400 uppercase ml-2">Precio Anterior (Opcional)</label>
                <input type="number" value={formData.oldPrice} onChange={e => setFormData({...formData, oldPrice: e.target.value})} className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl focus:outline-emerald-500 font-bold" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-black text-slate-400 uppercase ml-2">Estado</label>
                <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl focus:outline-emerald-500 font-bold">
                  <option value="ACTIVE">Activo</option>
                  <option value="COMING_SOON">Próximamente</option>
                </select>
              </div>
              <div className="col-span-2 space-y-1">
                <label className="text-xs font-black text-slate-400 uppercase ml-2">Descripción Corta</label>
                <input required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl focus:outline-emerald-500 font-bold" />
              </div>
              <div className="col-span-2 space-y-1">
                <label className="text-xs font-black text-slate-400 uppercase ml-2">Características (separadas por coma)</label>
                <textarea required value={formData.features} onChange={e => setFormData({...formData, features: e.target.value})} className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl focus:outline-emerald-500 font-bold h-32" />
              </div>
              
              <div className="col-span-2 flex items-center gap-4 bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                <input type="checkbox" checked={formData.isTrial} onChange={e => setFormData({...formData, isTrial: e.target.checked})} className="w-5 h-5 rounded border-emerald-300 text-emerald-600 focus:ring-emerald-500" id="isTrial" />
                <label htmlFor="isTrial" className="text-sm font-bold text-emerald-900 cursor-pointer">Este plan es de prueba gratuita (Trial)</label>
              </div>

              <div className="col-span-2 pt-4">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-emerald-600 text-white font-black py-5 rounded-2xl text-xl shadow-xl shadow-emerald-600/20 hover:bg-emerald-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? "Guardando..." : <><Save className="w-6 h-6" /> Guardar Cambios</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
