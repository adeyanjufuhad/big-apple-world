"use client";

import { Notice, SubmitButton } from "@/components/form-bits";
import { FileSpreadsheet } from "lucide-react";
import Link from "next/link";
import { useActionState, useState } from "react";
import { importProducts } from "./actions";

export function ImportForm() {
  const [state, action] = useActionState(importProducts, null);
  const [fileName, setFileName] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {state?.error && <Notice tone="error">{state.error}</Notice>}
      {state?.created !== undefined && (
        <div className="card p-5">
          <p className="font-semibold">
            Imported {state.created} {state.created === 1 ? "product" : "products"}.
          </p>
          {state.created > 0 && (
            <p className="mt-1 text-sm text-muted">
              They’re hidden from the shop until you add a photo and turn on “Show on shop”.{" "}
              <Link href="/products?filter=needs-photo" className="font-medium text-navy hover:underline">
                Add photos now
              </Link>
            </p>
          )}
          {!!state.newCategories?.length && (
            <p className="mt-2 text-sm text-muted">New categories created: {state.newCategories.join(", ")}.</p>
          )}
          {!!state.problems?.length && (
            <div className="mt-4">
              <p className="text-sm font-medium text-apple">
                {state.problems.length} {state.problems.length === 1 ? "row was" : "rows were"} skipped:
              </p>
              <ul className="mt-2 max-h-48 space-y-1 overflow-y-auto text-sm text-muted">
                {state.problems.map((p) => (
                  <li key={p.row}>
                    Row {p.row}: {p.message}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <form action={action} className="card space-y-5 p-5 sm:p-6">
        <label className="flex cursor-pointer flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-line bg-sand px-6 py-10 text-center transition-colors hover:border-navy">
          <FileSpreadsheet className="size-9 text-muted" />
          <span className="text-sm">
            {fileName ? (
              <span className="font-medium text-ink">{fileName}</span>
            ) : (
              <>
                <span className="font-medium text-navy">Choose a CSV file</span>
                <br />
                <span className="text-muted">Excel or Google Sheets → File → Download/Save as → CSV</span>
              </>
            )}
          </span>
          <input
            type="file"
            name="file"
            accept=".csv,text/csv"
            required
            className="sr-only"
            onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
          />
        </label>
        <SubmitButton>Import products</SubmitButton>
      </form>
    </div>
  );
}
