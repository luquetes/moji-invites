import { getActiveEvent, listGuests } from "@/lib/store";
import { GuestTable } from "@/components/studio/GuestTable";
import { AddGuestForm } from "@/components/studio/AddGuestForm";
import { rsvpCounts } from "@/lib/social";

export const dynamic = "force-dynamic";

export default function InvitadosPage() {
  const event = getActiveEvent();
  if (!event) return <p>No hay evento.</p>;
  const guests = listGuests(event.id);
  const counts = rsvpCounts(guests);

  return (
    <div>
      <h1 className="font-display text-4xl">Quién aceptó o rechazó</h1>
      <p className="mt-2 text-ink/60">
        {counts.accepted} sí · {counts.declined} no · {counts.pending} sin responder
      </p>
      <div className="mt-6">
        <AddGuestForm eventId={event.id} />
      </div>
      <div className="mt-8">
        <GuestTable guests={guests} />
      </div>
    </div>
  );
}
