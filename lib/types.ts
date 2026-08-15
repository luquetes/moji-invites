export type EventCategory =
  | "bodas"
  | "quince"
  | "comunion"
  | "cumple"
  | "egreso"
  | "bautismo"
  | "empresarial";

export type ModuleId =
  | "cover"
  | "countdown"
  | "hosts"
  | "itinerary"
  | "location"
  | "dresscode"
  | "gallery"
  | "music"
  | "gifts"
  | "rsvp"
  | "menu"
  | "stay"
  | "transport"
  | "instagram"
  | "faq";

export type RsvpStatus = "pending" | "accepted" | "declined";
export type PaymentProvider = "stripe" | "mercadopago";
export type PaymentStatus = "draft" | "pending" | "paid" | "failed";
export type PlanId = "esencial" | "completo" | "premium";
export type SocialPlatform = "instagram" | "tiktok" | "pinterest";
export type SocialPostStatus = "draft" | "scheduled" | "published" | "failed";
export type OrnamentStyle =
  | "floral"
  | "geometric"
  | "botanical"
  | "art-deco"
  | "minimal"
  | "script";

export interface Palette {
  bg: string;
  paper: string;
  ink: string;
  muted: string;
  accent: string;
  accentSoft: string;
}

export interface TemplateSet {
  slug: string;
  name: string;
  category: EventCategory;
  family: string;
  tagline: string;
  description: string;
  palette: Palette;
  displayFont: "cormorant" | "cinzel" | "fraunces" | "playfair";
  ornament: OrnamentStyle;
  preview: string;
  comingSoon?: boolean;
}

export interface ModuleDef {
  id: ModuleId;
  label: string;
  description: string;
  locked?: boolean;
  defaultEnabled: boolean;
}

export interface ModuleState {
  id: ModuleId;
  enabled: boolean;
}

export interface EventContent {
  title: string;
  subtitle: string;
  hosts: string;
  date: string;
  time: string;
  city: string;
  venueCeremony: string;
  addressCeremony: string;
  venueParty: string;
  addressParty: string;
  story: string;
  dresscode: string;
  giftMessage: string;
  giftAlias: string;
  giftCbu: string;
  musicNote: string;
  playlistUrl: string;
  instagramHandle: string;
  menu: string;
  stay: string;
  transport: string;
  faq: { q: string; a: string }[];
  gallery: { src: string; alt: string }[];
}

export interface InviteEvent {
  id: string;
  slug: string;
  templateSlug: string;
  plan: PlanId;
  paid: boolean;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  modules: ModuleState[];
  content: EventContent;
  paletteOverride?: Partial<Palette>;
}

export interface Guest {
  id: string;
  eventId: string;
  name: string;
  email: string;
  phone: string;
  plusOnes: number;
  token: string;
  status: RsvpStatus;
  message: string;
  dietary: string;
  respondedAt?: string;
}

export interface Payment {
  id: string;
  eventId: string;
  provider: PaymentProvider;
  plan: PlanId;
  amount: number;
  currency: "ARS";
  status: PaymentStatus;
  createdAt: string;
}

export interface SocialPost {
  id: string;
  eventId: string;
  platform: SocialPlatform;
  title: string;
  caption: string;
  hashtags: string[];
  scheduledAt: string;
  status: SocialPostStatus;
  createdAt: string;
}

export interface Database {
  events: InviteEvent[];
  guests: Guest[];
  payments: Payment[];
  socialPosts: SocialPost[];
}

export interface RsvpCounts {
  accepted: number;
  declined: number;
  pending: number;
  plusOnes: number;
}
