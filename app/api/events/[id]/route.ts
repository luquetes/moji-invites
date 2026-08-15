import { NextResponse } from "next/server";
import { getEvent, upsertEvent } from "@/lib/store";
import { canPublish } from "@/lib/social";
import type { InviteEvent } from "@/lib/types";

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
  const current = getEvent(id);
  if (!current) return NextResponse.json({ error: "No encontrado" }, { status: 404 });

  const patch = (await request.json()) as Partial<InviteEvent>;
  const next: InviteEvent = {
    ...current,
    ...patch,
    id: current.id,
    paid: current.paid || Boolean(patch.paid),
  };

  if (patch.published && !current.published) {
    const gate = canPublish(next);
    if (!gate.ok) {
      return NextResponse.json({ error: gate.reason }, { status: 402 });
    }
  }

  return NextResponse.json({ event: upsertEvent(next) });
}
