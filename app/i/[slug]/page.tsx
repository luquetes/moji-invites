import { notFound } from "next/navigation";
import { getEventBySlug, getGuestByToken } from "@/lib/store";
import { asPublishedEvent } from "@/lib/eventRevision";
import { PublicInvitation } from "@/components/invitation/PublicInvitation";

export const dynamic = "force-dynamic";

export default async function InvitationPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ g?: string; preview?: string; t?: string }>;
}) {
  const { slug } = await params;
  const { g, preview } = await searchParams;
  const stored = getEventBySlug(slug);
  if (!stored) notFound();

  const isPreview = preview === "1";
  const event = isPreview ? stored : asPublishedEvent(stored);
  if (!event) notFound();

  const guest = g ? getGuestByToken(g) : undefined;
  return <PublicInvitation event={event} guest={guest?.eventId === event.id ? guest : undefined} />;
}
