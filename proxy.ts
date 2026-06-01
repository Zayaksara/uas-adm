import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

// Edge-safe auth (no DB/bcrypt) — protects /admin via the `authorized` callback.
// Next 16 renamed the "middleware" convention to "proxy".
export const { auth: proxy } = NextAuth(authConfig);
export default proxy;

export const config = {
  matcher: ["/admin/:path*"],
};
