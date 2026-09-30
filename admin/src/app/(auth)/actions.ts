"use server";

import { HONEYPOT_FIELD } from "@/components/honeypot";
import { auth, isAllowedEmail } from "@/lib/auth/server";
import { allowAttempt, requestIp } from "@/lib/security";
import { redirect } from "next/navigation";

type State = { error: string } | null;

const TOO_MANY = "Too many attempts. Please wait 15 minutes and try again.";

/** Hidden honeypot field: people never see it, form-filling bots do. */
function isBot(formData: FormData) {
  const tripped = String(formData.get(HONEYPOT_FIELD) ?? "") !== "";
  if (tripped) console.warn("Admin form rejected: honeypot field was filled");
  return tripped;
}

export async function signIn(_prev: State, formData: FormData): Promise<State> {
  const email = String(formData.get("email") ?? "").trim().slice(0, 254);
  const password = String(formData.get("password") ?? "").slice(0, 256);
  if (isBot(formData)) return { error: "Wrong email or password." };
  if (!email || !password) return { error: "Enter your email and password." };

  // 10 tries per IP and 5 per account every 15 minutes.
  const ip = await requestIp();
  const [ipOk, emailOk] = await Promise.all([
    allowAttempt("login-ip", ip, 900, 10),
    allowAttempt("login-email", email, 900, 5),
  ]);
  if (!ipOk || !emailOk) return { error: TOO_MANY };

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
  const name = String(formData.get("name") ?? "").trim().slice(0, 80);
  const email = String(formData.get("email") ?? "").trim().slice(0, 254);
  const password = String(formData.get("password") ?? "").slice(0, 256);

  if (isBot(formData)) return { error: "Couldn’t create the account." };
  if (!(await allowAttempt("setup-ip", await requestIp(), 3600, 5))) return { error: TOO_MANY };
  if (!name || !email) return { error: "Enter your name and email." };
  if (!isAllowedEmail(email)) return { error: "This email isn’t on the admin list. Ask your developer to add it." };
  if (password.length < 10) return { error: "Use a password of at least 10 characters." };
  if (password !== formData.get("confirm")) return { error: "The passwords don’t match." };

  const { error } = await auth.signUp.email({ name, email, password });
  if (error) {
    const exists = /exist|already/i.test(error.message ?? "");
    return { error: exists ? "An account with this email already exists — sign in instead." : "Couldn’t create the account." };
  }
  redirect("/");
}

export async function signOut() {
  await auth.signOut();
  redirect("/login");
}
