import type { Hobby, Profile } from "@/lib/data";
import { Reveal } from "@/components/interactive/Reveal";

const MARKER_COLORS = ["bg-nb-blue", "bg-nb-green", "bg-nb-orange", "bg-nb-pink"];

export default function AboutSection({
  profile,
  hobbies,
}: {
  profile: Profile;
  hobbies: Hobby[];
}) {
  return (
    <section
      id="tentang"
      className="flex min-h-dvh flex-col justify-center border-t-2 border-nb-ink bg-nb-purple px-6 py-24 lg:px-16"
    >
      <div className="mx-auto w-full max-w-7xl">
        <Reveal>
          <h2 className="mb-2 inline-block border-2 border-nb-ink bg-white px-4 py-2 text-3xl font-extrabold nb-shadow">
            Tentang Saya
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-8 md:grid-cols-[1.2fr_1fr]">
          <Reveal className="nb-card nb-hover bg-white p-6">
            <p className="text-lg leading-relaxed text-zinc-800">
              {profile.bio}
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3 text-sm font-bold">
              <InfoRow label="Email" value={profile.email} />
              <InfoRow label="Telepon" value={profile.phone} />
              <InfoRow label="Lokasi" value={profile.location} />
            </div>
          </Reveal>

          <Reveal delay={120} className="nb-card nb-hover bg-nb-yellow p-6">
            <h3 className="mb-4 text-lg font-extrabold uppercase tracking-wide">
              Hobi &amp; Minat
            </h3>
            {hobbies.length === 0 ? (
              <p className="font-bold text-zinc-700">Belum ada data hobi.</p>
            ) : (
              <ul className="space-y-3">
                {hobbies.map((h, i) => (
                  <li
                    key={h.id}
                    className="flex items-start gap-3 border-2 border-nb-ink bg-white p-3"
                  >
                    <span
                      aria-hidden="true"
                      className={`mt-1 size-4 shrink-0 border-2 border-nb-ink ${MARKER_COLORS[i % MARKER_COLORS.length]}`}
                    />
                    <div>
                      <p className="font-extrabold">{h.name}</p>
                      {h.description && (
                        <p className="text-sm text-zinc-700">{h.description}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-2 border-nb-ink bg-nb-cream p-2">
      <p className="text-xs uppercase text-zinc-500">{label}</p>
      <p className="wrap-break-words">{value}</p>
    </div>
  );
}
