import { auth } from "@/lib/auth/server";

// Redirects signed-out visitors to /login. The email allowlist is enforced in
// requireAdmin() on every page and action.
export default auth.middleware({ loginUrl: "/login" });

export const config = {
  matcher: ["/((?!login|setup|api/auth|_next|icon|logo|manifest|favicon).*)"],
};
