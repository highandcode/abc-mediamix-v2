const PILLARS = ["Strategy", "Creative", "Media", "PR & Comms", "Experiences", "Data"];

export default function Belief() {
  return (
    <section id="about" className="relative flex h-[100svh] flex-col justify-center overflow-hidden bg-ivory px-6 pb-6 pt-[var(--nav-h)]">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-[11px] font-semibold tracking-[0.3em] text-gold">ONE PARTNER. ONE VISION.</p>
        <h2 className="mt-4 font-display text-3xl font-extrabold uppercase leading-[1.05] tracking-tight text-ink short:text-2xl sm:text-5xl">
          We don&apos;t sell channels.
          <br />
          We connect <span className="text-gold">possibilities.</span>
        </h2>
        <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-ink-soft short:mt-3">
          Bring us an idea. We know how to turn it into something people see, hear, read,
          experience, and remember &mdash; without you needing five different agencies to do it.
        </p>

        <div className="mt-[min(3rem,5svh)] flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {PILLARS.map((pillar) => (
            <span
              key={pillar}
              className="text-[11px] font-medium uppercase tracking-wide-label text-ink-soft/60"
            >
              {pillar}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
