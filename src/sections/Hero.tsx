import { useEffect, useRef } from "react";
import { gsap } from "../lib/gsap";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { useLenisScrollTo } from "../hooks/useLenisScrollTo";
import { requestSectionById } from "../lib/sectionNavigator";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const clothRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const paraRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);
  const reducedMotion = useReducedMotion();
  const scrollTo = useLenisScrollTo();

  // Hero is already on screen at load, so its own reveal plays
  // autonomously on mount rather than waiting for a scroll trigger. The
  // visual panel is left out of this timeline — it's already owned by the
  // scroll-parallax tween below, and fighting that tween for the same
  // properties (opacity/y/scale) would make GSAP's overwrite manager kill
  // one of the two.
  useEffect(() => {
    if (reducedMotion) return;
    const headline = headlineRef.current;
    const para = paraRef.current;
    const cta = ctaRef.current;
    if (!headline || !para || !cta) return;

    const ctx = gsap.context(() => {
      gsap.set([headline, para, cta], { opacity: 0, y: 16 });

      gsap
        .timeline({ delay: 0.1 })
        .to(headline, { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }, 0)
        .to(para, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, 0.35)
        .to(cta, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, 0.5);
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  useEffect(() => {
    if (reducedMotion) return;
    const cloth = clothRef.current;
    const section = sectionRef.current;
    if (!cloth || !section) return;

    const ctx = gsap.context(() => {
      gsap.to(cloth, {
        yPercent: -6,
        scale: 0.94,
        opacity: 0.35,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: 0.6,
        },
      });
    }, section);

    return () => ctx.revert();
  }, [reducedMotion]);

  const scrollToNext = () => {
    if (requestSectionById("something-coming")) return;
    const next = document.getElementById("something-coming");
    if (next) scrollTo(next);
  };

  return (
    <section
      id="top"
      ref={sectionRef}
      className="relative flex min-h-[100svh] items-center overflow-hidden bg-ivory pt-24 pb-16 short:min-h-0 short:pt-20 short:pb-6 lg:pt-32"
    >
      <div className="mx-auto grid w-full max-w-[1440px] grid-cols-1 items-center gap-16 px-6 short:grid-cols-1 short:gap-6 lg:grid-cols-2 lg:gap-12 lg:px-12">
        {/* Left: headline */}
        <div className="max-w-xl">
          <h1
            ref={headlineRef}
            className="font-display text-[13vw] font-extrabold uppercase leading-[0.95] tracking-tight text-ink short:text-4xl sm:text-6xl lg:text-6xl xl:text-7xl"
          >
            What if
            <br />
            one idea could
            <br />
            change <span className="text-gold">everything?</span>
          </h1>

          <p ref={paraRef} className="mt-6 max-w-sm text-base leading-relaxed text-ink-soft short:mt-2 short:text-sm">
            We don&apos;t chase attention.
            <br />
            We build impact that lasts.
          </p>

          <button
            ref={ctaRef}
            onClick={scrollToNext}
            className="group mt-9 flex items-center gap-3 text-left short:mt-4"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold/40 text-gold transition-all group-hover:bg-gold group-hover:text-ivory">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M12 4v16m0 0-6-6m6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span>
              <span className="block text-[13px] font-semibold tracking-wide-label text-ink">
                BEGIN THE STORY
              </span>
              <span className="block text-[11px] text-ink-soft">Scroll to find out</span>
            </span>
          </button>
        </div>

        {/* Right: the hidden answer — a decorative flourish, not core
            content, so it's the first thing dropped when height is scarce
            (landscape phones) rather than forcing the section to scroll. */}
        <div className="relative mx-auto w-full max-w-md short:hidden lg:max-w-none">
          <div
            ref={clothRef}
            className="relative aspect-[4/5] w-full origin-center rounded-[2.5rem]"
            style={{
              background:
                "linear-gradient(155deg, #faf8f3 0%, #ece6d9 45%, #ddd4c0 100%)",
              boxShadow:
                "0 40px 80px -30px rgba(62,62,62,0.35), inset 0 0 60px rgba(255,255,255,0.4)",
            }}
          >
            <svg
              className="absolute inset-0 h-full w-full opacity-40"
              viewBox="0 0 400 500"
              fill="none"
              aria-hidden="true"
            >
              {[70, 140, 210, 280, 350].map((x, i) => (
                <path
                  key={x}
                  d={`M${x},0 C${x - 40},160 ${x + 40},340 ${x - 10},500`}
                  stroke="rgba(62,62,62,0.12)"
                  strokeWidth={i % 2 === 0 ? 1.5 : 1}
                />
              ))}
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center px-10 text-center">
              <p className="font-display text-[13px] font-semibold uppercase leading-relaxed tracking-wide-label text-ink-soft">
                Every great impact
                <br />
                starts with a thought.
                <br />
                Ours is to make it
                <br />
                <span className="text-gold">unmissable.</span>
              </p>

              <svg
                className="mt-10 animate-bounce"
                width="18"
                height="24"
                viewBox="0 0 18 24"
                fill="none"
                aria-hidden="true"
              >
                <path d="M9 0v20m0 0-6-6m6 6 6-6" stroke="var(--color-gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-6 hidden items-center gap-3 lg:left-12 lg:flex">
        <span className="text-[10px] font-medium tracking-wide-label text-ink-soft">SCROLL TO BEGIN</span>
        <span className="h-px w-10 bg-gold/50" />
      </div>
    </section>
  );
}
