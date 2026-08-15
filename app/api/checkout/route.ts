import { NextResponse } from "next/server";
import { addPayment, getEvent, upsertEvent } from "@/lib/store";
import { PLANS, uid } from "@/lib/format";
import type { PaymentProvider, PlanId } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = await request.json();
  const event = getEvent(body.eventId);
  if (!event) return NextResponse.json({ error: "Evento no encontrado" }, { status: 404 });

  const plan = (body.plan as PlanId) ?? event.plan;
  const provider = (body.provider as PaymentProvider) ?? "mercadopago";
  const catalog = PLANS.find((p) => p.id === plan);
  if (!catalog) return NextResponse.json({ error: "Plan inválido" }, { status: 400 });

  const payment = addPayment({
    id: uid("pay"),
    eventId: event.id,
    provider,
    plan,
    amount: catalog.price,
    currency: "ARS",
    status: "paid",
    createdAt: new Date().toISOString(),
  });

  const updated = upsertEvent({ ...event, paid: true, plan, published: true });
  return NextResponse.json({ payment, event: updated });
}
