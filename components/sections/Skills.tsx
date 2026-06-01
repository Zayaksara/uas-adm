import type { Skill } from "@/lib/data";
import { EmptyState } from "./Education";
import { Reveal } from "@/components/interactive/Reveal";

const CARD_COLORS = ["bg-nb-blue", "bg-nb-green", "bg-nb-orange", "bg-nb-pink"];

export default function SkillsSection({ items }: { items: Skill[] }) {
  // Group skills by category
  const groups = items.reduce<Record<string, Skill[]>>((acc, s) => {
    (acc[s.category] ??= []).push(s);
    return acc;
  }, {});
  const categories = Object.keys(groups);

  return (
    <section id="skills" className="flex min-h-dvh flex-col justify-center border-y-2 border-nb-ink bg-nb-cream px-6 py-24 lg:px-16">
      <div className="mx-auto w-full max-w-7xl">
        <Reveal>
          <h2 className="mb-2 inline-block border-2 border-nb-ink bg-nb-blue px-4 py-2 text-3xl font-extrabold nb-shadow">
            Skills
          </h2>
          <p className="mb-10 mt-4 text-zinc-700">
            Teknologi dan kemampuan yang saya kuasai.
          </p>
        </Reveal>

        {items.length === 0 ? (
          <EmptyState label="Belum ada data skill." />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat, i) => (
              <Reveal
                key={cat}
                delay={i * 80}
                className={`nb-card nb-hover p-6 ${CARD_COLORS[i % CARD_COLORS.length]}`}
              >
                <h3 className="mb-4 text-lg font-extrabold uppercase tracking-wide">
                  {cat}
                </h3>
                <ul className="space-y-4">
                  {groups[cat].map((s) => (
                    <li key={s.id}>
                      <div className="mb-1 flex items-center justify-between text-sm font-bold">
                        <span>{s.name}</span>
                        <span>{s.level}%</span>
                      </div>
                      <div className="h-4 w-full border-2 border-nb-ink bg-white">
                        <div
                          className="h-full bg-nb-ink"
                          style={{ width: `${Math.min(100, Math.max(0, s.level))}%` }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
