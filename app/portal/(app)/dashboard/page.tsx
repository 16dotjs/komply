"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useClientData } from "@/lib/portal/ClientDataContext";
import { PageHeader } from "@/components/portal/PortalUI";
import type { Database } from "@/lib/supabase/database.types";

type RiskScore = Database["public"]["Tables"]["risk_scores"]["Row"];
type AuditReport = Database["public"]["Tables"]["audit_reports"]["Row"];
type Alert = Database["public"]["Tables"]["alerts"]["Row"];

function riskColor(score: number) {
  return score >= 70 ? "#4a7c59" : score >= 40 ? "#8A857E" : "#BF4A2B";
}
function riskLabel(score: number) {
  return score >= 70 ? "Low risk" : score >= 40 ? "Medium risk" : "High risk";
}
function sevColor(s: string) {
  return s === "critical" || s === "high" ? "#BF4A2B" : s === "medium" ? "#8A857E" : "#C4C0BB";
}

export default function DashboardPage() {
  const client = useClientData();

  const [risk, setRisk] = useState<RiskScore | null | undefined>(undefined);
  const [audits, setAudits] = useState<AuditReport[]>([]);
  const [alerts, setAlerts] = useState<Alert[] | null>(null);

  useEffect(() => {
    if (!client) {
      setRisk(null);
      setAlerts([]);
      return;
    }
    const supabase = createClient();

    supabase
      .from("risk_scores")
      .select("*")
      .eq("client_id", client.id)
      .order("generated_at", { ascending: false })
      .limit(1)
      .then(({ data }) => setRisk(data?.[0] ?? null));

    supabase
      .from("audit_reports")
      .select("*")
      .eq("client_id", client.id)
      .order("generated_at", { ascending: false })
      .then(({ data }) => setAudits(data ?? []));

    supabase
      .from("alerts")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false })
      .limit(3)
      .then(({ data }) => setAlerts(data ?? []));
  }, [client]);

  const frameworks = client?.frameworks ?? [];

  return (
    <>
      <PageHeader title="Dashboard" subtitle="Your compliance overview" />

      <div className="px-8 py-8 space-y-8">
        {/* Welcome card */}
        <div className="border border-rule p-7 md:p-8 relative">
          <div className="absolute top-0 right-0 w-14 h-14 border-t border-r border-clay pointer-events-none" />
          <p className="text-clay text-[10px] font-light tracking-[0.25em] uppercase mb-3">
            Welcome back
          </p>
          <h2 className="font-display text-[2rem] font-semibold tracking-tight-display text-ink mb-2">
            {client === null ? "Welcome" : client?.company || "—"}
          </h2>
          <p className="font-body text-sm font-light text-ash">
            {client === null
              ? "Your account is being set up. Check back soon."
              : client?.stage || "—"}
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-px bg-rule">
          <div className="bg-paper p-6">
            <p className="text-[10px] font-light tracking-[0.2em] uppercase text-ash mb-3">
              Risk score
            </p>
            <p
              className="font-display text-4xl font-semibold"
              style={{ color: risk ? riskColor(risk.score) : "#111110" }}
            >
              {risk ? `${risk.score}/100` : "—"}
            </p>
            <p className="text-[11px] font-light text-ash mt-1">
              {risk ? riskLabel(risk.score) : "Pending analysis"}
            </p>
          </div>
          <div className="bg-paper p-6">
            <p className="text-[10px] font-light tracking-[0.2em] uppercase text-ash mb-3">
              Frameworks tracked
            </p>
            <p className="font-display text-4xl font-semibold text-ink">
              {client ? frameworks.length : "—"}
            </p>
          </div>
          <div className="bg-paper p-6">
            <p className="text-[10px] font-light tracking-[0.2em] uppercase text-ash mb-3">
              Active alerts
            </p>
            <p className="font-display text-4xl font-semibold text-ink">
              {alerts === null ? "—" : alerts.length}
            </p>
          </div>
          <div className="bg-paper p-6">
            <p className="text-[10px] font-light tracking-[0.2em] uppercase text-ash mb-3">
              Account status
            </p>
            <p className="font-display text-2xl font-semibold" style={{ color: "#4a7c59" }}>
              Active
            </p>
          </div>
        </div>

        {/* Risk heat map */}
        {risk?.breakdown && Object.keys(risk.breakdown).length > 0 && (
          <div>
            <p className="text-[10px] font-light tracking-[0.2em] uppercase text-ash mb-4">
              Risk heat map
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-px bg-rule">
              {Object.entries(risk.breakdown).map(([fw, score]) => {
                const bg = score >= 70 ? "#4a7c59" : score >= 40 ? "#8A857E" : "#BF4A2B";
                return (
                  <div
                    key={fw}
                    className="p-4 flex flex-col items-center justify-center"
                    style={{ background: bg }}
                  >
                    <p className="font-display text-xl font-semibold" style={{ color: "#F7F4F0" }}>
                      {score}
                    </p>
                    <p
                      className="text-[10px] font-light tracking-[0.15em] uppercase mt-1"
                      style={{ color: "#F7F4F0", opacity: 0.8 }}
                    >
                      {fw}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Audit readiness */}
        {audits.length > 0 && (
          <div>
            <p className="text-[10px] font-light tracking-[0.2em] uppercase text-ash mb-4">
              Audit readiness
            </p>
            <div className="space-y-0">
              {audits.map((a) => {
                const color = a.readiness_pct >= 70 ? "#4a7c59" : a.readiness_pct >= 40 ? "#8A857E" : "#BF4A2B";
                return (
                  <div key={a.id} className="border-t border-rule py-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-body text-sm font-light text-ink">{a.framework}</p>
                      <p className="font-display text-xl font-semibold" style={{ color }}>
                        {a.readiness_pct}%
                      </p>
                    </div>
                    <div className="w-full h-px bg-rule relative">
                      <div
                        className="h-px absolute top-0 left-0 transition-all duration-700"
                        style={{ width: `${a.readiness_pct}%`, background: color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Frameworks */}
        <div>
          <p className="text-[10px] font-light tracking-[0.2em] uppercase text-ash mb-4">
            Your frameworks
          </p>
          <div className="flex flex-wrap gap-2">
            {frameworks.length > 0 ? (
              frameworks.map((f) => (
                <span
                  key={f}
                  className="border border-rule px-3 py-1.5 text-[11px] font-light tracking-loose-body text-ink"
                >
                  {f}
                </span>
              ))
            ) : (
              <p className="text-sm font-light text-ash">
                No frameworks assigned yet. Your Komply analyst will update
                this after onboarding.
              </p>
            )}
          </div>
        </div>

        {/* Recent alerts */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-[10px] font-light tracking-[0.2em] uppercase text-ash">
              Recent alerts
            </p>
            <Link
              href="/portal/monitoring"
              className="text-[11px] font-light text-ash border-b border-ash/40 hover:text-ink hover:border-ink transition-colors"
            >
              View all →
            </Link>
          </div>
          <div className="space-y-0">
            {alerts === null && (
              <p className="text-sm font-light text-ash py-4">Loading alerts...</p>
            )}
            {alerts !== null && alerts.length === 0 && (
              <p className="text-sm font-light text-ash py-4 border-t border-rule">
                No alerts yet. You&apos;ll be notified when new regulatory
                updates are published.
              </p>
            )}
            {alerts !== null &&
              alerts.map((a) => (
                <div key={a.id} className="border-t border-rule py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span
                          className="text-[10px] font-light tracking-[0.15em] uppercase"
                          style={{ color: sevColor(a.severity) }}
                        >
                          {a.severity}
                        </span>
                        <span className="text-[10px] font-light tracking-[0.15em] uppercase text-ash">
                          {a.regulator || ""}
                        </span>
                      </div>
                      <p className="font-body text-sm font-light text-ink mb-1">{a.title}</p>
                      <p className="font-body text-[12px] font-light text-ash leading-relaxed">
                        {a.summary}
                      </p>
                    </div>
                    <span className="text-[11px] font-light text-ash whitespace-nowrap">
                      {new Date(a.created_at).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
}
