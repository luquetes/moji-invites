import { NextResponse } from "next/server";
import { getEvent, listSocialPosts, upsertSocialPost } from "@/lib/store";
import { generateSocialPack, nextScheduleSlot } from "@/lib/social";
import { uid } from "@/lib/format";
import type { SocialPlatform } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = await request.json();
  const event = getEvent(body.eventId);
  if (!event) return NextResponse.json({ error: "Evento no encontrado" }, { status: 404 });
  if (event.plan !== "premium" || !event.paid) {
    return NextResponse.json(
      { error: "La automatización de redes requiere el plan Premium pago." },
      { status: 402 },
    );
  }

  if (body.action === "publish") {
    const posts = listSocialPosts(event.id);
    const post = posts.find((p) => p.id === body.postId);
    if (!post) return NextResponse.json({ error: "Post no encontrado" }, { status: 404 });
    const updated = upsertSocialPost({ ...post, status: "published" });
    return NextResponse.json({ post: updated });
  }

  const pack = generateSocialPack(event);
  const platforms = Object.keys(pack) as SocialPlatform[];
  const created = platforms.map((platform, index) => {
    const piece = pack[platform];
    const when = new Date(nextScheduleSlot());
    when.setDate(when.getDate() + index);
    return upsertSocialPost({
      id: uid("soc"),
      eventId: event.id,
      platform,
      title: piece.title,
      caption: piece.caption,
      hashtags: piece.hashtags,
      scheduledAt: when.toISOString(),
      status: "scheduled",
      createdAt: new Date().toISOString(),
    });
  });

  return NextResponse.json({ posts: created });
}
