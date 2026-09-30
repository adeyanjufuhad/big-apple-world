"use client";

import { PasswordInput } from "@/components/password-input";
import { useActionState } from "react";
import { signIn } from "../actions";

export function LoginForm() {
  const [state, action, pending] = useActionState(signIn, null);
  return (
    <form action={action} className="space-y-4">
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium">Email</span>
        <input name="email" type="email" autoComplete="email" required className="field" />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium">Password</span>
        <PasswordInput name="password" autoComplete="current-password" required />
      </label>
      {state?.error && <p className="text-sm text-apple">{state.error}</p>}
      <button
        disabled={pending}
        className="h-11 w-full rounded-full bg-ink text-sm font-medium text-white transition-colors hover:bg-navy disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
