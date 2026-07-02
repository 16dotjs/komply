"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { PageHeader } from "@/components/portal/PortalUI";
import type { Database } from "@/lib/supabase/database.types";

type Alert = Database["public"]["Tables"]["alerts"]["Row"];

const REGULATORS = ["CBN", "NDPC", "SEC", "FIRS", "NCC", "FATF"];

function sevColor(s: string) {
  return s === "critical" || s === "high"
    ? "#BF4A2B"
    : s === "medium"
      ? "#8A857E"
      : "#C4C0BB";
}

export default function MonitoringPage() {
  const [alerts, setAlerts] = useState<Alert[] | null>(null);
  const [severity, setSeverity] = useState("all");
  const [regulator, setRegulator] = useState("all");
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("alerts")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false })
      .then(({ data }) => setAlerts(data ?? []));
  }, []);

  function toggle(id: string) {
    setOpenIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  const filtered = (alerts ?? []).filter(
    (a) =>
      (severity === "all" || a.severity === severity) &&
      (regulator === "all" || a.regulator === regulator),
  );

  return (
    <>
      <PageHeader
        title="Monitoring"
        subtitle="Regulatory alerts relevant to your business"
        right={
          <div className="text-right">
            <p className="font-display text-2xl font-semibold text-ink">
              {alerts === null ? "—" : filtered.length}
            </p>
            <p className="text-[10px] font-light tracking-[0.15em] uppercase text-ash">
              Total alerts
            </p>
          </div>
        }
      />

      <div className="px-8 py-4 border-b border-rule flex items-center gap-4">
        <select
          value={severity}
          onChange={(e) => setSeverity(e.target.value)}
          className="bg-paper border border-rule px-3 py-2 text-sm font-light font-body text-ash appearance-none cursor-pointer"
        >
          <option value="all">All severities</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <select
          value={regulator}
          onChange={(e) => setRegulator(e.target.value)}
          className="bg-paper border border-rule px-3 py-2 text-sm font-light font-body text-ash appearance-none cursor-pointer"
        >
          <option value="all">All regulators</option>
          {REGULATORS.map((r) => (
            <option key={r} value={r}>
              {r === "SEC" ? "SEC Nigeria" : r}
            </option>
          ))}
        </select>
      </div>

      <div className="px-8 py-6">
        {alerts === null && (
          <div className="py-20 text-center">
            <p className="text-sm font-light text-ash">Loading alerts...</p>
          </div>
        )}

        {alerts !== null && filtered.length === 0 && (
          <div className="py-20 text-center">
            <p className="font-display text-2xl font-semibold tracking-tight-display text-ink mb-2">
              No alerts yet.
            </p>
            <p className="text-sm font-light text-ash">
              Komply will publish regulatory updates here as they happen.
            </p>
          </div>
        )}

        {alerts !== null && filtered.length > 0 && (
          <div className="space-y-0">
            {filtered.map((a) => {
              const open = openIds.has(a.id);
              return (
                <div
                  key={a.id}
                  className="border-t border-rule py-6 cursor-pointer transition-colors hover:bg-rule/10"
                  onClick={() => toggle(a.id)}
                >
                  <div className="flex items-start justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span
                          className="text-[10px] font-light tracking-[0.15em] uppercase"
                          style={{ color: sevColor(a.severity) }}
                        >
                          {a.severity}
                        </span>
                        <span className="text-[10px] font-light tracking-[0.15em] uppercase text-ash">
                          {a.regulator || ""}
                        </span>
                        <span className="text-[10px] font-light tracking-[0.15em] text-ash">
                          {new Date(a.created_at).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      <p className="font-display text-xl font-semibold tracking-tight-display text-ink mb-2">
                        {a.title}
                      </p>
                      <p className="font-body text-sm font-light text-ash leading-relaxed">
                        {a.summary}
                      </p>

                      {a.body && (
                        <>
                          {open && (
                            <div className="mt-4">
                              <div className="border-t border-rule pt-4">
                                <p className="font-body text-sm font-light text-ink leading-relaxed whitespace-pre-line">
                                  {a.body}
                                </p>
                              </div>
                            </div>
                          )}
                          <button className="text-[11px] font-light text-ash hover:text-ink transition-colors mt-3 border-b border-ash/40 pb-px">
                            {open ? "Read less ←" : "Read more →"}
                          </button>
                        </>
                      )}
                    </div>

                    <div className="flex flex-col gap-1 items-end shrink-0">
                      {(a.frameworks || []).map((f) => (
                        <span
                          key={f}
                          className="border border-rule px-2 py-1 text-[10px] font-light tracking-loose-body text-ash"
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
