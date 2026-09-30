# Security

How Big Apple World (storefront + admin) handles each item on the security checklist.

| # | Item | How it's handled |
| --- | --- | --- |
| 1 | Hide API keys | All secrets live in server-only env vars (`.env.local`, Vercel env). No `NEXT_PUBLIC_` secrets. Database, storage and auth modules import `server-only`, so a client component can't bundle them. |
| 2 | Purge git secrets | `.env*` files are git-ignored (only blank `.env.example` is committed). History has been scanned clean. CI runs **gitleaks** on every push. |
| 3 | Least-privilege DB keys | The public storefront uses `shop_web`, a role that can only read the catalog, insert events/orders, and call the rate limiter. Only the admin (behind login) uses the owner role. The browser never talks to the database. |
| 4 | Row-level security | RLS is enabled on every table (`db/security.sql`). `shop_web` policies: read categories, read **published** products only, insert **pending** orders only, insert events. |
| 5 | Encrypt sensitive data | No customer personal data is stored (orders hold items and totals; visitors are random IDs). Rate-limit keys are HMAC-SHA256 hashes, never raw IPs or emails. Passwords are handled by Neon Auth. All DB traffic uses TLS (`sslmode=require`, `channel_binding=require`), and Neon encrypts data at rest. |
| 6 | Server-side auth | Every admin page and server action calls `requireAdmin()` (session **and** email allowlist). The proxy redirect is only a first line of defence. |
| 7 | Lock record access | RLS hides unpublished products and all orders and analytics from the storefront role. Admin access is limited to `ADMIN_EMAILS`. |
| 8 | Block field tampering | Column-level grants: the shop can insert only `ref, items, total, visitor_id` into orders, so it can't set `status`, `created_at` or `id`. Order totals are recomputed from database prices. Admin actions read an explicit whitelist of fields and validate status values. |
| 9 | Secure session cookies | Neon Auth session cookies are `HttpOnly` and `Secure`. The admin sets `SameSite=Strict`. |
| 10 | Hash passwords | Managed Better Auth (Neon Auth) stores only password hashes. The app never sees or stores them. The setup page enforces 10+ character passwords. |
| 11 | Rate-limit login | Admin sign-in allows 10 tries per IP and 5 per account per 15 minutes. Setup allows 5 per IP per hour. Backed by the `hit_rate_limit()` DB function. |
| 12 | Bot protection | Vercel **BotID** (invisible) guards `/api/orders` and `/api/track`. Known bot user-agents are ignored. Admin forms have a honeypot field. Public APIs are rate-limited (orders: 10 per 10 min per IP; events: 120 per min per IP). |
| 13 | Parameterized queries | Every query uses the Neon driver's tagged templates, so values are always sent as parameters. There is no string-built SQL. |
| 14 | Validate all input | APIs cap body size, whitelist event types, regex-check order refs and slugs, and clamp quantities. Admin actions trim and cap lengths, check UUIDs, and bound prices. |
| 15 | Escape user content | React escapes all rendered text. There is no `dangerouslySetInnerHTML`. WhatsApp messages are URL-encoded. Image hosts are restricted in `next.config`. |
| 16 | Restrict file uploads | Admin-only. 5 MB max. Type is detected from the file's bytes (JPEG/PNG/WebP/AVIF only, no SVG). Stored under random names, so the uploader's filename is never used. |
| 17 | Trim API responses | Public APIs return `204` or `{ ok }` only. Errors are generic. Sign-in errors don't reveal whether an account exists. `X-Powered-By` is disabled. |
| 18 | Security headers | CSP, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, `Cross-Origin-Opener-Policy`. The admin also sends `X-Robots-Tag: noindex`. |
| 19 | Force HTTPS | Vercel redirects HTTP to HTTPS. Production adds HSTS (2 years, preload) and `upgrade-insecure-requests`. |
| 20 | Scan dependencies | `npm audit` for both apps runs in CI on every push and weekly. Dependabot opens weekly update PRs. |

## After deploying

- In Vercel → Firewall, enable **BotID Deep Analysis** for the storefront project.
- Add the admin's production URL to Neon → Auth → Trusted domains.
- Rotate any credential that has ever been shared outside the env files (chat, screenshots, email).

## Reporting a problem

Email the site owner. Please don't open a public issue for security problems.
