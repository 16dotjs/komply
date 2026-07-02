"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const NAV_ITEMS = [
  { href: "/admin/dashboard", label: "Requests" },
  { href: "/admin/clients", label: "Clients" },
  { href: "/admin/alerts", label: "Alerts" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
  }

  // client-detail isn't in the nav (it's reached via "Manage →" from Clients)
  // but should still show Clients as active since it's a sub-view of it.
  const isActive = (href: string) =>
    pathname === href || (href === "/admin/clients" && pathname.startsWith("/admin/clients/"));

  return (
    <aside className="fixed top-0 left-0 h-full w-56 border-r border-rule bg-paper flex flex-col z-40">
      <div className="px-6 py-6 border-b border-rule">
        <Link
          href="/"
          className="font-display text-xl font-semibold tracking-tight-display"
        >
          Komply<span className="text-clay">.</span>
        </Link>
        <p className="text-[9px] font-light tracking-[0.2em] uppercase text-ash mt-1">
          Admin
        </p>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-1">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 text-sm font-light transition-colors ${
                active ? "text-ink bg-rule/50" : "text-ash hover:text-ink"
              }`}
            >
              <span
                className={`w-1 h-1 rounded-full ${active ? "bg-clay" : "bg-rule"}`}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="px-4 py-6 border-t border-rule">
        <button
          onClick={handleLogout}
          className="text-[11px] font-light tracking-loose-body text-ash hover:text-clay transition-colors"
        >
          Sign out →
        </button>
      </div>
    </aside>
  );
}
