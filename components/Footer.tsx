"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Footer() {
  const pathname = usePathname();
  if (
    pathname.startsWith("/i/") ||
    pathname.startsWith("/editor") ||
    pathname.startsWith("/studio") ||
    pathname.startsWith("/checkout")
  ) {
    return null;
  }

  return (
    <footer className="border-t border-ink/10 bg-[#efe6d6]">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-12 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-display text-3xl">Moji</p>
          <p className="mt-2 max-w-sm text-sm text-ink/60">
            Invitaciones digitales customizables, inspiradas en la calidez de
            Fixdate y pensadas para que las armes vos, en vivo.
          </p>
        </div>
        <div className="flex gap-6 text-sm text-ink/70">
          <Link href="/modelos">Modelos</Link>
          <Link href="/studio">Studio demo</Link>
          <Link href="/#pagos">Pagos</Link>
        </div>
      </div>
    </footer>
  );
}
