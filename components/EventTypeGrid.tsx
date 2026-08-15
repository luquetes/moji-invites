import Link from "next/link";
import { CATEGORIES } from "@/lib/templates";
import { cn } from "@/lib/cn";

const marks: Record<string, string> = {
  bodas: "♡",
  quince: "✦",
  comunion: "✞",
  cumple: "✸",
  egreso: "🎓",
  bautismo: "❀",
  empresarial: "◈",
};

export function EventTypeGrid() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
      {CATEGORIES.map((cat) => {
        const inner = (
          <div
            className={cn(
              "group relative overflow-hidden rounded-3xl border border-ink/10 bg-paper p-4 shadow-soft transition",
              cat.soon ? "opacity-70" : "hover:-translate-y-1 hover:border-gold/50",
            )}
          >
            <div className="flex h-16 items-center justify-center rounded-2xl bg-cream font-display text-3xl text-gold-deep">
              {marks[cat.id]}
            </div>
            <p className="mt-3 font-display text-xl">{cat.label}</p>
            <p className="text-xs text-ink/55">{cat.blurb}</p>
            {cat.soon && (
              <span className="mt-3 inline-block rounded-full bg-ink/5 px-2 py-1 text-[10px] uppercase tracking-widest text-ink/50">
                Muy pronto
              </span>
            )}
          </div>
        );
        if (cat.soon) return <div key={cat.id}>{inner}</div>;
        return (
          <Link key={cat.id} href={`/modelos?cat=${cat.id}`}>
            {inner}
          </Link>
        );
      })}
    </div>
  );
}
