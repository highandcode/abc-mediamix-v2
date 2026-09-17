import { useIsomorphicLayoutEffect } from "../hooks/useIsomorphicLayoutEffect";
import { useSectionNavigator } from "../hooks/useSectionNavigator";
import { ScrollTrigger } from "../lib/gsap";
import ScrollProgress from "../components/ScrollProgress";
import SectionNavigatorDebug from "../components/SectionNavigatorDebug";
import Hero from "../sections/Hero";
import SomethingComing from "../sections/SomethingComing";
import StringInfinity from "../sections/StringInfinity";
import Ecosystem from "../sections/Ecosystem";
import BreakSilos from "../sections/BreakSilos";
import Work from "../sections/Work";
import Curious from "../sections/Curious";
import Belief from "../sections/Belief";
import FinalCTA from "../sections/FinalCTA";

// DOM ids of each top-level section below, in render order — the section
// navigator's frame registry. Add a new section here (and give it a
// matching `id`) to fold it into the cinematic paginated flow.
const FRAME_IDS = [
  "top",
  "something-coming",
  "string-infinity",
  "approach",
  "insights",
  "work",
  "curious",
  "about",
  "contact",
];

/**
 * The homepage — unchanged from the original single-page build. Do not
 * redesign; the inner pages are built to extend this experience, not
 * replace it.
 */
export default function Home() {
  const debugSnapshot = useSectionNavigator(FRAME_IDS, import.meta.env.DEV);

  useIsomorphicLayoutEffect(() => {
    return () => {
      // Several sections below pin: true, which makes ScrollTrigger wrap
      // them in a "pin-spacer" div it inserts outside of React's
      // knowledge. Each section reverts its own ScrollTrigger on unmount,
      // but when navigating away from Home, AnimatePresence deletes this
      // whole subtree in one React commit — if a section's own revert
      // hasn't un-wrapped its pin-spacer by the moment React reaches that
      // node, React's removeChild targets a parent that's no longer
      // accurate and throws, which (with no error boundary) unmounts the
      // entire app. Killing every ScrollTrigger here, ahead of the
      // section-level cleanups, restores the DOM to its un-pinned shape
      // before React's own deletion pass reaches it.
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <>
      <ScrollProgress />
      <Hero />
      <SomethingComing />
      <StringInfinity />
      <Ecosystem />
      <BreakSilos />
      <Work />
      <Curious />
      <Belief />
      <FinalCTA />
      {import.meta.env.DEV && <SectionNavigatorDebug snapshot={debugSnapshot} />}
    </>
  );
}
