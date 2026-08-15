import { NextResponse } from "next/server";
import { defaultContent, slugify, uid } from "@/lib/format";
import { defaultModules } from "@/lib/modules";
import { getTemplate } from "@/lib/templates";
import { listEvents, upsertEvent } from "@/lib/store";
import type { InviteEvent } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ events: listEvents() });
}

export async function POST(request: Request) {
  const body = await request.json();
  const template = getTemplate(body.templateSlug);
  if (!template) {
    return NextResponse.json({ error: "Template inexistente" }, { status: 400 });
  }

  const now = new Date().toISOString();
  const id = uid("evt");
  const event: InviteEvent = {
    id,
    slug: slugify(`${template.slug}-${id.slice(-6)}`),
    templateSlug: template.slug,
    plan: "completo",
    paid: false,
    published: false,
    createdAt: now,
    updatedAt: now,
    modules: defaultModules(),
    content: defaultContent(
      template.category === "quince"
        ? {
            title: "Valentina",
            subtitle: "Mis 15 años",
            hosts: "Mis papás te invitan",
            story: "Quiero festejar esta noche con las personas que quiero.",
          }
        : template.category === "comunion"
          ? {
              title: "Benicio",
              subtitle: "Primera comunión",
              hosts: "La familia te espera",
              story: "Acompañanos en este día especial.",
            }
          : undefined,
    ),
  };

  upsertEvent(event);
  return NextResponse.json({ event });
}
