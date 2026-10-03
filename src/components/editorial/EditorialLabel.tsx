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
        "text-[13px] font-bold tracking-[0.28em] sm:text-[15px]",
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
