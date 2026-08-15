"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

export function AddGuestForm({ eventId }: { eventId: string }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  async function add(e: FormEvent) {
    e.preventDefault();
    await fetch("/api/guests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventId, name, email, phone }),
    });
    setName("");
    setEmail("");
    setPhone("");
    router.refresh();
  }

  return (
    <form onSubmit={add} className="grid gap-2 rounded-[24px] border border-ink/10 bg-paper p-4 sm:grid-cols-4">
      <input
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nombre"
        className="rounded-xl bg-cream px-3 py-2 text-sm"
      />
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Mail"
        className="rounded-xl bg-cream px-3 py-2 text-sm"
      />
      <input
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="WhatsApp"
        className="rounded-xl bg-cream px-3 py-2 text-sm"
      />
      <button className="rounded-xl bg-ink text-xs uppercase tracking-widest text-cream">
        Agregar invitado
      </button>
    </form>
  );
}
