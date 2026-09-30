import { ConfirmButton } from "@/components/form-bits";
import { PageHeader } from "@/components/page-header";
import { requireAdmin } from "@/lib/auth/server";
import { getCategories, getProductById, isUuid } from "@/lib/db";
import { Trash2 } from "lucide-react";
import { notFound } from "next/navigation";
import { deleteProduct } from "../../actions";
import { ProductForm } from "../product-form";

export const metadata = { title: "Edit product" };

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  if (!isUuid(id)) notFound();
  const [product, categories] = await Promise.all([getProductById(id), getCategories()]);
  if (!product) notFound();

  return (
    <>
      <PageHeader
        title="Edit product"
        description={product.name}
        action={
          <form action={deleteProduct}>
            <input type="hidden" name="id" value={product.id} />
            <ConfirmButton
              message={`Delete “${product.name}”? This can’t be undone. (To hide it for now, turn off “Show on shop” instead.)`}
              className="inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-medium text-apple ring-1 ring-apple/30 hover:bg-apple-soft"
            >
              <Trash2 className="size-4" /> Delete
            </ConfirmButton>
          </form>
        }
      />
      <ProductForm product={product} categories={categories} />
    </>
  );
}
