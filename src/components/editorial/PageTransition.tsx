import { useEffect, type ReactNode } from "react";
import { motion } from "framer-motion";
import { useSectionNavigator } from "../../hooks/useSectionNavigator";
import { startFrameAudit } from "../../lib/frameGuard";
import FrameProgress from "./FrameProgress";

/**
 * Shared shell for inner pages: the enter/exit fade, plus the section
 * navigator — every `[data-frame]` section inside is one frame, and a
 * wheel/swipe/key gesture slides to the next, exactly as on the homepage.
 * (The homepage names its frames explicitly and isn't wrapped in this.)
 *
 * The transition is opacity-only on purpose: a moving wrapper would put the
 * frames off their resting position while the navigator measures them, and
 * would turn the fixed page chrome inside it into transformed content.
 */
export default function PageTransition({ children }: { children: ReactNode }) {
  useSectionNavigator();

  useEffect(() => {
    if (!import.meta.env.DEV) return;
    return startFrameAudit();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <FrameProgress />
      {children}
    </motion.div>
  );
}
