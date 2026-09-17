import { useState, type FormEvent } from "react";
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

      <section className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden bg-ivory px-6 py-32 lg:px-12">
        <div className="mx-auto grid w-full max-w-[1440px] grid-cols-1 gap-16 lg:grid-cols-[1fr_1fr] lg:gap-24">
          <div>
            <StoryReveal>
              <EditorialLabel>ABC / CONTACT</EditorialLabel>
            </StoryReveal>
            <StoryReveal delay={90}>
              <h1 className="mt-4 font-display text-6xl font-extrabold uppercase leading-[0.9] tracking-tight text-ink sm:text-8xl">
                Next
                <br />
                <span className="text-gold">page?</span>
              </h1>
            </StoryReveal>
            <StoryReveal delay={180}>
              <p className="mt-6 max-w-sm font-serif text-xl italic text-ink-soft">
                Every idea starts somewhere. Tell us what you&apos;re building.
              </p>
            </StoryReveal>
            <StoryReveal delay={260} className="mt-12 hidden lg:block">
              <GoldThread variant="loop" className="w-48" />
            </StoryReveal>
          </div>

          <StoryReveal delay={140}>
            {sent ? (
              <div className="flex h-full min-h-[320px] flex-col items-center justify-center text-center">
                <GoldThread variant="loop" className="w-32" />
                <p className="mt-6 font-display text-2xl font-bold uppercase tracking-tight text-ink">
                  Opening your inbox&hellip;
                </p>
                <p className="mt-2 max-w-xs text-sm text-ink-soft">
                  We&apos;ll take it from here.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {FIELDS.map((field) => (
                    <label key={field.name} className="block">
                      <span className="text-[11px] font-semibold uppercase tracking-wide-label text-ink-soft">
                        {field.label}
                        {field.required && <span className="text-gold"> *</span>}
                      </span>
                      <input
                        name={field.name}
                        type={field.type}
                        required={field.required}
                        className="mt-2 w-full border-0 border-b border-ink/20 bg-transparent py-2 text-base text-ink outline-none transition-colors focus:border-gold"
                      />
                    </label>
                  ))}
                </div>

                <label className="block">
                  <span className="text-[11px] font-semibold uppercase tracking-wide-label text-ink-soft">
                    Tell us a little about it
                  </span>
                  <textarea
                    name="message"
                    rows={4}
                    className="mt-2 w-full resize-none border-0 border-b border-ink/20 bg-transparent py-2 text-base text-ink outline-none transition-colors focus:border-gold"
                  />
                </label>

                <button
                  type="submit"
                  className="group mt-4 inline-flex w-fit items-center gap-3 rounded-full bg-gold px-8 py-4 text-[13px] font-semibold uppercase tracking-wide-label text-ink transition-transform hover:scale-105"
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
