import type { EventCategory, TemplateSet } from "./types";

export const CATEGORIES: {
  id: EventCategory;
  label: string;
  soon?: boolean;
  blurb: string;
}[] = [
  { id: "bodas", label: "Bodas", blurb: "Casamientos con alma editorial" },
  { id: "quince", label: "15 años", blurb: "Una noche para recordar" },
  { id: "comunion", label: "Comunión", blurb: "Celebraciones íntimas y claras" },
  { id: "cumple", label: "Cumpleaños", blurb: "Fiestas con personalidad", soon: true },
  { id: "egreso", label: "Egreso", blurb: "El cierre de una etapa", soon: true },
  { id: "bautismo", label: "Bautismo", blurb: "Bienvenidas suaves", soon: true },
  { id: "empresarial", label: "Empresarial", blurb: "Eventos de marca", soon: true },
];

export const TEMPLATES: TemplateSet[] = [
  {
    slug: "magnolias-gold",
    name: "Magnolias Gold",
    category: "bodas",
    family: "Magnolias",
    tagline: "Botánica dorada y papel marfil",
    description:
      "Un set floral de alta costura: magnolias, oro viejo y tipografía editorial. Ideal para bodas de día o jardín.",
    palette: {
      bg: "#f4ead8",
      paper: "#fff8ee",
      ink: "#3a2a1c",
      muted: "#8a7058",
      accent: "#b8893a",
      accentSoft: "#ead9b3",
    },
    displayFont: "cormorant",
    ornament: "floral",
    preview:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80",
  },
  {
    slug: "deluxe-classic",
    name: "Deluxe Classic",
    category: "bodas",
    family: "Deluxe",
    tagline: "Ornamento fino, silueta minimal",
    description:
      "El clásico deluxe: marcos geométricos, serifas ceremoniales y un ritmo visual contenido.",
    palette: {
      bg: "#efe7db",
      paper: "#fffcf7",
      ink: "#241c16",
      muted: "#7a6a58",
      accent: "#9a7844",
      accentSoft: "#e2d3b8",
    },
    displayFont: "cinzel",
    ornament: "art-deco",
    preview:
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=900&q=80",
  },
  {
    slug: "vintage",
    name: "Vintage",
    category: "bodas",
    family: "Vintage",
    tagline: "Pasteles, romanticismo y trazo suave",
    description:
      "Líneas simples, paleta pastel y un aire de mediados de siglo con un giro contemporáneo.",
    palette: {
      bg: "#f3e6e1",
      paper: "#fff6f2",
      ink: "#4a322c",
      muted: "#9a7368",
      accent: "#c4847a",
      accentSoft: "#f0d4cc",
    },
    displayFont: "fraunces",
    ornament: "script",
    preview:
      "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=900&q=80",
  },
  {
    slug: "tropical",
    name: "Tropical",
    category: "bodas",
    family: "Tropical",
    tagline: "Verde vivo y flores de verano",
    description:
      "Frescura natural, hojas y un acento coral. Perfecto para destinos, quintas y fiestas al aire libre.",
    palette: {
      bg: "#e4eee4",
      paper: "#f7fff6",
      ink: "#1e3324",
      muted: "#5d7a62",
      accent: "#2f6b4f",
      accentSoft: "#cfe3d4",
    },
    displayFont: "cormorant",
    ornament: "botanical",
    preview:
      "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=900&q=80",
  },
  {
    slug: "navy-romance",
    name: "Navy Romance",
    category: "bodas",
    family: "Romance",
    tagline: "Noche, oro y marino profundo",
    description:
      "Una paleta nocturna con destellos dorados. Ceremonias de noche, salones y brindis bajo estrellas.",
    palette: {
      bg: "#1b2433",
      paper: "#222c3d",
      ink: "#f4ead8",
      muted: "#b7c0ce",
      accent: "#d4b072",
      accentSoft: "#3a465c",
    },
    displayFont: "playfair",
    ornament: "geometric",
    preview:
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=900&q=80",
  },
  {
    slug: "bohemio",
    name: "Bohemio",
    category: "bodas",
    family: "Boho",
    tagline: "Terracota, lino y pampas",
    description:
      "Texturas de tierra, tipografía suelta y un mood descalzo-elegante para quintas y atardeceres.",
    palette: {
      bg: "#efe0d0",
      paper: "#fbf3ea",
      ink: "#4a3124",
      muted: "#8b6b55",
      accent: "#c47a4a",
      accentSoft: "#edcbb3",
    },
    displayFont: "cormorant",
    ornament: "botanical",
    preview:
      "https://images.unsplash.com/photo-1478144592103-25e218a58043?auto=format&fit=crop&w=900&q=80",
  },
  {
    slug: "aurum-wine",
    name: "Aurum Wine",
    category: "bodas",
    family: "Aurum",
    tagline: "Burdeos, oro y papel oscuro",
    description:
      "Un set dramático y cálido, pensado para otoño, bodegas y celebraciones íntimas de noche.",
    palette: {
      bg: "#3a1f26",
      paper: "#45262e",
      ink: "#f6e6d8",
      muted: "#d2b4a8",
      accent: "#d4a05a",
      accentSoft: "#5c3340",
    },
    displayFont: "cinzel",
    ornament: "art-deco",
    preview:
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=900&q=80",
  },
  {
    slug: "minimalista",
    name: "Minimalista",
    category: "bodas",
    family: "Studio",
    tagline: "Blanco, aire y un solo gesto",
    description:
      "Poca ornamentación, mucha claridad. Una invitación contemporánea que deja hablar a la información.",
    palette: {
      bg: "#f3f1ee",
      paper: "#ffffff",
      ink: "#22201c",
      muted: "#7a776f",
      accent: "#22201c",
      accentSoft: "#e6e2db",
    },
    displayFont: "fraunces",
    ornament: "minimal",
    preview:
      "https://images.unsplash.com/photo-1460978812857-470ed1c77af0?auto=format&fit=crop&w=900&q=80",
  },
  {
    slug: "playa",
    name: "Playa",
    category: "bodas",
    family: "Costa",
    tagline: "Arena, sal y azul claro",
    description:
      "Un set costero con tipografía ligera y acentos aqua. Para casamientos frente al mar.",
    palette: {
      bg: "#e7f1f2",
      paper: "#f7fcfc",
      ink: "#1d3a40",
      muted: "#5d7d82",
      accent: "#2a7d86",
      accentSoft: "#c5e2e5",
    },
    displayFont: "cormorant",
    ornament: "minimal",
    preview:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80",
  },
  {
    slug: "quince-aurora",
    name: "Aurora",
    category: "quince",
    family: "15",
    tagline: "Rosa noche, glitter suave y firma",
    description:
      "Pensado para 15 años: portada cinematográfica, countdown y un RSVP que ordena la lista VIP.",
    palette: {
      bg: "#2a1824",
      paper: "#351f2e",
      ink: "#fbeaf3",
      muted: "#d7b3c4",
      accent: "#e8a0c0",
      accentSoft: "#4a2d40",
    },
    displayFont: "playfair",
    ornament: "script",
    preview:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=900&q=80",
  },
  {
    slug: "quince-garden",
    name: "Jardín Rosa",
    category: "quince",
    family: "15",
    tagline: "Flores claras y paleta candy",
    description:
      "Un quince de día: pétalos, tipografía script y módulos de música, dress code y regalos.",
    palette: {
      bg: "#f8e8ef",
      paper: "#fff7fa",
      ink: "#4a2436",
      muted: "#9a6578",
      accent: "#d46a8c",
      accentSoft: "#f3c9d8",
    },
    displayFont: "cormorant",
    ornament: "floral",
    preview:
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=900&q=80",
  },
  {
    slug: "comunion-lino",
    name: "Lino",
    category: "comunion",
    family: "Comunión",
    tagline: "Marfil, calma y letra clara",
    description:
      "Una comunión serena: paleta de lino, itinerario familiar y confirmación de asistencia simple.",
    palette: {
      bg: "#efe9dc",
      paper: "#fffaf1",
      ink: "#3b3428",
      muted: "#7d7464",
      accent: "#8a7a55",
      accentSoft: "#e4dcc8",
    },
    displayFont: "fraunces",
    ornament: "minimal",
    preview:
      "https://images.unsplash.com/photo-1445633629932-0029acc44e88?auto=format&fit=crop&w=900&q=80",
  },
];

export function getTemplate(slug: string): TemplateSet | undefined {
  return TEMPLATES.find((t) => t.slug === slug);
}

export function templatesByCategory(category?: EventCategory): TemplateSet[] {
  if (!category) return TEMPLATES;
  return TEMPLATES.filter((t) => t.category === category);
}

export function isDarkTemplate(slug: string): boolean {
  const t = getTemplate(slug);
  if (!t) return false;
  return ["navy-romance", "aurum-wine", "quince-aurora"].includes(t.slug);
}
