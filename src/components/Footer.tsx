import { Link } from "react-router-dom";

const LINKS = [
  { label: "Work", href: "/work" },
  { label: "Approach", href: "/approach" },
  { label: "About", href: "/about" },
  { label: "Insights", href: "/insights" },
  { label: "Contact", href: "/contact" },
];

export default function Footer() {
  return (
    <footer className="border-t border-ink/10 bg-ivory px-6 py-14 lg:px-12">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <img
            src="/assets/abc-logo-master.png"
            alt="ABC Mediamix — Ideas. Media. Impact."
            width={200}
            height={132}
            loading="lazy"
            className="h-14 w-auto"
          />
          <p className="mt-4 max-w-xs text-sm text-ink-soft">
            One partner. One vision. Everything connected.
          </p>
        </div>

        <nav className="flex flex-wrap gap-x-8 gap-y-3">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="text-[12px] font-semibold tracking-wide-label text-ink-soft transition-colors hover:text-gold"
            >
              {link.label.toUpperCase()}
            </Link>
          ))}
        </nav>

        <div className="text-sm text-ink-soft">
          <a href="mailto:info@abcmediamix.com" className="transition-colors hover:text-gold">
            info@abcmediamix.com
          </a>
        </div>
      </div>

      <div className="mx-auto mt-12 flex max-w-[1440px] flex-col gap-3 border-t border-ink/10 pt-6 text-[11px] text-ink-soft/70 sm:flex-row sm:items-center sm:justify-between">
        <span>&copy; {new Date().getFullYear()} ABC Mediamix. All rights reserved.</span>
        <div className="flex gap-6">
          <a href="#" className="transition-colors hover:text-gold">Privacy Policy</a>
          <a href="#" className="transition-colors hover:text-gold">Terms &amp; Conditions</a>
        </div>
      </div>
    </footer>
  );
}
