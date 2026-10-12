# DataVerse DPO masterclass

A responsive Next.js recreation of the DataVerse Solutions webinar landing page.

## Local development

Requires Node.js 24 or later.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Production

```bash
npm run check
```

This app uses the Next.js App Router and is ready for Vercel’s standard Next.js deployment flow. No environment variables are required.

## Page map

| Source | Local route |
| --- | --- |
| https://webinar-dashboard-psi.vercel.app/ | `/` |

Images are stored in `public/sites/dataverse/`. The seat registration link opens Calendly; the community link opens WhatsApp.
