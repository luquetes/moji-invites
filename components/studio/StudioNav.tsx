"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

const items = [
  { href: "/studio", label: "Resumen" },
  { href: "/studio/invitados", label: "Invitados" },
  { href: "/studio/enviar", label: "Enviar" },
  { href: "/studio/redes", label: "Redes" },
  { href: "/studio/pagos", label: "Pagos" },
];

export function StudioNav({ eventId }: { eventId?: string }) {
  const pathname = usePathname();
  return (
    <aside className="rounded-[28px] border border-ink/10 bg-paper p-5 shadow-soft">
      <p className="font-display text-3xl">Studio</p>
      <p className="mt-1 text-xs uppercase tracking-[0.2em] text-ink/45">Mini backoffice</p>
      <nav className="mt-6 space-y-1">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "block rounded-2xl px-3 py-2 text-sm",
              pathname === item.href ? "bg-ink text-cream" : "hover:bg-cream",
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      {eventId && (
        <Link
          href={`/editor/${eventId}`}
          className="mt-8 block text-xs uppercase tracking-widest text-gold-deep"
        >
          Abrir editor →
        </Link>
      )}
    </aside>
  );
}
