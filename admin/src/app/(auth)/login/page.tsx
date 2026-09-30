import Link from "next/link";
import { AuthShell } from "../auth-shell";
import { LoginForm } from "./login-form";

export const metadata = { title: "Sign in" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return (
    <AuthShell title="Welcome back" subtitle="Sign in to manage Big Apple World.">
      {error === "not-allowed" && (
        <p className="mb-5 rounded-xl bg-apple-soft px-4 py-3 text-sm text-apple">
          That account doesn’t have admin access.
        </p>
      )}
      <LoginForm />
      <p className="mt-8 text-center text-sm text-muted">
        First time here?{" "}
        <Link href="/setup" className="font-medium text-navy hover:underline">
          Set up the owner account
        </Link>
      </p>
    </AuthShell>
  );
}
