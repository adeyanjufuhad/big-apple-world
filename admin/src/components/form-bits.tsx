"use client";

import { cn } from "@/lib/cn";
import { ImagePlus, Loader2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useFormStatus } from "react-dom";

export function SubmitButton({ children, className }: { children: React.ReactNode; className?: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      disabled={pending}
      className={cn(
        "inline-flex h-11 items-center justify-center gap-2 rounded-full bg-ink px-6 text-sm font-medium text-white transition-colors hover:bg-navy disabled:opacity-60",
        className,
      )}
    >
      {pending && <Loader2 className="size-4 animate-spin" />}
      {pending ? "Saving…" : children}
    </button>
  );
}

/** A button that asks for confirmation before submitting its form. */
export function ConfirmButton({ message, children, className }: { message: string; children: React.ReactNode; className?: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      disabled={pending}
      onClick={(e) => {
        if (!confirm(message)) e.preventDefault();
      }}
      className={className}
    >
      {children}
    </button>
  );
}

/** Photo picker with a live preview. The file is sent with the form as "image". */
export function ImageField({ current, required, label = "Photo" }: { current?: string | null; required?: boolean; label?: string }) {
  const [preview, setPreview] = useState<string | null>(null);
  const shown = preview ?? current ?? null;

  return (
    <div>
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      <label className="group relative flex aspect-square w-full max-w-xs cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-line bg-sand text-center transition-colors hover:border-navy">
        {shown ? (
          <>
            {preview ? (
              // Local blob preview — next/image can't optimise object URLs.
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="" className="absolute inset-0 size-full object-contain p-4 mix-blend-multiply" />
            ) : (
              <Image src={shown} alt="" fill sizes="320px" className="object-contain p-4 mix-blend-multiply" />
            )}
            <span className="absolute inset-x-3 bottom-3 rounded-full bg-white/90 py-1.5 text-xs font-medium opacity-0 shadow-sm transition-opacity group-hover:opacity-100">
              Change photo
            </span>
          </>
        ) : (
          <span className="flex flex-col items-center gap-2 px-6 text-sm text-muted">
            <ImagePlus className="size-8" />
            <span>
              <span className="font-medium text-navy">Choose a photo</span>
              <br />
              JPG, PNG or WebP, up to 5 MB
            </span>
          </span>
        )}
        <input
          type="file"
          name="image"
          accept="image/jpeg,image/png,image/webp,image/avif"
          required={required && !current}
          className="sr-only"
          onChange={(e) => {
            const file = e.target.files?.[0];
            setPreview(file ? URL.createObjectURL(file) : null);
          }}
        />
      </label>
      <p className="mt-2 text-xs text-muted">Tip: a plain white background looks best on the shop.</p>
    </div>
  );
}

export function Toggle({ name, label, hint, defaultChecked }: { name: string; label: string; hint?: string; defaultChecked?: boolean }) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-4 rounded-xl p-3 ring-1 ring-line has-[:checked]:bg-navy-soft/60">
      <span>
        <span className="block text-sm font-medium">{label}</span>
        {hint && <span className="block text-xs text-muted">{hint}</span>}
      </span>
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="peer sr-only" />
      <span className="relative mt-0.5 h-6 w-11 shrink-0 rounded-full bg-line transition-colors peer-checked:bg-navy peer-focus-visible:ring-2 peer-focus-visible:ring-navy peer-focus-visible:ring-offset-2 after:absolute after:top-0.5 after:left-0.5 after:size-5 after:rounded-full after:bg-white after:shadow after:transition-transform peer-checked:after:translate-x-5" />
    </label>
  );
}

export function Notice({ children, tone = "success" }: { children: React.ReactNode; tone?: "success" | "error" }) {
  return (
    <p
      role="status"
      className={cn(
        "mb-6 rounded-xl px-4 py-3 text-sm",
        tone === "success" ? "bg-emerald-50 text-emerald-800" : "bg-apple-soft text-apple",
      )}
    >
      {children}
    </p>
  );
}
