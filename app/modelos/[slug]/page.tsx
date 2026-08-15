import Link from "next/link";
import { notFound } from "next/navigation";
import { getTemplate, TEMPLATES } from "@/lib/templates";
import { MODULE_CATALOG } from "@/lib/modules";
import { CreateFromTemplate } from "@/components/CreateFromTemplate";
import { TemplateCard } from "@/components/TemplateCard";

export default async function ModeloPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const template = getTemplate(slug);
  if (!template) notFound();

  return (
    <div className="mx-auto max-w-6xl px-5 py-14">
      <Link href="/modelos" className="text-xs uppercase tracking-widest text-ink/50">
        ← Modelos
      </Link>
      <div className="mt-6 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div
          className="min-h-[420px] rounded-[36px] bg-cover bg-center shadow-soft"
          style={{ backgroundImage: `url(${template.preview})` }}
        />
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-gold-deep">{template.family}</p>
          <h1 className="mt-2 font-display text-5xl">{template.name}</h1>
          <p className="mt-2 font-display text-2xl italic text-ink/60">{template.tagline}</p>
          <p className="mt-4 text-ink/70">{template.description}</p>
          <div className="mt-6 flex gap-2">
            {Object.values(template.palette).slice(0, 6).map((c) => (
              <span key={c} className="h-8 w-8 rounded-full border border-ink/10" style={{ background: c }} />
            ))}
          </div>
          <CreateFromTemplate slug={template.slug} />
        </div>
      </div>

      <h2 className="mt-16 font-display text-3xl">Módulos del set</h2>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {MODULE_CATALOG.map((m) => (
          <div key={m.id} className="rounded-2xl border border-ink/10 bg-paper p-4">
            <p className="font-medium">{m.label}</p>
            <p className="text-sm text-ink/55">{m.description}</p>
            <p className="mt-2 text-[10px] uppercase tracking-widest text-ink/40">
              {m.defaultEnabled ? "On por defecto" : "Opcional"}
              {m.locked ? " · siempre visible" : ""}
            </p>
          </div>
        ))}
      </div>

      <h2 className="mt-16 font-display text-3xl">Otros modelos</h2>
      <div className="mt-6 grid gap-6 md:grid-cols-3">
        {TEMPLATES.filter((t) => t.slug !== slug)
          .slice(0, 3)
          .map((t) => (
            <TemplateCard key={t.slug} template={t} />
          ))}
      </div>
    </div>
  );
}
