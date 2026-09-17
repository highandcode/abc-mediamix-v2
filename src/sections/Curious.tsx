import { useCallback, useRef, useState } from "react";

const HEADLINE = "We don't just make the idea. We make people feel it.";

export default function Curious() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [reveal, setReveal] = useState(28);

  const updateFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setReveal(Math.min(100, Math.max(0, pct)));
  }, []);

  return (
    <section id="curious" className="relative overflow-hidden bg-ivory px-6 py-28 lg:py-36">
      <div className="mx-auto max-w-4xl text-center">
        <p className="text-[11px] font-semibold tracking-[0.3em] text-gold">LOOK CLOSER.</p>
        <p className="mt-2 text-xs text-ink-soft">There&apos;s more to this story &mdash; drag to reveal it.</p>

        <div
          ref={containerRef}
          onMouseMove={(e) => updateFromClientX(e.clientX)}
          onTouchMove={(e) => updateFromClientX(e.touches[0].clientX)}
          onMouseLeave={() => setReveal(28)}
          className="relative mt-10 cursor-none select-none py-6"
        >
          <h2 className="font-display text-3xl font-extrabold uppercase leading-tight tracking-tight text-ink/15 sm:text-5xl">
            {HEADLINE}
          </h2>
          <h2
            aria-hidden="true"
            className="absolute inset-0 top-6 font-display text-3xl font-extrabold uppercase leading-tight tracking-tight text-ink sm:text-5xl"
            style={{ clipPath: `inset(0 ${100 - reveal}% 0 0)` }}
          >
            {HEADLINE.split(" ").map((word, i) =>
              i % 3 === 0 ? (
                <span key={i} className="text-gold">
                  {word}{" "}
                </span>
              ) : (
                `${word} `
              )
            )}
          </h2>

          <div
            className="pointer-events-none absolute top-0 h-full w-px bg-gold/60"
            style={{ left: `${reveal}%` }}
          >
            <span className="absolute left-1/2 top-1/2 h-9 w-9 -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold/60 bg-paper" />
          </div>
        </div>
      </div>
    </section>
  );
}
