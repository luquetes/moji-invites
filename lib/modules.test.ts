import { describe, expect, it, beforeEach } from "vitest";
import {
  defaultModules,
  moduleFields,
  normalizeModules,
  reorderModules,
  toggleModule,
} from "./modules";
import { canPublish, generateSocialPack, rsvpCounts } from "./social";
import { configureStore, getEvent, listGuests, resetStore, upsertEvent } from "./store";
import { seedDatabase } from "./seed";
import { defaultContent } from "./format";
import { snapshotRevision } from "./eventRevision";
import type { InviteEvent } from "./types";

describe("modules", () => {
  it("does not disable the locked cover", () => {
    const next = toggleModule(defaultModules(), "cover", false);
    expect(next.find((m) => m.id === "cover")?.enabled).toBe(true);
  });

  it("toggles optional modules", () => {
    const next = toggleModule(defaultModules(), "faq", true);
    expect(next.find((m) => m.id === "faq")?.enabled).toBe(true);
  });

  it("reorders modules while keeping cover movable", () => {
    const modules = defaultModules();
    const next = reorderModules(modules, "rsvp", "countdown");
    const ids = next.map((m) => m.id);
    expect(ids.indexOf("rsvp")).toBeLessThan(ids.indexOf("countdown"));
  });

  it("defaults include ceremony and party instead of itinerary/location", () => {
    const ids = defaultModules().map((m) => m.id);
    expect(ids).toContain("ceremony");
    expect(ids).toContain("party");
    expect(ids).not.toContain("itinerary");
    expect(ids).not.toContain("location");
  });

  it("maps legacy itinerary/location to ceremony/party", () => {
    const next = normalizeModules([
      { id: "cover", enabled: true },
      { id: "itinerary", enabled: true },
      { id: "location", enabled: false },
      { id: "gifts", enabled: true },
    ]);
    const ids = next.map((m) => m.id);
    expect(ids).not.toContain("itinerary");
    expect(ids).not.toContain("location");
    expect(ids.indexOf("ceremony")).toBe(1);
    expect(ids.indexOf("party")).toBe(2);
    expect(next.find((m) => m.id === "ceremony")?.enabled).toBe(true);
    expect(next.find((m) => m.id === "party")?.enabled).toBe(false);
    expect(moduleFields("ceremony").map((f) => f.key)).toContain("venueCeremony");
    expect(moduleFields("party").map((f) => f.key)).toContain("timeParty");
  });

  it("maps legacy music to playlist and inviteMusic", () => {
    const next = normalizeModules([
      { id: "cover", enabled: true },
      { id: "music", enabled: true },
      { id: "gifts", enabled: true },
    ]);
    const ids = next.map((m) => m.id);
    expect(ids).not.toContain("music");
    expect(ids).toContain("playlist");
    expect(ids).toContain("inviteMusic");
    expect(next.find((m) => m.id === "playlist")?.enabled).toBe(true);
    expect(next.find((m) => m.id === "inviteMusic")?.enabled).toBe(true);
  });
});

describe("rsvp and publish", () => {
  const guests = [
    { status: "accepted" as const, plusOnes: 1 },
    { status: "accepted" as const, plusOnes: 0 },
    { status: "declined" as const, plusOnes: 2 },
    { status: "pending" as const, plusOnes: 0 },
  ].map((g, i) => ({
    id: `g${i}`,
    eventId: "e1",
    name: `Guest ${i}`,
    email: `${i}@mail.com`,
    phone: "",
    token: `t${i}`,
    message: "",
    dietary: "",
    songSuggestion: "",
    ...g,
  }));

  it("counts accepted, declined, pending and plus ones", () => {
    expect(rsvpCounts(guests)).toEqual({
      accepted: 2,
      declined: 1,
      pending: 1,
      plusOnes: 1,
    });
  });

  it("blocks publish until the template is paid", () => {
    const event = {
      id: "e1",
      slug: "demo",
      templateSlug: "vintage",
      plan: "esencial",
      paid: false,
      published: false,
      createdAt: "",
      updatedAt: "",
      modules: defaultModules(),
      content: defaultContent({ title: "Ana y Leo" }),
    } satisfies InviteEvent;
    expect(canPublish(event).ok).toBe(false);
    expect(canPublish({ ...event, paid: true }).ok).toBe(true);
  });
});

describe("social pack", () => {
  it("builds platform-specific copy from the event", () => {
    const event = {
      id: "e1",
      slug: "demo",
      templateSlug: "tropical",
      plan: "premium",
      paid: true,
      published: true,
      createdAt: "",
      updatedAt: "",
      modules: defaultModules(),
      content: defaultContent({ title: "Luz y Pedro", city: "Mendoza" }),
    } satisfies InviteEvent;
    const pack = generateSocialPack(event);
    expect(pack.instagram.caption).toContain("Luz y Pedro");
    expect(pack.tiktok.hashtags).toContain("#fyp");
    expect(pack.pinterest.title).toContain("Mendoza");
  });
});

describe("store", () => {
  beforeEach(() => {
    configureStore({ persist: false });
    resetStore(seedDatabase());
  });

  it("seeds the demo event and guests", () => {
    const event = getEvent("evt_demo_sofia");
    expect(event?.slug).toBe("sofia-y-martin");
    expect(event?.publishedRevision?.slug).toBe("sofia-y-martin");
    expect(listGuests("evt_demo_sofia").length).toBeGreaterThan(3);
  });

  it("persists module order on upsert", () => {
    const event = getEvent("evt_demo_sofia")!;
    const modules = reorderModules(event.modules, "gifts", "cover");
    upsertEvent({ ...event, modules });
    expect(getEvent("evt_demo_sofia")?.modules[0].id).toBe("gifts");
  });

  it("keeps published revision unchanged when draft content is edited", () => {
    const event = getEvent("evt_demo_sofia")!;
    const liveSubtitle = event.publishedRevision?.content.subtitle;
    upsertEvent({
      ...event,
      content: { ...event.content, subtitle: "Borrador distinto" },
    });
    const next = getEvent("evt_demo_sofia")!;
    expect(next.content.subtitle).toBe("Borrador distinto");
    expect(next.publishedRevision?.content.subtitle).toBe(liveSubtitle);
  });

  it("copies draft into published revision on publish helper snapshot", () => {
    const event = getEvent("evt_demo_sofia")!;
    const draft = {
      ...event,
      content: { ...event.content, subtitle: "Nueva versión live" },
      publishedRevision: snapshotRevision({
        ...event,
        content: { ...event.content, subtitle: "Nueva versión live" },
      }),
    };
    upsertEvent(draft);
    expect(getEvent("evt_demo_sofia")?.publishedRevision?.content.subtitle).toBe(
      "Nueva versión live",
    );
  });
});
