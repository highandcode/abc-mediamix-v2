type Props = {
  onSkip: () => void;
  /** "light" text for navy sections, "dark" for ivory ones. */
  tone?: "light" | "dark";
};

/**
 * Sits at the bottom of a pinned, scroll-scrubbed section: tells the visitor
 * the sequence is scroll-driven and offers a way past it for anyone who
 * isn't interested in playing it out.
 */
export default function SkipPin({ onSkip, tone = "dark" }: Props) {
  const light = tone === "light";
  return (
    <div className="absolute inset-x-0 bottom-5 z-10 flex items-center justify-center gap-4 px-6 sm:bottom-7">
      <span
        className={`text-[10px] font-medium uppercase tracking-wide-label ${
          light ? "text-ivory/50" : "text-ink-soft/60"
        }`}
      >
        Scroll to explore
      </span>
      <span className={`h-3 w-px ${light ? "bg-ivory/25" : "bg-ink/20"}`} aria-hidden="true" />
      <button
        type="button"
        onClick={onSkip}
        className={`group flex items-center gap-2 rounded-full border px-4 py-2 text-[10px] font-semibold uppercase tracking-wide-label transition-colors ${
          light
            ? "border-ivory/30 text-ivory hover:border-gold hover:bg-gold hover:text-navy"
            : "border-ink/25 text-ink hover:border-gold hover:bg-gold hover:text-ivory"
        }`}
      >
        Skip
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 4v16m0 0-6-6m6 6 6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}
