import { useEffect, useRef, useState, type ReactNode } from "react";
import clsx from "clsx";
import { useReducedMotion } from "../../hooks/useReducedMotion";

export default function StoryReveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      setVisible(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      // Any overlap counts. Content parked at the very bottom of a one-screen
      // frame starts 24px lower than its resting place, so a stricter zone
      // (a threshold, or a negative bottom margin) would put it out of reach
      // and it would never appear.
      { threshold: 0, rootMargin: "0px 0px 4% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [reducedMotion]);

  return (
    <div
      ref={ref}
      className={clsx(
        "transition-all duration-[900ms] ease-out",
        visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
        className
      )}
      style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}
    >
      {children}
    </div>
  );
}
