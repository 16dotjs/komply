"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useClientData } from "@/lib/portal/ClientDataContext";
import { PageHeader, NotReady } from "@/components/portal/PortalUI";
import type { Database } from "@/lib/supabase/database.types";

type Task = Database["public"]["Tables"]["remediation_tasks"]["Row"];

function statusColor(s: string) {
  return s === "complete" ? "#4a7c59" : s === "in_progress" ? "#8A857E" : "#BF4A2B";
}
function statusLabel(s: string) {
  return s === "complete" ? "Complete" : s === "in_progress" ? "In progress" : "Not started";
}
function priorityColor(p: string | null) {
  return p === "critical" || p === "high" ? "#BF4A2B" : p === "medium" ? "#8A857E" : "#C4C0BB";
}

export default function TasksPage() {
  const client = useClientData();
  const [tasks, setTasks] = useState<Task[] | null>(null);
  const [status, setStatus] = useState("all");
  const [priority, setPriority] = useState("all");

  useEffect(() => {
    if (!client) {
      setTasks([]);
      return;
    }
    const supabase = createClient();
    supabase
      .from("remediation_tasks")
      .select("*")
      .eq("client_id", client.id)
      .order("created_at", { ascending: true })
      .then(({ data }) => setTasks(data ?? []));
  }, [client]);

  const notReady = tasks !== null && (!client || tasks.length === 0);

  const notStarted = tasks?.filter((t) => t.status === "not_started").length ?? 0;
  const inProgress = tasks?.filter((t) => t.status === "in_progress").length ?? 0;
  const complete = tasks?.filter((t) => t.status === "complete").length ?? 0;
  const openCount = notStarted + inProgress;

  const filtered = (tasks ?? []).filter(
    (t) =>
      (status === "all" || t.status === status) &&
      (priority === "all" || t.priority === priority),
  );

  return (
    <>
      <PageHeader
        title="Tasks"
        subtitle="Remediation actions assigned to your team"
        right={
          !notReady && tasks !== null ? (
            <div className="text-right">
              <p className="font-display text-2xl font-semibold text-ink">
                {openCount}
              </p>
              <p className="text-[10px] font-light tracking-[0.15em] uppercase text-ash">
                Open tasks
              </p>
            </div>
          ) : undefined
        }
      />

      <div className="px-8 py-8">
        {tasks === null && (
          <div className="py-20 text-center">
            <p className="text-sm font-light text-ash">Loading tasks...</p>
          </div>
        )}

        {notReady && (
          <NotReady
            title="No tasks assigned yet."
            body="Your Komply analyst will assign remediation tasks after your gap analysis is reviewed. Tasks will appear here once your gap report is published."
            footer={
              <Link
                href="/portal/gap-report"
                className="text-[11px] font-light tracking-loose-body text-ash border-b border-ash/40 hover:text-ink hover:border-ink transition-colors"
              >
                View gap report →
              </Link>
            }
          />
        )}

        {tasks !== null && !notReady && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-rule">
              <div className="bg-paper p-6">
                <p className="text-[10px] font-light tracking-[0.2em] uppercase text-ash mb-3">
                  Not started
                </p>
                <p className="font-display text-4xl font-semibold text-clay">
                  {notStarted}
                </p>
              </div>
              <div className="bg-paper p-6">
                <p className="text-[10px] font-light tracking-[0.2em] uppercase text-ash mb-3">
                  In progress
                </p>
                <p className="font-display text-4xl font-semibold text-ink">
                  {inProgress}
                </p>
              </div>
              <div className="bg-paper p-6">
                <p className="text-[10px] font-light tracking-[0.2em] uppercase text-ash mb-3">
                  Complete
                </p>
                <p
                  className="font-display text-4xl font-semibold"
                  style={{ color: "#4a7c59" }}
                >
                  {complete}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="bg-paper border border-rule px-3 py-2 text-sm font-light font-body text-ash appearance-none cursor-pointer"
              >
                <option value="all">All statuses</option>
                <option value="not_started">Not started</option>
                <option value="in_progress">In progress</option>
                <option value="complete">Complete</option>
              </select>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="bg-paper border border-rule px-3 py-2 text-sm font-light font-body text-ash appearance-none cursor-pointer"
              >
                <option value="all">All priorities</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div className="space-y-0">
              {filtered.length === 0 && (
                <p className="text-sm font-light text-ash py-4 border-t border-rule">
                  No tasks match this filter.
                </p>
              )}
              {filtered.map((t) => {
                const sColor = statusColor(t.status);
                return (
                  <div key={t.id} className="border-t border-rule py-5">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                      <div className="md:col-span-1 flex justify-start">
                        {t.status === "complete" ? (
                          <div
                            className="w-5 h-5 border flex items-center justify-center text-[10px] shrink-0 mt-0.5"
                            style={{ borderColor: sColor, color: sColor }}
                          >
                            ✓
                          </div>
                        ) : (
                          <div
                            className="w-5 h-5 border shrink-0 mt-0.5"
                            style={{ borderColor: sColor }}
                          />
                        )}
                      </div>
                      <div className="md:col-span-8">
                        <div className="flex items-center gap-3 mb-1 flex-wrap">
                          {t.priority && (
                            <span
                              className="text-[10px] font-light tracking-[0.15em] uppercase"
                              style={{ color: priorityColor(t.priority) }}
                            >
                              {t.priority}
                            </span>
                          )}
                          {t.framework && (
                            <span className="border border-rule px-2 py-0.5 text-[10px] font-light tracking-loose-body text-ash">
                              {t.framework}
                            </span>
                          )}
                        </div>
                        <p className="font-body text-sm font-light text-ink mb-1">
                          {t.title}
                        </p>
                        <p className="font-body text-[12px] font-light text-ash leading-relaxed">
                          {t.description || ""}
                        </p>
                        {t.due_date && (
                          <p className="text-[11px] font-light text-ash mt-1">
                            Due:{" "}
                            {new Date(t.due_date).toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                        )}
                      </div>
                      <div className="md:col-span-3 flex justify-start md:justify-end">
                        <span
                          className="text-[10px] font-light tracking-[0.15em] uppercase"
                          style={{ color: sColor }}
                        >
                          {statusLabel(t.status)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
