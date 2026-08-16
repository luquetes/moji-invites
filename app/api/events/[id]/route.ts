import { NextResponse } from "next/server";
import { getEvent, upsertEvent } from "@/lib/store";
import { applyEventPatch, type EventPatch } from "@/lib/eventPatch";
import { withEventLock } from "@/lib/lock";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const event = getEvent(id);
  if (!event) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return NextResponse.json({ event });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const patch = (await request.json()) as EventPatch;

  return withEventLock(id, () => {
    const current = getEvent(id);
    if (!current) return NextResponse.json({ error: "No encontrado" }, { status: 404 });

    const result = applyEventPatch(current, patch);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 402 });
    }

    return NextResponse.json({ event: upsertEvent(result.event) });
  });
}
