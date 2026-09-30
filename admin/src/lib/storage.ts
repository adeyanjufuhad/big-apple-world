import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { randomUUID } from "node:crypto";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  endpoint: process.env.AWS_ENDPOINT_URL_S3,
  forcePathStyle: true,
  requestChecksumCalculation: "WHEN_REQUIRED",
});

const TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

/** Uploads an image to the public product-images bucket and returns its public URL. */
export async function uploadImage(file: File, folder: "products" | "categories") {
  const ext = TYPES[file.type];
  if (!ext) throw new Error("Please upload a JPG, PNG, WebP or AVIF image.");
  if (file.size > MAX_IMAGE_BYTES) throw new Error("Image is larger than 5 MB.");

  const bucket = process.env.S3_BUCKET!;
  const key = `${folder}/${randomUUID()}.${ext}`;
  await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: Buffer.from(await file.arrayBuffer()),
      ContentType: file.type,
      CacheControl: "public, max-age=31536000, immutable",
    }),
  );
  return `${process.env.AWS_ENDPOINT_URL_S3}/${bucket}/${key}`;
}
