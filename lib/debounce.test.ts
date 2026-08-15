import { afterEach, describe, expect, it, vi } from "vitest";
import { createDebounced } from "./debounce";
import { formatDateTime } from "./format";

describe("createDebounced", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("sends only the last call after the wait", () => {
    vi.useFakeTimers();
    const fn = vi.fn();
    const debounced = createDebounced(fn, 2000);

    debounced("a");
    debounced("b");
    debounced("c");
    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1999);
    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith("c");
  });

  it("flush sends pending work immediately", () => {
    vi.useFakeTimers();
    const fn = vi.fn();
    const debounced = createDebounced(fn, 2000);

    debounced("draft");
    debounced.flush();
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith("draft");

    vi.advanceTimersByTime(2000);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("cancel drops pending work", () => {
    vi.useFakeTimers();
    const fn = vi.fn();
    const debounced = createDebounced(fn, 2000);

    debounced("lost");
    debounced.cancel();
    vi.advanceTimersByTime(2000);
    expect(fn).not.toHaveBeenCalled();
  });
});

describe("formatDateTime", () => {
  it("includes date and time", () => {
    const label = formatDateTime("2026-08-15T14:32:00.000-03:00");
    expect(label).toMatch(/15/);
    expect(label).toMatch(/2026/);
    expect(label).toMatch(/\d{1,2}:\d{2}/);
  });
});
