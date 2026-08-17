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
  | "ceremony"
  | "party"
  | "dresscode"
  | "gallery"
  | "playlist"
  | "inviteMusic"
  | "gifts"
  | "rsvp"
  | "menu"
  | "stay"
  | "transport"
  | "instagram"
  | "faq";

export type ModuleFieldKind = "text" | "textarea" | "date" | "url" | "checkbox";

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

export interface ModuleState {
  id: ModuleId;
  enabled: boolean;
}

export interface EventContent {
  title: string;
  subtitle: string;
  hosts: string;
  date: string;
  /** Ceremony start time, e.g. "17:00". */
  time: string;
  /** Party / reception start time, e.g. "21:00". */
  timeParty: string;
  city: string;
  venueCeremony: string;
  addressCeremony: string;
  /** Show an embedded mini map for the ceremony address. */
  showMapCeremony: boolean;
  venueParty: string;
  addressParty: string;
  /** Show an embedded mini map for the party address. */
  showMapParty: boolean;
  story: string;
  dresscode: string;
  giftMessage: string;
  giftAlias: string;
  giftCbu: string;
  /** Copy inviting guests to add a song to the shared playlist. */
  musicNote: string;
  /** Public collaborative playlist URL (Spotify, etc.). */
  playlistUrl: string;
  /** YouTube URL for the invitation soundtrack (hidden embed + FAB). */
  inviteMusicUrl: string;
  instagramHandle: string;
  menu: string;
  stay: string;
  transport: string;
  faq: { q: string; a: string }[];
  gallery: { src: string; alt: string }[];
}

/** Editable content field owned by a module entity. */
export interface ModuleFieldDef {
  key: keyof EventContent;
  label: string;
  kind: ModuleFieldKind;
  rows?: number;
}

export interface ModuleDef {
  id: ModuleId;
  label: string;
  description: string;
  locked?: boolean;
  defaultEnabled: boolean;
  /** Content fields this module owns (Contenido tab). */
  fields: ModuleFieldDef[];
  /** Shown in Contenido when the module has no editable fields yet. */
  emptyHint?: string;
}

/** Snapshot of invitation content shown at /i/[slug] when published. */
export interface EventRevision {
  slug: string;
  modules: ModuleState[];
  content: EventContent;
  paletteOverride?: Partial<Palette>;
}

export interface InviteEvent {
  id: string;
  /** Draft slug — edited in the studio; preview uses this. */
  slug: string;
  templateSlug: string;
  plan: PlanId;
  paid: boolean;
  /** True when a live revision is publicly available (without ?preview=1). */
  published: boolean;
  createdAt: string;
  /** Draft last-saved time. */
  updatedAt: string;
  /** Draft modules / content / palette — autosave writes here only. */
  modules: ModuleState[];
  content: EventContent;
  paletteOverride?: Partial<Palette>;
  /**
   * Frozen live invitation. Updated only on explicit publish.
   * Autosave must never overwrite this.
   */
  publishedRevision?: EventRevision | null;
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
  /** Song the guest wants on the collaborative playlist. */
  songSuggestion: string;
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
