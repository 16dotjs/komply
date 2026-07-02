"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV_LINKS = [
  { href: "/services", label: "Services" },
  { href: "/process", label: "Process" },
  { href: "/coverage", label: "Coverage" },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-paper/95 backdrop-blur-sm border-b border-rule">
      <div className="max-w-screen-xl mx-auto px-6 md:px-12 flex items-center justify-between h-16">
        <Link
          href="/"
          className="font-display text-xl font-semibold tracking-tight-display"
        >
          Komply<span className="text-clay">.</span>
        </Link>

        <button
          onClick={() => setMenuOpen((open) => !open)}
          className="md:hidden flex flex-col gap-[5px] p-2"
          aria-label="Menu"
          aria-expanded={menuOpen}
        >
          <span className="w-5 h-px bg-ink block" />
          <span className="w-5 h-px bg-ink block" />
          <span className="w-3 h-px bg-ink block" />
        </button>

        <div className="hidden md:flex items-center gap-10">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`nav-link font-body text-sm font-light tracking-loose-body transition-colors ${
                pathname === link.href
                  ? "text-ink"
                  : "text-ash hover:text-ink"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="bg-ink text-paper text-sm font-light px-5 py-2.5 hover:bg-clay transition-colors duration-300"
          >
            Request access
          </Link>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-rule bg-paper px-6 py-8 flex flex-col gap-7">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="font-body text-sm font-light tracking-loose-body text-ash"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/contact"
            onClick={() => setMenuOpen(false)}
            className="inline-block bg-ink text-paper text-sm font-light px-5 py-3.5 text-center"
          >
            Request access
          </Link>
        </div>
      )}
    </nav>
  );
}
