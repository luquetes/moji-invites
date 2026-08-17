import type { EventContent, InviteEvent } from "./types";

export type CalendarStop = "ceremony" | "party";

export interface CalendarEventInput {
  uid: string;
  title: string;
  location: string;
  description?: string;
  start: Date;
  end: Date;
}

/** Combine the invitation calendar day with a `HH:mm` time (local). */
export function combineEventDateAndTime(isoDate: string, timeHhMm: string): Date {
  const base = new Date(isoDate);
  const day = Number.isNaN(base.getTime()) ? new Date() : base;
  const match = timeHhMm.trim().match(/^(\d{1,2}):(\d{2})$/);
  const hours = match ? Number(match[1]) : 12;
  const minutes = match ? Number(match[2]) : 0;
  return new Date(day.getFullYear(), day.getMonth(), day.getDate(), hours, minutes, 0, 0);
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

/** Floating local datetime for ICS (no Z) so wall-clock time stays as edited. */
export function formatIcsLocal(date: Date): string {
  return (
    `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}` +
    `T${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`
  );
}

export function formatIcsUtcStamp(date = new Date()): string {
  return (
    `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}` +
    `T${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}${pad(date.getUTCSeconds())}Z`
  );
}

export function escapeIcsText(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

export function buildIcs(event: CalendarEventInput): string {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Moji//Invites//ES",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${escapeIcsText(event.uid)}`,
    `DTSTAMP:${formatIcsUtcStamp()}`,
    `DTSTART:${formatIcsLocal(event.start)}`,
    `DTEND:${formatIcsLocal(event.end)}`,
    `SUMMARY:${escapeIcsText(event.title)}`,
    `LOCATION:${escapeIcsText(event.location)}`,
  ];
  if (event.description?.trim()) {
    lines.push(`DESCRIPTION:${escapeIcsText(event.description.trim())}`);
  }
  lines.push("END:VEVENT", "END:VCALENDAR");
  return `${lines.join("\r\n")}\r\n`;
}

function stopDurationMs(stop: CalendarStop): number {
  return stop === "ceremony" ? 60 * 60 * 1000 : 4 * 60 * 60 * 1000;
}

export function calendarInputForStop(
  event: InviteEvent,
  stop: CalendarStop,
  inviteUrl?: string,
): CalendarEventInput {
  const content = event.content;
  const isCeremony = stop === "ceremony";
  const label = isCeremony ? "Ceremonia" : "Fiesta";
  const time = (isCeremony ? content.time : content.timeParty) || "12:00";
  const venue = isCeremony ? content.venueCeremony : content.venueParty;
  const address = isCeremony ? content.addressCeremony : content.addressParty;
  const start = combineEventDateAndTime(content.date, time);
  const end = new Date(start.getTime() + stopDurationMs(stop));
  const location = [venue, address].filter(Boolean).join(", ");
  const descriptionParts = [
    content.subtitle?.trim(),
    inviteUrl ? `Invitación: ${inviteUrl}` : undefined,
  ].filter(Boolean);

  return {
    uid: `${event.id}-${stop}@moji.invites`,
    title: `${content.title} · ${label}`,
    location,
    description: descriptionParts.join("\n"),
    start,
    end,
  };
}

export function icsFilename(content: EventContent, stop: CalendarStop): string {
  const label = stop === "ceremony" ? "ceremonia" : "fiesta";
  const base = content.title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 32);
  return `${base || "evento"}-${label}.ics`;
}

/** Trigger an .ics download in the browser. */
export function downloadIcs(filename: string, body: string): void {
  const blob = new Blob([body], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.rel = "noopener";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export function downloadStopCalendar(event: InviteEvent, stop: CalendarStop, inviteUrl?: string): void {
  const input = calendarInputForStop(event, stop, inviteUrl);
  downloadIcs(icsFilename(event.content, stop), buildIcs(input));
}
