/**
 * Decorative neo-brutalist shapes (square outline + hard shadow + flat color).
 * Purely visual → aria-hidden + pointer-events-none so they never block UI.
 * `float` adds a gentle bob (disabled under prefers-reduced-motion via CSS).
 */
type Shape = "square" | "circle" | "triangle";

export function Decor({
  shape = "square",
  className = "",
  color = "bg-nb-blue",
  rotate = 0,
  float = false,
}: {
  shape?: Shape;
  className?: string;
  color?: string;
  rotate?: number;
  float?: boolean;
}) {
  const base = "border-2 border-nb-ink nb-shadow";
  const shapeCls =
    shape === "circle" ? "rounded-full" : shape === "triangle" ? "[clip-path:polygon(50%_0,100%_100%,0_100%)]" : "";

  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute ${float ? "nb-float" : ""} ${className}`}
      style={{ ["--nb-rot" as string]: `${rotate}deg`, transform: `rotate(${rotate}deg)` }}
    >
      <span className={`block size-full ${base} ${color} ${shapeCls}`} />
    </span>
  );
}
