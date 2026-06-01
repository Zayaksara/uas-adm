/**
 * Seamless marquee banner (pure CSS, no JS). The items are rendered twice
 * so the -50% keyframe loops without a visible jump. Decorative → aria-hidden.
 */
export function Marquee({ items }: { items: string[] }) {
  const row = [...items, ...items];
  return (
    <div
      aria-hidden="true"
      className="marquee-mask overflow-hidden border-y-2 border-nb-ink bg-nb-yellow py-3 select-none"
    >
      <div className="marquee-track">
        {row.map((text, i) => (
          <span key={i} className="mx-6 text-lg font-extrabold uppercase tracking-tight">
            {text}
            <span className="mx-6 text-nb-pink">/</span>
          </span>
        ))}
      </div>
    </div>
  );
}
