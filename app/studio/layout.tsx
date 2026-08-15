import type { ReactNode } from "react";
import { StudioNav } from "@/components/studio/StudioNav";
import { getActiveEvent } from "@/lib/store";

export const dynamic = "force-dynamic";

export default function StudioLayout({ children }: { children: ReactNode }) {
  const event = getActiveEvent();
  return (
    <div className="mx-auto grid max-w-6xl gap-6 px-5 py-10 lg:grid-cols-[240px_1fr]">
      <StudioNav eventId={event?.id} />
      <div>{children}</div>
    </div>
  );
}
