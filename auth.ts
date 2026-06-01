import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import type { RowDataPacket } from "mysql2";
import { authConfig } from "@/auth.config";
import { query } from "@/lib/db";

interface AdminRow extends RowDataPacket {
  id: number;
  username: string;
  password_hash: string;
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const username = String(credentials?.username ?? "");
        const password = String(credentials?.password ?? "");
        if (!username || !password) return null;

        const rows = await query<AdminRow>(
          "SELECT id, username, password_hash FROM admin WHERE username = ? LIMIT 1",
          [username],
        );
        const admin = rows[0];
        if (!admin) return null;

        const ok = await bcrypt.compare(password, admin.password_hash);
        if (!ok) return null;

        return { id: String(admin.id), name: admin.username };
      },
    }),
  ],
});
