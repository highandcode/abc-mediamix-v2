import { useEffect, useRef, useState } from "react";
import { gsap } from "../lib/gsap";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { useLenisScrollTo } from "../hooks/useLenisScrollTo";
import { requestSectionById } from "../lib/sectionNavigator";

const SOUND_PREF_KEY = "abc-hero-sound";
const SOUND_VOLUME = 0.6;

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const toggleSoundRef = useRef<() => void>(() => {});
  const [soundOn, setSoundOn] = useState(false);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const paraRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);
  const soundBtnRef = useRef<HTMLButtonElement>(null);
  const reducedMotion = useReducedMotion();
  const scrollTo = useLenisScrollTo();

  // Hero is already on screen at load, so its own reveal plays
  // autonomously on mount rather than waiting for a scroll trigger.
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

  // The typing sound is the video's own audio track, so it stays in step with
  // the hands on screen (silent while they are away from the keys) through
  // every loop. Browsers only allow audio after a user gesture, so it starts
  // on the first click / tap / key press — or straight away where the browser
  // already allows it — unless the visitor switched it off before (that choice
  // is remembered). It fades in and out, and is muted whenever the hero is off
  // screen or the tab is hidden. The picture never stops; only the sound does.
  useEffect(() => {
    const video = videoRef.current;
    const section = sectionRef.current;
    if (!video || !section || reducedMotion) return;

    video.muted = true;
    video.volume = 0;
    setSoundOn(false);
    let wants = true;
    try {
      if (localStorage.getItem(SOUND_PREF_KEY) === "off") wants = false;
    } catch {
      /* storage unavailable — fall back to the default */
    }
    let audible = false; // the visitor has sound switched on
    let visible = true;
    let disposed = false;

    const gestures = ["pointerdown", "pointerup", "keydown", "touchend"] as const;
    const disarm = () => gestures.forEach((g) => window.removeEventListener(g, onGesture, true));
    const arm = () => gestures.forEach((g) => window.addEventListener(g, onGesture, true));
    function onGesture(e: Event) {
      if (soundBtnRef.current?.contains(e.target as Node)) return;
      disarm();
      if (wants && !audible) start();
    }

    const apply = () => {
      gsap.killTweensOf(video);
      if (audible && visible && !document.hidden) {
        video.muted = false;
        // Un-muting without a user gesture makes some browsers pause the
        // video — if that happens, fall back to muted playback and wait.
        video
          .play()
          .then(() => {
            if (disposed) return;
            gsap.to(video, { volume: SOUND_VOLUME, duration: 1.2, ease: "power1.out" });
            setSoundOn(true);
          })
          .catch((err: unknown) => {
            if ((err as { name?: string })?.name === "AbortError") return;
            audible = false;
            video.muted = true;
            void video.play().catch(() => {});
            setSoundOn(false);
            if (wants) arm();
          });
      } else if (!video.muted) {
        gsap.to(video, { volume: 0, duration: 0.5, onComplete: () => (video.muted = true) });
      }
    };
    const start = () => {
      audible = true;
      apply();
    };

    toggleSoundRef.current = () => {
      if (audible) {
        wants = false;
        audible = false;
        setSoundOn(false);
        try {
          localStorage.setItem(SOUND_PREF_KEY, "off");
        } catch {
          /* ignore */
        }
        apply();
      } else {
        wants = true;
        try {
          localStorage.setItem(SOUND_PREF_KEY, "on");
        } catch {
          /* ignore */
        }
        start();
      }
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        apply();
      },
      { threshold: 0.3 }
    );
    io.observe(section);
    const onVisibility = () => apply();
    document.addEventListener("visibilitychange", onVisibility);

    if (wants) {
      const policy = (navigator as { getAutoplayPolicy?: (el: HTMLMediaElement) => string })
        .getAutoplayPolicy?.(video);
      if (policy === "allowed") start();
      else arm();
    }

    return () => {
      disposed = true;
      disarm();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      gsap.killTweensOf(video);
      video.muted = true;
    };
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
      {/* Experiment: full-bleed video behind the hero (see .hero-video in
          globals.css — turned 90deg on landscape screens so the whole desk
          scene fills the frame). The ivory wash keeps the navy headline
          legible. Under reduced motion the poster frame stands in for the
          playing video. */}
      <div aria-hidden="true" className="hero-video-frame pointer-events-none absolute inset-0">
        <video
          ref={videoRef}
          className="hero-video"
          src="/assets/hero-bg.mp4"
          poster="/assets/hero-bg-poster.jpg"
          autoPlay={!reducedMotion}
          muted
          loop
          playsInline
          preload="auto"
        />
      </div>
      <div aria-hidden="true" className="hero-wash pointer-events-none absolute inset-0" />

      {/* One frame: everything below is sized from the viewport so the
          whole hero — headline, copy and CTA — is on screen at once,
          whatever the window. */}
      <div className="relative z-10 mx-auto flex h-full w-full max-w-[1440px] flex-col items-start justify-center gap-4 px-6 short:gap-3 lg:flex-row lg:items-center lg:gap-12 lg:px-12">
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
      </div>

      {!reducedMotion && (
        <button
          ref={soundBtnRef}
          type="button"
          onClick={() => toggleSoundRef.current()}
          aria-label={soundOn ? "Turn sound off" : "Turn sound on"}
          aria-pressed={soundOn}
          className="group absolute bottom-4 right-6 z-20 flex items-center gap-3 lg:bottom-8 lg:right-12"
        >
          <span className="hidden text-[10px] font-medium tracking-wide-label text-ink-soft lg:inline">
            SOUND {soundOn ? "ON" : "OFF"}
          </span>
          <span className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/40 bg-ivory/70 text-gold backdrop-blur-sm transition-colors group-hover:bg-gold group-hover:text-ivory">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5H4z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
              {soundOn ? (
                <path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              ) : (
                <path d="M15.5 9.5l5 5m0-5l-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            )}
          </svg>
        </span>
      </button>
      )}

      <div className="absolute bottom-8 left-6 z-10 hidden items-center gap-3 lg:left-12 lg:flex [@media(max-height:800px)]:!hidden">
        <span className="text-[10px] font-medium tracking-wide-label text-ink-soft">SCROLL TO BEGIN</span>
        <span className="h-px w-10 bg-gold/50" />
      </div>
    </section>
  );
}
