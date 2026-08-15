import type { ModuleDef, ModuleId, ModuleState } from "./types";

export const MODULE_CATALOG: ModuleDef[] = [
  {
    id: "cover",
    label: "Portada",
    description: "Nombres, fecha y apertura animada",
    locked: true,
    defaultEnabled: true,
  },
  {
    id: "countdown",
    label: "Cuenta regresiva",
    description: "Reloj en vivo hasta el gran día",
    defaultEnabled: true,
  },
  {
    id: "hosts",
    label: "Nuestra historia",
    description: "Texto de los anfitriones y firma",
    defaultEnabled: true,
  },
  {
    id: "itinerary",
    label: "Itinerario",
    description: "Ceremonia, fiesta y horarios",
    defaultEnabled: true,
  },
  {
    id: "location",
    label: "Ubicación",
    description: "Mapa e indicaciones",
    defaultEnabled: true,
  },
  {
    id: "dresscode",
    label: "Dress code",
    description: "Estilo de vestimenta del evento",
    defaultEnabled: true,
  },
  {
    id: "gallery",
    label: "Álbum de fotos",
    description: "Recorrido fotográfico",
    defaultEnabled: true,
  },
  {
    id: "music",
    label: "Música",
    description: "Tema de fondo y lista de canciones",
    defaultEnabled: false,
  },
  {
    id: "gifts",
    label: "Regalos",
    description: "Alias, CBU o mesa de regalos",
    defaultEnabled: true,
  },
  {
    id: "rsvp",
    label: "Confirmar asistencia",
    description: "RSVP aceptar / rechazar",
    defaultEnabled: true,
  },
  {
    id: "menu",
    label: "Menú",
    description: "Opciones gastronómicas",
    defaultEnabled: false,
  },
  {
    id: "stay",
    label: "Alojamiento",
    description: "Hoteles sugeridos para invitados",
    defaultEnabled: false,
  },
  {
    id: "transport",
    label: "Transporte",
    description: "Cómo llegar y transfers",
    defaultEnabled: false,
  },
  {
    id: "instagram",
    label: "Instagram wall",
    description: "Hashtag y muro del evento",
    defaultEnabled: false,
  },
  {
    id: "faq",
    label: "Preguntas frecuentes",
    description: "Niños, estacionamiento, horarios",
    defaultEnabled: false,
  },
];

export function defaultModules(): ModuleState[] {
  return MODULE_CATALOG.map((mod) => ({
    id: mod.id,
    enabled: mod.defaultEnabled,
  }));
}

export function enabledModules(modules: ModuleState[]): ModuleState[] {
  return modules.filter((m) => m.enabled);
}

export function toggleModule(
  modules: ModuleState[],
  id: ModuleId,
  enabled: boolean,
): ModuleState[] {
  const def = MODULE_CATALOG.find((m) => m.id === id);
  if (def?.locked) return modules;
  return modules.map((m) => (m.id === id ? { ...m, enabled } : m));
}

export function reorderModules(
  modules: ModuleState[],
  activeId: ModuleId,
  overId: ModuleId,
): ModuleState[] {
  const from = modules.findIndex((m) => m.id === activeId);
  const to = modules.findIndex((m) => m.id === overId);
  if (from < 0 || to < 0 || from === to) return modules;
  const next = [...modules];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

export function moduleLabel(id: ModuleId): string {
  return MODULE_CATALOG.find((m) => m.id === id)?.label ?? id;
}
