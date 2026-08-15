import { describe, expect, it, beforeEach } from "vitest";
import { defaultModules, reorderModules, toggleModule } from "./modules";
import { canPublish, generateSocialPack, rsvpCounts } from "./social";
import { configureStore, getEvent, listGuests, resetStore, upsertEvent } from "./store";
import { seedDatabase } from "./seed";
import { defaultContent } from "./format";
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
    expect(listGuests("evt_demo_sofia").length).toBeGreaterThan(3);
  });

  it("persists module order on upsert", () => {
    const event = getEvent("evt_demo_sofia")!;
    const modules = reorderModules(event.modules, "gifts", "cover");
    upsertEvent({ ...event, modules });
    expect(getEvent("evt_demo_sofia")?.modules[0].id).toBe("gifts");
  });
});
