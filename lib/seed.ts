import { defaultModules } from "./modules";
import { defaultContent, uid } from "./format";
import { snapshotRevision } from "./eventRevision";
import type { Database, Guest, InviteEvent, SocialPost } from "./types";

const DEMO_ID = "evt_demo_sofia";

export function seedDatabase(): Database {
  const now = new Date().toISOString();
  const draft: InviteEvent = {
    id: DEMO_ID,
    slug: "sofia-y-martin",
    templateSlug: "magnolias-gold",
    plan: "premium",
    paid: true,
    published: true,
    createdAt: now,
    updatedAt: now,
    modules: defaultModules().map((m) =>
      ["playlist", "inviteMusic", "menu", "instagram"].includes(m.id)
        ? { ...m, enabled: true }
        : m,
    ),
    content: defaultContent(),
  };
  const event: InviteEvent = {
    ...draft,
    publishedRevision: snapshotRevision(draft),
  };

  const guests: Guest[] = [
    guest(event.id, "Valentina Ruiz", "vale@mail.com", "5491111111111", "accepted", 1, "¡Ahí vamos!", "Dancing Queen"),
    guest(event.id, "Joaquín Pérez", "joaco@mail.com", "5491111111112", "accepted", 0, "", "September — Earth, Wind & Fire"),
    guest(event.id, "Camila Gómez", "cami@mail.com", "5491111111113", "declined", 0, "Estamos de viaje"),
    guest(event.id, "Lucas Fernández", "lucas@mail.com", "5491111111114", "pending", 1),
    guest(event.id, "Martina Díaz", "martina@mail.com", "5491111111115", "accepted", 0, "", "Blinding Lights"),
    guest(event.id, "Nicolás Blanco", "nico@mail.com", "5491111111116", "pending", 0),
    guest(event.id, "Elena Castro", "elena@mail.com", "5491111111117", "declined", 0),
    guest(event.id, "Tomás Aguilar", "tomas@mail.com", "5491111111118", "accepted", 2, "Llevamos a los chicos", "Don't Stop Me Now"),
  ];

  const socialPosts: SocialPost[] = [
    {
      id: uid("soc"),
      eventId: event.id,
      platform: "instagram",
      title: "Save the date · carrusel",
      caption: "Sofía & Martín · 14 de noviembre, Buenos Aires. Link in bio.",
      hashtags: ["#savethedate", "#invitaciondigital"],
      scheduledAt: new Date(Date.now() + 86400000).toISOString(),
      status: "scheduled",
      createdAt: now,
    },
    {
      id: uid("soc"),
      eventId: event.id,
      platform: "pinterest",
      title: "Invitación Magnolias Gold",
      caption: "Set floral customizable con RSVP en vivo.",
      hashtags: ["Invitaciones digitales", "Boda"],
      scheduledAt: new Date(Date.now() + 172800000).toISOString(),
      status: "scheduled",
      createdAt: now,
    },
  ];

  return {
    events: [event],
    guests,
    payments: [
      {
        id: uid("pay"),
        eventId: event.id,
        provider: "mercadopago",
        plan: "premium",
        amount: 129900,
        currency: "ARS",
        status: "paid",
        createdAt: now,
      },
    ],
    socialPosts,
  };
}

function guest(
  eventId: string,
  name: string,
  email: string,
  phone: string,
  status: Guest["status"],
  plusOnes: number,
  message = "",
  songSuggestion = "",
): Guest {
  return {
    id: uid("gst"),
    eventId,
    name,
    email,
    phone,
    plusOnes,
    token: uid("tok"),
    status,
    message,
    dietary: "",
    songSuggestion,
    respondedAt: status === "pending" ? undefined : new Date().toISOString(),
  };
}

export const DEMO_EVENT_ID = DEMO_ID;
