# Big Apple World

Minimalist storefront for **AC Big Apple / Big Apple World** — wholesale beauty & spa essentials, Balogun Market, Lagos.

Built with Next.js (App Router), Tailwind CSS v4 and Motion. The cart has no payment step: checkout sends the order to the store on WhatsApp.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Where to edit things

| What | File |
| --- | --- |
| Products, prices, stock, best seller / new flags | `src/lib/products.ts` |
| Brands in the scrolling brand strip | `src/lib/brands.ts` |
| Phone / WhatsApp number, address, hours | `src/lib/site.ts` |
| WhatsApp order message format | `src/lib/whatsapp.ts` |
| Brand colours and fonts | `src/app/globals.css` |
| Product photos | `public/products/` |

> **Before launch:** prices in `products.ts` and names in `brands.ts` are placeholders — replace them with the real values.

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
