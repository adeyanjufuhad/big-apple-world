"use client";

import { ImageField, SubmitButton, Toggle } from "@/components/form-bits";
import type { Category, Product } from "@/lib/db";
import Link from "next/link";
import { useActionState } from "react";
import { saveProduct } from "../actions";

export function ProductForm({ product, categories }: { product?: Product; categories: Category[] }) {
  const [state, action] = useActionState(saveProduct, null);

  return (
    <form action={action} className="grid gap-8 lg:grid-cols-[320px_1fr]">
      {product && <input type="hidden" name="id" value={product.id} />}

      <div className="card h-fit p-5">
        <ImageField current={product?.image_url} required={!product} label="Product photo" />
      </div>

      <div className="card space-y-5 p-5 sm:p-6">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">Product name</span>
          <input name="name" required maxLength={120} defaultValue={product?.name} placeholder="e.g. Cordless UV/LED Nail Lamp" className="field" />
        </label>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">Category</span>
            <select name="category_id" required defaultValue={product?.category_id ?? ""} className="field">
              <option value="" disabled>
                Choose a category
              </option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            {categories.length === 0 && (
              <Link href="/categories" className="mt-1 block text-xs text-navy hover:underline">
                Create a category first
              </Link>
            )}
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">Price (₦)</span>
            <input
              name="price"
              required
              inputMode="numeric"
              defaultValue={product?.price}
              placeholder="e.g. 38000"
              className="field tabular-nums"
            />
          </label>
        </div>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">Description</span>
          <textarea
            name="description"
            rows={4}
            maxLength={2000}
            defaultValue={product?.description}
            placeholder="What it is, what it's for, what's in the box."
            className="field h-auto py-3"
          />
        </label>

        <div className="grid gap-3 sm:grid-cols-2">
          <Toggle name="in_stock" label="In stock" hint="Customers can add it to cart" defaultChecked={product?.in_stock ?? true} />
          <Toggle name="published" label="Show on shop" hint="Turn off to hide it" defaultChecked={product?.published ?? true} />
          <Toggle name="best_seller" label="Best seller" hint="Shown in Best sellers" defaultChecked={product?.best_seller} />
          <Toggle name="new_arrival" label="New arrival" hint="Shown in New arrivals" defaultChecked={product?.new_arrival} />
        </div>

        {state?.error && <p className="text-sm text-apple">{state.error}</p>}

        <div className="flex flex-wrap items-center gap-3 border-t border-line pt-5">
          <SubmitButton>{product ? "Save changes" : "Add product"}</SubmitButton>
          <Link href="/products" className="h-11 rounded-full px-5 text-sm leading-[2.75rem] font-medium text-muted hover:text-ink">
            Cancel
          </Link>
        </div>
      </div>
    </form>
  );
}
