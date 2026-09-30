import { CATALOG_TAG } from "@/lib/catalog";
import { revalidatePath, revalidateTag } from "next/cache";
import { timingSafeEqual } from "node:crypto";

// Called by the admin app after the catalog changes, so the shop updates immediately.
export async function POST(req: Request) {
  const secret = process.env.REVALIDATE_SECRET;
  const given = req.headers.get("x-revalidate-secret") ?? "";
  if (!secret || given.length !== secret.length || !timingSafeEqual(Buffer.from(given), Buffer.from(secret))) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  revalidateTag(CATALOG_TAG, { expire: 0 });
  revalidatePath("/", "layout");
  return Response.json({ revalidated: true });
}
