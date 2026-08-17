import fs from "fs";
import path from "path";
import type {
  Database,
  Guest,
  InviteEvent,
  Payment,
  SocialPost,
} from "./types";
import { seedDatabase } from "./seed";
import { matchesSlug, normalizeEvent } from "./eventRevision";

const DEFAULT_PATH = path.join(process.cwd(), "data", "db.json");

let memory: Database | null = null;
let memoryMtimeMs = -1;
let filePath = DEFAULT_PATH;
let persistToDisk = true;

export function configureStore(options: { filePath?: string; persist?: boolean } = {}) {
  filePath = options.filePath ?? DEFAULT_PATH;
  persistToDisk = options.persist ?? true;
  memory = null;
  memoryMtimeMs = -1;
}

function emptyDb(): Database {
  return { events: [], guests: [], payments: [], socialPosts: [] };
}

function readDb(): Database {
  // Always reconcile from disk when persisting. Next.js can load this module in
  // separate bundles (API routes vs pages), so an in-memory-only cache goes stale
  // after another isolate writes db.json.
  if (persistToDisk) {
    try {
      if (fs.existsSync(filePath)) {
        const mtimeMs = fs.statSync(filePath).mtimeMs;
        if (memory && mtimeMs === memoryMtimeMs) return memory;
        const raw = fs.readFileSync(filePath, "utf8");
        memory = JSON.parse(raw) as Database;
        memoryMtimeMs = mtimeMs;
        return memory;
      }
    } catch {
      // fall through to seed
    }
    memory = seedDatabase();
    writeDb(memory);
    return memory;
  }
  if (memory) return memory;
  memory = seedDatabase();
  return memory;
}

function writeDb(db: Database) {
  memory = db;
  if (!persistToDisk) return;
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(db, null, 2));
  memoryMtimeMs = fs.statSync(filePath).mtimeMs;
}

export function getDb(): Database {
  return structuredClone(readDb());
}

export function resetStore(db: Database = seedDatabase()) {
  writeDb(db);
}

export function listEvents(): InviteEvent[] {
  return readDb().events.map(normalizeEvent);
}

export function getActiveEvent(): InviteEvent | undefined {
  const event = readDb().events[0];
  return event ? normalizeEvent(event) : undefined;
}

export function getEvent(id: string): InviteEvent | undefined {
  const event = readDb().events.find((e) => e.id === id);
  return event ? normalizeEvent(event) : undefined;
}

export function getEventBySlug(slug: string): InviteEvent | undefined {
  const event = readDb().events.find((e) => matchesSlug(e, slug));
  return event ? normalizeEvent(event) : undefined;
}

export function upsertEvent(event: InviteEvent): InviteEvent {
  const db = readDb();
  const idx = db.events.findIndex((e) => e.id === event.id);
  const next = normalizeEvent({ ...event, updatedAt: new Date().toISOString() });
  if (idx >= 0) db.events.splice(idx, 1);
  db.events.unshift(next);
  writeDb(db);
  return next;
}

export function listGuests(eventId: string): Guest[] {
  return readDb()
    .guests.filter((g) => g.eventId === eventId)
    .map(normalizeGuest);
}

export function getGuestByToken(token: string): Guest | undefined {
  const guest = readDb().guests.find((g) => g.token === token);
  return guest ? normalizeGuest(guest) : undefined;
}

export function upsertGuest(guest: Guest): Guest {
  const db = readDb();
  const next = normalizeGuest(guest);
  const idx = db.guests.findIndex((g) => g.id === next.id);
  if (idx >= 0) db.guests[idx] = next;
  else db.guests.push(next);
  writeDb(db);
  return next;
}

function normalizeGuest(guest: Guest): Guest {
  return {
    ...guest,
    songSuggestion: guest.songSuggestion ?? "",
    dietary: guest.dietary ?? "",
    message: guest.message ?? "",
  };
}

export function listPayments(eventId: string): Payment[] {
  return readDb().payments.filter((p) => p.eventId === eventId);
}

export function addPayment(payment: Payment): Payment {
  const db = readDb();
  db.payments.unshift(payment);
  writeDb(db);
  return payment;
}

export function listSocialPosts(eventId: string): SocialPost[] {
  return readDb()
    .socialPosts.filter((p) => p.eventId === eventId)
    .sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt));
}

export function upsertSocialPost(post: SocialPost): SocialPost {
  const db = readDb();
  const idx = db.socialPosts.findIndex((p) => p.id === post.id);
  if (idx >= 0) db.socialPosts[idx] = post;
  else db.socialPosts.push(post);
  writeDb(db);
  return post;
}

export function replaceDb(mutator: (db: Database) => void) {
  const db = readDb();
  mutator(db);
  writeDb(db);
}

export { emptyDb };
