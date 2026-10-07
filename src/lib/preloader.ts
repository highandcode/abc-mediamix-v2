/**
 * The first-load preloader (inline markup + styles in index.html). It lifts
 * once the page is presentable: webfonts loaded and, where there is one, the
 * hero video able to play. It's held for a minimum beat so it never just
 * flashes, and capped so a slow network never holds the page hostage.
 * Sections that animate in on load wait for `onPreloaderDone` so their
 * reveal isn't spent underneath it.
 */

const MIN_VISIBLE_MS = 900;
const MAX_WAIT_MS = 4000;
const FADE_MS = 600;

let done = typeof document === "undefined" || !document.getElementById("preloader");
const waiting = new Set<() => void>();

export function onPreloaderDone(cb: () => void) {
  if (done) {
    cb();
    return () => {};
  }
  waiting.add(cb);
  return () => {
    waiting.delete(cb);
  };
}

function finish() {
  if (done) return;
  done = true;
  const el = document.getElementById("preloader");
  el?.classList.add("is-done");
  window.setTimeout(() => el?.remove(), FADE_MS);
  waiting.forEach((cb) => cb());
  waiting.clear();
}

function videoReady(video: HTMLVideoElement) {
  if (video.readyState >= 3) return Promise.resolve();
  return new Promise<void>((resolve) => {
    video.addEventListener("canplay", () => resolve(), { once: true });
    video.addEventListener("error", () => resolve(), { once: true });
  });
}

/** Call once on the client, after the app has mounted. */
export function startPreloader() {
  if (done) return;
  const minimum = new Promise((r) => window.setTimeout(r, Math.max(0, MIN_VISIBLE_MS - performance.now())));
  const fonts = document.fonts?.ready ?? Promise.resolve();
  const video = document.querySelector<HTMLVideoElement>(".hero-video");
  const ready = Promise.all([minimum, fonts, video ? videoReady(video) : Promise.resolve()]);
  const cap = new Promise((r) => window.setTimeout(r, MAX_WAIT_MS));
  void Promise.race([ready, cap]).then(finish);
}
