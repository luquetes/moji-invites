import Link from "next/link";
import { EventTypeGrid } from "@/components/EventTypeGrid";
import { TemplateCard } from "@/components/TemplateCard";
import { TEMPLATES } from "@/lib/templates";
import { PLANS, formatARS } from "@/lib/format";

const features = [
  ["Nombres de invitados", "Cada persona abre una invitación pensada para ella."],
  ["Envío ilimitado", "WhatsApp, mail, redes o el link que elijas."],
  ["Cuenta regresiva", "En vivo, hasta el minuto del evento."],
  ["Ubicación", "Mapa e indicaciones de ceremonia y fiesta."],
  ["RSVP", "Aceptar o rechazar, con +1 y mensaje."],
  ["Álbum y música", "Fotos, canción de fondo y playlist."],
  ["Regalos", "Alias, CBU o mesa de regalos."],
  ["Dress code", "El código de vestimenta, sin PDFs sueltos."],
  ["Mini backoffice", "Quién dijo que sí, quién no, en un vistazo."],
  ["Redes", "Copy para Pinterest, Instagram y TikTok."],
];

export default function HomePage() {
  return (
    <div>
      <section className="mx-auto max-w-6xl px-5 pb-16 pt-16 text-center">
        <p className="text-xs uppercase tracking-[0.32em] text-gold-deep">
          Interactivas, funcionales y vivas
        </p>
        <h1 className="mt-4 font-display text-5xl leading-[0.95] sm:text-7xl">
          Invitaciones digitales
          <br />
          para tu evento
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-ink/65">
          Sets de templates customizables, con herramientas en vivo para reordenar
          y prender módulos. Inspirado en la calidez de Fixdate, pero para que lo
          armes vos — y lo publiques cuando pagás.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/modelos"
            className="rounded-full bg-ink px-6 py-3 text-xs font-medium uppercase tracking-[0.18em] text-cream"
          >
            Ver modelos
          </Link>
          <Link
            href="/studio"
            className="rounded-full border border-ink/20 px-6 py-3 text-xs uppercase tracking-[0.18em]"
          >
            Abrir studio demo
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-20">
        <h2 className="mb-6 text-center font-display text-3xl">¿Qué vas a festejar?</h2>
        <EventTypeGrid />
      </section>

      <section className="bg-paper py-20">
        <div className="mx-auto max-w-6xl px-5">
          <p className="text-center text-xs uppercase tracking-[0.28em] text-gold-deep">
            La magia de las invitaciones digitales
          </p>
          <h2 className="mt-3 text-center font-display text-4xl">¿Qué incluyen?</h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {features.map(([title, body]) => (
              <div key={title} className="rounded-3xl border border-ink/8 bg-cream p-5">
                <p className="font-display text-xl">{title}</p>
                <p className="mt-2 text-sm text-ink/60">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="font-display text-4xl">Modelos</h2>
            <p className="text-ink/60">{TEMPLATES.length} sets listos para customizar</p>
          </div>
          <Link href="/modelos" className="text-sm uppercase tracking-widest text-gold-deep">
            Ver todos
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {TEMPLATES.slice(0, 6).map((t) => (
            <TemplateCard key={t.slug} template={t} />
          ))}
        </div>
      </section>

      <section id="como-funciona" className="bg-[#efe6d6] py-20">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="text-center font-display text-4xl">¿Cómo obtenerla?</h2>
          <p className="mt-2 text-center text-ink/60">Fácil, rápido y sin asesor de por medio.</p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              ["1", "Elegí", "El set que más te guste: Magnolias, Deluxe, Tropical, 15 o Comunión."],
              ["2", "Customizá", "Reordená módulos, apagá los que no van, editá textos y colores en vivo."],
              ["3", "Publicá", "Pagá con Stripe o Mercado Pago, enviá el link y mirá el RSVP."],
            ].map(([n, t, b]) => (
              <div key={n} className="rounded-[28px] bg-paper p-8 shadow-soft">
                <p className="font-display text-5xl text-gold">{n}</p>
                <p className="mt-2 font-display text-3xl">{t}</p>
                <p className="mt-3 text-sm text-ink/65">{b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-5 py-20 lg:grid-cols-2">
        <div className="rounded-[32px] bg-ink p-10 text-cream">
          <p className="text-xs uppercase tracking-[0.28em] text-gold-pale">Editor en vivo</p>
          <h2 className="mt-3 font-display text-4xl">Reorder y toggle de módulos</h2>
          <p className="mt-4 text-cream/70">
            Arrastrá Portada, Countdown, RSVP, Álbum, Regalos… El preview del
            celular se actualiza al instante. La portada queda siempre, el resto
            es tuyo.
          </p>
          <Link
            href="/editor/evt_demo_sofia"
            className="mt-8 inline-block rounded-full bg-cream px-5 py-2 text-xs uppercase tracking-widest text-ink"
          >
            Probar el editor
          </Link>
        </div>
        <div id="pagos" className="rounded-[32px] border border-ink/10 bg-paper p-10">
          <p className="text-xs uppercase tracking-[0.28em] text-gold-deep">Pagos + redes</p>
          <h2 className="mt-3 font-display text-4xl">Stripe, Mercado Pago y un calendario social</h2>
          <p className="mt-4 text-ink/65">
            Recién cuando el template está pago podés publicar, enviar invitaciones
            y ver quién aceptó o rechazó. El plan Premium genera copys y agenda
            posts en Pinterest, Instagram y TikTok.
          </p>
          <div className="mt-6 grid gap-3">
            {PLANS.map((p) => (
              <div key={p.id} className="flex items-center justify-between rounded-2xl bg-cream px-4 py-3">
                <div>
                  <p className="font-medium">{p.name}</p>
                  <p className="text-xs text-ink/50">{p.tagline}</p>
                </div>
                <p className="font-display text-2xl">{formatARS(p.price)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
