import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-5 py-24 text-center">
      <p className="font-display text-6xl">404</p>
      <p className="mt-3 text-ink/60">
        Esta invitación no existe o todavía no fue publicada.
      </p>
      <Link href="/" className="mt-6 inline-block text-sm uppercase tracking-widest">
        Volver a Moji
      </Link>
    </div>
  );
}
