// One-off import of Allure's in-stock products, used with the site owner's permission
// (images and prices). Descriptions are written fresh rather than copied.
// Run from admin/:  node --env-file=.env.local scripts/import-allure.mjs <dir-with-allure-json>
// Safe to re-run: products whose slug already exists are skipped.
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { neon } from "@neondatabase/serverless";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const dir = process.argv[2];
if (!dir) throw new Error("Pass the folder containing p*.json and categories.json");

const sql = neon(process.env.DATABASE_URL);
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  endpoint: process.env.AWS_ENDPOINT_URL_S3,
  forcePathStyle: true,
  requestChecksumCalculation: "WHEN_REQUIRED",
});
const bucket = process.env.S3_BUCKET;
const publicBase = `${process.env.AWS_ENDPOINT_URL_S3}/${bucket}`;

// ---------- Source data ----------
const allureCats = new Map(JSON.parse(readFileSync(path.join(dir, "categories.json"), "utf8")).map((c) => [c.id, c]));
const items = readdirSync(dir)
  .filter((f) => /^p\d+\.json$/.test(f))
  .flatMap((f) => JSON.parse(readFileSync(path.join(dir, f), "utf8")))
  .filter((p) => p.is_in_stock && p.type === "simple" && p.images?.length && Number(p.prices?.price) > 0);

function topLevel(id) {
  let c = allureCats.get(id);
  while (c?.parent) c = allureCats.get(c.parent);
  return c?.name ?? "";
}

// Priority order: the first rule that matches any of the product's top-level categories wins.
const RULES = [
  [["Makeup"], "makeup"],
  [["Fragrance"], "fragrance"],
  [["Hair"], "hair-care"],
  [["Face Moisturizers Nigeria", "Korean Beauty", "Azelaic Acid"], "skincare"],
  [["Bath and Body", "Baby"], "bath-body"],
  [["For Him"], "mens-care"],
];
const NEW_CATEGORIES = {
  skincare: "Skincare",
  "bath-body": "Bath & Body",
  makeup: "Makeup",
  fragrance: "Fragrance",
  "mens-care": "Men's Care",
};

function categoryFor(p) {
  const tops = new Set(p.categories.map((c) => topLevel(c.id)));
  for (const [names, slug] of RULES) if (names.some((n) => tops.has(n))) return slug;
  return "bath-body";
}

// ---------- Helpers ----------
const NAMED = { amp: "&", quot: '"', apos: "'", lt: "<", gt: ">", nbsp: " ", ndash: "–", mdash: "—", rsquo: "’", lsquo: "‘", rdquo: "”", ldquo: "“", hellip: "…", trade: "™", reg: "®" };
function decode(text) {
  return text
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&([a-z]+);/gi, (m, n) => NAMED[n.toLowerCase()] ?? m)
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function slugify(text) {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100);
}

function describe(name, categoryName) {
  return `${name} — part of our ${categoryName.toLowerCase()} range. Message us on WhatsApp to confirm availability or to order in wholesale quantities.`;
}

async function withRetry(fn, tries = 3) {
  for (let i = 1; ; i++) {
    try {
      return await fn();
    } catch (err) {
      if (i >= tries) throw err;
      await new Promise((r) => setTimeout(r, 1000 * i));
    }
  }
}

// ---------- Categories ----------
const existingCats = new Map((await sql`select id, slug from categories`).map((c) => [c.slug, c.id]));
for (const [slug, name] of Object.entries(NEW_CATEGORIES)) {
  if (existingCats.has(slug)) continue;
  const [row] = await sql`
    insert into categories (slug, name, sort_order)
    values (${slug}, ${name}, (select coalesce(max(sort_order), -1) + 1 from categories))
    returning id`;
  existingCats.set(slug, row.id);
  console.log("created category", name);
}

// ---------- Products ----------
const taken = new Set((await sql`select slug from products`).map((r) => r.slug));
const queue = items.map((p) => ({ p, category: categoryFor(p), slug: slugify(p.slug) || slugify(decode(p.name)) }));
let done = 0;
let created = 0;
let skipped = 0;
const failures = [];

async function importOne({ p, category, slug }) {
  if (taken.has(slug)) {
    skipped++;
    return;
  }
  taken.add(slug);
  const name = decode(p.name).slice(0, 120);
  const price = Math.round(Number(p.prices.price) / 10 ** (p.prices.currency_minor_unit ?? 0));

  const imageUrl = await withRetry(async () => {
    const res = await fetch(p.images[0].src, { headers: { "user-agent": "Mozilla/5.0 (BigAppleBeauty catalog import)" } });
    if (!res.ok) throw new Error(`image ${res.status}`);
    const web = await sharp(Buffer.from(await res.arrayBuffer()))
      .rotate()
      .resize({ width: 800, height: 800, fit: "inside", withoutEnlargement: true })
      .flatten({ background: "#ffffff" })
      .webp({ quality: 80 })
      .toBuffer();
    const key = `products/allure/${slug}.webp`;
    await s3.send(new PutObjectCommand({ Bucket: bucket, Key: key, Body: web, ContentType: "image/webp", CacheControl: "public, max-age=31536000, immutable" }));
    return `${publicBase}/${key}`;
  });

  await sql`
    insert into products (slug, name, category_id, price, description, image_url, in_stock, best_seller, new_arrival, published)
    values (${slug}, ${name}, ${existingCats.get(category)}, ${price}, ${describe(name, NEW_CATEGORIES[category] ?? "hair care")},
            ${imageUrl}, true, false, false, true)
    on conflict (slug) do nothing`;
  created++;
}

const CONCURRENCY = 6;
async function worker() {
  while (queue.length) {
    const job = queue.shift();
    try {
      await importOne(job);
    } catch (err) {
      failures.push(`${job.slug}: ${err.message}`);
    }
    if (++done % 50 === 0) console.log(`${done}/${items.length} processed (${created} added)`);
  }
}
await Promise.all(Array.from({ length: CONCURRENCY }, worker));

// Give new categories a cover photo from one of their products.
await sql`
  update categories c set image_url = (
    select p.image_url from products p where p.category_id = c.id and p.image_url is not null order by p.price desc limit 1)
  where c.image_url is null`;

console.log(`\nDone: ${created} added, ${skipped} already present, ${failures.length} failed.`);
if (failures.length) console.log("Failures:\n" + failures.slice(0, 30).join("\n"));
