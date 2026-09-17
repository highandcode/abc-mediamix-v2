import { useEffect, useLayoutEffect } from "react";

/**
 * `useLayoutEffect` on the client, `useEffect` (a no-op during SSR) on the
 * server — avoids React's "useLayoutEffect does nothing on the server"
 * warning without changing behavior in the browser, where it still runs.
 */
export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;
