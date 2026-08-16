import { describe, expect, it, beforeEach } from "vitest";
import { applyEventPatch } from "./eventPatch";
import { withEventLock } from "./lock";
import { defaultModules } from "./modules";
import { defaultContent } from "./format";
import { snapshotRevision } from "./eventRevision";
import type { InviteEvent } from "./types";

function event(partial: Partial<InviteEvent> = {}): InviteEvent {
  const base: InviteEvent = {
    id: "e1",
    slug: "ana-y-leo",
    templateSlug: "vintage",
    plan: "completo",
    paid: true,
    published: true,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    modules: defaultModules(),
    content: defaultContent({ title: "Ana y Leo", subtitle: "Live" }),
  };
  const next = { ...base, ...partial };
  if (next.published && !next.publishedRevision) {
    next.publishedRevision = snapshotRevision(next);
  }
  return next;
}

describe("applyEventPatch", () => {
  it("keeps the live revision when a stale draft save lands after publish", () => {
    const live = event({ content: defaultContent({ subtitle: "Publicado" }) });
    const result = applyEventPatch(live, {
      content: defaultContent({ subtitle: "Borrador viejo" }),
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.event.content.subtitle).toBe("Borrador viejo");
    expect(result.event.published).toBe(true);
    expect(result.event.publishedRevision?.content.subtitle).toBe("Publicado");
  });

  it("snapshots the current draft only on explicit publish", () => {
    const current = event({
      published: true,
      content: defaultContent({ subtitle: "Nuevo draft" }),
      publishedRevision: snapshotRevision(
        event({ content: defaultContent({ subtitle: "Viejo live" }) }),
      ),
    });
    const result = applyEventPatch(current, { action: "publish" });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.event.publishedRevision?.content.subtitle).toBe("Nuevo draft");
  });

  it("unpublish leaves the frozen revision in place", () => {
    const current = event({ content: defaultContent({ subtitle: "Live" }) });
    const result = applyEventPatch(current, { action: "unpublish" });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.event.published).toBe(false);
    expect(result.event.publishedRevision?.content.subtitle).toBe("Live");
  });
});

describe("withEventLock", () => {
  beforeEach(() => {
    // locks are process-wide; unique ids keep tests isolated
  });

  it("runs work for the same event one after another", async () => {
    const order: number[] = [];
    const first = withEventLock("lock-a", async () => {
      order.push(1);
      await Promise.resolve();
      order.push(2);
    });
    const second = withEventLock("lock-a", async () => {
      order.push(3);
    });
    await Promise.all([first, second]);
    expect(order).toEqual([1, 2, 3]);
  });
});
