import { describe, expect, it } from "vitest";
import {
  buildIcs,
  calendarInputForStop,
  combineEventDateAndTime,
  escapeIcsText,
  formatIcsLocal,
  icsFilename,
} from "./calendar";
import { defaultContent } from "./format";
import { defaultModules } from "./modules";
import type { InviteEvent } from "./types";

function sampleEvent(partial?: Partial<InviteEvent>): InviteEvent {
  return {
    id: "evt_test",
    slug: "sofia-y-martin",
    templateSlug: "magnolias-gold",
    plan: "completo",
    paid: true,
    published: true,
    createdAt: "",
    updatedAt: "",
    modules: defaultModules(),
    content: defaultContent(),
    ...partial,
  };
}

describe("combineEventDateAndTime", () => {
  it("uses the local calendar day and HH:mm", () => {
    const start = combineEventDateAndTime("2026-11-14T17:00:00.000Z", "21:30");
    expect(start.getFullYear()).toBe(2026);
    expect(start.getMonth()).toBe(10);
    expect(start.getDate()).toBe(14);
    expect(start.getHours()).toBe(21);
    expect(start.getMinutes()).toBe(30);
  });
});

describe("buildIcs", () => {
  it("emits a VEVENT with escaped text", () => {
    const start = new Date(2026, 10, 14, 17, 0, 0);
    const end = new Date(2026, 10, 14, 18, 0, 0);
    const ics = buildIcs({
      uid: "evt_test-ceremony@moji.invites",
      title: "Sofía & Martín · Ceremonia",
      location: "Iglesia, Recoleta",
      description: "Nos casamos\nLink: https://moji.test/i/x",
      start,
      end,
    });
    expect(ics).toContain("BEGIN:VEVENT");
    expect(ics).toContain(`DTSTART:${formatIcsLocal(start)}`);
    expect(ics).toContain(`DTEND:${formatIcsLocal(end)}`);
    expect(ics).toContain("SUMMARY:Sofía & Martín · Ceremonia");
    expect(ics).toContain(escapeIcsText("Nos casamos\nLink: https://moji.test/i/x"));
    expect(ics.endsWith("\r\n")).toBe(true);
  });
});

describe("calendarInputForStop", () => {
  it("builds ceremony and party windows", () => {
    const event = sampleEvent();
    const ceremony = calendarInputForStop(event, "ceremony", "https://moji.test/i/sofia-y-martin");
    expect(ceremony.title).toContain("Ceremonia");
    expect(ceremony.location).toContain("Recoleta");
    expect(ceremony.description).toContain("https://moji.test/i/sofia-y-martin");
    expect(ceremony.end.getTime() - ceremony.start.getTime()).toBe(60 * 60 * 1000);

    const party = calendarInputForStop(event, "party");
    expect(party.title).toContain("Fiesta");
    expect(party.location).toContain("Pilar");
    expect(party.end.getTime() - party.start.getTime()).toBe(4 * 60 * 60 * 1000);
    expect(icsFilename(event.content, "party")).toMatch(/fiesta\.ics$/);
  });
});
