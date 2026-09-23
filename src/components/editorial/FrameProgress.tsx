import { useFrameSnapshot } from "../../hooks/useFrameSnapshot";
import { requestFrameIndex } from "../../lib/sectionNavigator";

/**
 * Progress through the page's frames: one dot per frame, the current one
 * lengthened. Doubles as navigation — a dot slides straight to its frame.
 * Renders nothing until a navigator is running (and under reduced motion,
 * where there isn't one).
 */
export default function FrameProgress() {
  const snapshot = useFrameSnapshot();
  if (!snapshot || snapshot.totalFrames < 2) return null;

  return (
    <nav
      aria-label="Page sections"
      className="fixed right-2 top-1/2 z-40 flex -translate-y-1/2 flex-col items-center gap-1 lg:right-5"
    >
      {Array.from({ length: snapshot.totalFrames }, (_, i) => {
        const current = i === snapshot.currentIndex;
        return (
          <button
            key={i}
            type="button"
            aria-label={`Go to section ${i + 1} of ${snapshot.totalFrames}`}
            aria-current={current ? "true" : undefined}
            onClick={() => requestFrameIndex(i)}
            className="group flex h-5 w-5 items-center justify-center"
          >
            <span
              className={`block w-[5px] rounded-full bg-gold transition-all duration-500 ${
                current ? "h-5 opacity-100" : "h-[5px] opacity-30 group-hover:opacity-70"
              }`}
            />
          </button>
        );
      })}
    </nav>
  );
}
