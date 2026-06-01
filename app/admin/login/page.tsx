"use client";

import { useActionState } from "react";
import { loginAction } from "../actions";

export default function LoginPage() {
  const [error, formAction, pending] = useActionState(loginAction, undefined);

  return (
    <main className="flex min-h-screen items-center justify-center bg-nb-cream px-4">
      <form
        action={formAction}
        className="nb-card-lg w-full max-w-sm space-y-5 bg-white p-8"
      >
        <div>
          <h1 className="text-3xl font-extrabold">Admin Login</h1>
          <p className="mt-1 text-sm text-zinc-600">Masuk untuk mengelola portofolio.</p>
        </div>

        {error && (
          <p className="border-2 border-nb-ink bg-nb-pink px-3 py-2 text-sm font-bold">
            {error}
          </p>
        )}

        <label className="block space-y-1">
          <span className="text-sm font-bold">Username</span>
          <input
            name="username"
            required
            autoComplete="username"
            className="w-full border-2 border-nb-ink px-3 py-2 outline-none focus:bg-nb-yellow/40"
          />
        </label>

        <label className="block space-y-1">
          <span className="text-sm font-bold">Password</span>
          <input
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="w-full border-2 border-nb-ink px-3 py-2 outline-none focus:bg-nb-yellow/40"
          />
        </label>

        <button
          type="submit"
          disabled={pending}
          className="nb-btn w-full bg-nb-green disabled:opacity-60"
        >
          {pending ? "Memproses..." : "Masuk"}
        </button>
      </form>
    </main>
  );
}
