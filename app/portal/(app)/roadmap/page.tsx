"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useClientData } from "@/lib/portal/ClientDataContext";
import { PageHeader, NotReady } from "@/components/portal/PortalUI";
import { ProgressBar } from "@/components/portal/ProgressBar";
import type { Database } from "@/lib/supabase/database.types";

type RoadmapItem = Database["public"]["Tables"]["roadmap_items"]["Row"];

function statusColor(s: string) {
  return s === "complete" ? "#4a7c59" : s === "in_progress" ? "#BF4A2B" : "#8A857E";
}
function statusLabel(s: string) {
  return s === "complete" ? "Complete" : s === "in_progress" ? "In progress" : "Pending";
}

export default function RoadmapPage() {
  const client = useClientData();
  const [items, setItems] = useState<RoadmapItem[] | null>(null);

  useEffect(() => {
    if (!client) {
      setItems([]);
      return;
    }
    const supabase = createClient();
    supabase
      .from("roadmap_items")
      .select("*")
      .eq("client_id", client.id)
      .order("order_index", { ascending: true })
      .then(({ data }) => setItems(data ?? []));
  }, [client]);

  const notReady = items !== null && (!client || items.length === 0);
  const completed = items?.filter((i) => i.status === "complete").length ?? 0;
  const pct = items && items.length > 0 ? Math.round((completed / items.length) * 100) : 0;

  return (
    <>
      <PageHeader
        title="Roadmap"
        subtitle="Your licensing and compliance milestones"
      />
      <div className="px-8 py-8">
        {items === null && (
          <div className="py-20 text-center">
            <p className="text-sm font-light text-ash">Loading roadmap...</p>
          </div>
        )}

        {notReady && (
          <NotReady
            title="Your roadmap is being built."
            body="Your Komply analyst will map your licensing milestones after your onboarding call. Check back within 5 business days."
          />
        )}

        {items !== null && !notReady && (
          <>
            <div className="mb-10">
              <ProgressBar percent={pct} label="Overall progress" />
            </div>

            <div className="space-y-0">
              {items.map((item, i) => (
                <div key={item.id} className="border-t border-rule py-6">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                    <div className="md:col-span-1">
                      <div
                        className="w-7 h-7 border flex items-center justify-center text-[11px] font-light"
                        style={{
                          borderColor: statusColor(item.status),
                          color: statusColor(item.status),
                        }}
                      >
                        {item.status === "complete" ? "✓" : i + 1}
                      </div>
                    </div>
                    <div className="md:col-span-7">
                      <p className="font-body text-sm font-light text-ink font-medium mb-1">
                        {item.title}
                      </p>
                      <p className="font-body text-sm font-light text-ash leading-relaxed">
                        {item.description || ""}
                      </p>
                      {item.due_date && (
                        <p className="text-[11px] font-light text-ash mt-2">
                          Due:{" "}
                          {new Date(item.due_date).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      )}
                    </div>
                    <div className="md:col-span-4 flex justify-start md:justify-end">
                      <span
                        className="text-[10px] font-light tracking-[0.15em] uppercase"
                        style={{ color: statusColor(item.status) }}
                      >
                        {statusLabel(item.status)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
