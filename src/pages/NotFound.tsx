import { Link } from "react-router-dom";
import PageTransition from "../components/editorial/PageTransition";
import EditorialLabel from "../components/editorial/EditorialLabel";

export default function NotFound() {
  return (
    <PageTransition>
      <section className="flex min-h-[100svh] flex-col items-center justify-center bg-ivory px-6 text-center">
        <EditorialLabel>ABC / 404</EditorialLabel>
        <h1 className="mt-4 font-display text-5xl font-extrabold uppercase tracking-tight text-ink sm:text-7xl">
          This page
          <br />
          isn&apos;t written <span className="text-gold">yet.</span>
        </h1>
        <Link
          to="/"
          className="mt-10 inline-flex items-center gap-3 rounded-full border border-ink/20 px-6 py-3 text-[12px] font-semibold tracking-wide-label text-ink transition-colors hover:border-gold hover:text-gold"
        >
          BACK TO THE BEGINNING
        </Link>
      </section>
    </PageTransition>
  );
}
