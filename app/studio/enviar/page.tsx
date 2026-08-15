import { getActiveEvent, listGuests } from "@/lib/store";
import { SendList } from "@/components/studio/SendList";

export const dynamic = "force-dynamic";

export default function EnviarPage() {
  const event = getActiveEvent();
  if (!event) return <p>No hay evento.</p>;
  const guests = listGuests(event.id);
  return (
    <div>
      <h1 className="font-display text-4xl">Enviar invitación</h1>
      <p className="mt-2 max-w-xl text-ink/60">
        Cada invitado tiene un token. El link abre la invitación con su nombre y
        registra el RSVP en este studio.
      </p>
      <SendList event={event} guests={guests} />
    </div>
  );
}
