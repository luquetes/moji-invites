import { notFound } from "next/navigation";
import { getEvent } from "@/lib/store";
import { EditorShell } from "@/components/editor/EditorShell";

export const dynamic = "force-dynamic";

export default async function EditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = getEvent(id);
  if (!event) notFound();
  return <EditorShell initial={event} />;
}
