import { describe, expect, it } from "vitest";
import { defaultContent, parseYoutubeVideoId, toDateInputValue, withDateInputValue } from "./format";

describe("toDateInputValue / withDateInputValue", () => {
  it("round-trips a local calendar day", () => {
    const iso = "2026-11-14T17:00:00.000Z";
    const ymd = toDateInputValue(iso);
    expect(ymd).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    const next = withDateInputValue(iso, ymd);
    expect(toDateInputValue(next)).toBe(ymd);
  });

  it("changes only the calendar day", () => {
    const iso = "2026-11-14T20:30:00.000Z";
    const next = withDateInputValue(iso, "2027-03-01");
    expect(toDateInputValue(next)).toBe("2027-03-01");
    const prev = new Date(iso);
    const after = new Date(next);
    expect(after.getHours()).toBe(prev.getHours());
    expect(after.getMinutes()).toBe(prev.getMinutes());
  });

  it("returns empty for invalid iso", () => {
    expect(toDateInputValue("not-a-date")).toBe("");
  });
});

describe("defaultContent", () => {
  it("includes ceremony and party times", () => {
    const content = defaultContent();
    expect(content.time).toBe("17:00");
    expect(content.timeParty).toBe("21:00");
  });
});

describe("parseYoutubeVideoId", () => {
  it("parses watch, short, and embed urls", () => {
    expect(parseYoutubeVideoId("https://www.youtube.com/watch?v=jfKfPfyJRdk")).toBe("jfKfPfyJRdk");
    expect(parseYoutubeVideoId("https://youtu.be/jfKfPfyJRdk")).toBe("jfKfPfyJRdk");
    expect(parseYoutubeVideoId("https://www.youtube.com/embed/jfKfPfyJRdk")).toBe("jfKfPfyJRdk");
  });

  it("returns null for non-youtube urls", () => {
    expect(parseYoutubeVideoId("https://open.spotify.com/track/x")).toBeNull();
    expect(parseYoutubeVideoId("")).toBeNull();
  });
});
