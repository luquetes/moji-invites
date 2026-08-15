"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { InviteEvent, SocialPost } from "@/lib/types";
import { formatDateShort } from "@/lib/format";

const labels = {
  instagram: "Instagram",
  tiktok: "TikTok",
  pinterest: "Pinterest",
  draft: "Borrador",
  scheduled: "Programada",
  published: "Publicada",
  failed: "Error",
};

export function SocialStudio({ event, posts }: { event: InviteEvent; posts: SocialPost[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function generate() {
    setBusy(true);
    await fetch("/api/social", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventId: event.id, action: "generate" }),
    });
    setBusy(false);
    router.refresh();
  }

  async function publish(id: string) {
    await fetch("/api/social", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventId: event.id, action: "publish", postId: id }),
    });
    router.refresh();
  }

  return (
    <div className="mt-8">
      <button
        disabled={busy || event.plan !== "premium"}
        onClick={generate}
        className="rounded-full bg-ink px-4 py-2 text-xs uppercase tracking-widest text-cream disabled:opacity-40"
      >
        {busy ? "Generando…" : "Generar pack de contenido"}
      </button>
      {event.plan !== "premium" && (
        <p className="mt-2 text-xs text-ink/50">La automatización de redes entra en el plan Premium.</p>
      )}

      <div className="mt-8 space-y-4">
        {posts.map((post) => (
          <article key={post.id} className="rounded-[24px] border border-ink/10 bg-paper p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs uppercase tracking-widest text-gold-deep">
                {labels[post.platform]} · {labels[post.status]}
              </p>
              <p className="text-xs text-ink/45">{formatDateShort(post.scheduledAt)}</p>
            </div>
            <h2 className="mt-2 font-display text-2xl">{post.title}</h2>
            <p className="mt-2 whitespace-pre-line text-sm text-ink/70">{post.caption}</p>
            <p className="mt-3 text-xs text-ink/45">{post.hashtags.join(" ")}</p>
            {post.status !== "published" && (
              <button
                onClick={() => publish(post.id)}
                className="mt-4 rounded-full border border-ink/15 px-3 py-1 text-xs uppercase tracking-widest"
              >
                Publicar ahora (simulado)
              </button>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
