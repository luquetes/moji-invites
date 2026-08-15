import { getActiveEvent, listSocialPosts } from "@/lib/store";
import { SocialStudio } from "@/components/studio/SocialStudio";

export const dynamic = "force-dynamic";

export default function RedesPage() {
  const event = getActiveEvent();
  if (!event) return <p>No hay evento.</p>;
  const posts = listSocialPosts(event.id);
  return (
    <div>
      <h1 className="font-display text-4xl">Redes</h1>
      <p className="mt-2 max-w-xl text-ink/60">
        Generamos copy para Instagram, TikTok y Pinterest a partir del evento, y
        lo dejamos programado. En producción un worker publicaría vía las APIs
        oficiales o Zapier.
      </p>
      <SocialStudio event={event} posts={posts} />
    </div>
  );
}
