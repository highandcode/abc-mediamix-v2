import { useEffect, useId, useRef } from "react";
import { gsap, ScrollTrigger } from "../../lib/gsap";
import { infinityPath, prepareDraw } from "../../lib/paths";
import { useReducedMotion } from "../../hooks/useReducedMotion";

type GoldThreadProps = {
  /** "vertical" travels top-to-bottom as a spine; "loop" draws a small infinity accent. */
  variant?: "vertical" | "loop";
  height?: string;
  className?: string;
  opacity?: number;
};

/**
 * The homepage's gold-string motif, continued into the inner pages as a
 * recurring "editorial spine" — draws on as the visitor scrolls past it.
 */
export default function GoldThread({
  variant = "vertical",
  height = "100%",
  className = "",
  opacity = 0.55,
}: GoldThreadProps) {
  const pathRef = useRef<SVGPathElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const gradientId = useId();

  useEffect(() => {
    const path = pathRef.current;
    const wrap = wrapRef.current;
    if (!path || !wrap) return;

    if (reducedMotion) {
      path.style.strokeDasharray = "none";
      gsap.set(path, { opacity });
      return;
    }

    prepareDraw(path);
    gsap.set(path, { opacity });

    const ctx = gsap.context(() => {
      gsap.to(path, {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: {
          trigger: wrap,
          start: "top 90%",
          end: "bottom 45%",
          scrub: 0.6,
        },
      });
    }, wrap);

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      ctx.revert();
    };
  }, [reducedMotion, opacity]);

  if (variant === "loop") {
    const d = infinityPath(60, 30, 90, 40, 100);
    return (
      <div ref={wrapRef} className={className} aria-hidden="true">
        <svg viewBox="0 0 120 60" className="h-auto w-full overflow-visible">
          <path
            ref={pathRef}
            d={d}
            fill="none"
            stroke="var(--color-gold)"
            strokeWidth="1.25"
            strokeLinecap="round"
          />
        </svg>
      </div>
    );
  }

  return (
    <div ref={wrapRef} className={className} style={{ height }} aria-hidden="true">
      <svg
        viewBox="0 0 24 400"
        preserveAspectRatio="none"
        className="h-full w-6 overflow-visible"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-gold)" stopOpacity="0" />
            <stop offset="12%" stopColor="var(--color-gold)" stopOpacity="1" />
            <stop offset="88%" stopColor="var(--color-gold)" stopOpacity="1" />
            <stop offset="100%" stopColor="var(--color-gold)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          ref={pathRef}
          d="M12,0 C4,60 20,120 12,180 C4,240 20,300 12,400"
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
