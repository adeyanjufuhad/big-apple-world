"use client";

import { PasswordInput } from "@/components/password-input";
import { useActionState } from "react";
import { createOwner } from "../actions";

export function SetupForm() {
  const [state, action, pending] = useActionState(createOwner, null);
  return (
    <form action={action} className="space-y-4">
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium">Your name</span>
        <input name="name" autoComplete="name" required className="field" />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium">Email</span>
        <input name="email" type="email" autoComplete="email" required className="field" />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium">Password</span>
        <PasswordInput name="password" autoComplete="new-password" minLength={8} required />
        <span className="mt-1 block text-xs text-muted">At least 8 characters.</span>
      </label>
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium">Confirm password</span>
        <PasswordInput name="confirm" autoComplete="new-password" minLength={8} required />
      </label>
      {state?.error && <p className="text-sm text-apple">{state.error}</p>}
      <button
        disabled={pending}
        className="h-11 w-full rounded-full bg-ink text-sm font-medium text-white transition-colors hover:bg-navy disabled:opacity-60"
      >
        {pending ? "Creating account…" : "Create account"}
      </button>
    </form>
  );
}
