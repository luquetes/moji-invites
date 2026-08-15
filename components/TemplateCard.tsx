import Link from "next/link";
import type { TemplateSet } from "@/lib/types";
import { cn } from "@/lib/cn";

export function TemplateCard({
  template,
  href,
}: {
  template: TemplateSet;
  href?: string;
}) {
  const dest = href ?? `/modelos/${template.slug}`;
  return (
    <Link
      href={dest}
      className="group overflow-hidden rounded-[28px] border border-ink/10 bg-paper shadow-soft transition hover:-translate-y-1"
    >
      <div
        className="relative h-56 bg-cover bg-center"
        style={{ backgroundImage: `url(${template.preview})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
        <span className="absolute left-4 top-4 rounded-full bg-paper/90 px-3 py-1 text-[10px] uppercase tracking-[0.18em]">
          {template.family}
        </span>
        <p className="absolute bottom-4 left-4 font-display text-3xl text-white">
          {template.name}
        </p>
      </div>
      <div className="p-5">
        <p className="text-sm text-ink/65">{template.tagline}</p>
        <div className="mt-4 flex gap-2">
          {Object.values(template.palette)
            .slice(0, 5)
            .map((color) => (
              <span
                key={color}
                className="h-5 w-5 rounded-full border border-ink/10"
                style={{ background: color }}
              />
            ))}
        </div>
        <p className={cn("mt-4 text-xs uppercase tracking-[0.18em] text-gold-deep")}>
          Ver ejemplo · Personalizar
        </p>
      </div>
    </Link>
  );
}
