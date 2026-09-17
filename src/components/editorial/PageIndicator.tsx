export default function PageIndicator({
  label,
  tone = "ink",
}: {
  label: string;
  tone?: "ink" | "ivory";
}) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed bottom-8 left-6 z-40 hidden items-center gap-3 lg:left-12 lg:flex ${
        tone === "ivory" ? "text-ivory/50" : "text-ink-soft/60"
      }`}
    >
      <span className="h-px w-8 bg-gold/50" />
      <span className="text-[10px] font-medium tracking-wide-label">{label}</span>
    </div>
  );
}
