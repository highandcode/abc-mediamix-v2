import { useEffect, useState } from "react";

/**
 * Starts `false` on every render pass (server and client) so hydration never
 * mismatches; the real media-query value is applied as a post-hydration
 * upgrade once mounted.
 */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(query.matches);
    const listener = (e: MediaQueryListEvent) => setReduced(e.matches);
    query.addEventListener("change", listener);
    return () => query.removeEventListener("change", listener);
  }, []);

  return reduced;
}
