"use client";

/**
 * ⚠️ RECONSTRUCTED PAGE — NOT THE ORIGINAL
 *
 * The original portal/dashboard.html got overwritten on disk when the admin
 * dashboard.html (same filename) was uploaded later in the migration
 * conversation, and its content was never fully captured before that
 * happened. This is a best-effort placeholder built from the same visual
 * patterns as the other 7 portal pages (stat tiles, "not ready" states,
 * client context) — it is NOT a migration of the real page.
 *
 * To fix properly: re-upload the original portal/dashboard.html and this
 * file should be rebuilt to match it exactly.
 */

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useClientData } from "@/lib/portal/ClientDataContext";
import { PageHeader } from "@/components/portal/PortalUI";

interface Summary {
  openGaps: number;
  openTasks: number;
  roadmapPct: number;
  recentAlerts: number;
}

const LINKS = [
  { href: "/portal/monitoring", label: "Monitoring", desc: "Regulatory alerts" },
  { href: "/portal/gap-report", label: "Gap Report", desc: "Compliance gaps" },
  { href: "/portal/roadmap", label: "Roadmap", desc: "Licensing milestones" },
  { href: "/portal/documents", label: "Documents", desc: "Shared files" },
  { href: "/portal/licensing", label: "Licensing", desc: "CBN checklist" },
  { href: "/portal/tasks", label: "Tasks", desc: "Remediation actions" },
];

export default function DashboardPage() {
  const client = useClientData();
  const [summary, setSummary] = useState<Summary | null>(null);

  useEffect(() => {
    if (!client) {
      setSummary({ openGaps: 0, openTasks: 0, roadmapPct: 0, recentAlerts: 0 });
      return;
    }
    const supabase = createClient();

    Promise.all([
      supabase
        .from("gap_reports")
        .select("status")
        .eq("client_id", client.id),
      supabase
        .from("remediation_tasks")
        .select("status")
        .eq("client_id", client.id),
      supabase
        .from("roadmap_items")
        .select("status")
        .eq("client_id", client.id),
      supabase
        .from("alerts")
        .select("id")
        .eq("published", true)
        .order("created_at", { ascending: false })
        .limit(30),
    ]).then(([gaps, tasks, roadmap, alerts]) => {
      const openGaps = (gaps.data ?? []).filter((g) => g.status !== "resolved").length;
      const openTasks = (tasks.data ?? []).filter((t) => t.status !== "complete").length;
      const roadmapItems = roadmap.data ?? [];
      const roadmapDone = roadmapItems.filter((r) => r.status === "complete").length;
      const roadmapPct =
        roadmapItems.length > 0 ? Math.round((roadmapDone / roadmapItems.length) * 100) : 0;

      setSummary({
        openGaps,
        openTasks,
        roadmapPct,
        recentAlerts: alerts.data?.length ?? 0,
      });
    });
  }, [client]);

  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle={client ? `Welcome back, ${client.company ?? "there"}` : "Welcome"}
      />

      <div className="px-8 py-8 space-y-10">
        <div className="border border-clay/30 bg-clay/5 px-5 py-4">
          <p className="font-body text-[12px] font-light text-clay leading-relaxed">
            This dashboard was rebuilt from scratch — the original page
            content wasn&apos;t available during migration. Treat the layout
            below as a starting point, not a faithful copy.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-px bg-rule">
          <div className="bg-paper p-6">
            <p className="text-[10px] font-light tracking-[0.2em] uppercase text-ash mb-3">
              Open gaps
            </p>
            <p className="font-display text-4xl font-semibold text-clay">
              {summary === null ? "—" : summary.openGaps}
            </p>
          </div>
          <div className="bg-paper p-6">
            <p className="text-[10px] font-light tracking-[0.2em] uppercase text-ash mb-3">
              Open tasks
            </p>
            <p className="font-display text-4xl font-semibold text-ink">
              {summary === null ? "—" : summary.openTasks}
            </p>
          </div>
          <div className="bg-paper p-6">
            <p className="text-[10px] font-light tracking-[0.2em] uppercase text-ash mb-3">
              Roadmap progress
            </p>
            <p className="font-display text-4xl font-semibold text-ink">
              {summary === null ? "—" : `${summary.roadmapPct}%`}
            </p>
          </div>
          <div className="bg-paper p-6">
            <p className="text-[10px] font-light tracking-[0.2em] uppercase text-ash mb-3">
              Recent alerts
            </p>
            <p className="font-display text-4xl font-semibold text-ink">
              {summary === null ? "—" : summary.recentAlerts}
            </p>
          </div>
        </div>

        <div>
          <p className="text-[10px] font-light tracking-[0.2em] uppercase text-ash mb-4">
            Go to
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-px bg-rule">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="bg-paper p-6 hover:bg-rule/20 transition-colors"
              >
                <p className="font-display text-lg font-semibold tracking-tight-display mb-1">
                  {l.label}
                </p>
                <p className="text-[12px] font-light text-ash">{l.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
