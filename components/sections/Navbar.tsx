"use client";

import { useEffect, useState } from "react";

const links = [
  { id: "home", label: "Home" },
  { id: "pendidikan", label: "Pendidikan" },
  { id: "skills", label: "Skills" },
  { id: "project", label: "Project" },
  { id: "prestasi", label: "Prestasi" },
  { id: "tentang", label: "Tentang" },
];

export default function Navbar({ name }: { name: string }) {
  const [active, setActive] = useState("home");
  const [open, setOpen] = useState(false);

  // Scroll-spy: highlight the section currently in view.
  useEffect(() => {
    const sections = links
      .map((l) => document.getElementById(l.id))
      .filter(Boolean) as HTMLElement[];

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b-2 border-nb-ink bg-nb-yellow">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3 lg:px-16">
        <a href="#home" className="text-xl font-extrabold tracking-tight nb-focus">
          {name.split(" ")[1] || "Portofolio"}
          <span className="text-nb-pink">.</span>
        </a>

        {/* Desktop links */}
        <ul className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <li key={l.id}>
              <a
                href={`#${l.id}`}
                aria-current={active === l.id ? "true" : undefined}
                className={`block border-2 px-3 py-1.5 font-bold transition-colors nb-focus ${
                  active === l.id
                    ? "border-nb-ink bg-nb-ink text-white"
                    : "border-transparent hover:bg-white"
                }`}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Mobile toggle (icon-free, uses a bold label per design tone) */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          className="nb-btn bg-white px-3 py-1.5 text-sm md:hidden"
        >
          {open ? "Tutup" : "Menu"}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <ul
          id="mobile-menu"
          className="border-t-2 border-nb-ink bg-nb-yellow px-4 py-2 md:hidden"
        >
          {links.map((l) => (
            <li key={l.id}>
              <a
                href={`#${l.id}`}
                onClick={() => setOpen(false)}
                aria-current={active === l.id ? "true" : undefined}
                className={`block border-b-2 border-nb-ink/20 py-3 font-bold nb-focus ${
                  active === l.id ? "text-nb-pink" : ""
                }`}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
