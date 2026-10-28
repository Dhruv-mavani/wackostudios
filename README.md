# Wacko Studios

Marketing site for Wacko Studios. Next.js (App Router) + React + Tailwind CSS.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
```

- Content (services, work, clients, time slots, contact details): `lib/data.ts`
- Scroll animations (intro, services reel, work stack, marquees): `components/ScrollEngine.tsx`
- Styles: `app/globals.css` (Tailwind theme tokens plus the ported animation CSS)

Work samples and client logos are placeholders. Set `SHOW_SAMPLE_TAGS` to `false` in `lib/data.ts` once real ones are added.
