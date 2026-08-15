"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

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

  async function toggle() {
    setError("");
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

  return (
    <div>
      <button
        onClick={toggle}
        disabled={busy || (!published && !canPublish)}
        className="rounded-full bg-ink px-4 py-2 text-xs uppercase tracking-widest text-cream disabled:opacity-40"
      >
        {published ? "Despublicar" : "Publicar invitación"}
      </button>
      {(error || (!canPublish && !published)) && (
        <p className="mt-2 text-xs text-rose">{error || reason}</p>
      )}
    </div>
  );
}
