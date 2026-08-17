import type { EventContent, PlanId } from "./types";

export const PLANS: {
  id: PlanId;
  name: string;
  price: number;
  tagline: string;
  features: string[];
}[] = [
    {
      id: "esencial",
      name: "Esencial",
      price: 49900,
      tagline: "Publicar, enviar y RSVP",
      features: [
        "1 set de template",
        "Editor en vivo",
        "Hasta 80 invitados",
        "Confirmaciones aceptar / rechazar",
        "Link personalizable",
      ],
    },
    {
      id: "completo",
      name: "Completo",
      price: 89900,
      tagline: "Todos los módulos + música",
      features: [
        "Todo Esencial",
        "Módulos ilimitados",
        "Invitados ilimitados",
        "Álbum, regalos y dress code",
        "Acceso VIP opcional",
      ],
    },
    {
      id: "premium",
      name: "Premium",
      price: 129900,
      tagline: "Redes + publicaciones programadas",
      features: [
        "Todo Completo",
        "Generación de contenido",
        "Pinterest, Instagram y TikTok",
        "Calendario de publicaciones",
        "Mini backoffice avanzado",
      ],
    },
  ];

export function formatARS(amount: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDateLong(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}

export function formatDateShort(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(d);
}

export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

/** `yyyy-MM-dd` for `<input type="date">` (local calendar day). */
export function toDateInputValue(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Replace the calendar day of an ISO timestamp, keeping the local time-of-day. */
export function withDateInputValue(iso: string, ymd: string): string {
  const parts = ymd.split("-").map(Number);
  const [y, m, day] = parts;
  if (!y || !m || !day) return iso;
  const prev = new Date(iso);
  const next = Number.isNaN(prev.getTime())
    ? new Date(y, m - 1, day, 12, 0, 0)
    : new Date(prev);
  next.setFullYear(y, m - 1, day);
  return next.toISOString();
}

export function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 48);
}

/** Extract an 11-char YouTube video id from common watch / youtu.be / embed URLs. */
export function parseYoutubeVideoId(url: string): string | null {
  const trimmed = url.trim();
  if (!trimmed) return null;
  try {
    const parsed = new URL(trimmed);
    const host = parsed.hostname.replace(/^www\./, "");
    if (host === "youtu.be") {
      const id = parsed.pathname.split("/").filter(Boolean)[0] ?? "";
      return /^[\w-]{11}$/.test(id) ? id : null;
    }
    if (host === "youtube.com" || host === "m.youtube.com" || host === "music.youtube.com") {
      const v = parsed.searchParams.get("v");
      if (v && /^[\w-]{11}$/.test(v)) return v;
      const parts = parsed.pathname.split("/").filter(Boolean);
      const embedIdx = parts.findIndex((p) => p === "embed" || p === "shorts" || p === "live");
      if (embedIdx >= 0) {
        const id = parts[embedIdx + 1] ?? "";
        return /^[\w-]{11}$/.test(id) ? id : null;
      }
    }
  } catch {
    // fall through
  }
  const loose = trimmed.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([\w-]{11})/);
  return loose?.[1] ?? null;
}

export function uid(prefix = "id"): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 8)}${Date.now().toString(36).slice(-4)}`;
}

export function defaultContent(partial?: Partial<EventContent>): EventContent {
  return {
    title: "Sofía & Martín",
    subtitle: "Nos casamos",
    hosts: "Con la bendición de nuestras familias",
    date: "2026-11-14T17:00:00.000Z",
    time: "17:00",
    timeParty: "21:00",
    city: "Buenos Aires",
    venueCeremony: "Iglesia Nuestra Señora del Pilar",
    addressCeremony: "Junín 1898, Recoleta",
    showMapCeremony: true,
    venueParty: "Estancia La Paz",
    addressParty: "Ruta 8 km 62, Pilar",
    showMapParty: true,
    story:
      "Nos conocimos un verano en la costa y desde entonces cada plan se volvió un nosotros. Queremos celebrarlo con las personas que más queremos.",
    dresscode: "Elegante sport · paleta tierra y oro",
    giftMessage: "Lo más importante es que estés. Si querés acompañarnos con un presente:",
    giftAlias: "sofi.martin.casorio",
    giftCbu: "0000003100012345678901",
    musicNote: "Sumá tus canciones favoritas a la playlist!",
    playlistUrl: "https://open.spotify.com",
    inviteMusicUrl: "https://www.youtube.com/watch?v=jfKfPfyJRdk",
    instagramHandle: "@sofiymartin",
    menu: "Entrada de estación · principal a elección (carne o vegetariano) · tarta nupcial",
    stay: "Sugerimos Hotel Fasano y Palacio Duhau. Código MOJI26.",
    transport: "Habrá transfers desde Recoleta a las 16:00 y retorno a las 04:00.",
    faq: [
      { q: "¿Hay lugar para niños?", a: "Sí, con rincón kids a partir de las 20 h." },
      { q: "¿Hasta cuándo confirmo?", a: "Hasta el 14 de octubre." },
    ],
    gallery: [
      {
        src: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
        alt: "Retrato de pareja",
      },
      {
        src: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80",
        alt: "Detalle floral",
      },
      {
        src: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80",
        alt: "Mesa de celebración",
      },
    ],
    ...partial,
  };
}

export function whatsappLink(phone: string, text: string): string {
  const digits = phone.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

export function inviteUrl(origin: string, slug: string, token?: string): string {
  const url = new URL(`/i/${slug}`, origin);
  if (token) url.searchParams.set("g", token);
  return url.toString();
}
