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
| Brands in the scrolling brand strip | `src/lib/brands.ts` |
| Phone / WhatsApp number, address, hours, TikTok link | `src/lib/site.ts` |
| WhatsApp order message format | `src/lib/whatsapp.ts` |
| Brand colours and fonts | `src/app/globals.css` |
| Database schema | `db/schema.sql` |

> **Before launch:** the starting prices (seeded from `db/seed-data.ts`) and the names in `brands.ts` are placeholders. Update prices in the admin, replace the brand names, and paste the TikTok URL into `site.tiktok` (the footer icon becomes a link once it's set).

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
- [Progressive Blur](https://21st.dev/@ibelick/components/progressive-blur) — `src/components/ui/progressive-blur.tsx`

Both are by ibelick (Motion Primitives). They power the brand marquee.

## Data & analytics

- **Catalog:** read from Neon and cached for 5 minutes (`src/lib/catalog.ts`). The admin refreshes it instantly through `POST /api/revalidate`.
- **Orders:** `POST /api/orders` saves each WhatsApp checkout with a reference such as `BA-7K2QXM`. Prices are looked up in the database, never trusted from the browser.
- **Analytics:** `POST /api/track` records page views, product views, add-to-carts and WhatsApp clicks against a random visitor ID. No names, emails or IP addresses are stored.
- The storefront connects with a restricted database role that can read the catalog and insert events and orders only.

## Deploy on Vercel

Import the repo with the default root directory and set `DATABASE_URL` and `REVALIDATE_SECRET`. Deploy the admin as a second Vercel project (see `admin/README.md`).
