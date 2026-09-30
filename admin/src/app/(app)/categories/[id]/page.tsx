import { PageHeader } from "@/components/page-header";
import { requireAdmin } from "@/lib/auth/server";
import { getCategories, isUuid } from "@/lib/db";
import { notFound } from "next/navigation";
import { CategoryForm } from "../category-form";

export const metadata = { title: "Edit category" };

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  if (!isUuid(id)) notFound();
  const category = (await getCategories()).find((c) => c.id === id);
  if (!category) notFound();

  return (
    <>
      <PageHeader title="Edit category" description={category.name} />
      <div className="max-w-xl">
        <CategoryForm category={category} />
      </div>
    </>
  );
}
