"use server";

import { auth, isAllowedEmail } from "@/lib/auth/server";
import { redirect } from "next/navigation";

type State = { error: string } | null;

export async function signIn(_prev: State, formData: FormData): Promise<State> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "Enter your email and password." };

  const { error } = await auth.signIn.email({ email, password });
  if (error) return { error: "Wrong email or password." };

  if (!isAllowedEmail(email)) {
    await auth.signOut();
    return { error: "This account doesn’t have admin access." };
  }
  redirect("/");
}

/** First-time setup: creates the owner's account. Only emails on ADMIN_EMAILS can register. */
export async function createOwner(_prev: State, formData: FormData): Promise<State> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!name || !email) return { error: "Enter your name and email." };
  if (!isAllowedEmail(email)) return { error: "This email isn’t on the admin list. Ask your developer to add it." };
  if (password.length < 8) return { error: "Use a password of at least 8 characters." };
  if (password !== formData.get("confirm")) return { error: "The passwords don’t match." };

  const { error } = await auth.signUp.email({ name, email, password });
  if (error) {
    const exists = /exist|already/i.test(error.message ?? "");
    return { error: exists ? "An account with this email already exists — sign in instead." : error.message || "Couldn’t create the account." };
  }
  redirect("/");
}

export async function signOut() {
  await auth.signOut();
  redirect("/login");
}
