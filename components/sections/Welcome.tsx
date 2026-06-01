import { ArrowDown } from "lucide-react";
import { Decor } from "@/components/interactive/Decor";
import { Reveal } from "@/components/interactive/Reveal";

/**
 * Full-screen intro / CTA splash. Big animated wordmark, decorative shapes,
 * and a scroll cue. The first thing the visitor sees.
 */
export default function Welcome({ name }: { name: string }) {
  return (
    <section
      id="welcome"
      className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden border-b-2 border-nb-ink bg-nb-yellow px-4 text-center"
    >
      {/* Decorative shapes scattered around */}
      <Decor shape="circle" color="bg-nb-blue" float className="left-[10%] top-[15%] size-16" />
      <Decor shape="square" color="bg-nb-pink" rotate={18} className="right-[12%] top-[20%] size-12" />
      <Decor shape="triangle" color="bg-nb-green" float className="bottom-[18%] right-[16%] size-14" />
      <Decor shape="square" color="bg-nb-purple" rotate={-10} float className="bottom-[22%] left-[14%] size-10" />

      <div className="relative">
        <Reveal>
          <p className="mb-4 inline-block border-2 border-nb-ink bg-white px-4 py-1.5 text-sm font-bold uppercase tracking-[0.3em] nb-shadow">
            Selamat Datang
          </p>
        </Reveal>

        <Reveal delay={120}>
          <h1 className="text-[clamp(2.5rem,11vw,8rem)] font-extrabold uppercase leading-[0.92] tracking-tighter">
            <span className="block">Welcome to</span>
            <span className="mt-2 block bg-nb-ink px-4 text-white">My Portofolio</span>
          </h1>
        </Reveal>

        <Reveal delay={240}>
          <p className="mx-auto mt-6 max-w-md text-lg font-semibold text-zinc-800">
            Halo, saya <span className="text-nb-pink">{name}</span>. Mari jelajahi
            karya, perjalanan, dan apa yang sedang saya kerjakan.
          </p>
        </Reveal>

        <Reveal delay={360}>
          <a href="#home" className="nb-btn mt-8 bg-white nb-focus">
            Mulai Jelajah
          </a>
        </Reveal>
      </div>

      {/* Scroll cue */}
      <a
        href="#home"
        aria-label="Gulir ke bawah"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 nb-focus"
      >
        <span className="flex size-11 items-center justify-center border-2 border-nb-ink bg-white nb-shadow nb-float">
          <ArrowDown size={20} aria-hidden="true" />
        </span>
      </a>
    </section>
  );
}
