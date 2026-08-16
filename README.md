# Moji — Invitaciones digitales

Prototipo de un sistema de templates de invitaciones, inspirado en [Fixdate](https://fixdate.io/ar/) pero **self-serve**: el anfitrión customiza en vivo, paga, publica y sigue el RSVP desde un mini backoffice.

La idea de producto, el modelo draft vs live y las invariantes de ingeniería están en [CLAUDE.md](./CLAUDE.md) (Cursor y otros agentes también leen [AGENTS.md](./AGENTS.md)).

## Qué incluye

- **Sets de templates** (Bodas, 15 años, Comunión) con paleta, tipografía y ornamentación propias: Magnolias Gold, Deluxe Classic, Vintage, Tropical, Navy Romance, Bohemio, Aurum Wine, Minimalista, Playa, Aurora, Jardín Rosa, Lino.
- **Editor en vivo**: reorder (drag) y toggle de módulos. El preview tipo celular se actualiza al instante.
- **Invitación pública** con countdown, itinerario, mapa, álbum, regalos, dress code, RSVP personalizado por invitado.
- **Mini backoffice**: publicar, enviar por WhatsApp/mail/link, ver quién aceptó o rechazó.
- **Pasarela proto** Stripe + Mercado Pago (sin cobro real). El pago desbloquea publicar / enviar / RSVP.
- **Redes (plan Premium)**: generación de copy para Instagram, TikTok y Pinterest + calendario de publicaciones (simulado; en producción iría a las APIs o Zapier).

## Cómo correrlo

```bash
npm install
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000).

- Landing y catálogo: `/` y `/modelos`
- Editor demo: `/editor/evt_demo_sofia`
- Invitación publicada: `/i/sofia-y-martin`
- Studio: `/studio`
- Checkout: elegí un modelo → Adquirir

```bash
npm test
npm run build
```

## Flujo

1. Elegí un set.
2. Personalizá módulos, textos y colores.
3. Pagá (demo) con Mercado Pago o Stripe.
4. Publicá, cargá invitados y enviá el link.
5. Cada invitado acepta o rechaza; el studio muestra el recuento.
6. En Premium, generá y programá piezas para redes.

Los datos del proto viven en `data/db.json` (se crea solo, con un evento demo de Sofía & Martín ya pago y con invitados).

## Notas de producto

Fixdate trabaja con asesores y entrega en 72 h. Moji apunta al mismo universo visual (sets temáticos, módulos de boda, RSVP, música, regalos) pero con **herramientas de customización en vivo** y un backoffice del anfitrión. Las pasarelas y el scheduler de redes están cableados a nivel de producto; las credenciales reales de Stripe, Mercado Pago e Instagram/TikTok/Pinterest se conectarían en un siguiente paso.
