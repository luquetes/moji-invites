"use client";

import { useState } from "react";
import type { Guest, InviteEvent, RsvpStatus } from "@/lib/types";
import { InvitationView } from "./InvitationView";

export function PublicInvitation({ event, guest }: { event: InviteEvent; guest?: Guest }) {
  const [currentGuest, setCurrentGuest] = useState(guest);

  async function onRsvp(status: RsvpStatus, extras: { message: string; plusOnes: number }) {
    const res = await fetch("/api/rsvp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventId: event.id,
        token: currentGuest?.token,
        name: currentGuest?.name ?? "Invitado",
        status,
        ...extras,
      }),
    });
    const data = await res.json();
    if (data.guest) setCurrentGuest(data.guest);
  }

  return <InvitationView event={event} guest={currentGuest} onRsvp={onRsvp} />;
}
