import { canPublish } from "./social";
import { snapshotRevision } from "./eventRevision";
import type { InviteEvent, Palette, PlanId } from "./types";

export type EventPatch = Partial<InviteEvent> & {
  action?: "publish" | "unpublish";
};

export type EventPatchResult =
  | { ok: true; event: InviteEvent }
  | { ok: false; error: string };

/**
 * Merge a PATCH onto the latest persisted event.
 * Draft fields come from the patch; live publish state is taken from
 * `current` unless this request is an explicit publish/unpublish.
 */
export function applyEventPatch(current: InviteEvent, patch: EventPatch): EventPatchResult {
  const next: InviteEvent = {
    ...current,
    slug: typeof patch.slug === "string" ? patch.slug : current.slug,
    templateSlug:
      typeof patch.templateSlug === "string" ? patch.templateSlug : current.templateSlug,
    plan: (patch.plan as PlanId | undefined) ?? current.plan,
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
    if (!gate.ok) return { ok: false, error: gate.reason ?? "No se puede publicar" };
    next.published = true;
    next.publishedRevision = snapshotRevision(next);
  } else if (patch.action === "unpublish") {
    next.published = false;
  }

  return { ok: true, event: next };
}
