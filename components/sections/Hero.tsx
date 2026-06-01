import { Mail, ArrowUpRight, MapPin } from "lucide-react";
import type { Profile } from "@/lib/data";
import { Reveal } from "@/components/interactive/Reveal";
import { Decor } from "@/components/interactive/Decor";

export default function Hero({ profile }: { profile: Profile }) {
  const initials = profile.full_name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  const hasGithub = profile.github_url && profile.github_url !== "#";
  const hasLinkedin = profile.linkedin_url && profile.linkedin_url !== "#";

  return (
    <section
      id="home"
      className="relative flex min-h-dvh items-center overflow-hidden border-b-2 border-nb-ink bg-nb-cream px-6 py-24 lg:px-16"
    >
      {/* Decorative shapes (purely visual, playful) */}
      <Decor shape="circle" color="bg-nb-blue" float className="left-[4%] top-[14%] size-16" />
      <Decor shape="square" color="bg-nb-pink" rotate={12} float className="right-[6%] top-[12%] size-12" />
      <Decor shape="triangle" color="bg-nb-green" float className="bottom-[10%] left-[8%] size-10" />
      <Decor shape="square" color="bg-nb-purple" rotate={-14} className="left-[42%] top-[8%] size-8" />
      <Decor shape="circle" color="bg-nb-orange" float className="bottom-[16%] right-[10%] size-14" />
      <Decor shape="triangle" color="bg-nb-yellow" rotate={20} className="right-[44%] bottom-[8%] size-9" />
      <Decor shape="square" color="bg-nb-green" rotate={8} float className="left-[2%] bottom-[34%] size-7" />

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-12 md:grid-cols-[1fr_1.1fr]">
        <Reveal className="space-y-6">
          {/* Availability badge — blinking dot, no emoji */}
          <span className="nb-chip bg-nb-green">
            <span className="size-2 rounded-full bg-nb-ink nb-blink" />
            Tersedia untuk berkolaborasi
          </span>

          <h1 className="text-[clamp(2.25rem,6vw,4.5rem)] font-extrabold leading-[1.05] tracking-tight">
            {profile.full_name}
          </h1>
          <p className="text-xl font-bold text-nb-pink">{profile.headline}</p>
          <p className="max-w-xl text-lg leading-relaxed text-zinc-700">
            {profile.tagline}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <a href="#tentang" className="nb-btn bg-nb-yellow nb-focus">
              Tentang Saya
            </a>
            <a
              href={`mailto:${profile.email}`}
              className="nb-btn bg-white nb-focus"
            >
              <Mail size={18} aria-hidden="true" /> Kontak
            </a>
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-2 text-sm font-semibold">
            <span className="inline-flex items-center gap-1.5">
              <MapPin size={16} aria-hidden="true" /> {profile.location}
            </span>
            {hasGithub && (
              <a
                href={profile.github_url}
                className="inline-flex items-center gap-1 underline-offset-4 hover:underline nb-focus"
              >
                GitHub <ArrowUpRight size={15} aria-hidden="true" />
              </a>
            )}
            {hasLinkedin && (
              <a
                href={profile.linkedin_url}
                className="inline-flex items-center gap-1 underline-offset-4 hover:underline nb-focus"
              >
                LinkedIn <ArrowUpRight size={15} aria-hidden="true" />
              </a>
            )}
          </div>
        </Reveal>

        {/* Avatar */}
        <Reveal delay={120} className="justify-self-center md:justify-self-end">
          <div className="relative">
            {/* Offset accent block behind the photo for depth */}
            <span
              aria-hidden="true"
              className="absolute -right-4 -top-4 hidden size-full border-2 border-nb-ink bg-nb-pink lg:block"
            />
            <div className="nb-card-lg nb-hover relative flex aspect-square w-[78vw] max-w-sm items-center justify-center overflow-hidden bg-nb-blue text-8xl font-extrabold sm:w-[60vw] md:w-full md:max-w-md lg:h-[72vh] lg:w-[72vh] lg:max-w-none">
              {profile.photo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.photo_url}
                  alt={`Foto ${profile.full_name}`}
                  className="size-full object-cover"
                />
              ) : (
                <span aria-hidden="true">{initials}</span>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
