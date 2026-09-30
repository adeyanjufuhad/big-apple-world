import { PageHeader } from "@/components/page-header";
import { requireAdmin } from "@/lib/auth/server";
import { getCategories } from "@/lib/db";
import { ProductForm } from "../product-form";

export const metadata = { title: "Add product" };

export default async function NewProductPage() {
  await requireAdmin();
  const categories = await getCategories();
  return (
    <>
      <PageHeader title="Add product" description="It appears on the shop as soon as you save." />
      <ProductForm categories={categories} />
    </>
  );
}
