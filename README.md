# Big Apple Beauty

Minimalist storefront for **Big Apple Beauty** (AC Big Apple) — wholesale beauty & spa essentials, Balogun Market, Lagos.

Built with Next.js (App Router), Tailwind CSS v4, Motion and a Neon Postgres database. The cart has no payment step: checkout sends the order to the store on WhatsApp and saves it as a pending order for the owner.

This repo holds two apps:

| App | Folder | Local URL |
| --- | --- | --- |
| Storefront | `/` | http://localhost:3000 |
| Admin (owner's back office) | [`admin/`](admin/README.md) | http://localhost:3001 |

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000. Copy `.env.example` to `.env.local` and fill in `DATABASE_URL` and `REVALIDATE_SECRET` first.

## Where to edit things

| What | File |
| --- | --- |
| Products, categories, prices, stock, photos | **Admin app** (stored in Neon) |
| Brands in the scrolling brand strip (each links to a search) | `src/lib/brands.ts` |
| Phone / WhatsApp number, address, hours, TikTok link | `src/lib/site.ts` |
| WhatsApp order message format | `src/lib/whatsapp.ts` |
| Brand colours and fonts | `src/app/globals.css` |
| Database schema | `db/schema.sql` |

> **Before launch:** check prices in the admin (the imported range uses Allure's retail prices), and paste the TikTok URL into `site.tiktok` (the footer icon becomes a link once it's set).

Page transitions live in `src/app/template.tsx`.

## Homepage sections

1. Hero
2. Shop by category
3. In stock
4. Best sellers
5. Brands (animated marquee)
6. New arrivals
7. Why choose us
8. Visit us (address, hours, WhatsApp)

## Brand colours

Sampled from the logo:

- Apple red `#E83136`
- Navy `#3D3E91`

## Components from 21st.dev

- [Infinite Slider](https://21st.dev/@ibelick/components/infinite-slider) — `src/components/ui/infinite-slider.tsx`

Infinite Slider is by ibelick (Motion Primitives) and powers the brand marquee. The why-us statement uses an adaptation of [Reading Text Reveal](https://21st.dev/waleedkibhen/reading-text-reveal) — `src/components/ui/scroll-text-reveal.tsx`.

## Data & analytics

- **Catalog:** read from Neon and cached for 5 minutes (`src/lib/catalog.ts`). The admin refreshes it instantly through `POST /api/revalidate`.
- **Orders:** `POST /api/orders` saves each WhatsApp checkout with a reference such as `BA-7K2QXM`. Prices are looked up in the database, never trusted from the browser.
- **Analytics:** `POST /api/track` records page views, product views, add-to-carts and WhatsApp clicks against a random visitor ID. No names, emails or IP addresses are stored.
- The storefront connects with a restricted database role that can read the catalog and insert events and orders only.

## Deploy the storefront on Cloudflare Workers

The storefront is live at [bigapplebeauty.store](https://bigapplebeauty.store/) and [www.bigapplebeauty.store](https://www.bigapplebeauty.store/) on the `big-apple-beauty` Worker in the client's Cloudflare account. The [workers.dev URL](https://big-apple-beauty.bigappleworld.workers.dev/) remains available as a preview. The Worker uses the `big-apple-beauty-cache` KV namespace and SQLite-backed Durable Objects for Next.js cache revalidation. Run `npm run cf:build` and `npx opennextjs-cloudflare deploy` from this folder. Set the Worker secrets `DATABASE_URL`, `REVALIDATE_SECRET`, and `RATE_LIMIT_SECRET` before serving traffic. Do not commit their values. The storefront's database URL should use the restricted role described above. Keep Next.js pinned to 16.3.8 until the OpenNext adapter supports the 16.4 preview manifest.

The custom domain routes are `bigapplebeauty.store` and `www.bigapplebeauty.store`. They use an active Cloudflare zone and Cloudflare's assigned nameservers at Spaceship. The admin production `STOREFRONT_URL` is `https://bigapplebeauty.store`; keep the same `REVALIDATE_SECRET` on both apps. The admin app is deployed separately; see [its instructions](admin/README.md).

KV is eventually consistent, so catalog edits may take up to about a minute to appear in every location even after the admin calls `/api/revalidate`. The five-minute time-based refresh remains a fallback. Monitor Workers and KV usage against Cloudflare's free-tier limits.
