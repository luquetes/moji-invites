import type {
  ModuleDef,
  ModuleFieldDef,
  ModuleId,
  ModuleState,
} from "./types";

function fields(...defs: ModuleFieldDef[]): ModuleFieldDef[] {
  return defs;
}

export const MODULE_CATALOG: ModuleDef[] = [
  {
    id: "cover",
    label: "Portada",
    description: "Nombres, fecha y apertura animada",
    locked: true,
    defaultEnabled: true,
    fields: fields(
      { key: "title", label: "Título", kind: "text" },
      { key: "subtitle", label: "Bajada", kind: "text" },
      { key: "date", label: "Fecha", kind: "date" },
      { key: "city", label: "Ciudad", kind: "text" },
    ),
  },
  {
    id: "countdown",
    label: "Cuenta regresiva",
    description: "Reloj en vivo hasta el gran día",
    defaultEnabled: true,
    fields: [],
    emptyHint: "Usa la fecha de la Portada.",
  },
  {
    id: "hosts",
    label: "Nuestra historia",
    description: "Texto de los anfitriones y firma",
    defaultEnabled: true,
    fields: fields(
      { key: "hosts", label: "Anfitriones", kind: "text" },
      { key: "story", label: "Historia", kind: "textarea", rows: 5 },
    ),
  },
  {
    id: "ceremony",
    label: "Ceremonia",
    description: "Horario, lugar y cómo llegar",
    defaultEnabled: true,
    fields: fields(
      { key: "time", label: "Hora", kind: "text" },
      { key: "venueCeremony", label: "Lugar", kind: "text" },
      { key: "addressCeremony", label: "Dirección", kind: "text" },
      { key: "showMapCeremony", label: "Mostrar mini mapa", kind: "checkbox" },
    ),
  },
  {
    id: "party",
    label: "Fiesta",
    description: "Horario, salón y cómo llegar",
    defaultEnabled: true,
    fields: fields(
      { key: "timeParty", label: "Hora", kind: "text" },
      { key: "venueParty", label: "Lugar", kind: "text" },
      { key: "addressParty", label: "Dirección", kind: "text" },
      { key: "showMapParty", label: "Mostrar mini mapa", kind: "checkbox" },
    ),
  },
  {
    id: "dresscode",
    label: "Dress code",
    description: "Estilo de vestimenta del evento",
    defaultEnabled: true,
    fields: fields({ key: "dresscode", label: "Dress code", kind: "textarea", rows: 2 }),
  },
  {
    id: "gallery",
    label: "Álbum de fotos",
    description: "Recorrido fotográfico",
    defaultEnabled: true,
    fields: [],
    emptyHint: "Las fotos se editan más adelante.",
  },
  {
    id: "playlist",
    label: "Playlist colaborativa",
    description: "Link público para que sumen canciones",
    defaultEnabled: false,
    fields: fields(
      { key: "musicNote", label: "Texto", kind: "textarea", rows: 2 },
      { key: "playlistUrl", label: "Link playlist", kind: "url" },
    ),
  },
  {
    id: "inviteMusic",
    label: "Música de la invitación",
    description: "YouTube oculto con play / mute",
    defaultEnabled: false,
    fields: fields({ key: "inviteMusicUrl", label: "Link de YouTube", kind: "url" }),
  },
  {
    id: "gifts",
    label: "Regalos",
    description: "Alias, CBU o mesa de regalos",
    defaultEnabled: true,
    fields: fields(
      { key: "giftMessage", label: "Mensaje", kind: "textarea", rows: 3 },
      { key: "giftAlias", label: "Alias", kind: "text" },
      { key: "giftCbu", label: "CBU / CVU", kind: "text" },
    ),
  },
  {
    id: "rsvp",
    label: "Confirmar asistencia",
    description: "RSVP aceptar / rechazar",
    defaultEnabled: true,
    fields: [],
    emptyHint: "Los invitados confirman desde el link o el Studio.",
  },
  {
    id: "menu",
    label: "Menú",
    description: "Opciones gastronómicas",
    defaultEnabled: false,
    fields: fields({ key: "menu", label: "Menú", kind: "textarea", rows: 3 }),
  },
  {
    id: "stay",
    label: "Alojamiento",
    description: "Hoteles sugeridos para invitados",
    defaultEnabled: false,
    fields: fields({ key: "stay", label: "Alojamiento", kind: "textarea", rows: 3 }),
  },
  {
    id: "transport",
    label: "Transporte",
    description: "Cómo llegar y transfers",
    defaultEnabled: false,
    fields: fields({ key: "transport", label: "Transporte", kind: "textarea", rows: 3 }),
  },
  {
    id: "instagram",
    label: "Instagram wall",
    description: "Hashtag y muro del evento",
    defaultEnabled: false,
    fields: fields({ key: "instagramHandle", label: "Handle / hashtag", kind: "text" }),
  },
  {
    id: "faq",
    label: "Preguntas frecuentes",
    description: "Niños, estacionamiento, horarios",
    defaultEnabled: false,
    fields: [],
    emptyHint: "Las preguntas se editan más adelante.",
  },
];

