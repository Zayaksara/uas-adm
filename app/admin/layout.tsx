import Link from "next/link";
import { auth } from "@/auth";
import { logoutAction } from "./actions";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <div className="min-h-screen bg-nb-cream">
      {session?.user && (
        <header className="sticky top-0 z-50 border-b-2 border-nb-ink bg-nb-yellow">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
            <Link href="/admin" className="text-xl font-extrabold">
              Admin Panel
            </Link>
            <div className="flex items-center gap-3">
              <Link href="/" className="font-bold underline-offset-4 hover:underline">
                Lihat Situs ↗
              </Link>
              <span className="hidden text-sm font-bold sm:inline">
                {session.user.name}
              </span>
              <form action={logoutAction}>
                <button className="nb-btn bg-nb-pink px-3 py-1.5 text-sm">
                  Logout
                </button>
              </form>
            </div>
          </div>
        </header>
      )}
      <div className="mx-auto max-w-5xl px-4 py-8">{children}</div>
    </div>
  );
}
