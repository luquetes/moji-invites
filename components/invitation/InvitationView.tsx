"use client";

import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";
import type { CSSProperties } from "react";
import {
  MapPin,
  CalendarPlus,
  Music2,
  Gift,
  Instagram,
  Play,
  Volume2,
  VolumeX,
} from "lucide-react";
import type { Guest, InviteEvent, ModuleId, RsvpStatus } from "@/lib/types";
import { getTemplate, isDarkTemplate } from "@/lib/templates";
import { formatDateLong, parseYoutubeVideoId } from "@/lib/format";
import { downloadStopCalendar } from "@/lib/calendar";
import { Ornament } from "@/components/Ornament";
import { cn } from "@/lib/cn";

const fontClass: Record<string, string> = {
  cormorant: "font-display",
  cinzel: "font-cinzel",
  fraunces: "font-fraunces",
  playfair: "font-playfair",
};

/** Modules that only use overlay UI (e.g. FAB) — no in-flow preview section. */
const OVERLAY_ONLY_MODULES = new Set<ModuleId>(["inviteMusic"]);

type RsvpExtras = { message: string; plusOnes: number; songSuggestion?: string };

export function InvitationView({
  event,
  guest,
  compact = false,
  highlight,
  onRsvp,
  onSongSuggest,
}: {
  event: InviteEvent;
  guest?: Guest;
  compact?: boolean;
  highlight?: ModuleId;
  onRsvp?: (status: RsvpStatus, extras: RsvpExtras) => void;
  onSongSuggest?: (song: string) => void;
}) {
  const template = getTemplate(event.templateSlug);
  const palette = { ...(template?.palette ?? {}), ...event.paletteOverride };
  const dark = isDarkTemplate(event.templateSlug);
  const [opened, setOpened] = useState(!compact);
  const [now, setNow] = useState(() => Date.now());
  const scrollRef = useRef<HTMLDivElement>(null);
  const skipHighlightScroll = useRef(true);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (skipHighlightScroll.current) {
      skipHighlightScroll.current = false;
      return;
    }
    if (!highlight || OVERLAY_ONLY_MODULES.has(highlight)) return;
    setOpened(true);
    const timer = window.setTimeout(() => {
      const target = scrollRef.current?.querySelector<HTMLElement>(
        `[data-module-id="${highlight}"]`,
      );
      target?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 60);
    return () => window.clearTimeout(timer);
  }, [highlight]);

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
  const inviteMusicOn = modules.some((m) => m.id === "inviteMusic");
  const inviteMusicUrl = event.content.inviteMusicUrl?.trim() ?? "";
  const playlistOn = modules.some((m) => m.id === "playlist");

  return (
    <div
      style={style}
      className={cn(
        "relative overflow-hidden text-[color:var(--ink)]",
        compact ? "h-full" : "min-h-screen",
      )}
    >
      <div
        ref={scrollRef}
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
            {modules.map((mod) => {
              if (OVERLAY_ONLY_MODULES.has(mod.id)) return null;
              return (
              <section
                key={mod.id}
                data-module-id={mod.id}
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
                {mod.id === "ceremony" && <VenueStopBlock kind="ceremony" event={event} display={display} />}
                {mod.id === "party" && <VenueStopBlock kind="party" event={event} display={display} />}
                {mod.id === "dresscode" && (
                  <SimpleBlock kicker="Dress code" title={event.content.dresscode} display={display} />
                )}
                {mod.id === "gallery" && <GalleryBlock event={event} display={display} />}
                {mod.id === "playlist" && (
                  <PlaylistBlock
                    event={event}
                    guest={guest}
                    display={display}
                    compact={compact}
                    onSongSuggest={onSongSuggest}
                  />
                )}
                {mod.id === "gifts" && <GiftsBlock event={event} display={display} />}
                {mod.id === "rsvp" && (
                  <RsvpBlock
                    event={event}
                    guest={guest}
                    display={display}
                    onRsvp={onRsvp}
                    compact={compact}
                    askSong={playlistOn}
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
              );
            })}
            <p className={cn("pb-8 text-center text-[10px] uppercase tracking-[0.24em] opacity-50", dark && "opacity-70")}>
              Hecho con Moji
            </p>
          </div>
        )}
      </div>

      {inviteMusicOn ? <InviteMusicFab url={inviteMusicUrl} compact={compact} /> : null}
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

function VenueStopBlock({
  kind,
  event,
  display,
}: {
  kind: "ceremony" | "party";
  event: InviteEvent;
  display: string;
}) {
  const isCeremony = kind === "ceremony";
  const title = isCeremony ? "Ceremonia" : "Fiesta";
  const time = (isCeremony ? event.content.time : event.content.timeParty)?.trim();
  const venue = isCeremony ? event.content.venueCeremony : event.content.venueParty;
  const address = isCeremony ? event.content.addressCeremony : event.content.addressParty;
  const showMap = isCeremony ? event.content.showMapCeremony : event.content.showMapParty;
  const mapsQ = encodeURIComponent(`${venue} ${address}`.trim());
  const canMap = Boolean(mapsQ);

  return (
    <div className="rounded-[28px] bg-[color:var(--paper)] p-6 shadow-soft">
      <p className="text-[10px] uppercase tracking-[0.28em] text-[color:var(--muted)]">{title}</p>
      <p className={cn(display, "mt-3 text-3xl")}>
        {venue}
        {time ? ` · ${time}` : ""}
      </p>
      <p className="mt-1 text-sm text-[color:var(--muted)]">{address}</p>
      {showMap && canMap ? (
        <div className="mt-4 overflow-hidden rounded-2xl border border-[color:var(--soft)]">
          <iframe
            title={`Mapa · ${title}`}
            src={`https://maps.google.com/maps?q=${mapsQ}&z=15&output=embed`}
            className="h-40 w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      ) : null}
      <div className="mt-4 flex flex-wrap gap-3">
        <a
          href={`https://maps.google.com/?q=${mapsQ}`}
          className="inline-flex items-center gap-2 rounded-full bg-[color:var(--ink)] px-4 py-2 text-xs uppercase tracking-[0.16em] text-[color:var(--bg)]"
        >
          <MapPin size={14} /> Cómo llegar
        </a>
        <button
          type="button"
          onClick={() => {
            const origin = typeof window !== "undefined" ? window.location.origin : "";
            const inviteUrl = origin ? `${origin}/i/${event.slug}` : undefined;
            downloadStopCalendar(event, kind, inviteUrl);
          }}
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em]"
        >
          <CalendarPlus size={14} /> Agendar
        </button>
      </div>
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

function PlaylistBlock({
  event,
  guest,
  display,
  compact,
  onSongSuggest,
}: {
  event: InviteEvent;
  guest?: Guest;
  display: string;
  compact?: boolean;
  onSongSuggest?: (song: string) => void;
}) {
  const url = event.content.playlistUrl?.trim();
  const [song, setSong] = useState(guest?.songSuggestion ?? "");
  const [saved, setSaved] = useState(Boolean(guest?.songSuggestion));

  useEffect(() => {
    setSong(guest?.songSuggestion ?? "");
    setSaved(Boolean(guest?.songSuggestion));
  }, [guest?.songSuggestion]);

  return (
    <div className="rounded-[28px] bg-[color:var(--paper)] p-6 shadow-soft">
      <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-[color:var(--muted)]">
        <Music2 size={14} /> Playlist
      </div>
      <p className={cn(display, "mt-3 text-2xl")}>{event.content.musicNote}</p>
      {url ? (
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-block text-xs uppercase tracking-[0.16em] underline underline-offset-4"
        >
          Abrir playlist
        </a>
      ) : null}
      {!compact && (
        <div className="mt-4 space-y-2">
          <label className="block text-left text-xs text-[color:var(--muted)]">
            Tu canción favorita
            <input
              value={song}
              onChange={(e) => {
                setSong(e.target.value);
                setSaved(false);
              }}
              placeholder="Tema · artista"
              className="mt-1 w-full rounded-2xl border border-[color:var(--soft)] bg-transparent px-3 py-2 text-sm"
            />
          </label>
          <button
            type="button"
            disabled={!song.trim() || !onSongSuggest}
            onClick={() => {
              onSongSuggest?.(song.trim());
              setSaved(true);
            }}
            className="rounded-full bg-[color:var(--ink)] px-4 py-2 text-xs uppercase tracking-[0.16em] text-[color:var(--bg)] disabled:opacity-40"
          >
            {saved ? "Guardada" : "Sumar canción"}
          </button>
          {!onSongSuggest && (
            <p className="text-[11px] text-[color:var(--muted)]">
              En el link publicado, cada invitado puede sumar su tema.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

type YoutubePlayer = {
  playVideo: () => void;
  mute: () => void;
  unMute: () => void;
  destroy: () => void;
};

type YoutubeNamespace = {
  Player: new (
    elementId: string,
    options: {
      videoId: string;
      width?: number | string;
      height?: number | string;
      playerVars?: Record<string, string | number>;
      events?: { onReady?: () => void };
    },
  ) => YoutubePlayer;
};

declare global {
  interface Window {
    YT?: YoutubeNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let youtubeApiPromise: Promise<YoutubeNamespace> | null = null;

function loadYoutubeApi(): Promise<YoutubeNamespace> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("no window"));
  }
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (youtubeApiPromise) return youtubeApiPromise;

  youtubeApiPromise = new Promise((resolve) => {
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previous?.();
      if (window.YT) resolve(window.YT);
    };
    if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(script);
    }
  });

  return youtubeApiPromise;
}

function InviteMusicFab({ url, compact }: { url: string; compact?: boolean }) {
  const videoId = parseYoutubeVideoId(url);
  const hostId = useId().replace(/:/g, "");
  const playerRef = useRef<YoutubePlayer | null>(null);
  const [ready, setReady] = useState(false);
  const [started, setStarted] = useState(false);
  const [muted, setMuted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setReady(false);
    setStarted(false);
    setMuted(false);
    setError(null);
    playerRef.current?.destroy();
    playerRef.current = null;

    if (!videoId) return;

    void loadYoutubeApi().then((YT) => {
      if (cancelled) return;
      playerRef.current = new YT.Player(hostId, {
        videoId,
        width: 1,
        height: 1,
        playerVars: {
          playsinline: 1,
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
          rel: 0,
          loop: 1,
          playlist: videoId,
        },
        events: {
          onReady: () => {
            if (!cancelled) setReady(true);
          },
        },
      });
    });

    return () => {
      cancelled = true;
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, [videoId, hostId]);

  function onClick() {
    if (!url.trim()) {
      setError("Falta el link de YouTube en el editor.");
      return;
    }
    if (!videoId) {
      setError("El link no es de YouTube. Pegá un link válido (youtube.com o youtu.be).");
      return;
    }
    const player = playerRef.current;
    if (!player || !ready) {
      setError("La música todavía se está cargando. Probá de nuevo en un momento.");
      return;
    }
    setError(null);
    if (!started) {
      player.unMute();
      player.playVideo();
      setStarted(true);
      setMuted(false);
      return;
    }
    if (muted) {
      player.unMute();
      setMuted(false);
    } else {
      player.mute();
      setMuted(true);
    }
  }

  const label = !started ? "Reproducir música" : muted ? "Activar sonido" : "Silenciar";
  const Icon = !started ? Play : muted ? VolumeX : Volume2;

  return (
    <div
      className={cn(
        "absolute z-20 flex flex-col items-end gap-2",
        compact ? "bottom-4 right-4" : "bottom-6 right-6",
      )}
    >
      {error ? (
        <p
          role="alert"
          className={cn(
            "max-w-[220px] rounded-2xl bg-[color:var(--ink)] px-3 py-2 text-left text-[11px] leading-snug text-[color:var(--bg)] shadow-phone",
          )}
        >
          {error}
        </p>
      ) : null}
      <div className="pointer-events-none absolute h-px w-px overflow-hidden opacity-0" aria-hidden>
        <div id={hostId} />
      </div>
      <button
        type="button"
        onClick={onClick}
        aria-label={label}
        title={label}
        className={cn(
          "flex items-center justify-center rounded-full bg-[color:var(--ink)] text-[color:var(--bg)] shadow-phone",
          compact ? "h-11 w-11" : "h-14 w-14",
        )}
      >
        <Icon size={compact ? 18 : 22} />
      </button>
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
  askSong,
}: {
  event: InviteEvent;
  guest?: Guest;
  display: string;
  onRsvp?: (status: RsvpStatus, extras: RsvpExtras) => void;
  compact?: boolean;
  askSong?: boolean;
}) {
  const [message, setMessage] = useState(guest?.message ?? "");
  const [plusOnes, setPlusOnes] = useState(guest?.plusOnes ?? 0);
  const [songSuggestion, setSongSuggestion] = useState(guest?.songSuggestion ?? "");
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
              {askSong && (
                <label className="mt-3 block text-left text-xs text-[color:var(--muted)]">
                  Canción para la playlist
                  <input
                    value={songSuggestion}
                    onChange={(e) => setSongSuggestion(e.target.value)}
                    placeholder="Tema · artista"
                    className="mt-1 w-full rounded-2xl border border-[color:var(--soft)] bg-transparent px-3 py-2 text-sm"
                  />
                </label>
              )}
            </>
          )}
          <div className="mt-5 flex justify-center gap-3">
            <button
              onClick={() => {
                onRsvp?.("accepted", {
                  message,
                  plusOnes,
                  ...(askSong ? { songSuggestion: songSuggestion.trim() } : {}),
                });
                setDone("accepted");
              }}
              className="rounded-full bg-[color:var(--ink)] px-5 py-2 text-xs uppercase tracking-[0.16em] text-[color:var(--bg)]"
            >
              Ahí voy
            </button>
            <button
              onClick={() => {
                onRsvp?.("declined", {
                  message,
                  plusOnes: 0,
                  ...(askSong ? { songSuggestion: songSuggestion.trim() } : {}),
                });
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
