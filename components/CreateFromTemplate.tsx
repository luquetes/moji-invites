"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function CreateFromTemplate({ slug }: { slug: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function create(goto: "editor" | "checkout") {
    setBusy(true);
    setError("");
    const res = await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ templateSlug: slug }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "No se pudo crear");
      setBusy(false);
      return;
    }
    router.push(goto === "editor" ? `/editor/${data.event.id}` : `/checkout/${data.event.id}`);
  }

  return (
    <div className="mt-8 flex flex-wrap gap-3">
      <button
        disabled={busy}
        onClick={() => create("editor")}
        className="rounded-full bg-ink px-5 py-3 text-xs uppercase tracking-[0.16em] text-cream disabled:opacity-60"
      >
        Personalizar en vivo
      </button>
      <button
        disabled={busy}
        onClick={() => create("checkout")}
        className="rounded-full border border-ink/20 px-5 py-3 text-xs uppercase tracking-[0.16em]"
      >
        Adquirir este set
      </button>
      {error && <p className="w-full text-sm text-rose">{error}</p>}
    </div>
  );
}
