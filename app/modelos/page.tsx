import Link from "next/link";
import { TemplateCard } from "@/components/TemplateCard";
import { CATEGORIES, templatesByCategory } from "@/lib/templates";
import type { EventCategory } from "@/lib/types";

export default async function ModelosPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string }>;
}) {
  const { cat } = await searchParams;
  const category = CATEGORIES.some((c) => c.id === cat) ? (cat as EventCategory) : undefined;
  const templates = templatesByCategory(category);

  return (
    <div className="mx-auto max-w-6xl px-5 py-14">
      <p className="text-xs uppercase tracking-[0.28em] text-gold-deep">Sets customizables</p>
      <h1 className="mt-2 font-display text-5xl">Modelos</h1>
      <p className="mt-3 max-w-xl text-ink/65">
        Cada set trae paleta, ornamentación y tipografía. Después los módulos se
        prenden, apagan y reordenan en el editor.
      </p>
      <div className="mt-8 flex flex-wrap gap-2">
        <Link
          href="/modelos"
          className={`rounded-full px-4 py-2 text-xs uppercase tracking-widest ${!category ? "bg-ink text-cream" : "bg-paper"}`}
        >
          Todos
        </Link>
        {CATEGORIES.filter((c) => !c.soon).map((c) => (
          <Link
            key={c.id}
            href={`/modelos?cat=${c.id}`}
            className={`rounded-full px-4 py-2 text-xs uppercase tracking-widest ${category === c.id ? "bg-ink text-cream" : "bg-paper"}`}
          >
            {c.label}
          </Link>
        ))}
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {templates.map((t) => (
          <TemplateCard key={t.slug} template={t} />
        ))}
      </div>
    </div>
  );
}
