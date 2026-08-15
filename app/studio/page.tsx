import Link from "next/link";
import { getActiveEvent, listGuests, listSocialPosts } from "@/lib/store";
import { rsvpCounts, canPublish } from "@/lib/social";
import { getTemplate } from "@/lib/templates";
import { PublishButton } from "@/components/studio/PublishButton";

export const dynamic = "force-dynamic";

export default function StudioHome() {
  const event = getActiveEvent();
  if (!event) return <p>No hay evento demo.</p>;
  const guests = listGuests(event.id);
  const counts = rsvpCounts(guests);
  const posts = listSocialPosts(event.id);
  const template = getTemplate(event.templateSlug);
  const publish = canPublish(event);

  return (
    <div>
      <p className="text-xs uppercase tracking-[0.28em] text-gold-deep">Mini backoffice</p>
      <h1 className="mt-2 font-display text-5xl">{event.content.title}</h1>
      <p className="mt-2 text-ink/60">
        {template?.name} · /i/{event.slug} · {event.paid ? "Pago" : "Pendiente de pago"} ·{" "}
        {event.published ? "Publicada" : "Borrador"}
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-4">
        {[
          ["Aceptaron", counts.accepted, "text-sage"],
          ["Rechazaron", counts.declined, "text-rose"],
          ["Pendientes", counts.pending, "text-ink/50"],
          ["+1 confirmados", counts.plusOnes, "text-gold-deep"],
        ].map(([label, value, color]) => (
          <div key={String(label)} className="rounded-[24px] border border-ink/10 bg-paper p-5">
            <p className="text-[10px] uppercase tracking-widest text-ink/45">{label}</p>
            <p className={`font-display text-5xl ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <PublishButton eventId={event.id} published={event.published} canPublish={publish.ok} reason={publish.reason} />
        <Link
          href={event.published ? `/i/${event.slug}` : `/i/${event.slug}?preview=1`}
          className="rounded-full border border-ink/15 px-4 py-2 text-xs uppercase tracking-widest"
        >
          Ver invitación
        </Link>
        <Link href="/studio/enviar" className="rounded-full border border-ink/15 px-4 py-2 text-xs uppercase tracking-widest">
          Enviar
        </Link>
      </div>

      <div className="mt-10 rounded-[24px] bg-paper p-6">
        <p className="font-display text-2xl">Publicaciones programadas</p>
        <p className="text-sm text-ink/55">{posts.length} piezas en el calendario de redes</p>
      </div>
    </div>
  );
}
