import { useCallback } from "react";
import { getLenisInstance } from "../lib/lenisInstance";

export function useLenisScrollTo() {
  return useCallback((target: HTMLElement | number) => {
    const lenis = getLenisInstance();
    if (lenis) {
      lenis.scrollTo(target, { duration: 1.4 });
    } else if (typeof target === "number") {
      window.scrollTo({ top: target, behavior: "smooth" });
    } else {
      target.scrollIntoView({ behavior: "smooth" });
    }
  }, []);
}