const LEGACY_MODULE_IDS = new Set(["itinerary", "location"]);
const LEGACY_MUSIC_ID = "music";

export function defaultModules(): ModuleState[] {
  return MODULE_CATALOG.map((mod) => ({
    id: mod.id,
    enabled: mod.defaultEnabled,
  }));
}

/**
 * Migrate legacy itinerary/location → ceremony/party, music → playlist + inviteMusic,
 * and append any catalog modules missing from older rows (preserving host order).
 */
export function normalizeModules(
  modules: { id: string; enabled: boolean }[],
): ModuleState[] {
  let working = modules.map((m) => ({ ...m }));

  if (working.some((m) => LEGACY_MODULE_IDS.has(m.id))) {
    const itinerary = working.find((m) => m.id === "itinerary");
    const location = working.find((m) => m.id === "location");
    const insertAt = working.findIndex((m) => LEGACY_MODULE_IDS.has(m.id));
    const withoutLegacy = working.filter((m) => !LEGACY_MODULE_IDS.has(m.id));
    const ceremonyEnabled = itinerary?.enabled ?? location?.enabled ?? true;
    const partyEnabled = location?.enabled ?? itinerary?.enabled ?? true;
    const insert = [
      { id: "ceremony", enabled: ceremonyEnabled },
      { id: "party", enabled: partyEnabled },
    ];
    const at = insertAt < 0 ? withoutLegacy.length : insertAt;
    working = [
      ...withoutLegacy.slice(0, at),
      ...insert,
      ...withoutLegacy.slice(at),
    ];
  }

  if (working.some((m) => m.id === LEGACY_MUSIC_ID)) {
    const music = working.find((m) => m.id === LEGACY_MUSIC_ID)!;
    const insertAt = working.findIndex((m) => m.id === LEGACY_MUSIC_ID);
    const withoutMusic = working.filter((m) => m.id !== LEGACY_MUSIC_ID);
    const insert = [
      { id: "playlist", enabled: music.enabled },
      { id: "inviteMusic", enabled: music.enabled },
    ];
    working = [
      ...withoutMusic.slice(0, insertAt),
      ...insert,
      ...withoutMusic.slice(insertAt),
    ];
  }

  const next: ModuleState[] = working.map(asModuleState);
  const seen = new Set(next.map((m) => m.id));
  for (const def of MODULE_CATALOG) {
    if (!seen.has(def.id)) {
      next.push({ id: def.id, enabled: def.defaultEnabled });
      seen.add(def.id);
    }
  }

  return next.filter((m) => MODULE_CATALOG.some((d) => d.id === m.id));
}

function asModuleState(m: { id: string; enabled: boolean }): ModuleState {
  return { id: m.id as ModuleId, enabled: m.enabled };
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

export function moduleFields(id: ModuleId): ModuleFieldDef[] {
  return MODULE_CATALOG.find((m) => m.id === id)?.fields ?? [];
}
