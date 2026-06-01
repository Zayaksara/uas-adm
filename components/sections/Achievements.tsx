import { Trophy } from "lucide-react";
import type { Achievement } from "@/lib/data";
import { EmptyState } from "./Education";
import { Reveal } from "@/components/interactive/Reveal";

export default function AchievementsSection({
  items,
}: {
  items: Achievement[];
}) {
  return (
    <section id="prestasi" className="flex min-h-dvh flex-col justify-center px-6 py-24 lg:px-16">
      <div className="mx-auto w-full max-w-7xl">
        <Reveal>
          <h2 className="mb-2 inline-block border-2 border-nb-ink bg-nb-orange px-4 py-2 text-3xl font-extrabold nb-shadow">
            Prestasi
          </h2>
          <p className="mb-10 mt-4 text-zinc-700">
            Penghargaan dan pencapaian yang pernah saya raih.
          </p>
        </Reveal>

        {items.length === 0 ? (
          <EmptyState label="Belum ada data prestasi." />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((a, i) => (
              <Reveal
                as="article"
                key={a.id}
                delay={i * 80}
                className="nb-card nb-hover flex flex-col gap-3 p-6"
              >
                <span className="flex size-12 items-center justify-center border-2 border-nb-ink bg-nb-yellow">
                  <Trophy size={24} aria-hidden="true" />
                </span>
                <h3 className="text-lg font-extrabold leading-snug">{a.title}</h3>
                <div className="flex flex-wrap items-center gap-2 text-sm font-bold text-zinc-600">
                  <span>{a.issuer}</span>
                  <span className="nb-chip bg-nb-pink">{a.year}</span>
                </div>
                {a.description && (
                  <p className="text-sm text-zinc-700">{a.description}</p>
                )}
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
