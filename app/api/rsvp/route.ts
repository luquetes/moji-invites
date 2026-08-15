import { NextResponse } from "next/server";
import { getEvent, getGuestByToken, upsertGuest } from "@/lib/store";
import { uid } from "@/lib/format";
import type { Guest, RsvpStatus } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = await request.json();
  const event = getEvent(body.eventId);
  if (!event?.published) {
    return NextResponse.json({ error: "Invitación no publicada" }, { status: 404 });
  }

  const status = body.status as RsvpStatus;
  if (status !== "accepted" && status !== "declined") {
    return NextResponse.json({ error: "Estado inválido" }, { status: 400 });
  }

  const existing = body.token ? getGuestByToken(body.token) : undefined;
  const guest: Guest = {
    id: existing?.id ?? uid("gst"),
    eventId: event.id,
    name: body.name?.trim() || existing?.name || "Invitado",
    email: existing?.email ?? "",
    phone: existing?.phone ?? "",
    plusOnes: Number(body.plusOnes ?? existing?.plusOnes ?? 0),
    token: existing?.token ?? uid("tok"),
    status,
    message: body.message ?? "",
    dietary: body.dietary ?? "",
    respondedAt: new Date().toISOString(),
  };
  upsertGuest(guest);
  return NextResponse.json({ guest });
}
