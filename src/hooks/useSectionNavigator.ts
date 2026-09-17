import { useRef, useState } from "react";
import {
  SectionNavigator,
  setActiveSectionNavigator,
  type NavigatorSnapshot,
} from "../lib/sectionNavigator";
import { useIsomorphicLayoutEffect } from "./useIsomorphicLayoutEffect";
import { useReducedMotion } from "./useReducedMotion";

/**
 * Mounts the section navigator for the lifetime of the calling page. Under
 * `prefers-reduced-motion`, SmoothScroll never creates a Lenis instance,
 * so the navigator's `start()` simply never gets a Lenis to attach to and
 * the page falls back to ordinary continuous scrolling.
 *
 * `debug` is only ever wired up in development — see SectionNavigatorDebug.
 */
export function useSectionNavigator(ids: string[], debug = false) {
  const reducedMotion = useReducedMotion();
  const [snapshot, setSnapshot] = useState<NavigatorSnapshot | null>(null);
  const idsRef = useRef(ids);
  idsRef.current = ids;

  useIsomorphicLayoutEffect(() => {
    if (reducedMotion) return;

    const navigator = new SectionNavigator(idsRef.current);
    setActiveSectionNavigator(navigator);
    const unsubscribe = debug ? navigator.subscribe(setSnapshot) : undefined;
    navigator.start();

    return () => {
      unsubscribe?.();
      setActiveSectionNavigator(null);
      navigator.destroy();
    };
  }, [reducedMotion, debug]);

  return snapshot;
}
