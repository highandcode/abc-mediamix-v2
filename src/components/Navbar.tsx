import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useLenisScrollTo } from "../hooks/useLenisScrollTo";
import { requestSectionById } from "../lib/sectionNavigator";

const LINKS = [
  { label: "Work", href: "/work" },
  { label: "Approach", href: "/approach" },
  { label: "About", href: "/about" },
  { label: "Insights", href: "/insights" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const scrollTo = useLenisScrollTo();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  // The work case-study hero is the one page whose first section is a navy
  // background — the transparent navbar state would sit the (now-navy)
  // logo directly on navy and it would disappear. Keep the navbar solid
  // there from the start instead of waiting for scroll.
  const isDarkHero = /^\/work\/[^/]+\/?$/.test(pathname);
  const solid = scrolled || isDarkHero;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const goHome = (e: React.MouseEvent) => {
    e.preventDefault();
    if (pathname === "/") {
      if (!requestSectionById("top")) scrollTo(0);
    } else {
      navigate("/");
    }
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        solid ? "bg-ivory/85 backdrop-blur-md shadow-[0_1px_0_rgba(0,0,0,0.06)]" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-3 lg:px-12">
        <a href="/" onClick={goHome} className="flex items-center">
          <img
            src="/assets/abc-logo-master.png"
            alt="ABC Mediamix — Ideas. Media. Impact."
            width={200}
            height={132}
            className="h-10 w-auto lg:h-12"
          />
        </a>

        <nav className="hidden items-center gap-10 md:flex">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`text-[13px] font-medium tracking-wide-label transition-colors hover:text-ink ${
                pathname.startsWith(link.href) ? "text-ink" : "text-ink-soft"
              }`}
            >
              {link.label.toUpperCase()}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link
            to="/contact"
            className="hidden rounded-full border border-ink/20 px-5 py-2 text-[12px] font-semibold tracking-wide-label text-ink transition-colors hover:border-gold hover:text-gold sm:inline-block"
          >
            LET&apos;S TALK
          </Link>
          <button
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-navy text-ivory transition-transform hover:scale-105"
          >
            <span className="relative block h-3 w-4">
              <span
                className={`absolute left-0 top-0 h-px w-4 bg-current transition-transform duration-300 ${menuOpen ? "translate-y-[6px] rotate-45" : ""}`}
              />
              <span
                className={`absolute left-0 bottom-0 h-px w-4 bg-current transition-transform duration-300 ${menuOpen ? "-translate-y-[6px] -rotate-45" : ""}`}
              />
            </span>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-ink/10 bg-ivory px-6 py-6 md:hidden">
          <nav className="flex flex-col gap-5">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-sm font-medium tracking-wide-label text-ink"
              >
                {link.label.toUpperCase()}
              </Link>
            ))}
            <Link
              to="/contact"
              onClick={() => setMenuOpen(false)}
              className="mt-2 inline-block w-fit rounded-full border border-ink/20 px-5 py-2 text-[12px] font-semibold tracking-wide-label text-ink"
            >
              LET&apos;S TALK
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
