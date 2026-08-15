"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { InviteEvent, PaymentProvider, PlanId } from "@/lib/types";
import { PLANS, formatARS } from "@/lib/format";
import { getTemplate } from "@/lib/templates";
import { cn } from "@/lib/cn";

export function CheckoutClient({ event }: { event: InviteEvent }) {
  const router = useRouter();
  const [plan, setPlan] = useState<PlanId>(event.plan);
  const [provider, setProvider] = useState<PaymentProvider>("mercadopago");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const template = getTemplate(event.templateSlug);
  const selected = PLANS.find((p) => p.id === plan)!;

  async function pay() {
    setBusy(true);
    setError("");
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventId: event.id, plan, provider }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "No se pudo cobrar");
      setBusy(false);
      return;
    }
    router.push("/studio");
  }

  if (event.paid) {
    return (
      <div className="mx-auto max-w-lg px-5 py-20 text-center">
        <p className="font-display text-4xl">Este set ya está pago</p>
        <p className="mt-3 text-ink/60">Podés publicar y enviar invitaciones desde el studio.</p>
        <Link href="/studio" className="mt-6 inline-block rounded-full bg-ink px-5 py-2 text-xs uppercase tracking-widest text-cream">
          Ir al studio
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-14">
      <p className="text-xs uppercase tracking-[0.28em] text-gold-deep">Pasarela proto</p>
      <h1 className="mt-2 font-display text-5xl">Adquirir {template?.name}</h1>
      <p className="mt-3 max-w-xl text-ink/65">
        Stripe y Mercado Pago en modo demo: no hay cargo real. El pago desbloquea
        publicar, enviar y el RSVP en el mini backoffice.
      </p>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {PLANS.map((p) => (
          <button
            key={p.id}
            onClick={() => setPlan(p.id)}
            className={cn(
              "rounded-[28px] border p-5 text-left",
              plan === p.id ? "border-ink bg-paper shadow-soft" : "border-ink/10",
            )}
          >
            <p className="font-display text-2xl">{p.name}</p>
            <p className="font-display text-3xl">{formatARS(p.price)}</p>
            <p className="mt-1 text-xs text-ink/50">{p.tagline}</p>
            <ul className="mt-4 space-y-1 text-sm text-ink/70">
              {p.features.map((f) => (
                <li key={f}>· {f}</li>
              ))}
            </ul>
          </button>
        ))}
      </div>

      <div className="mt-10 grid gap-6 rounded-[28px] border border-ink/10 bg-paper p-6 md:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-widest text-ink/45">Medio de pago</p>
          <div className="mt-3 flex gap-2">
            <button
              onClick={() => setProvider("mercadopago")}
              className={cn(
                "rounded-full px-4 py-2 text-sm",
                provider === "mercadopago" ? "bg-[#009ee3] text-white" : "bg-cream",
              )}
            >
              Mercado Pago
            </button>
            <button
              onClick={() => setProvider("stripe")}
              className={cn(
                "rounded-full px-4 py-2 text-sm",
                provider === "stripe" ? "bg-[#635bff] text-white" : "bg-cream",
              )}
            >
              Stripe
            </button>
          </div>
          {provider === "stripe" ? (
            <div className="mt-6 space-y-3">
              <input placeholder="4242 4242 4242 4242" className="w-full rounded-xl border border-ink/10 bg-cream px-3 py-2" />
              <div className="grid grid-cols-2 gap-3">
                <input placeholder="MM/AA" className="rounded-xl border border-ink/10 bg-cream px-3 py-2" />
                <input placeholder="CVC" className="rounded-xl border border-ink/10 bg-cream px-3 py-2" />
              </div>
              <p className="text-xs text-ink/45">Formulario Stripe Elements (simulado).</p>
            </div>
          ) : (
            <p className="mt-6 text-sm text-ink/65">
              En producción redirigimos a Checkout Pro de Mercado Pago. Acá
              simulamos el retorno exitoso y marcamos el evento como pago.
            </p>
          )}
        </div>
        <div className="rounded-2xl bg-cream p-5">
          <p className="text-sm text-ink/50">Resumen</p>
          <p className="mt-2 font-display text-3xl">{event.content.title}</p>
          <p className="text-sm">{template?.name}</p>
          <p className="mt-4 font-display text-4xl">{formatARS(selected.price)}</p>
          <button
            disabled={busy}
            onClick={pay}
            className="mt-6 w-full rounded-full bg-ink py-3 text-xs uppercase tracking-[0.18em] text-cream disabled:opacity-60"
          >
            {busy ? "Procesando…" : `Pagar con ${provider === "stripe" ? "Stripe" : "Mercado Pago"}`}
          </button>
          {error && <p className="mt-3 text-sm text-rose">{error}</p>}
        </div>
      </div>
    </div>
  );
}
