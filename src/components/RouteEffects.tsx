import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ScrollTrigger } from "../lib/gsap";
import { getLenisInstance } from "../lib/lenisInstance";

/** Resets scroll position and refreshes ScrollTrigger on every route change. */
export default function RouteEffects() {
  const { pathname } = useLocation();

  useEffect(() => {
    const lenis = getLenisInstance();
    if (lenis) {
      // The section navigator on Home may leave Lenis stopped/locked
      // between gestures — release it on every route change so the page
      // being navigated to (which may not be the paginated Home) always
      // gets normal free scrolling, and so this reset itself can't be
      // swallowed by a lock left over from the page being left.
      lenis.start();
      lenis.scrollTo(0, { immediate: true, force: true });
    } else {
      window.scrollTo(0, 0);
    }

    const raf = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(raf);
  }, [pathname]);

  return null;
}
