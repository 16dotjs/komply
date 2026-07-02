"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useClientData } from "@/lib/portal/ClientDataContext";
import { PageHeader, NotReady } from "@/components/portal/PortalUI";
import { ProgressBar } from "@/components/portal/ProgressBar";
import type { Database } from "@/lib/supabase/database.types";

type ChecklistItem = Database["public"]["Tables"]["licensing_checklists"]["Row"];

function statusColor(s: string) {
  return s === "complete" ? "#4a7c59" : s === "in_progress" ? "#8A857E" : "#BF4A2B";
}
function statusLabel(s: string) {
  return s === "complete" ? "Complete" : s === "in_progress" ? "In progress" : "Not started";
}

function ChecklistRow({ item }: { item: ChecklistItem }) {
  const color = statusColor(item.status);
  return (
    <div className="border-t border-rule py-5">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
        <div className="md:col-span-1 flex justify-start pt-0.5">
          {item.status === "complete" ? (
            <div
              className="w-5 h-5 border flex items-center justify-center text-[10px] shrink-0 mt-0.5"
              style={{ borderColor: color, color }}
            >
              ✓
            </div>
          ) : (
            <div
              className="w-5 h-5 border shrink-0 mt-0.5"
              style={{ borderColor: color }}
            />
          )}
        </div>
        <div className="md:col-span-8">
          <p className="font-body text-sm font-light text-ink mb-1">
            {item.title}
          </p>
          <p className="font-body text-[12px] font-light text-ash leading-relaxed">
            {item.description || ""}
          </p>
        </div>
        <div className="md:col-span-3 flex justify-start md:justify-end items-start">
          <span
            className="text-[10px] font-light tracking-[0.15em] uppercase"
            style={{ color }}
          >
            {statusLabel(item.status)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function LicensingPage() {
  const client = useClientData();
  const [items, setItems] = useState<ChecklistItem[] | null>(null);

  useEffect(() => {
    if (!client) {
      setItems([]);
      return;
    }
    const supabase = createClient();
    supabase
      .from("licensing_checklists")
      .select("*")
      .eq("client_id", client.id)
      .order("order_index", { ascending: true })
      .then(({ data }) => setItems(data ?? []));
  }, [client]);

  const notReady = items !== null && (!client || items.length === 0);

  const licenseType = items?.[0]?.license_type || "—";
  const notStarted = items?.filter((i) => i.status === "not_started").length ?? 0;
  const inProgress = items?.filter((i) => i.status === "in_progress").length ?? 0;
  const complete = items?.filter((i) => i.status === "complete").length ?? 0;
  const pct = items && items.length > 0 ? Math.round((complete / items.length) * 100) : 0;
  const required = items?.filter((i) => i.required) ?? [];
  const optional = items?.filter((i) => !i.required) ?? [];

  return (
    <>
      <PageHeader
        title="Licensing"
        subtitle="Your CBN license application checklist"
      />
      <div className="px-8 py-8 space-y-8">
        {items === null && (
          <div className="py-20 text-center">
            <p className="text-sm font-light text-ash">Loading checklist...</p>
          </div>
        )}

        {notReady && (
          <NotReady
            title="Your licensing checklist is being prepared."
            body="Your Komply analyst will generate your licensing checklist after your gap analysis is complete. This typically happens within 5 business days of onboarding."
            footer={
              <p className="text-[11px] font-light tracking-loose-body text-ash">
                Questions? Email <span className="text-ink">hello@komply.co</span>
              </p>
            }
          />
        )}

        {items !== null && !notReady && (
          <div className="space-y-8">
            <div className="border border-rule p-7 relative">
              <div className="absolute top-0 right-0 w-14 h-14 border-t border-r border-clay pointer-events-none" />
              <p className="text-clay text-[10px] font-light tracking-[0.25em] uppercase mb-2">
                Target license
              </p>
              <h2 className="font-display text-3xl font-semibold tracking-tight-display text-ink mb-6">
                {licenseType}
              </h2>

              <ProgressBar percent={pct} />

              <div className="flex items-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: "#bf4a2b" }} />
                  <p className="text-[11px] font-light text-ash">
                    {notStarted} not started
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: "#8a857e" }} />
                  <p className="text-[11px] font-light text-ash">
                    {inProgress} in progress
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: "#4a7c59" }} />
                  <p className="text-[11px] font-light text-ash">
                    {complete} complete
                  </p>
                </div>
              </div>
            </div>

            {required.length > 0 && (
              <div>
                <p className="text-[10px] font-light tracking-[0.2em] uppercase text-ash mb-4">
                  Required
                </p>
                <div className="space-y-0">
                  {required.map((item) => (
                    <ChecklistRow key={item.id} item={item} />
                  ))}
                </div>
              </div>
            )}

            {optional.length > 0 && (
              <div>
                <p className="text-[10px] font-light tracking-[0.2em] uppercase text-ash mb-4">
                  Recommended
                </p>
                <div className="space-y-0">
                  {optional.map((item) => (
                    <ChecklistRow key={item.id} item={item} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
