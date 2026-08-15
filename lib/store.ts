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

const DEFAULT_PATH = path.join(process.cwd(), "data", "db.json");

let memory: Database | null = null;
let filePath = DEFAULT_PATH;
let persistToDisk = true;

export function configureStore(options: { filePath?: string; persist?: boolean } = {}) {
  filePath = options.filePath ?? DEFAULT_PATH;
  persistToDisk = options.persist ?? true;
  memory = null;
}

function emptyDb(): Database {
  return { events: [], guests: [], payments: [], socialPosts: [] };
}

function readDb(): Database {
  if (memory) return memory;
  if (persistToDisk) {
    try {
      if (fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath, "utf8");
        memory = JSON.parse(raw) as Database;
        return memory;
      }
    } catch {
      // fall through to seed
    }
  }
  memory = seedDatabase();
  writeDb(memory);
  return memory;
}

function writeDb(db: Database) {
  memory = db;
  if (!persistToDisk) return;
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(db, null, 2));
}

export function getDb(): Database {
  return structuredClone(readDb());
}

export function resetStore(db: Database = seedDatabase()) {
  writeDb(db);
}

export function listEvents(): InviteEvent[] {
  return readDb().events;
}

export function getActiveEvent(): InviteEvent | undefined {
  return readDb().events[0];
}

export function getEvent(id: string): InviteEvent | undefined {
  return readDb().events.find((e) => e.id === id);
}

export function getEventBySlug(slug: string): InviteEvent | undefined {
  return readDb().events.find((e) => e.slug === slug);
}

export function upsertEvent(event: InviteEvent): InviteEvent {
  const db = readDb();
  const idx = db.events.findIndex((e) => e.id === event.id);
  const next = { ...event, updatedAt: new Date().toISOString() };
  if (idx >= 0) db.events.splice(idx, 1);
  db.events.unshift(next);
  writeDb(db);
  return next;
}

export function listGuests(eventId: string): Guest[] {
  return readDb().guests.filter((g) => g.eventId === eventId);
}

export function getGuestByToken(token: string): Guest | undefined {
  return readDb().guests.find((g) => g.token === token);
}

export function upsertGuest(guest: Guest): Guest {
  const db = readDb();
  const idx = db.guests.findIndex((g) => g.id === guest.id);
  if (idx >= 0) db.guests[idx] = guest;
  else db.guests.push(guest);
  writeDb(db);
  return guest;
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
