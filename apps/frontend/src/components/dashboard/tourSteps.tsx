import React from "react";
import { LayoutDashboard, Star, Building, Settings, CheckCircle2, CalendarDays, Clock, Users, DollarSign, MapPin, Globe, FileText } from "lucide-react";
import type { TourStep } from "@/components/dashboard/TourGuide";

export const dashboardTourSteps: TourStep[] = [
  {
    target: "dashboard-welcome",
    title: "¡Bienvenido a CanchaSync!",
    content: "Este es tu centro de mando. Aquí verás un resumen rápido de cómo va tu negocio hoy.",
    icon: <LayoutDashboard className="w-7 h-7" />
  },
  {
    target: "dashboard-stats",
    title: "Tus Números en Tiempo Real",
    content: "Controla tus ingresos mensuales y las reservas del día. ¡Todo con datos reales de tus canchas!",
    icon: <Star className="w-7 h-7" />
  },
  {
    target: "dashboard-canchas-tab",
    title: "Gestiona tus Canchas",
    content: "Aquí puedes agregar nuevos espacios o editar precios. Tu plan tiene un límite máximo de canchas.",
    icon: <Building className="w-7 h-7" />
  },
  {
    target: "dashboard-config-tab",
    title: "Configuración Crucial",
    content: "¡IMPORTANTE! Completa tu perfil (Logo, Horarios, Descripción) para que tu página web pública se vea profesional.",
    icon: <Settings className="w-7 h-7" />
  },
  {
    target: "dashboard-public-link",
    title: "Tu Ventana al Mundo",
    content: "Este es el link que debes compartir con tus clientes. Lo que edites en 'Configuración' se verá aquí al instante.",
    icon: <CheckCircle2 className="w-7 h-7" />
  }
];

export const canchasTourSteps: TourStep[] = [
  {
    target: "canchas-header",
    title: "Tus Espacios Deportivos",
    content: "Aquí gestionas todas tus canchas. Puedes ver cuántas tienes creadas y cuántas permite tu plan.",
    icon: <Building className="w-7 h-7" />
  },
  {
    target: "canchas-new-btn",
    title: "Crear Nueva Cancha",
    content: "Presiona este botón para agregar una nueva cancha. Recuerda que tu plan puede limitar la cantidad.",
    icon: <CheckCircle2 className="w-7 h-7" />
  },
  {
    target: "canchas-list",
    title: "Lista de Canchas",
    content: "Aquí ves todas tus canchas. Puedes editarlas, cambiar el precio o eliminarlas.",
    icon: <FileText className="w-7 h-7" />
  }
];

export const reservasTourSteps: TourStep[] = [
  {
    target: "reservas-header",
    title: "Módulo de Reservas",
    content: "Aquí puedes ver todas las reservas que tus clientes han hecho en tus canchas.",
    icon: <CalendarDays className="w-7 h-7" />
  },
  {
    target: "reservas-filters",
    title: "Filtra tus Reservas",
    content: "Usa los filtros para buscar reservas por fecha, estado o cancha específica.",
    icon: <Clock className="w-7 h-7" />
  },
  {
    target: "reservas-list",
    title: "Detalle de Reservas",
    content: "Cada fila muestra un cliente, la cancha, la hora y el estado del pago. Puedes confirmar o cancelar reservas.",
    icon: <DollarSign className="w-7 h-7" />
  }
];

export const perfilTourSteps: TourStep[] = [
  {
    target: "perfil-header",
    title: "Tu Perfil de Complejo",
    content: "Aquí gestionas toda la información pública de tu negocio. Es lo que tus clientes verán en tu web.",
    icon: <Globe className="w-7 h-7" />
  },
  {
    target: "perfil-basic",
    title: "Información Básica",
    content: "Completa el nombre comercial, la descripción y tu slug personalizado para tener tu propia URL.",
    icon: <FileText className="w-7 h-7" />
  },
  {
    target: "perfil-location",
    title: "Ubicación y Horarios",
    content: "Agrega tu dirección exacta, horario de atención y precio base. ¡Esto ayuda a tus clientes a encontrarte!",
    icon: <MapPin className="w-7 h-7" />
  },
  {
    target: "perfil-payments",
    title: "Pagos y Personal",
    content: "Configura el nombre del titular de Yape/Plin y los datos de tu equipo de trabajo.",
    icon: <Users className="w-7 h-7" />
  }
];
