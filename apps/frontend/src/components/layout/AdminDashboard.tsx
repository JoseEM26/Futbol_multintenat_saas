"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Activity, CalendarDays, Settings, Users, LogOut, Menu, HelpCircle } from "lucide-react";
import { signOut, useSession } from "@/lib/auth-client";
import Image from "next/image";
import { usePathname } from "next/navigation";

export function AdminDashboard({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const { data: session, isPending } = useSession();
  const pathname = usePathname();
  const role = session?.user?.role || "TENANT_ADMIN";

  if (isPending) return <div className="h-screen w-full flex items-center justify-center bg-slate-50 text-emerald-600 font-bold">Cargando CanchaSync...</div>;

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans selection:bg-emerald-500/30">
      {/* Sidebar */}
      <aside
        className={cn(
          "flex flex-col border-r border-slate-200 bg-white transition-all duration-300 shadow-sm z-20",
          isSidebarOpen ? "w-64" : "w-20"
        )}
      >
        <div className="flex h-16 items-center justify-between px-4 border-b border-slate-100">
          {isSidebarOpen && (
            <div className="flex items-center gap-2">
              <Image src="/logo.png" alt="Logo" width={28} height={28} className="rounded-md" />
              <span className="text-xl font-extrabold tracking-tight text-slate-800">
                Cancha<span className="text-emerald-600">Sync</span>
              </span>
            </div>
          )}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-md hover:bg-slate-100 text-slate-500 transition-colors ml-auto"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-2 p-4">
          <NavItem icon={<Activity />} label="Resumen General" isOpen={isSidebarOpen} active={pathname === "/dashboard"} href="/dashboard" />
          
          {role === "SUPER_ADMIN" && (
            <>
              <NavItem icon={<Users />} label="Administrar Usuarios" isOpen={isSidebarOpen} active={pathname.startsWith("/dashboard/usuarios")} href="/dashboard/usuarios" />
              <NavItem icon={<CalendarDays />} label="Todas las Reservas" isOpen={isSidebarOpen} active={pathname.startsWith("/dashboard/reservas")} href="/dashboard/reservas" />
              <NavItem icon={<Activity />} label="Gestionar Planes" isOpen={isSidebarOpen} active={pathname.startsWith("/dashboard/planes")} href="/dashboard/planes" />
              <NavItem icon={<Settings />} label="Configuración Global" isOpen={isSidebarOpen} active={pathname.startsWith("/dashboard/config")} href="/dashboard/config" />
            </>
          )}

          {role === "TENANT_ADMIN" && (
            <>
              <NavItem icon={<Activity />} label="Mis Canchas" isOpen={isSidebarOpen} active={pathname.startsWith("/dashboard/canchas")} href="/dashboard/canchas" />
              <NavItem icon={<CalendarDays />} label="Reservas" isOpen={isSidebarOpen} active={pathname.startsWith("/dashboard/reservas")} href="/dashboard/reservas" />
              <NavItem icon={<Settings />} label="Mi Perfil" isOpen={isSidebarOpen} active={pathname.startsWith("/dashboard/perfil")} href="/dashboard/perfil" />
            </>
          )}

          {role === "TENANT_ADMIN" && (
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('replay-tour'))}
              className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-amber-600 hover:bg-amber-50 transition-colors w-full mt-4 border border-dashed border-amber-200"
            >
              <HelpCircle className="w-5 h-5 flex-shrink-0" />
              {isSidebarOpen && <span>Ver Tutorial</span>}
            </button>
          )}


          <NavItem icon={<Activity />} label="Ver Web Pública" isOpen={isSidebarOpen} active={pathname === "/"} href="/" />
        </nav>

        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <button 
            onClick={async () => {
              await signOut();
              window.location.href = "/login";
            }}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            {isSidebarOpen && <span>Cerrar Sesión</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden bg-slate-50/50">
        <header className="h-16 flex items-center justify-between px-8 border-b border-slate-200 bg-white/80 backdrop-blur-md z-10 sticky top-0 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800">
            {role === "SUPER_ADMIN" ? "Super Admin Panel" : role === "TENANT_ADMIN" ? "Panel del Local" : "Mi Panel"}
          </h2>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-bold text-slate-800">{session?.user?.name || "Usuario"}</div>
              <div className={`text-[10px] font-black uppercase tracking-wider ${
                role === "SUPER_ADMIN" ? "text-purple-600" : role === "TENANT_ADMIN" ? "text-emerald-600" : "text-slate-400"
              }`}>{role.replace("_", " ")}</div>
            </div>
            <div className={`h-9 w-9 rounded-full flex items-center justify-center font-bold text-sm shadow-inner ${
              role === "SUPER_ADMIN" ? "bg-purple-100 border border-purple-200 text-purple-700" :
              role === "TENANT_ADMIN" ? "bg-emerald-100 border border-emerald-200 text-emerald-700" :
              "bg-slate-100 border border-slate-200 text-slate-700"
            }`}>
              {(session?.user?.name || "U").split(" ").map((n: string) => n[0]).join("").slice(0,2).toUpperCase()}
            </div>
          </div>
        </header>
        
        <div className="flex-1 overflow-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

function NavItem({ icon, label, isOpen, href = "#", active = false }: { icon: React.ReactNode, label: string, isOpen: boolean, href?: string, active?: boolean }) {
  return (
    <a
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition-all duration-200",
        active 
          ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20" 
          : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
      )}
    >
      <span className={cn("flex-shrink-0 w-5 h-5", active ? "text-white" : "")}>{icon}</span>
      {isOpen && <span>{label}</span>}
    </a>
  );
}
