import { notFound } from "next/navigation";
import { getEventBySlug, getGuestByToken } from "@/lib/store";
import { PublicInvitation } from "@/components/invitation/PublicInvitation";

export const dynamic = "force-dynamic";

export default async function InvitationPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ g?: string; preview?: string }>;
}) {
  const { slug } = await params;
  const { g, preview } = await searchParams;
  const event = getEventBySlug(slug);
  if (!event) notFound();
  if (!event.published && preview !== "1") notFound();
  const guest = g ? getGuestByToken(g) : undefined;
  return <PublicInvitation event={event} guest={guest?.eventId === event.id ? guest : undefined} />;
}
