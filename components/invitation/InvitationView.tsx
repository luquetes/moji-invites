"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import type { CSSProperties } from "react";
import { MapPin, CalendarPlus, Music2, Gift, Instagram } from "lucide-react";
import type { Guest, InviteEvent, ModuleId, RsvpStatus } from "@/lib/types";
import { getTemplate, isDarkTemplate } from "@/lib/templates";
import { formatDateLong } from "@/lib/format";
import { Ornament } from "@/components/Ornament";
import { cn } from "@/lib/cn";

const fontClass: Record<string, string> = {
  cormorant: "font-display",
  cinzel: "font-cinzel",
  fraunces: "font-fraunces",
  playfair: "font-playfair",
};

export function InvitationView({
  event,
  guest,
  compact = false,
  highlight,
  onRsvp,
}: {
  event: InviteEvent;
  guest?: Guest;
  compact?: boolean;
  highlight?: ModuleId;
  onRsvp?: (status: RsvpStatus, extras: { message: string; plusOnes: number }) => void;
}) {
  const template = getTemplate(event.templateSlug);
  const palette = { ...(template?.palette ?? {}), ...event.paletteOverride };
  const dark = isDarkTemplate(event.templateSlug);
  const [opened, setOpened] = useState(!compact);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const style = {
    "--bg": palette.bg,
    "--paper": palette.paper,
    "--ink": palette.ink,
    "--muted": palette.muted,
    "--accent": palette.accent,
    "--soft": palette.accentSoft,
  } as CSSProperties;

  const display = fontClass[template?.displayFont ?? "cormorant"];
  const modules = event.modules.filter((m) => m.enabled);
  const remaining = useMemo(() => countdown(event.content.date, now), [event.content.date, now]);

  return (
    <div
      style={style}
      className={cn(
        "relative overflow-hidden text-[color:var(--ink)]",
        compact ? "h-full" : "min-h-screen",
      )}
    >
      <div
        className={cn("h-full overflow-y-auto invite-scroll", compact ? "max-h-full" : "")}
        style={{ background: "var(--bg)" }}
      >
        {!opened ? (
          <Cover
            event={event}
            display={display}
            ornament={template?.ornament ?? "floral"}
            onOpen={() => setOpened(true)}
            guestName={guest?.name}
          />
        ) : (
          <div className={cn("mx-auto", compact ? "px-5 py-8" : "max-w-lg px-6 py-12")}>
            {modules.map((mod) => (
              <section
                key={mod.id}
                className={cn(
                  "mb-10 scroll-mt-6 rounded-[28px] transition",
                  highlight === mod.id && "ring-2 ring-[color:var(--accent)] ring-offset-4 ring-offset-[color:var(--bg)]",
                )}
              >
                {mod.id === "cover" && (
                  <Cover
                    event={event}
                    display={display}
                    ornament={template?.ornament ?? "floral"}
                    embedded
                    guestName={guest?.name}
                  />
                )}
                {mod.id === "countdown" && <CountdownBlock remaining={remaining} display={display} />}
                {mod.id === "hosts" && <HostsBlock event={event} display={display} />}
                {mod.id === "itinerary" && <ItineraryBlock event={event} display={display} />}
                {mod.id === "location" && <LocationBlock event={event} display={display} />}
                {mod.id === "dresscode" && (
                  <SimpleBlock kicker="Dress code" title={event.content.dresscode} display={display} />
                )}
                {mod.id === "gallery" && <GalleryBlock event={event} display={display} />}
                {mod.id === "music" && (
                  <IconBlock icon={<Music2 size={18} />} kicker="Música" title={event.content.musicNote} />
                )}
                {mod.id === "gifts" && <GiftsBlock event={event} display={display} />}
                {mod.id === "rsvp" && (
                  <RsvpBlock
                    event={event}
                    guest={guest}
                    display={display}
                    onRsvp={onRsvp}
                    compact={compact}
                  />
                )}
                {mod.id === "menu" && (
                  <SimpleBlock kicker="Menú" title={event.content.menu} display={display} />
                )}
                {mod.id === "stay" && (
                  <SimpleBlock kicker="Alojamiento" title={event.content.stay} display={display} />
                )}
                {mod.id === "transport" && (
                  <SimpleBlock kicker="Transporte" title={event.content.transport} display={display} />
                )}
                {mod.id === "instagram" && (
                  <IconBlock
                    icon={<Instagram size={18} />}
                    kicker="Instagram"
                    title={`Etiquetanos ${event.content.instagramHandle}`}
                  />
                )}
                {mod.id === "faq" && <FaqBlock event={event} display={display} />}
              </section>
            ))}
            <p className={cn("pb-8 text-center text-[10px] uppercase tracking-[0.24em] opacity-50", dark && "opacity-70")}>
              Hecho con Moji
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function Cover({
  event,
  display,
  ornament,
  onOpen,
  embedded,
  guestName,
}: {
  event: InviteEvent;
  display: string;
  ornament: "floral" | "geometric" | "botanical" | "art-deco" | "minimal" | "script";
  onOpen?: () => void;
  embedded?: boolean;
  guestName?: string;
}) {
  return (
    <div className={cn("relative text-center", embedded ? "py-6" : "flex min-h-[520px] flex-col items-center justify-center px-8 py-16")}>
      <p className="text-[11px] uppercase tracking-[0.32em] text-[color:var(--muted)]">
        {event.content.subtitle}
      </p>
      <h1 className={cn(display, "mt-4 text-5xl leading-tight")}>{event.content.title}</h1>
      <Ornament style={ornament} color="var(--accent)" className="mx-auto mt-6 h-8 w-44" />
      <p className="mt-6 font-display text-xl italic text-[color:var(--muted)]">
        {formatDateLong(event.content.date)}
      </p>
      <p className="mt-1 text-sm text-[color:var(--muted)]">{event.content.city}</p>
      {guestName && (
        <p className="mt-6 text-sm">
          Para <span className="font-medium">{guestName}</span>
        </p>
      )}
      {onOpen && (
        <button
          onClick={onOpen}
          className="mt-10 rounded-full border border-[color:var(--accent)] px-6 py-2 text-xs uppercase tracking-[0.22em]"
        >
          Abrir invitación
        </button>
      )}
    </div>
  );
}

function CountdownBlock({
  remaining,
  display,
}: {
  remaining: { d: number; h: number; m: number; s: number };
  display: string;
}) {
  const cells = [
    [remaining.d, "días"],
    [remaining.h, "hs"],
    [remaining.m, "min"],
    [remaining.s, "seg"],
  ];
  return (
    <div className="rounded-[28px] bg-[color:var(--paper)] px-4 py-8 text-center shadow-soft">
      <p className="text-[10px] uppercase tracking-[0.28em] text-[color:var(--muted)]">Falta</p>
      <div className="mt-4 grid grid-cols-4 gap-2">
        {cells.map(([value, label]) => (
          <div key={String(label)}>
            <p className={cn(display, "text-3xl")}>{value}</p>
            <p className="text-[10px] uppercase tracking-widest text-[color:var(--muted)]">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function HostsBlock({ event, display }: { event: InviteEvent; display: string }) {
  return (
    <div className="px-2 text-center">
      <p className="text-[10px] uppercase tracking-[0.28em] text-[color:var(--muted)]">
        {event.content.hosts}
      </p>
      <p className={cn(display, "mt-4 text-2xl leading-snug")}>{event.content.story}</p>
    </div>
  );
}

function ItineraryBlock({ event, display }: { event: InviteEvent; display: string }) {
  return (
    <div className="rounded-[28px] bg-[color:var(--paper)] p-6 shadow-soft">
      <p className="text-[10px] uppercase tracking-[0.28em] text-[color:var(--muted)]">Itinerario</p>
      <div className="mt-4 space-y-4">
        <div>
          <p className={cn(display, "text-2xl")}>Ceremonia · {event.content.time}</p>
          <p className="text-sm text-[color:var(--muted)]">{event.content.venueCeremony}</p>
        </div>
        <div className="h-px bg-[color:var(--soft)]" />
        <div>
          <p className={cn(display, "text-2xl")}>Fiesta</p>
          <p className="text-sm text-[color:var(--muted)]">{event.content.venueParty}</p>
        </div>
        <a
          className="mt-2 inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em]"
          href={`https://calendar.google.com`}
        >
          <CalendarPlus size={14} /> Agendar
        </a>
      </div>
    </div>
  );
}

function LocationBlock({ event, display }: { event: InviteEvent; display: string }) {
  const q = encodeURIComponent(`${event.content.venueParty} ${event.content.addressParty}`);
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.28em] text-[color:var(--muted)]">Ubicación</p>
      <p className={cn(display, "mt-2 text-3xl")}>{event.content.venueParty}</p>
      <p className="text-sm text-[color:var(--muted)]">{event.content.addressParty}</p>
      <p className="mt-3 text-sm">{event.content.venueCeremony}</p>
      <p className="text-sm text-[color:var(--muted)]">{event.content.addressCeremony}</p>
      <a
        href={`https://maps.google.com/?q=${q}`}
        className="mt-4 inline-flex items-center gap-2 rounded-full bg-[color:var(--ink)] px-4 py-2 text-xs uppercase tracking-[0.16em] text-[color:var(--bg)]"
      >
        <MapPin size={14} /> Cómo llegar
      </a>
    </div>
  );
}

function GalleryBlock({ event, display }: { event: InviteEvent; display: string }) {
  return (
    <div>
      <p className={cn(display, "mb-4 text-3xl")}>Álbum</p>
      <div className="grid grid-cols-3 gap-2">
        {event.content.gallery.map((img) => (
          <div
            key={img.src}
            className="aspect-[3/4] rounded-2xl bg-cover bg-center"
            style={{ backgroundImage: `url(${img.src})` }}
            aria-label={img.alt}
          />
        ))}
      </div>
    </div>
  );
}

function GiftsBlock({ event, display }: { event: InviteEvent; display: string }) {
  return (
    <div className="rounded-[28px] border border-[color:var(--soft)] p-6">
      <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.28em]">
        <Gift size={14} /> Regalos
      </div>
      <p className={cn(display, "mt-3 text-2xl")}>{event.content.giftMessage}</p>
      <p className="mt-3 text-sm">Alias {event.content.giftAlias}</p>
      <p className="text-xs text-[color:var(--muted)]">CBU {event.content.giftCbu}</p>
    </div>
  );
}

function SimpleBlock({
  kicker,
  title,
  display,
}: {
  kicker: string;
  title: string;
  display: string;
}) {
  return (
    <div className="text-center">
      <p className="text-[10px] uppercase tracking-[0.28em] text-[color:var(--muted)]">{kicker}</p>
      <p className={cn(display, "mt-3 text-2xl")}>{title}</p>
    </div>
  );
}

function IconBlock({
  icon,
  kicker,
  title,
}: {
  icon: ReactNode;
  kicker: string;
  title: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-[24px] bg-[color:var(--paper)] p-5">
      <div className="mt-0.5">{icon}</div>
      <div>
        <p className="text-[10px] uppercase tracking-[0.28em] text-[color:var(--muted)]">{kicker}</p>
        <p className="mt-1 text-sm">{title}</p>
      </div>
    </div>
  );
}

function FaqBlock({ event, display }: { event: InviteEvent; display: string }) {
  return (
    <div>
      <p className={cn(display, "mb-4 text-3xl")}>Preguntas</p>
      <div className="space-y-4">
        {event.content.faq.map((item) => (
          <div key={item.q}>
            <p className="text-sm font-medium">{item.q}</p>
            <p className="text-sm text-[color:var(--muted)]">{item.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function RsvpBlock({
  event,
  guest,
  display,
  onRsvp,
  compact,
}: {
  event: InviteEvent;
  guest?: Guest;
  display: string;
  onRsvp?: (status: RsvpStatus, extras: { message: string; plusOnes: number }) => void;
  compact?: boolean;
}) {
  const [message, setMessage] = useState(guest?.message ?? "");
  const [plusOnes, setPlusOnes] = useState(guest?.plusOnes ?? 0);
  const [done, setDone] = useState<RsvpStatus | null>(guest?.status === "pending" ? null : guest?.status ?? null);

  return (
    <div className="rounded-[28px] bg-[color:var(--paper)] p-6 text-center shadow-soft">
      <p className="text-[10px] uppercase tracking-[0.28em] text-[color:var(--muted)]">RSVP</p>
      <p className={cn(display, "mt-2 text-3xl")}>¿Nos acompañás?</p>
      {done && done !== "pending" ? (
        <p className="mt-4 text-sm">
          {done === "accepted" ? "Confirmaste tu asistencia. ¡Gracias!" : "Registramos que no vas a poder. Te extrañamos."}
        </p>
      ) : (
        <>
          {!compact && (
            <>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Un mensaje para los anfitriones"
                className="mt-4 w-full rounded-2xl border border-[color:var(--soft)] bg-transparent p-3 text-sm"
              />
              <label className="mt-3 flex items-center justify-center gap-2 text-sm">
                Acompañantes
                <input
                  type="number"
                  min={0}
                  max={6}
                  value={plusOnes}
                  onChange={(e) => setPlusOnes(Number(e.target.value))}
                  className="w-16 rounded-lg border border-[color:var(--soft)] bg-transparent px-2 py-1"
                />
              </label>
            </>
          )}
          <div className="mt-5 flex justify-center gap-3">
            <button
              onClick={() => {
                onRsvp?.("accepted", { message, plusOnes });
                setDone("accepted");
              }}
              className="rounded-full bg-[color:var(--ink)] px-5 py-2 text-xs uppercase tracking-[0.16em] text-[color:var(--bg)]"
            >
              Ahí voy
            </button>
            <button
              onClick={() => {
                onRsvp?.("declined", { message, plusOnes: 0 });
                setDone("declined");
              }}
              className="rounded-full border border-[color:var(--ink)] px-5 py-2 text-xs uppercase tracking-[0.16em]"
            >
              No puedo
            </button>
          </div>
          {!onRsvp && (
            <p className="mt-3 text-[11px] text-[color:var(--muted)]">
              En el link personalizado, cada invitado confirma acá. Evento {event.slug}.
            </p>
          )}
        </>
      )}
    </div>
  );
}

export function countdown(iso: string, now = Date.now()) {
  const target = new Date(iso).getTime();
  const diff = Math.max(0, target - now);
  return {
    d: Math.floor(diff / 86400000),
    h: Math.floor((diff % 86400000) / 3600000),
    m: Math.floor((diff % 3600000) / 60000),
    s: Math.floor((diff % 60000) / 1000),
  };
}
