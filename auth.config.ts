import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe config (no DB / bcrypt here) so it can run inside middleware.
 * The Credentials provider with DB access lives in auth.ts.
 */
export const authConfig = {
  trustHost: true,
  session: { strategy: "jwt" },
  pages: { signIn: "/admin/login" },
  providers: [],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = nextUrl;
      const isLogin = pathname === "/admin/login";
      const isAdminArea = pathname.startsWith("/admin");

      if (isAdminArea && !isLogin) return isLoggedIn; // require auth
      if (isLogin && isLoggedIn) {
        return Response.redirect(new URL("/admin", nextUrl));
      }
      return true;
    },
  },
} satisfies NextAuthConfig;
