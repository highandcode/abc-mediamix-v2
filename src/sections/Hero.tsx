import { useEffect, useRef } from "react";
import { gsap } from "../lib/gsap";
import { prepareDraw } from "../lib/paths";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { useLenisScrollTo } from "../hooks/useLenisScrollTo";
import { requestSectionById } from "../lib/sectionNavigator";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  const clothClipRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const threadRef = useRef<SVGPathElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const paraRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);
  const reducedMotion = useReducedMotion();
  const scrollTo = useLenisScrollTo();

  // Hero is already on screen at load, so its own reveal plays
  // autonomously on mount rather than waiting for a scroll trigger. The
  // cloth fades/settles in here too — it only shares `yPercent` with the
  // scrub timeline below, never opacity/scale, so the two never fight over
  // the same property.
  useEffect(() => {
    if (reducedMotion) return;
    const headline = headlineRef.current;
    const para = paraRef.current;
    const cta = ctaRef.current;
    const visual = visualRef.current;
    if (!headline || !para || !cta || !visual) return;

    const ctx = gsap.context(() => {
      gsap.set([headline, para, cta], { opacity: 0, y: 16 });
      gsap.set(visual, { opacity: 0, y: 14, scale: 0.97 });

      gsap
        .timeline({ delay: 0.1 })
        .to(headline, { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }, 0)
        .to(para, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, 0.35)
        .to(cta, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, 0.5)
        .to(visual, { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: "power2.out" }, 0.2);
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  // The cinematic hand-off into "something-coming": the section navigator
  // scrolls the window through Hero's own height during the locked
  // transition to the next frame, which is exactly the range this scrub
  // trigger watches — so the reveal plays out over that hand-off (and
  // reverses cleanly on scroll-back) without a second locking mechanism.
  useEffect(() => {
    if (reducedMotion) return;
    const section = sectionRef.current;
    const visual = visualRef.current;
    const clothClip = clothClipRef.current;
    const glow = glowRef.current;
    const thread = threadRef.current;
    if (!section || !visual || !clothClip || !glow || !thread) return;

    const ctx = gsap.context(() => {
      prepareDraw(thread);
      gsap.set(thread, { opacity: 0 });
      gsap.set(glow, { opacity: 0, scale: 0.85, transformOrigin: "50% 100%" });
      gsap.set(clothClip, { clipPath: "inset(0% 0% 0% 0%)", transformOrigin: "50% 100%" });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: 0.6,
        },
      });

      tl.to(visual, { yPercent: -4, ease: "none" }, 0)
        .to(thread, { opacity: 1, strokeDashoffset: 0, ease: "none" }, 0)
        .to(glow, { opacity: 0.85, scale: 1, ease: "power1.out" }, 0.15)
        .to(
          clothClip,
          { clipPath: "inset(0% 0% 9% 0%)", scale: 1.01, rotate: 0.4, ease: "power1.inOut" },
          0.1
        )
        .to(
          clothClip,
          { clipPath: "inset(0% 0% 5% 0%)", scale: 1, rotate: 0, ease: "power1.out" },
          0.55
        )
        .to(glow, { opacity: 0.6, scale: 0.95, ease: "power1.out" }, 0.7);
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
      className="relative h-[100svh] overflow-hidden bg-ivory pb-16 pt-[var(--nav-h)] short:pb-4 lg:pb-12"
    >
      {/* One frame: everything below is sized from the viewport so the
          whole hero — headline, copy, cloth and CTA — is on screen at once,
          whatever the window. Small screens stack the cloth between the copy
          and the CTA and let it take whatever height is left; from lg up the
          copy and cloth sit side by side. */}
      <div className="mx-auto flex h-full w-full max-w-[1440px] flex-col items-center gap-4 px-6 short:gap-3 lg:flex-row lg:gap-12 lg:px-12">
        <div className="contents lg:flex lg:min-w-0 lg:flex-1 lg:flex-col lg:justify-center lg:gap-[min(2rem,4svh)]">
          <h1
            ref={headlineRef}
            className="hero-headline order-1 max-w-xl font-display lg:max-w-none font-extrabold uppercase leading-[0.95] tracking-tight text-ink"
          >
            What if
            <br />
            one idea could
            <br className="hidden lg:block" /> change <span className="text-gold">everything?</span>
          </h1>

          <p
            ref={paraRef}
            className="order-2 max-w-sm text-base leading-relaxed text-ink-soft short:text-sm"
          >
            We don&apos;t chase attention.
            <br />
            We build impact that lasts.
          </p>

          <button
            ref={ctaRef}
            onClick={scrollToNext}
            className="group order-4 flex items-center gap-3 text-left"
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

        {/* The hidden answer — a decorative flourish, not core content, so
            it's the first thing dropped when height is scarce (landscape
            phones). It fills whatever room is left (the size container),
            keeping the cloth's own aspect ratio so the gold thread drawn
            over it stays registered. */}
        <div className="order-3 flex min-h-0 w-full flex-1 items-center justify-center [container-type:size] short:hidden lg:h-full">
          <div
            ref={visualRef}
            className="relative"
            style={{ width: "min(100cqw, calc(100cqh * 1255 / 1134))", aspectRatio: "1255 / 1134" }}
          >
            {/* ground shadow — the object physically resting in the scene */}
            <div
              aria-hidden="true"
              className="absolute inset-x-[12%] bottom-[3%] h-[8%] rounded-[100%]"
              style={{
                background: "radial-gradient(ellipse at center, rgba(38,41,112,0.30), transparent 72%)",
                filter: "blur(16px)",
              }}
            />

            {/* the idea, not yet revealed — a hint of warm light escaping
                from beneath the cloth once the reveal plays */}
            <div
              ref={glowRef}
              aria-hidden="true"
              className="absolute inset-x-[20%] bottom-[5%] h-[20%] rounded-[100%]"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(199,154,92,0.9) 0%, rgba(228,207,164,0.5) 45%, transparent 75%)",
                filter: "blur(7px)",
              }}
            />

            <div ref={clothClipRef} className="absolute inset-0">
              <picture>
                <source srcSet="/assets/hero-cloth-object.webp" type="image/webp" />
                <img
                  src="/assets/hero-cloth-object.png"
                  alt=""
                  aria-hidden="true"
                  width={1255}
                  height={1134}
                  loading="eager"
                  fetchPriority="high"
                  className="h-full w-full object-contain object-bottom"
                />
              </picture>
            </div>

            {/* gold thread — drawn on independently of the cloth image so
                GSAP can animate it as its own layer */}
            <svg
              className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
              viewBox="0 0 300 271"
              fill="none"
              aria-hidden="true"
            >
              <path
                ref={threadRef}
                d="M254,14 C214,70 244,132 206,180 C178,216 134,214 104,244"
                stroke="var(--color-gold)"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-6 hidden items-center gap-3 lg:left-12 lg:flex [@media(max-height:800px)]:!hidden">
        <span className="text-[10px] font-medium tracking-wide-label text-ink-soft">SCROLL TO BEGIN</span>
        <span className="h-px w-10 bg-gold/50" />
      </div>
    </section>
  );
}
