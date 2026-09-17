import type { ReactNode } from "react";
import { motion } from "framer-motion";

/**
 * Shared enter/exit for inner pages. The homepage itself is intentionally
 * left unwrapped so its own first-load experience never changes — this
 * only governs navigation between the inner "publication" pages.
 */
export default function PageTransition({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-px origin-left bg-gold"
        initial={{ scaleX: 0, opacity: 1 }}
        animate={{ scaleX: 1, opacity: 0 }}
        transition={{ duration: 0.7, ease: "easeInOut" }}
      />
      {children}
    </motion.div>
  );
}
