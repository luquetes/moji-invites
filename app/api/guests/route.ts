import { NextResponse } from "next/server";
import { getEvent, upsertGuest } from "@/lib/store";
import { uid } from "@/lib/format";
import type { Guest } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = await request.json();
  const event = getEvent(body.eventId);
  if (!event) return NextResponse.json({ error: "Evento no encontrado" }, { status: 404 });
  if (!event.paid) {
    return NextResponse.json(
      { error: "El envío se desbloquea cuando el template está pago." },
      { status: 402 },
    );
  }
  if (!body.name?.trim()) {
    return NextResponse.json({ error: "Falta el nombre" }, { status: 400 });
  }

  const guest: Guest = {
    id: uid("gst"),
    eventId: event.id,
    name: body.name.trim(),
    email: body.email ?? "",
    phone: body.phone ?? "",
    plusOnes: Number(body.plusOnes ?? 0),
    token: uid("tok"),
    status: "pending",
    message: "",
    dietary: "",
  };
  upsertGuest(guest);
  return NextResponse.json({ guest });
}
