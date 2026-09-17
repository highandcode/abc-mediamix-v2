import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { caseStudies } from "../data/work";
import { articles } from "../data/insights";
import { getRouteMeta, getMetaTagSpecs } from "../lib/seo";

const SEO_MARKER = "data-seo";

/**
 * Keeps document.title and every head tag from `seo.ts` in sync with the
 * current route on client-side navigation (prerendered pages already have
 * the correct head from the server render; this covers SPA transitions
 * between them). Shares `getRouteMeta`/`getMetaTagSpecs` with the server
 * renderer so client and server never disagree on what a route's tags are.
 */
export function usePageMeta() {
  const { pathname } = useLocation();

  useEffect(() => {
    const meta = getRouteMeta(pathname, { caseStudies, articles });

    document.title = meta.title;
    document.head.querySelectorAll(`[${SEO_MARKER}]`).forEach((el) => el.remove());

    for (const spec of getMetaTagSpecs(meta)) {
      const el = document.createElement(spec.tag);
      for (const [key, value] of Object.entries(spec.attrs)) {
        el.setAttribute(key, value);
      }
      if (spec.tag === "script") el.textContent = spec.text;
      el.setAttribute(SEO_MARKER, "true");
      document.head.appendChild(el);
    }
  }, [pathname]);
}
