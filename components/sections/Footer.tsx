import type { Profile } from "@/lib/data";

export default function Footer({ profile }: { profile: Profile }) {
  return (
    <footer className="border-t-2 border-nb-ink bg-nb-ink px-6 py-8 text-white lg:px-16">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 sm:flex-row">
        <p className="font-bold">
          © {new Date().getFullYear()} {profile.full_name}
        </p>
        <p className="text-sm text-zinc-400">
          Dibuat dengan Cinta oleh {profile.full_name}
        </p>
      </div>
    </footer>
  );
}
