import type { EventRevision, InviteEvent } from "./types";
import { defaultContent } from "./format";
import { normalizeModules } from "./modules";

export function snapshotRevision(event: InviteEvent): EventRevision {
  return {
    slug: event.slug,
    modules: structuredClone(event.modules),
    content: structuredClone(event.content),
    paletteOverride: event.paletteOverride
      ? structuredClone(event.paletteOverride)
      : undefined,
  };
}

/** Ensure older DB rows get content defaults, module migrations, and publish snapshots. */
export function normalizeEvent(event: InviteEvent): InviteEvent {
  const next: InviteEvent = {
    ...event,
    modules: normalizeModules(event.modules),
    content: defaultContent(event.content),
    publishedRevision: event.publishedRevision
      ? {
          ...event.publishedRevision,
          modules: normalizeModules(event.publishedRevision.modules),
          content: defaultContent(event.publishedRevision.content),
        }
      : event.publishedRevision,
  };
  if (next.published && !next.publishedRevision) {
    return { ...next, publishedRevision: snapshotRevision(next) };
  }
  return next;
}

/** Overlay the frozen live revision onto the event for public rendering. */
export function asPublishedEvent(event: InviteEvent): InviteEvent | null {
  const revision = event.publishedRevision;
  if (!event.published || !revision) return null;
  return {
    ...event,
    slug: revision.slug,
    modules: revision.modules,
    content: revision.content,
    paletteOverride: revision.paletteOverride,
  };
}

export function publicSlug(event: InviteEvent): string {
  if (event.published && event.publishedRevision?.slug) {
    return event.publishedRevision.slug;
  }
  return event.slug;
}

export function matchesSlug(event: InviteEvent, slug: string): boolean {
  return event.slug === slug || event.publishedRevision?.slug === slug;
}
