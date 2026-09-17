import type { ReactNode } from "react";
import clsx from "clsx";

export default function PullQuote({
  children,
  className,
  tone = "ink",
}: {
  children: ReactNode;
  className?: string;
  tone?: "ink" | "ivory";
}) {
  return (
    <blockquote
      className={clsx(
        "relative border-l-2 border-gold/50 pl-6 font-serif text-2xl italic leading-snug sm:text-3xl",
        tone === "ink" ? "text-ink" : "text-ivory",
        className
      )}
    >
      {children}
    </blockquote>
  );
}
