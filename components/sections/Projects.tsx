import { ArrowUpRight, Code } from "lucide-react";
import type { Project } from "@/lib/data";
import { EmptyState } from "./Education";
import { Reveal } from "@/components/interactive/Reveal";

function StatusBadge({ status }: { status: Project["status"] }) {
  const ongoing = status === "ongoing";
  return (
    <span
      className={`nb-chip ${ongoing ? "bg-nb-green" : "bg-nb-blue"}`}
    >
      {ongoing && <span className="size-2 rounded-full bg-nb-ink nb-blink" />}
      {ongoing ? "Sedang Berjalan" : "Selesai"}
    </span>
  );
}

export default function ProjectsSection({ items }: { items: Project[] }) {
  return (
    <section
      id="project"
      className="flex min-h-dvh flex-col justify-center border-t-2 border-nb-ink bg-white px-6 py-24 lg:px-16"
    >
      <div className="mx-auto w-full max-w-7xl">
        <Reveal>
          <h2 className="mb-2 inline-block border-2 border-nb-ink bg-nb-orange px-4 py-2 text-3xl font-extrabold nb-shadow">
            Project
          </h2>
          <p className="mb-10 mt-4 text-zinc-700">
            Beberapa project yang sedang berjalan dan telah selesai.
          </p>
        </Reveal>

        {items.length === 0 ? (
          <EmptyState label="Belum ada data project." />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((p, i) => (
              <Reveal
                as="article"
                key={p.id}
                delay={i * 90}
                className="nb-card nb-hover group flex flex-col overflow-hidden"
              >
                {/* Image / placeholder */}
                <div className="relative aspect-4/3 overflow-hidden border-b-2 border-nb-ink bg-nb-cream">
                  {p.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.image_url}
                      alt={`Pratinjau ${p.title}`}
                      className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center text-5xl font-extrabold text-nb-ink/15">
                      {p.title.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="absolute left-3 top-3">
                    <StatusBadge status={p.status} />
                  </span>
                </div>

                {/* Body */}
                <div className="flex flex-1 flex-col gap-3 p-5">
                  <h3 className="text-lg font-extrabold leading-snug">{p.title}</h3>
                  <p className="flex-1 text-sm text-zinc-700">{p.description}</p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {p.demo_url && p.demo_url !== "#" && (
                      <a href={p.demo_url} className="nb-btn bg-nb-yellow px-3 py-1.5 text-sm nb-focus">
                        Demo <ArrowUpRight size={15} aria-hidden="true" />
                      </a>
                    )}
                    {p.repo_url && p.repo_url !== "#" && (
                      <a href={p.repo_url} className="nb-btn bg-white px-3 py-1.5 text-sm nb-focus">
                        <Code size={15} aria-hidden="true" /> Kode
                      </a>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
