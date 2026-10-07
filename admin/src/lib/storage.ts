import "server-only";
import { AwsClient } from "aws4fetch";
import { randomUUID } from "node:crypto";

// aws4fetch signs plain fetch() requests for Neon's S3-compatible storage. It's tiny and
// runs natively on Cloudflare Workers, unlike the full AWS SDK.
function storageClient() {
  return new AwsClient({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    region: process.env.AWS_REGION,
    service: "s3",
  });
}

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

  // The admin form already shrinks photos to an 800px WebP in the browser (which also
  // strips metadata such as GPS location); the server only verifies and stores them.
  const bucket = process.env.S3_BUCKET!;
  // Random key: the uploader's filename never reaches storage.
  const key = `${folder}/${randomUUID()}.${kind.ext}`;
  const url = `${process.env.AWS_ENDPOINT_URL_S3}/${bucket}/${key}`;
  const res = await storageClient().fetch(url, {
    method: "PUT",
    body,
    headers: { "content-type": kind.type, "cache-control": "public, max-age=31536000, immutable" },
  });
  if (!res.ok) throw new Error("Couldn’t save the photo. Please try again.");
  return url;
}
