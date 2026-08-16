"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { dirtyKey, isEditorDirty } from "@/lib/editorSync";

export function PublishButton({
  eventId,
  published,
  canPublish,
  reason,
}: {
  eventId: string;
  published: boolean;
  canPublish: boolean;
  reason?: string;
}) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [editorDirty, setEditorDirty] = useState(false);

  useEffect(() => {
    const sync = () => setEditorDirty(isEditorDirty(eventId));
    sync();
    const onStorage = (e: StorageEvent) => {
      if (e.key === dirtyKey(eventId) || e.key === null) sync();
    };
    const tick = window.setInterval(sync, 1000);
    window.addEventListener("storage", onStorage);
    window.addEventListener("focus", sync);
    return () => {
      window.clearInterval(tick);
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("focus", sync);
    };
  }, [eventId]);

  async function toggle() {
    setError("");
    if (!published && isEditorDirty(eventId)) {
      setEditorDirty(true);
      setError("Hay cambios sin guardar en el editor. Guardá o publicá desde ahí.");
      return;
    }
    setBusy(true);
    const res = await fetch(`/api/events/${eventId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: published ? "unpublish" : "publish" }),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) {
      setError(data.error ?? reason ?? "No se pudo publicar");
      return;
    }
    router.refresh();
  }

  const blockedByDraft = !published && editorDirty;

  return (
    <div>
      <button
        onClick={toggle}
        disabled={busy || blockedByDraft || (!published && !canPublish)}
        className="rounded-full bg-ink px-4 py-2 text-xs uppercase tracking-widest text-cream disabled:opacity-40"
      >
        {published ? "Despublicar" : "Publicar invitación"}
      </button>
      {(error || blockedByDraft || (!canPublish && !published)) && (
        <p className="mt-2 text-xs text-rose">
          {error ||
            (blockedByDraft
              ? "Hay cambios sin guardar en el editor. Guardá o publicá desde ahí."
              : reason)}
        </p>
      )}
    </div>
  );
}
