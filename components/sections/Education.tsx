import { GraduationCap } from "lucide-react";
import type { Education } from "@/lib/data";
import { Reveal } from "@/components/interactive/Reveal";

export default function EducationSection({ items }: { items: Education[] }) {
  return (
    <section id="pendidikan" className="flex min-h-dvh flex-col justify-center px-6 py-24 lg:px-16">
      <div className="mx-auto w-full max-w-7xl">
        <Reveal>
          <h2 className="mb-2 inline-block border-2 border-nb-ink bg-nb-purple px-4 py-2 text-3xl font-extrabold nb-shadow">
            Riwayat Pendidikan
          </h2>
          <p className="mb-10 mt-4 text-zinc-700">
            Jenjang pendidikan yang telah dan sedang saya tempuh.
          </p>
        </Reveal>

        {items.length === 0 ? (
          <EmptyState label="Belum ada data pendidikan." />
        ) : (
          <ol className="space-y-6">
            {items.map((e, i) => (
              <Reveal
                as="li"
                key={e.id}
                delay={i * 80}
                className="nb-card nb-hover flex flex-col gap-2 p-6 sm:flex-row sm:items-start sm:gap-5"
              >
                <span className="flex size-12 shrink-0 items-center justify-center border-2 border-nb-ink bg-nb-green">
                  <GraduationCap size={24} aria-hidden="true" />
                </span>
                <div className="flex-1">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="text-xl font-extrabold">{e.institution}</h3>
                    <span className="nb-chip bg-nb-yellow">
                      {e.start_year} – {e.end_year ?? "Sekarang"}
                    </span>
                  </div>
                  <p className="mt-1 font-bold text-nb-pink">
                    {e.degree}
                    {e.field ? ` · ${e.field}` : ""}
                  </p>
                  {e.description && (
                    <p className="mt-2 text-zinc-700">{e.description}</p>
                  )}
                </div>
              </Reveal>
            ))}
          </ol>
        )}
      </div>
    </section>
  );
}

export function EmptyState({ label }: { label: string }) {
  return (
    <div className="nb-card bg-nb-cream p-6 text-center font-bold text-zinc-600">
      {label}
    </div>
  );
}
