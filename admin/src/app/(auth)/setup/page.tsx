import Link from "next/link";
import { AuthShell } from "../auth-shell";
import { SetupForm } from "./setup-form";

export const metadata = { title: "Set up" };

export default function SetupPage() {
  return (
    <AuthShell title="Set up the owner account" subtitle="Only emails approved by your developer can create an account.">
      <SetupForm />
      <p className="mt-8 text-center text-sm text-muted">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-navy hover:underline">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}
