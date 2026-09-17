import type { ReactNode } from "react";
import clsx from "clsx";
import EditorialLabel from "./EditorialLabel";
import StoryReveal from "./StoryReveal";

export default function EditorialHeader({
  kicker,
  heading,
  sub,
  tone = "ink",
  className,
}: {
  kicker: string;
  heading: ReactNode;
  sub?: ReactNode;
  tone?: "ink" | "ivory";
  className?: string;
}) {
  return (
    <div className={clsx("max-w-4xl", className)}>
      <StoryReveal>
        <EditorialLabel tone={tone === "ivory" ? "ivory" : "gold"}>{kicker}</EditorialLabel>
      </StoryReveal>
      <StoryReveal delay={80}>
        <h1
          className={clsx(
            "mt-4 font-display text-5xl font-extrabold uppercase leading-[0.98] tracking-tight sm:text-7xl lg:text-8xl",
            tone === "ivory" ? "text-ivory" : "text-ink"
          )}
        >
          {heading}
        </h1>
      </StoryReveal>
      {sub && (
        <StoryReveal delay={160}>
          <p
            className={clsx(
              "mt-6 max-w-md text-base leading-relaxed",
              tone === "ivory" ? "text-ivory/70" : "text-ink-soft"
            )}
          >
            {sub}
          </p>
        </StoryReveal>
      )}
    </div>
  );
}
