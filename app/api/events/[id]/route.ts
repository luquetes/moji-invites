import { NextResponse } from "next/server";
import { getEvent, upsertEvent } from "@/lib/store";
import { canPublish } from "@/lib/social";
import { snapshotRevision } from "@/lib/eventRevision";
import type { InviteEvent, Palette } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type EventPatch = Partial<InviteEvent> & {
  action?: "publish" | "unpublish";
};

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

  const patch = (await request.json()) as EventPatch;

  // Draft fields only. `published` / `publishedRevision` change exclusively via action.
  const next: InviteEvent = {
    ...current,
    slug: typeof patch.slug === "string" ? patch.slug : current.slug,
    templateSlug:
      typeof patch.templateSlug === "string" ? patch.templateSlug : current.templateSlug,
    plan: patch.plan ?? current.plan,
    modules: patch.modules ?? current.modules,
    content: patch.content ?? current.content,
    paletteOverride:
      patch.paletteOverride !== undefined
        ? (patch.paletteOverride as Partial<Palette> | undefined)
        : current.paletteOverride,
    id: current.id,
    createdAt: current.createdAt,
    paid: current.paid || Boolean(patch.paid),
    published: current.published,
    publishedRevision: current.publishedRevision ?? null,
  };

  if (patch.action === "publish") {
    const gate = canPublish(next);
    if (!gate.ok) {
      return NextResponse.json({ error: gate.reason }, { status: 402 });
    }
    next.published = true;
    next.publishedRevision = snapshotRevision(next);
  } else if (patch.action === "unpublish") {
    next.published = false;
  }

  return NextResponse.json({ event: upsertEvent(next) });
}
