import type { ReactNode } from "react";
import clsx from "clsx";

export default function EditorialLabel({
  children,
  className,
  tone = "gold",
}: {
  children: ReactNode;
  className?: string;
  tone?: "gold" | "ink" | "ivory";
}) {
  return (
    <p
      className={clsx(
        "text-[11px] font-semibold tracking-[0.3em]",
        tone === "gold" && "text-gold",
        tone === "ink" && "text-ink-soft",
        tone === "ivory" && "text-ivory/70",
        className
      )}
    >
      {children}
    </p>
  );
}
