# Moji Invites

Product brief and engineering invariants for anyone (human or agent) working in this repo. Keep this file current when the product model changes.

UI copy is **es-AR** (voseo rioplatense). Code, identifiers, and this brief are English.

## What we are building

**Moji** is a self-serve digital invitation product for Latin America (first market: Argentina). Inspiration: [Fixdate](https://fixdate.io/ar/) — thematic invitation sets, wedding modules, RSVP, music, gifts — but Fixdate is advisor-built in ~72h. Moji lets the host customize live, pay, publish, send, and track RSVPs from a mini backoffice.

Positioning: same visual universe (editorial, cream/gold, serif display), different loop — **you assemble it**.

### Core loop

1. Pick a template set (boda, 15 años, comunión; other categories “muy pronto”).
2. Customize in a live phone preview: reorder/toggle modules, edit copy, recolor.
3. Pay (Stripe or Mercado Pago; proto is simulated).
4. Publish a frozen live revision.
5. Add guests, send WhatsApp/mail/link, collect accept/decline.
6. Premium: generate and schedule social copy (IG / TikTok / Pinterest; proto is simulated).

## Product rules (do not break)

- **Draft ≠ live.** Autosave writes draft fields only (`slug`, `modules`, `content`, `paletteOverride`, `templateSlug`, `plan`). Guests on `/i/[slug]` see `publishedRevision`, never unsaved or unpublished draft — unless `?preview=1`.
- **Publish is explicit.** `published` / `publishedRevision` change only via `PATCH` `action: "publish" | "unpublish"`. Checkout must not auto-publish.
- **Paywall.** Publish, send guests, and RSVP tooling unlock after `paid`. `canPublish()` in `lib/social.ts` is the gate.
- **Cover module stays on.** It can be reordered; it cannot be toggled off.
- **Debounced editor saves.** Local preview updates immediately. Persist ~2s after the last edit, or immediately from the Guardar FAB / Preview / Publicar. One in-flight write queue per editor; server serializes writes per event id.
- **Studio must not snapshot a dirty editor.** If `localStorage` `moji-editor-dirty:{eventId}` is set, Studio blocks publish and tells the host to save or publish from the editor.
- **A late autosave must not roll back a publish.** `applyEventPatch` merges draft onto the *latest* persisted row under `withEventLock`. Live revision is copied from that row unless this request is a publish/unpublish.

## Stack

- Next.js 15 App Router, React 19, TypeScript, Tailwind 3
- Persistence: `data/db.json` via `lib/store.ts` (fs). Re-reads by mtime because Next can load the store in separate isolates.
- DnD: `@dnd-kit`. Icons: `lucide-react`.
- Tests: Vitest (`npm test`). No real Stripe/MP/social APIs yet.

Demo seed (`lib/seed.ts`): event `evt_demo_sofia`, slug `sofia-y-martin`, plan Premium, already paid + published, mixed RSVPs.

## Routes

| Path | Role |
| --- | --- |
| `/` | Marketing landing (Fixdate-like event types, features, plans) |
| `/modelos`, `/modelos/[slug]` | Template catalog + detail |
| `/editor/[id]` | Live editor |
| `/checkout/[id]` | Stripe / Mercado Pago proto |
| `/studio/*` | Host mini-backoffice (resumen, invitados, enviar, redes, pagos) |
| `/i/[slug]` | Public invitation. Live revision, or draft if `?preview=1` |
| `/api/events`, `/api/events/[id]` | Create / patch (draft + publish actions) |
| `/api/guests`, `/api/rsvp` | Guest list + accept/decline |
| `/api/checkout`, `/api/social` | Payments + social pack (simulated) |

## Domain

See `lib/types.ts`.

- **Template set** (`lib/templates.ts`): palette, display font, ornament, category, preview image.
- **Modules** (`lib/modules.ts`): cover, countdown, hosts, ceremony, party, dresscode, gallery, playlist, inviteMusic, gifts, rsvp, menu, stay, transport, instagram, faq. Each catalog entry owns its Contenido fields; editor Contenido follows Módulos order. Guests can store `songSuggestion` for the collaborative playlist.
- **InviteEvent**: draft document + `published` + optional `publishedRevision` (`lib/eventRevision.ts`).
- **Guest**: tokenized link, `accepted | declined | pending`, plus-ones.
- **Plans** (`lib/format.ts`): Esencial / Completo / Premium (ARS). Redes automation is Premium-only.

Helpers:

- `lib/eventPatch.ts` — merge PATCH onto latest event
- `lib/lock.ts` — per-event async lock
- `lib/debounce.ts` — editor debounce
- `lib/editorSync.ts` — dirty flag for Studio
- `lib/social.ts` — RSVP counts, `canPublish`, social copy pack

UI:

- `components/editor/EditorShell.tsx` — live tools + persist
- `components/invitation/InvitationView.tsx` — shared renderer (editor + public)
- `components/studio/*` — backoffice

## UX / design

- Language: Spanish (Argentina). Headlines in display serif (`Cormorant` / template font); UI in `Outfit`.
- Palette tokens: cream paper, ink, gold. Dark templates exist (Navy Romance, Aurum Wine, Aurora).
- Editor is a customization **tool**, not a page builder. Keep the phone preview as source of truth for module order.
- Event type cards in the landing grid must share height (`EventTypeGrid`).

## Out of scope (proto)

Real Stripe/Mercado Pago charges, real IG/TikTok/Pinterest posting, auth/accounts, multi-tenant hosting, advisor workflow. Wire product behavior as if those exist; do not fake that a post actually went out.

## How to work here

```bash
npm install
npm run dev    # http://localhost:3000
npm test
npm run build
```

- Prefer small, invariant-preserving changes over new abstractions.
- When you change publish/save/RSVP, add or update a Vitest case next to the helper (`lib/*.test.ts`).
- Do not commit `data/db.json` (gitignored; regenerated from seed).
- If you add a template, follow the existing `TemplateSet` shape and keep modules data-driven.
