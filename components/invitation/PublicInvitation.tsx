"use client";

import { useState } from "react";
import type { Guest, InviteEvent, RsvpStatus } from "@/lib/types";
import { InvitationView } from "./InvitationView";

type RsvpExtras = { message: string; plusOnes: number; songSuggestion?: string };

export function PublicInvitation({ event, guest }: { event: InviteEvent; guest?: Guest }) {
  const [currentGuest, setCurrentGuest] = useState(guest);

  async function persist(body: Record<string, unknown>) {
    const res = await fetch("/api/rsvp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventId: event.id,
        token: currentGuest?.token,
        name: currentGuest?.name ?? "Invitado",
        ...body,
      }),
    });
    const data = (await res.json()) as { guest?: Guest };
    if (data.guest) setCurrentGuest(data.guest);
  }

  async function onRsvp(status: RsvpStatus, extras: RsvpExtras) {
    await persist({ status, ...extras });
  }

  async function onSongSuggest(songSuggestion: string) {
    await persist({
      songSuggestion,
      status: currentGuest?.status === "pending" ? undefined : currentGuest?.status,
      plusOnes: currentGuest?.plusOnes ?? 0,
      message: currentGuest?.message ?? "",
    });
  }

  return (
    <InvitationView
      event={event}
      guest={currentGuest}
      onRsvp={onRsvp}
      onSongSuggest={onSongSuggest}
    />
  );
}
