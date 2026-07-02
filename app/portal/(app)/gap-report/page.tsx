"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useClientData } from "@/lib/portal/ClientDataContext";
import { PageHeader, NotReady } from "@/components/portal/PortalUI";
import { ProgressBar } from "@/components/portal/ProgressBar";
import type { Database } from "@/lib/supabase/database.types";

type Gap = Database["public"]["Tables"]["gap_reports"]["Row"];
type AuditReport = Database["public"]["Tables"]["audit_reports"]["Row"];

function sevColor(s: string) {
  return s === "critical" || s === "high"
    ? "#BF4A2B"
    : s === "medium"
      ? "#8A857E"
      : "#C4C0BB";
}
function statusColor(s: string) {
  return s === "resolved" ? "#4a7c59" : s === "in_progress" ? "#8A857E" : "#BF4A2B";
}
function statusLabel(s: string) {
  return s === "resolved" ? "Resolved" : s === "in_progress" ? "In progress" : "Open";
}
function readinessColor(pct: number) {
  return pct >= 70 ? "#4a7c59" : pct >= 40 ? "#8A857E" : "#BF4A2B";
}

export default function GapReportPage() {
  const client = useClientData();
  const [gaps, setGaps] = useState<Gap[] | null>(null);
  const [audits, setAudits] = useState<AuditReport[]>([]);

  useEffect(() => {
    if (!client) {
      setGaps([]);
      return;
    }
    const supabase = createClient();

    supabase
      .from("gap_reports")
      .select("*")
      .eq("client_id", client.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => setGaps(data ?? []));

    // audit_reports
    supabase
      .from("audit_reports")
      .select("*")
      .eq("client_id", client.id)
      .order("generated_at", { ascending: false })
      .then(({ data }) => setAudits(data ?? []));
  }, [client]);

  const notReady = gaps !== null && (!client || gaps.length === 0);

  const open = gaps?.filter((g) => g.status === "open").length ?? 0;
  const inProgress = gaps?.filter((g) => g.status === "in_progress").length ?? 0;
  const resolved = gaps?.filter((g) => g.status === "resolved").length ?? 0;
  const total = gaps?.length ?? 0;
  const remediationPct = total > 0 ? Math.round((resolved / total) * 100) : 0;

  const counts = { critical: 0, high: 0, medium: 0, low: 0 } as Record<string, number>;
  gaps?.forEach((g) => {
    if (counts[g.severity] !== undefined) counts[g.severity]++;
  });

  function downloadReport() {
    alert("PDF download coming soon. This feature is being built.");
  }

  return (
    <>
      <PageHeader
        title="Gap Report"
        subtitle="Your compliance gaps mapped against applicable frameworks"
        right={
          !notReady && gaps !== null ? (
            <button
              onClick={downloadReport}
              className="border border-rule text-sm font-light px-5 py-2.5 text-ash hover:border-ash hover:text-ink transition-colors"
            >
              Download PDF →
            </button>
          ) : undefined
        }
      />

      <div className="px-8 py-8 space-y-10">
        {gaps === null && (
          <div className="py-20 text-center">
            <p className="text-sm font-light text-ash">Loading report...</p>
          </div>
        )}

        {notReady && (
          <NotReady
            title="Your gap report is being prepared."
            body="Your Komply analyst is reviewing your compliance profile. Your gap report will appear here within 5 business days of your onboarding call."
          />
        )}

        {gaps !== null && !notReady && (
          <div className="space-y-10">
            {/* Remediation tracker */}
            <div>
              <p className="text-[10px] font-light tracking-[0.2em] uppercase text-ash mb-4">
                Remediation progress
              </p>
              <div className="border border-rule p-6">
                <ProgressBar percent={remediationPct} label="Overall completion" />
                <div className="flex items-center gap-6 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-clay" />
                    <p className="text-[11px] font-light text-ash">{open} open</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ background: "#8a857e" }} />
                    <p className="text-[11px] font-light text-ash">{inProgress} in progress</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ background: "#4a7c59" }} />
                    <p className="text-[11px] font-light text-ash">{resolved} resolved</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Audit readiness */}
            {audits.length > 0 && (
              <div>
                <p className="text-[10px] font-light tracking-[0.2em] uppercase text-ash mb-4">
                  Audit readiness by framework
                </p>
                <div className="space-y-0">
                  {audits.map((a) => {
                    const color = readinessColor(a.readiness_pct);
                    const met = a.findings?.met || [];
                    const unmet = a.findings?.unmet || [];
                    return (
                      <div key={a.id} className="border-t border-rule py-5">
                        <div className="flex items-center justify-between mb-3">
                          <p className="font-body text-sm font-light text-ink font-medium">
                            {a.framework}
                          </p>
                          <p className="font-display text-xl font-semibold" style={{ color }}>
                            {a.readiness_pct}% ready
                          </p>
                        </div>
                        <div className="w-full h-px bg-rule relative mb-4">
                          <div
                            className="h-px absolute top-0 left-0"
                            style={{ width: `${a.readiness_pct}%`, background: color }}
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {met.length > 0 && (
                            <div>
                              <p
                                className="text-[10px] font-light tracking-[0.15em] uppercase mb-2"
                                style={{ color: "#4a7c59" }}
                              >
                                Met
                              </p>
                              <div className="space-y-1">
                                {met.map((m) => (
                                  <p key={m} className="text-[12px] font-light text-ash leading-relaxed">
                                    ✓ {m}
                                  </p>
                                ))}
                              </div>
                            </div>
                          )}
                          {unmet.length > 0 && (
                            <div>
                              <p className="text-[10px] font-light tracking-[0.15em] uppercase mb-2 text-clay">
                                Unmet
                              </p>
                              <div className="space-y-1">
                                {unmet.map((u) => (
                                  <p key={u} className="text-[12px] font-light text-ash leading-relaxed">
                                    ✗ {u}
                                  </p>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Summary stats */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-px bg-rule">
              <div className="bg-paper p-6">
                <p className="text-[10px] font-light tracking-[0.2em] uppercase text-ash mb-3">
                  Critical gaps
                </p>
                <p className="font-display text-4xl font-semibold text-clay">
                  {counts.critical}
                </p>
              </div>
              <div className="bg-paper p-6">
                <p className="text-[10px] font-light tracking-[0.2em] uppercase text-ash mb-3">
                  High
                </p>
                <p className="font-display text-4xl font-semibold text-ink">
                  {counts.high}
                </p>
              </div>
              <div className="bg-paper p-6">
                <p className="text-[10px] font-light tracking-[0.2em] uppercase text-ash mb-3">
                  Medium
                </p>
                <p className="font-display text-4xl font-semibold text-ink">
                  {counts.medium}
                </p>
              </div>
              <div className="bg-paper p-6">
                <p className="text-[10px] font-light tracking-[0.2em] uppercase text-ash mb-3">
                  Low
                </p>
                <p className="font-display text-4xl font-semibold text-ink">
                  {counts.low}
                </p>
              </div>
            </div>

            {/* Gaps list */}
            <div>
              <p className="text-[10px] font-light tracking-[0.2em] uppercase text-ash mb-4">
                All gaps
              </p>
              <div className="space-y-0">
                {gaps.map((g) => (
                  <div key={g.id} className="border-t border-rule py-6">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                      <div className="md:col-span-2">
                        <span
                          className="text-[10px] font-light tracking-[0.15em] uppercase"
                          style={{ color: sevColor(g.severity) }}
                        >
                          {g.severity}
                        </span>
                        <p className="text-[11px] font-light text-ash mt-1">
                          {g.framework || ""}
                        </p>
                        <span
                          className="text-[10px] font-light tracking-[0.15em] uppercase mt-2 block"
                          style={{ color: statusColor(g.status) }}
                        >
                          {statusLabel(g.status)}
                        </span>
                      </div>
                      <div className="md:col-span-6">
                        <p className="font-body text-sm font-light text-ink font-medium mb-2">
                          {g.title}
                        </p>
                        <p className="font-body text-sm font-light text-ash leading-relaxed">
                          {g.description}
                        </p>
                      </div>
                      <div className="md:col-span-4">
                        <p className="text-[10px] font-light tracking-[0.15em] uppercase text-ash mb-1">
                          Recommended action
                        </p>
                        <p className="font-body text-[12px] font-light text-ink leading-relaxed">
                          {g.action || "—"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
