# Big Apple Beauty Admin

The owner's back office for Big Apple Beauty: a separate Next.js app, on its own URL, that shares the Neon database with the storefront.

- **Dashboard:** revenue from paid orders, visitors, "ready to buy" (pending) orders, a visit-to-sale funnel, most-wanted products, devices and referrers, for the last 7, 30 or 90 days.
- **Orders:** every "Checkout on WhatsApp" in the shop is saved with a reference like `BA-7K2QXM`, which also appears in the customer's WhatsApp message. Mark each order **paid** or **cancelled**. Only paid orders count as revenue.
- **Products:** add, edit, hide or delete products, upload photos, set the price, stock, best seller and new arrival.
- **Categories:** add, rename, reorder and delete categories with photos.
- **Installable:** on a phone, open the admin in the browser and choose *Add to Home Screen*. It opens like an app.

The shop updates as soon as you save (the admin calls the shop's `/api/revalidate`), and refreshes itself every 5 minutes regardless.

## Run locally

```bash
npm install
npm run dev        # http://localhost:3001
```

The storefront runs separately on http://localhost:3000.

## First sign-in

1. Put the owner's email in `ADMIN_EMAILS` (comma-separated for more than one person).
2. Open `/setup` and create the account with that email.
3. Sign in at `/login`.

Anyone can reach the sign-in page, but only emails on `ADMIN_EMAILS` can create an account or get in.

## Environment variables

See `.env.example`.

| Variable | What it is |
| --- | --- |
| `DATABASE_URL` | Neon connection string (owner role) |
| `NEON_AUTH_BASE_URL` | Neon Managed Better Auth URL (Neon console → Auth → Configuration) |
| `NEON_AUTH_COOKIE_SECRET` | Random string, 32+ characters |
| `ADMIN_EMAILS` | Emails allowed into the admin |
| `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` | Neon Object Storage credential (storage read and write) |
| `AWS_ENDPOINT_URL_S3`, `AWS_REGION`, `S3_BUCKET` | Storage endpoint, region and bucket (`product-images`, public read) |
| `STOREFRONT_URL` | The shop's URL, e.g. `https://big-apple-world.vercel.app` |
| `REVALIDATE_SECRET` | Same value as the storefront's `REVALIDATE_SECRET` |

## Deploy on Vercel

Create a **second** Vercel project from the same GitHub repo:

1. *Root Directory*: `admin`
2. Add the environment variables above.
3. After the first deploy, add the admin's URL (e.g. `https://bigapple-admin.vercel.app`) to **Neon → Auth → Trusted domains**, otherwise sign-in is rejected.

## Seed data

`scripts/seed.mjs` uploaded the original product photos and catalog. It's safe to re-run, because existing items are skipped:

```bash
node --env-file=.env.local --experimental-strip-types scripts/seed.mjs
```
