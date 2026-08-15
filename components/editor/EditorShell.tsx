"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Eye, EyeOff, GripVertical, Lock, Save } from "lucide-react";
import type { EventContent, InviteEvent, ModuleId, ModuleState } from "@/lib/types";
import { MODULE_CATALOG, moduleLabel } from "@/lib/modules";
import { getTemplate } from "@/lib/templates";
import { InvitationView } from "@/components/invitation/InvitationView";
import { cn } from "@/lib/cn";
import { createDebounced } from "@/lib/debounce";
import { formatDateTime } from "@/lib/format";

const SAVE_DEBOUNCE_MS = 2000;

export function EditorShell({ initial }: { initial: InviteEvent }) {
  const [event, setEvent] = useState(initial);
  const [tab, setTab] = useState<"modulos" | "contenido" | "estilo">("modulos");
  const [highlight, setHighlight] = useState<ModuleId>("cover");
  const [status, setStatus] = useState("Guardado");
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState(initial.updatedAt);
  const template = getTemplate(event.templateSlug);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  const eventRef = useRef(event);
  eventRef.current = event;
  const dirtyRef = useRef(false);
  const savingRef = useRef(false);
  const queuedWhileSaving = useRef(false);

  const persistRef = useRef<() => Promise<void>>(async () => undefined);

  persistRef.current = async () => {
    if (savingRef.current) {
      queuedWhileSaving.current = true;
      return;
    }
    savingRef.current = true;
    setSaving(true);
    setStatus("Guardando…");
    const snapshot = eventRef.current;
    try {
      const res = await fetch(`/api/events/${snapshot.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(snapshot),
      });
      if (!res.ok) {
        dirtyRef.current = true;
        setDirty(true);
        setStatus("No se pudo guardar");
        return;
      }
      const data = (await res.json()) as { event: InviteEvent };
      setLastSavedAt(data.event.updatedAt);
      if (eventRef.current === snapshot) {
        dirtyRef.current = false;
        setDirty(false);
        setStatus("Guardado");
      } else {
        dirtyRef.current = true;
        setDirty(true);
        setStatus("Sin guardar");
      }
    } finally {
      savingRef.current = false;
      setSaving(false);
      if (queuedWhileSaving.current) {
        queuedWhileSaving.current = false;
        void persistRef.current();
      }
    }
  };

  const debouncedSave = useMemo(
    () => createDebounced(() => void persistRef.current(), SAVE_DEBOUNCE_MS),
    [],
  );

  useEffect(() => () => debouncedSave.cancel(), [debouncedSave]);

  useEffect(() => {
    const onLeave = (e: BeforeUnloadEvent) => {
      if (!dirtyRef.current) return;
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", onLeave);
    return () => window.removeEventListener("beforeunload", onLeave);
  }, []);

  function applyChange(next: InviteEvent) {
    setEvent(next);
    dirtyRef.current = true;
    setDirty(true);
    setStatus("Sin guardar");
    debouncedSave();
  }

  function saveNow() {
    if (debouncedSave.pending()) {
      debouncedSave.flush();
      return;
    }
    void persistRef.current();
  }

  function onDragEnd(ev: DragEndEvent) {
    const { active, over } = ev;
    if (!over || active.id === over.id) return;
    const ids = event.modules.map((m) => m.id);
    const oldIndex = ids.indexOf(active.id as ModuleId);
    const newIndex = ids.indexOf(over.id as ModuleId);
    const modules = arrayMove(event.modules, oldIndex, newIndex);
    applyChange({ ...event, modules });
  }

  function toggle(id: ModuleId) {
    const def = MODULE_CATALOG.find((m) => m.id === id);
    if (def?.locked) return;
    const modules = event.modules.map((m) =>
      m.id === id ? { ...m, enabled: !m.enabled } : m,
    );
    applyChange({ ...event, modules });
  }

  return (
    <div className="min-h-screen bg-[#ebe3d4]">
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-ink/10 bg-cream/90 px-4 py-3 backdrop-blur">
        <Link href="/" className="font-display text-2xl">
          Moji
        </Link>
        <div className="hidden text-center sm:block">
          <p className="text-[10px] uppercase tracking-[0.22em] text-ink/50">Editor en vivo</p>
          <p className="font-display text-xl">{template?.name} · {event.content.title}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-[11.5rem] shrink-0 text-right">
            <p className="h-4 truncate text-xs text-ink/50">{status}</p>
            <p className="truncate text-[10px] leading-tight text-ink/40">
              Última edición {formatDateTime(lastSavedAt)}
            </p>
          </div>
          <Link href={`/i/${event.slug}?preview=1`} className="rounded-full px-3 py-2 text-xs uppercase tracking-widest">
            Preview
          </Link>
          <Link
            href={`/checkout/${event.id}`}
            className="rounded-full bg-ink px-4 py-2 text-xs uppercase tracking-[0.16em] text-cream"
          >
            {event.paid ? "Publicar" : "Comprar"}
          </Link>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 lg:grid-cols-[340px_1fr]">
        <aside className="rounded-[28px] border border-ink/10 bg-paper p-4 shadow-soft">
          <div className="mb-4 grid grid-cols-3 rounded-full bg-cream p-1 text-xs uppercase tracking-widest">
            {(["modulos", "contenido", "estilo"] as const).map((id) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={cn(
                  "rounded-full py-2",
                  tab === id && "bg-ink text-cream",
                )}
              >
                {id}
              </button>
            ))}
          </div>

          {tab === "modulos" && (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
              <SortableContext items={event.modules.map((m) => m.id)} strategy={verticalListSortingStrategy}>
                <ul className="space-y-2">
                  {event.modules.map((mod) => (
                    <SortableModule
                      key={mod.id}
                      mod={mod}
                      active={highlight === mod.id}
                      onSelect={() => setHighlight(mod.id)}
                      onToggle={() => toggle(mod.id)}
                    />
                  ))}
                </ul>
              </SortableContext>
            </DndContext>
          )}

          {tab === "contenido" && (
            <ContentForm
              content={event.content}
              slug={event.slug}
              onChange={(content, slug) => applyChange({ ...event, content, slug })}
            />
          )}

          {tab === "estilo" && (
            <ThemePanel
              event={event}
              onChange={(paletteOverride) => applyChange({ ...event, paletteOverride })}
            />
          )}
        </aside>

        <div className="flex justify-center">
          <PhoneFrame>
            <InvitationView event={event} compact highlight={highlight} />
          </PhoneFrame>
        </div>
      </div>

      <button
        type="button"
        onClick={saveNow}
        disabled={!dirty || saving}
        className={cn(
          "fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full px-5 py-3 text-xs uppercase tracking-[0.16em] text-cream shadow-phone transition",
          dirty && !saving ? "bg-ink" : "bg-ink/45",
        )}
        aria-label="Guardar cambios"
      >
        <Save size={16} />
        {saving ? "Guardando" : dirty ? "Guardar" : "Guardado"}
      </button>
    </div>
  );
}

function SortableModule({
  mod,
  active,
  onSelect,
  onToggle,
}: {
  mod: ModuleState;
  active: boolean;
  onSelect: () => void;
  onToggle: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: mod.id,
  });
  const def = MODULE_CATALOG.find((m) => m.id === mod.id);
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-2 rounded-2xl border px-2 py-2",
        active ? "border-gold bg-cream" : "border-ink/10",
        isDragging && "opacity-70",
        !mod.enabled && "opacity-50",
      )}
    >
      <button className="cursor-grab text-ink/40" {...attributes} {...listeners} aria-label="Reordenar">
        <GripVertical size={16} />
      </button>
      <button onClick={onSelect} className="flex-1 text-left">
        <p className="text-sm">{moduleLabel(mod.id)}</p>
        <p className="text-[10px] text-ink/45">{def?.description}</p>
      </button>
      {def?.locked ? (
        <Lock size={14} className="text-ink/30" />
      ) : (
        <button onClick={onToggle} className="rounded-full p-1" aria-label="Mostrar u ocultar">
          {mod.enabled ? <Eye size={16} /> : <EyeOff size={16} />}
        </button>
      )}
    </li>
  );
}

function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="relative w-[360px] max-w-full">
      <div className="absolute -inset-3 rounded-[44px] bg-ink/10 blur-xl" />
      <div className="relative overflow-hidden rounded-[40px] border-[10px] border-ink bg-ink shadow-phone">
        <div className="absolute left-1/2 top-2 z-10 h-5 w-24 -translate-x-1/2 rounded-full bg-black/70" />
        <div className="h-[720px] overflow-hidden bg-cream">{children}</div>
      </div>
      <p className="mt-4 text-center text-xs text-ink/50">
        Arrastrá módulos a la izquierda: el preview se reordena al instante.
      </p>
    </div>
  );
}

function ContentForm({
  content,
  slug,
  onChange,
}: {
  content: EventContent;
  slug: string;
  onChange: (content: EventContent, slug: string) => void;
}) {
  const fields: { key: keyof EventContent; label: string }[] = useMemo(
    () => [
      { key: "title", label: "Título" },
      { key: "subtitle", label: "Bajada" },
      { key: "hosts", label: "Anfitriones" },
      { key: "city", label: "Ciudad" },
      { key: "time", label: "Hora" },
      { key: "venueCeremony", label: "Ceremonia" },
      { key: "addressCeremony", label: "Dirección ceremonia" },
      { key: "venueParty", label: "Fiesta" },
      { key: "addressParty", label: "Dirección fiesta" },
      { key: "dresscode", label: "Dress code" },
      { key: "giftAlias", label: "Alias regalos" },
      { key: "instagramHandle", label: "Instagram" },
    ],
    [],
  );

  return (
    <div className="max-h-[70vh] space-y-3 overflow-y-auto pr-1">
      <label className="block text-xs">
        Link
        <input
          value={slug}
          onChange={(e) => onChange(content, e.target.value)}
          className="mt-1 w-full rounded-xl border border-ink/10 bg-cream px-3 py-2 text-sm"
        />
      </label>
      {fields.map((f) => (
        <label key={f.key} className="block text-xs">
          {f.label}
          <input
            value={String(content[f.key] ?? "")}
            onChange={(e) => onChange({ ...content, [f.key]: e.target.value }, slug)}
            className="mt-1 w-full rounded-xl border border-ink/10 bg-cream px-3 py-2 text-sm"
          />
        </label>
      ))}
      <label className="block text-xs">
        Historia
        <textarea
          value={content.story}
          onChange={(e) => onChange({ ...content, story: e.target.value }, slug)}
          className="mt-1 h-24 w-full rounded-xl border border-ink/10 bg-cream px-3 py-2 text-sm"
        />
      </label>
    </div>
  );
}

function ThemePanel({
  event,
  onChange,
}: {
  event: InviteEvent;
  onChange: (palette: InviteEvent["paletteOverride"]) => void;
}) {
  const template = getTemplate(event.templateSlug);
  const palette = { ...template?.palette, ...event.paletteOverride };
  const keys = ["bg", "paper", "ink", "accent", "muted"] as const;
  return (
    <div className="space-y-4">
      <p className="text-sm text-ink/60">
        Recoloré el set {template?.name} sin perder la ornamentación.
      </p>
      {keys.map((key) => (
        <label key={key} className="flex items-center justify-between text-sm capitalize">
          {key}
          <input
            type="color"
            value={palette[key] ?? "#ffffff"}
            onChange={(e) => onChange({ ...event.paletteOverride, [key]: e.target.value })}
            className="h-9 w-14 cursor-pointer rounded"
          />
        </label>
      ))}
    </div>
  );
}
