"use client";

import { useMemo, useState, type ReactNode } from "react";
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
import { GripVertical, Eye, EyeOff, Lock } from "lucide-react";
import type { EventContent, InviteEvent, ModuleId, ModuleState } from "@/lib/types";
import { MODULE_CATALOG, moduleLabel } from "@/lib/modules";
import { getTemplate } from "@/lib/templates";
import { InvitationView } from "@/components/invitation/InvitationView";
import { cn } from "@/lib/cn";

export function EditorShell({ initial }: { initial: InviteEvent }) {
  const [event, setEvent] = useState(initial);
  const [tab, setTab] = useState<"modulos" | "contenido" | "estilo">("modulos");
  const [highlight, setHighlight] = useState<ModuleId>("cover");
  const [status, setStatus] = useState("");
  const template = getTemplate(event.templateSlug);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  async function save(next = event) {
    setEvent(next);
    const res = await fetch(`/api/events/${next.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(next),
    });
    if (!res.ok) {
      setStatus("No se pudo guardar");
      return;
    }
    setStatus("Guardado");
    setTimeout(() => setStatus(""), 1500);
  }

  function onDragEnd(ev: DragEndEvent) {
    const { active, over } = ev;
    if (!over || active.id === over.id) return;
    const ids = event.modules.map((m) => m.id);
    const oldIndex = ids.indexOf(active.id as ModuleId);
    const newIndex = ids.indexOf(over.id as ModuleId);
    const modules = arrayMove(event.modules, oldIndex, newIndex);
    void save({ ...event, modules });
  }

  function toggle(id: ModuleId) {
    const def = MODULE_CATALOG.find((m) => m.id === id);
    if (def?.locked) return;
    const modules = event.modules.map((m) =>
      m.id === id ? { ...m, enabled: !m.enabled } : m,
    );
    void save({ ...event, modules });
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
        <div className="flex items-center gap-2">
          <span className="text-xs text-ink/50">{status}</span>
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
              onChange={(content, slug) => void save({ ...event, content, slug })}
            />
          )}

          {tab === "estilo" && (
            <ThemePanel
              event={event}
              onChange={(paletteOverride) => void save({ ...event, paletteOverride })}
            />
          )}
        </aside>

        <div className="flex justify-center">
          <PhoneFrame>
            <InvitationView event={event} compact highlight={highlight} />
          </PhoneFrame>
        </div>
      </div>
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
