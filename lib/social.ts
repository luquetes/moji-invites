import type { Guest, InviteEvent, RsvpCounts, SocialPlatform } from "./types";

export function rsvpCounts(guests: Guest[]): RsvpCounts {
  return guests.reduce<RsvpCounts>(
    (acc, guest) => {
      acc[guest.status] += 1;
      if (guest.status === "accepted") acc.plusOnes += guest.plusOnes;
      return acc;
    },
    { accepted: 0, declined: 0, pending: 0, plusOnes: 0 },
  );
}

export function canPublish(event: InviteEvent): { ok: boolean; reason?: string } {
  if (!event.paid) return { ok: false, reason: "Necesitás completar el pago del template." };
  if (!event.content.title.trim()) return { ok: false, reason: "Falta el título de la invitación." };
  return { ok: true };
}

export function generateSocialPack(event: InviteEvent): Record<
  SocialPlatform,
  { title: string; caption: string; hashtags: string[] }
> {
  const names = event.content.title;
  const city = event.content.city;
  const date = new Date(event.content.date);
  const dateLabel = Number.isNaN(date.getTime())
    ? event.content.date
    : date.toLocaleDateString("es-AR", { day: "numeric", month: "long" });

  return {
    instagram: {
      title: "Save the date · carrusel 4:5",
      caption: `${names} · ${dateLabel}, ${city}.\nUna invitación para guardar, abrir y confirmar.\nLink in bio.`,
      hashtags: ["#savethedate", "#invitaciondigital", "#casamientoargentina", "#mojiinvites"],
    },
    tiktok: {
      title: "Hook 9:16 · 12s",
      caption: `POV: te llega la invitación de ${names} y ya estás eligiendo look.\n${dateLabel} · ${city}. Confirmá con un tap.`,
      hashtags: ["#bodas", "#invitaciondigital", "#savethedate", "#fyp"],
    },
    pinterest: {
      title: `${names} | Invitación digital ${city}`,
      caption: `Set customizable, RSVP en vivo y un mini backoffice para ver quién dijo que sí. ${dateLabel}.`,
      hashtags: ["Invitaciones digitales", "Boda Argentina", "Save the date", "Wedding stationery"],
    },
  };
}

export function nextScheduleSlot(from = new Date()): string {
  const d = new Date(from);
  d.setDate(d.getDate() + 1);
  d.setHours(11, 0, 0, 0);
  return d.toISOString();
}
