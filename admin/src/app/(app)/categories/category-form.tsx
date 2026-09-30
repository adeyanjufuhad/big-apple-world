"use client";

import { ImageField, SubmitButton } from "@/components/form-bits";
import type { Category } from "@/lib/db";
import Link from "next/link";
import { useActionState } from "react";
import { saveCategory } from "../actions";

export function CategoryForm({ category }: { category?: Category }) {
  const [state, action] = useActionState(saveCategory, null);
  return (
    <form action={action} className="card space-y-5 p-5 sm:p-6">
      {category && <input type="hidden" name="id" value={category.id} />}
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium">Category name</span>
        <input name="name" required maxLength={80} defaultValue={category?.name} placeholder="e.g. Lash & Brow" className="field" />
      </label>
      <ImageField current={category?.image_url} label="Category photo (shown on the homepage)" />
      {state?.error && <p className="text-sm text-apple">{state.error}</p>}
      <div className="flex items-center gap-3">
        <SubmitButton>{category ? "Save changes" : "Add category"}</SubmitButton>
        {category && (
          <Link href="/categories" className="text-sm font-medium text-muted hover:text-ink">
            Cancel
          </Link>
        )}
      </div>
    </form>
  );
}
