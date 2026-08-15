"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

const links = [
  { href: "/modelos", label: "Modelos" },
  { href: "/#como-funciona", label: "Cómo funciona" },
  { href: "/studio", label: "Studio" },
];

export function Nav() {
  const pathname = usePathname();
  if (pathname.startsWith("/i/") || pathname.startsWith("/editor")) return null;

  return (
    <header className="sticky top-0 z-40 border-b border-ink/5 bg-cream/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="font-display text-3xl tracking-tight">Moji</span>
          <span className="hidden text-xs uppercase tracking-[0.22em] text-ink/50 sm:inline">
            invitaciones
          </span>
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-ink/70 transition hover:text-ink",
                pathname.startsWith(link.href) && "text-ink",
              )}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/modelos"
            className="rounded-full bg-ink px-4 py-2 text-xs font-medium uppercase tracking-[0.16em] text-cream"
          >
            Crear demo
          </Link>
        </nav>
      </div>
    </header>
  );
}
