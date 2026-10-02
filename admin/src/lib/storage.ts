import "server-only";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { randomUUID } from "node:crypto";
import sharp from "sharp";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  endpoint: process.env.AWS_ENDPOINT_URL_S3,
  forcePathStyle: true,
  requestChecksumCalculation: "WHEN_REQUIRED",
});

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

/**
 * Detects the image type from the file's first bytes. The browser-supplied MIME type
 * and filename are ignored, so a renamed script or SVG can't slip through.
 */
function sniffImage(bytes: Uint8Array): { ext: string; type: string } | null {
  const at = (offset: number, ...sig: number[]) => sig.every((b, i) => bytes[offset + i] === b);
  const ascii = (offset: number, text: string) => at(offset, ...Array.from(text, (c) => c.charCodeAt(0)));

  if (at(0, 0xff, 0xd8, 0xff)) return { ext: "jpg", type: "image/jpeg" };
  if (at(0, 0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a)) return { ext: "png", type: "image/png" };
  if (ascii(0, "RIFF") && ascii(8, "WEBP")) return { ext: "webp", type: "image/webp" };
  if (ascii(4, "ftyp") && (ascii(8, "avif") || ascii(8, "avis"))) return { ext: "avif", type: "image/avif" };
  return null;
}

/** Uploads an image to the public product-images bucket and returns its public URL. */
export async function uploadImage(file: File, folder: "products" | "categories") {
  if (file.size > MAX_IMAGE_BYTES) throw new Error("Image is larger than 5 MB.");
  const body = new Uint8Array(await file.arrayBuffer());
  const kind = sniffImage(body);
  if (!kind) throw new Error("Please upload a JPG, PNG, WebP or AVIF image.");

  // Re-encode to a web-sized WebP: phone photos shrink from megabytes to ~60 KB,
  // and re-encoding strips any metadata (like GPS location) from the original.
  const web = await sharp(body)
    .rotate()
    .resize({ width: 800, height: 800, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 82 })
    .toBuffer();

  const bucket = process.env.S3_BUCKET!;
  // Random key: the uploader's filename never reaches storage.
  const key = `${folder}/${randomUUID()}.webp`;
  await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: web,
      ContentType: "image/webp",
      CacheControl: "public, max-age=31536000, immutable",
    }),
  );
  return `${process.env.AWS_ENDPOINT_URL_S3}/${bucket}/${key}`;
}
