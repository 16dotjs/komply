import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-rule px-6 md:px-12 py-10 max-w-screen-xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <Link
          href="/"
          className="font-display text-lg font-semibold tracking-tight-display"
        >
          Komply<span className="text-clay">.</span>
        </Link>
        <p className="text-[11px] font-light tracking-loose-body text-ash">
          © {new Date().getFullYear()} Komply. African fintech compliance
          intelligence.
        </p>
        <div className="flex gap-8">
          <Link
            href="/privacy"
            className="text-[11px] font-light tracking-loose-body text-ash hover:text-ink transition-colors"
          >
            Privacy
          </Link>
          <Link
            href="/terms"
            className="text-[11px] font-light tracking-loose-body text-ash hover:text-ink transition-colors"
          >
            Terms
          </Link>
        </div>
      </div>
    </footer>
  );
}
