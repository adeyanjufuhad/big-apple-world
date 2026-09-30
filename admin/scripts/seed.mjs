// One-time seed: uploads the storefront's product photos to Neon Object Storage and
// inserts the starting catalog. Safe to re-run (existing slugs are skipped).
// Run from admin/:  node --env-file=.env.local --experimental-strip-types scripts/seed.mjs
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { neon } from "@neondatabase/serverless";
import { readFile } from "node:fs/promises";
import path from "node:path";

const { categories, products } = await import("../../db/seed-data.ts");

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  endpoint: process.env.AWS_ENDPOINT_URL_S3,
  forcePathStyle: true,
  requestChecksumCalculation: "WHEN_REQUIRED",
});
const bucket = process.env.S3_BUCKET;
const publicBase = `${process.env.AWS_ENDPOINT_URL_S3}/${bucket}`;
const sql = neon(process.env.DATABASE_URL);

const uploaded = new Map();
async function upload(localPath) {
  if (uploaded.has(localPath)) return uploaded.get(localPath);
  const file = path.basename(localPath);
  const key = `seed/${file}`;
  const body = await readFile(path.join("..", "public", localPath));
  await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: "image/jpeg",
      CacheControl: "public, max-age=31536000, immutable",
    }),
  );
  const url = `${publicBase}/${key}`;
  uploaded.set(localPath, url);
  console.log("uploaded", key);
  return url;
}

for (const [i, c] of categories.entries()) {
  const imageUrl = await upload(c.image);
  await sql`insert into categories (slug, name, image_url, sort_order)
            values (${c.slug}, ${c.name}, ${imageUrl}, ${i})
            on conflict (slug) do nothing`;
}

for (const p of products) {
  const imageUrl = await upload(p.image);
  await sql`insert into products (slug, name, category_id, price, description, image_url, in_stock, best_seller, new_arrival)
            select ${p.slug}, ${p.name}, id, ${p.price}, ${p.description}, ${imageUrl},
                   ${p.inStock}, ${!!p.bestSeller}, ${!!p.newArrival}
            from categories where slug = ${p.category}
            on conflict (slug) do nothing`;
}

const [{ count: cats }] = await sql`select count(*)::int as count from categories`;
const [{ count: prods }] = await sql`select count(*)::int as count from products`;
console.log(`done: ${cats} categories, ${prods} products, ${uploaded.size} images`);
