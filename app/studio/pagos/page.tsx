import { getActiveEvent, listPayments } from "@/lib/store";
import { formatARS, formatDateShort } from "@/lib/format";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function PagosPage() {
  const event = getActiveEvent();
  if (!event) return <p>No hay evento.</p>;
  const payments = listPayments(event.id);

  return (
    <div>
      <h1 className="font-display text-4xl">Pagos</h1>
      <p className="mt-2 text-ink/60">
        Pasarela simple: Mercado Pago (Argentina) y Stripe (tarjeta). El proto
        marca el evento como pago sin cobrar.
      </p>
      {!event.paid && (
        <Link
          href={`/checkout/${event.id}`}
          className="mt-6 inline-block rounded-full bg-ink px-4 py-2 text-xs uppercase tracking-widest text-cream"
        >
          Ir a checkout
        </Link>
      )}
      <div className="mt-8 overflow-hidden rounded-[24px] border border-ink/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-cream text-xs uppercase tracking-widest text-ink/50">
            <tr>
              <th className="px-4 py-3">Fecha</th>
              <th className="px-4 py-3">Proveedor</th>
              <th className="px-4 py-3">Plan</th>
              <th className="px-4 py-3">Monto</th>
              <th className="px-4 py-3">Estado</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p.id} className="border-t border-ink/5">
                <td className="px-4 py-3">{formatDateShort(p.createdAt)}</td>
                <td className="px-4 py-3 capitalize">{p.provider}</td>
                <td className="px-4 py-3 capitalize">{p.plan}</td>
                <td className="px-4 py-3">{formatARS(p.amount)}</td>
                <td className="px-4 py-3">{p.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
