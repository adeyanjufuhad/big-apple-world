import { buttonClass } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-28 text-center">
      <p className="font-display text-7xl text-apple">404</p>
      <h1 className="mt-4 text-2xl font-semibold">We couldn’t find that page</h1>
      <p className="mt-2 text-muted">It may have moved, or the product is no longer listed.</p>
      <Link href="/shop" className={buttonClass("primary", "lg", "mt-8")}>
        Browse the shop
      </Link>
    </div>
  );
}
