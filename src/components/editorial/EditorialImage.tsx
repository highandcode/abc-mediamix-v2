import type { ReactNode } from "react";
import clsx from "clsx";

/**
 * Centralized placeholder "photography" — abstract gradient + line-etch
 * plates, following the same technique the homepage already uses (Hero,
 * Work) in place of stock photography. Swap `TONES` for real campaign
 * imagery when available.
 */
export const TONES = [
  "linear-gradient(155deg,#1a1c4a 0%,#262970 55%,#3e3e3e 100%)",
  "linear-gradient(155deg,#9f732c 0%,#4a3a1f 65%,#262970 100%)",
  "linear-gradient(155deg,#faf8f3 0%,#ece6d9 50%,#c7bda3 100%)",
  "linear-gradient(155deg,#1a1c4a 0%,#262970 60%,#3e3e3e 100%)",
  "linear-gradient(155deg,#c79a5c 0%,#3e3e3e 55%,#262970 100%)",
];

export default function EditorialImage({
  tone = 0,
  ratio = "aspect-[4/5]",
  className,
  caption,
  children,
}: {
  tone?: number;
  ratio?: string;
  className?: string;
  caption?: string;
  children?: ReactNode;
}) {
  const light = tone === 2;
  return (
    <figure className={clsx("m-0", className)}>
      <div
        className={clsx("relative h-full w-full overflow-hidden border border-ink/10", ratio)}
        style={{ background: TONES[tone % TONES.length] }}
      >
        <svg
          className="absolute inset-0 h-full w-full opacity-[0.18]"
          viewBox="0 0 400 500"
          preserveAspectRatio="none"
          fill="none"
          aria-hidden="true"
        >
          {[40, 130, 220, 310].map((x, i) => (
            <path
              key={x}
              d={`M${x},0 C${x - 50},170 ${x + 50},330 ${x - 15},500`}
              stroke={light ? "rgba(62,62,62,0.4)" : "rgba(244,241,234,0.5)"}
              strokeWidth={i % 2 === 0 ? 1.2 : 0.7}
            />
          ))}
        </svg>
        {children}
      </div>
      {caption && (
        <figcaption className="mt-3 flex items-baseline gap-3 text-[11px] uppercase tracking-wide-label text-ink-soft/70">
          <span className="h-px w-4 bg-gold/50" />
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
