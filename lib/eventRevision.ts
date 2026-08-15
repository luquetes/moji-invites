import type { EventRevision, InviteEvent } from "./types";

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

/** Ensure older DB rows that were published before revisions existed get a snapshot. */
export function normalizeEvent(event: InviteEvent): InviteEvent {
  if (event.published && !event.publishedRevision) {
    return { ...event, publishedRevision: snapshotRevision(event) };
  }
  return event;
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
