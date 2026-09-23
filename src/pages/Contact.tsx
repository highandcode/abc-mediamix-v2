import { useState, type CSSProperties, type FormEvent } from "react";
import PageTransition from "../components/editorial/PageTransition";
import PageIndicator from "../components/editorial/PageIndicator";
import EditorialLabel from "../components/editorial/EditorialLabel";
import GoldThread from "../components/editorial/GoldThread";
import StoryReveal from "../components/editorial/StoryReveal";

const FIELDS = [
  { name: "name", label: "Name", type: "text", required: true },
  { name: "company", label: "Company", type: "text", required: false },
  { name: "email", label: "Email", type: "email", required: true },
  { name: "phone", label: "Phone", type: "tel", required: false },
] as const;

export default function Contact() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const subject = `A new idea from ${data.get("name") || "someone"}`;
    const body = [
      `Name: ${data.get("name") ?? ""}`,
      `Company: ${data.get("company") ?? ""}`,
      `Email: ${data.get("email") ?? ""}`,
      `Phone: ${data.get("phone") ?? ""}`,
      "",
      String(data.get("message") ?? ""),
    ].join("\n");

    setSent(true);
    window.setTimeout(() => {
      window.location.href = `mailto:info@abcmediamix.com?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(body)}`;
    }, 700);
  };

  return (
    <PageTransition>
      <PageIndicator label="ABC / CONTACT" />

      <section data-frame className="frame bg-ivory px-6 lg:px-12">
        <div className="frame-inner grid grid-cols-1 gap-[min(3svh,1.5rem)] lg:grid-cols-2 lg:items-center lg:gap-24 short:grid-cols-2 short:items-center short:gap-8">
          <div>
            <StoryReveal>
              <EditorialLabel>ABC / CONTACT</EditorialLabel>
            </StoryReveal>
            <StoryReveal delay={90}>
              <h1
                className="frame-display mt-3 font-display font-extrabold uppercase tracking-tight text-ink"
                style={{ "--chars": 10 } as CSSProperties}
              >
                Next <br className="hidden sm:inline" />
                <span className="text-gold">page?</span>
              </h1>
            </StoryReveal>
            <StoryReveal delay={180}>
              <p className="mt-[min(2.4svh,1.5rem)] max-w-sm font-serif text-base italic text-ink-soft sm:text-xl short:text-sm">
                Every idea starts somewhere. Tell us what you&apos;re building.
              </p>
            </StoryReveal>
            <StoryReveal delay={260} className="mt-[min(4svh,3rem)] hidden lg:block short:hidden">
              <GoldThread variant="loop" className="w-40" />
            </StoryReveal>
          </div>

          <StoryReveal delay={140}>
            {sent ? (
              <div className="flex h-full min-h-[200px] flex-col items-center justify-center text-center">
                <GoldThread variant="loop" className="w-32" />
                <p className="mt-6 font-display text-2xl font-bold uppercase tracking-tight text-ink">
                  Opening your inbox&hellip;
                </p>
                <p className="mt-2 max-w-xs text-sm text-ink-soft">
                  We&apos;ll take it from here.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-[min(2.4svh,1.25rem)]">
                <div className="grid grid-cols-2 gap-x-4 gap-y-[min(2.4svh,1.25rem)] sm:gap-x-6">
                  {FIELDS.map((field) => (
                    <label key={field.name} className="block">
                      <span className="text-[10px] font-semibold uppercase tracking-wide-label text-ink-soft sm:text-[11px]">
                        {field.label}
                        {field.required && <span className="text-gold"> *</span>}
                      </span>
                      <input
                        name={field.name}
                        type={field.type}
                        required={field.required}
                        className="mt-1 w-full border-0 border-b border-ink/20 bg-transparent py-1.5 text-base text-ink outline-none transition-colors focus:border-gold short:py-0.5"
                      />
                    </label>
                  ))}
                </div>

                <label className="block">
                  <span className="text-[10px] font-semibold uppercase tracking-wide-label text-ink-soft sm:text-[11px]">
                    Tell us a little about it
                  </span>
                  <textarea
                    name="message"
                    rows={3}
                    className="mt-1 w-full resize-none border-0 border-b border-ink/20 bg-transparent py-1.5 text-base text-ink outline-none transition-colors focus:border-gold short:h-9 short:py-0.5"
                  />
                </label>

                <button
                  type="submit"
                  className="group mt-1 inline-flex w-fit items-center gap-3 rounded-full bg-gold px-7 py-3 short:py-2 text-[12px] font-semibold uppercase tracking-wide-label text-ink transition-transform hover:scale-105 sm:text-[13px]"
                >
                  Send the first page
                  <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </button>
              </form>
            )}
          </StoryReveal>
        </div>
      </section>
    </PageTransition>
  );
}
