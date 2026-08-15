"use client";

import { useEffect, useState } from "react";
import type { Guest, InviteEvent } from "@/lib/types";
import { inviteUrl, whatsappLink } from "@/lib/format";
import { asPublishedEvent, publicSlug } from "@/lib/eventRevision";

export function SendList({ event, guests }: { event: InviteEvent; guests: Guest[] }) {
  const [origin, setOrigin] = useState("");
  useEffect(() => setOrigin(window.location.origin), []);
  const live = asPublishedEvent(event) ?? event;
  const slug = publicSlug(event);

  return (
    <div className="mt-8 space-y-3">
      {guests.map((guest) => {
        const url = origin ? inviteUrl(origin, slug, guest.token) : "";
        const text = `${guest.name}, estás invitadx a ${live.content.title}. Abrí tu invitación: ${url}`;
        return (
          <div key={guest.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-ink/10 bg-paper px-4 py-3">
            <div>
              <p className="font-medium">{guest.name}</p>
              <p className="max-w-md truncate text-xs text-ink/45">{url}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => navigator.clipboard.writeText(url)}
                className="rounded-full bg-cream px-3 py-1 text-xs uppercase tracking-widest"
              >
                Copiar
              </button>
              <a
                href={whatsappLink(guest.phone || "5491100000000", text)}
                className="rounded-full bg-[#25d366] px-3 py-1 text-xs uppercase tracking-widest text-white"
              >
                WhatsApp
              </a>
              <a
                href={`mailto:${guest.email}?subject=${encodeURIComponent(live.content.title)}&body=${encodeURIComponent(text)}`}
                className="rounded-full border border-ink/15 px-3 py-1 text-xs uppercase tracking-widest"
              >
                Mail
              </a>
            </div>
          </div>
        );
      })}
    </div>
  );
}
