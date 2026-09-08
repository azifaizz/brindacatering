# Brindha Catering Services — Website

Premium catering website: Home, About, Services, Menu, Gallery, Contact, plus an
enquiry endpoint, sitemap and robots file.

Stack: TanStack Start (React 19 + TypeScript), Tailwind CSS v4, Lucide icons,
React Hook Form + Zod.

## Local setup

```bash
bun install     # or npm install
bun run dev     # http://localhost:8080
bun run build   # production build
bun run lint
```

## Environment variables

Copy `.env.example` to `.env` and fill in the real values. Nothing is invented in
the code — empty values render clearly marked placeholders instead of fake data.

| Variable                                  | Purpose                                              |
| ----------------------------------------- | ---------------------------------------------------- |
| `VITE_SITE_URL`                           | Production URL, used in structured data              |
| `VITE_BUSINESS_PHONE`                     | Displayed phone number                               |
| `VITE_WHATSAPP_NUMBER`                    | Digits + country code, e.g. `919XXXXXXXXX`           |
| `VITE_BUSINESS_EMAIL`                     | Displayed email                                      |
| `VITE_BUSINESS_ADDRESS`                   | Address lines separated by `\|`                      |
| `VITE_BUSINESS_HOURS`                     | Free text, e.g. `Mon–Sun, 9:00 AM – 8:00 PM`         |
| `VITE_GOOGLE_MAPS_URL`                    | Directions link                                      |
| `VITE_GOOGLE_MAPS_EMBED_URL`              | Google Maps `embed` iframe src                       |
| `VITE_INSTAGRAM_URL`, `VITE_FACEBOOK_URL` | Social links                                         |
| `ENQUIRY_WEBHOOK_URL`                     | Server-only. Where enquiries are delivered           |
| `ENQUIRY_API_SECRET`                      | Server-only. Sent as a bearer token to that endpoint |

Never commit `.env`. Server-only values are read inside request handlers and are
never bundled into the browser.

## Updating content

All content lives in `src/data/` — no JSX edits needed.

- **Business information / hero / about text** — `src/data/business.ts`
- **Services** — `src/data/services.ts` (id, slug, title, description, image, highlights)
- **Menu categories and dishes** — `src/data/menu.ts` (price and tags are optional and only render when present)
- **Gallery** — `src/data/gallery.ts` (image, alt, title, category, order)

The data layer is deliberately typed and isolated so it can later be swapped for
a CMS or database without rewriting the UI.

## Replacing the hero video

Add the file at `public/videos/hero-catering.mp4` (optionally
`hero-catering.webm`). Paths are configured in `hero.video` in
`src/data/business.ts`. The poster image (`src/assets/hero-poster.jpg`) always
loads first; video only autoplays on larger screens, when data-saver is off and
when the visitor has not requested reduced motion.

## Replacing images

Drop new files in `src/assets/` and update the imports in `src/data/*.ts`. Keep
descriptive `alt` text — it is stored alongside each image in the data files.

## Enquiry backend

`POST /api/public/enquiry` validates with the shared Zod schema
(`src/lib/validation.ts`), applies a honeypot check, a request-size limit and a
per-IP rate limit, sanitises input, then forwards the enquiry to
`ENQUIRY_WEBHOOK_URL`. If that variable is unset the endpoint returns 503 and the
form tells the visitor to call or use WhatsApp — it never fakes a delivery.

The rate limiter is in-memory behind an `allow()` helper; swap it for
Redis/Upstash for multi-instance deployments.

## WhatsApp and Maps

WhatsApp links are generated in `src/lib/whatsapp.ts` from
`VITE_WHATSAPP_NUMBER`, with a configurable pre-filled message. Service pages add
the service name to the message automatically. Without a number, WhatsApp
buttons are hidden rather than broken. The Contact map uses
`VITE_GOOGLE_MAPS_EMBED_URL`.

## SEO and Google indexing

Each page sets its own title, description, canonical, Open Graph and Twitter
tags. Organization and WebSite JSON-LD live in the root route and only include
supplied values. `/sitemap.xml` is generated at request time; `/robots.txt` is in
`public/`.

To connect Search Console: publish the site, add the domain as a property,
verify via DNS or the HTML tag, then submit `https://your-domain/sitemap.xml`.
Indexing is performed by Google on its own schedule.
