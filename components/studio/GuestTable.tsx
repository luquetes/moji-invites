import type { Guest } from "@/lib/types";
import { formatDateShort } from "@/lib/format";

const labels = {
  accepted: "Aceptó",
  declined: "Rechazó",
  pending: "Pendiente",
};

export function GuestTable({ guests }: { guests: Guest[] }) {
  return (
    <div className="overflow-hidden rounded-[24px] border border-ink/10">
      <table className="w-full text-left text-sm">
        <thead className="bg-cream text-xs uppercase tracking-widest text-ink/50">
          <tr>
            <th className="px-4 py-3">Invitado</th>
            <th className="px-4 py-3">Estado</th>
            <th className="px-4 py-3">+1</th>
            <th className="px-4 py-3">Mensaje</th>
            <th className="px-4 py-3">Fecha</th>
          </tr>
        </thead>
        <tbody>
          {guests.map((guest) => (
            <tr key={guest.id} className="border-t border-ink/5">
              <td className="px-4 py-3">
                <p className="font-medium">{guest.name}</p>
                <p className="text-xs text-ink/50">{guest.email}</p>
              </td>
              <td className="px-4 py-3">
                <span
                  className={
                    guest.status === "accepted"
                      ? "text-sage"
                      : guest.status === "declined"
                        ? "text-rose"
                        : "text-ink/50"
                  }
                >
                  {labels[guest.status]}
                </span>
              </td>
              <td className="px-4 py-3">{guest.plusOnes}</td>
              <td className="px-4 py-3 text-ink/60">{guest.message || "—"}</td>
              <td className="px-4 py-3 text-ink/50">
                {guest.respondedAt ? formatDateShort(guest.respondedAt) : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
