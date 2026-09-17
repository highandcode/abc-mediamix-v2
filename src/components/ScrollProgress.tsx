import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "../lib/gsap";

const SCENES = ["01", "02", "03", "04", "05", "06", "07", "08"];

export default function ScrollProgress() {
  const fillRef = useRef<SVGRectElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fill = fillRef.current;
    const dot = dotRef.current;
    const track = trackRef.current;
    if (!fill || !dot || !track) return;

    const trigger = ScrollTrigger.create({
      start: 0,
      end: () => document.documentElement.scrollHeight - window.innerHeight,
      onUpdate: (self) => {
        const h = track.clientHeight;
        gsap.set(fill, { attr: { height: h * self.progress } });
        gsap.set(dot, { y: h * self.progress });
      },
    });

    return () => trigger.kill();
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center gap-3 lg:flex"
    >
      <span className="text-[10px] tracking-wide-label text-ink-soft">01</span>
      <div ref={trackRef} className="relative h-[38vh] w-px bg-ink/10">
        <svg width="1" height="100%" className="absolute inset-0 overflow-visible">
          <rect
            ref={fillRef}
            x="0"
            y="0"
            width="1"
            height="0"
            fill="var(--color-gold)"
          />
        </svg>
        <div
          ref={dotRef}
          className="absolute -left-[3px] top-0 h-[7px] w-[7px] rounded-full bg-gold shadow-[0_0_8px_rgba(159,115,44,0.6)]"
        />
      </div>
      <span className="text-[10px] tracking-wide-label text-ink-soft">{SCENES.length.toString().padStart(2, "0")}</span>
    </div>
  );
}
