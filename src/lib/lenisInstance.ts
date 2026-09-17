import type Lenis from "lenis";

let instance: Lenis | null = null;
const readyListeners = new Set<(lenis: Lenis) => void>();

export function setLenisInstance(lenis: Lenis | null) {
  instance = lenis;
  if (lenis) readyListeners.forEach((fn) => fn(lenis));
}

export function getLenisInstance() {
  return instance;
}

/**
 * Fires once with the Lenis instance — immediately if it already exists,
 * otherwise the next time one is created. Under `prefers-reduced-motion`,
 * SmoothScroll never creates an instance at all, so this simply never
 * fires — the caller's Lenis-dependent behavior stays inert instead of
 * needing its own reduced-motion branch.
 */
export function onLenisReady(cb: (lenis: Lenis) => void) {
  if (instance) {
    cb(instance);
    return () => {};
  }
  const wrapped = (lenis: Lenis) => {
    readyListeners.delete(wrapped);
    cb(lenis);
  };
  readyListeners.add(wrapped);
  return () => readyListeners.delete(wrapped);
}
