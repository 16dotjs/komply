"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useClientData } from "@/lib/portal/ClientDataContext";
import { PageHeader, NotReady } from "@/components/portal/PortalUI";
import type { Database } from "@/lib/supabase/database.types";

type Doc = Database["public"]["Tables"]["documents"]["Row"];

function getFileIcon(type: string | null) {
  if (!type) return "📄";
  if (type.includes("pdf")) return "📋";
  if (type.includes("word") || type.includes("doc")) return "📝";
  if (type.includes("sheet") || type.includes("excel") || type.includes("csv"))
    return "📊";
  if (type.includes("image")) return "🖼";
  return "📄";
}

function formatSize(bytes: number | null) {
  if (!bytes) return "";
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

export default function DocumentsPage() {
  const client = useClientData();
  const [docs, setDocs] = useState<Doc[] | null>(null);
  const [category, setCategory] = useState("all");

  useEffect(() => {
    if (!client) {
      setDocs([]);
      return;
    }
    const supabase = createClient();
    supabase
      .from("documents")
      .select("*")
      .eq("client_id", client.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => setDocs(data ?? []));
  }, [client]);

  if (docs === null) {
    return (
      <>
        <PageHeader
          title="Documents"
          subtitle="Files and templates shared by your Komply analyst"
        />
        <div className="px-8 py-8">
          <div className="py-20 text-center">
            <p className="text-sm font-light text-ash">
              Loading documents...
            </p>
          </div>
        </div>
      </>
    );
  }

  if (!client || docs.length === 0) {
    return (
      <>
        <PageHeader
          title="Documents"
          subtitle="Files and templates shared by your Komply analyst"
        />
        <div className="px-8 py-8">
          <div className="py-20 text-center">
            <NotReady
              title="No documents yet."
              body="Your Komply analyst will share policy templates, gap report PDFs, and compliance documentation here after your onboarding call."
            />
          </div>
        </div>
      </>
    );
  }

  const categories = ["all", ...new Set(docs.map((d) => d.category).filter(Boolean) as string[])];
  const filtered = category === "all" ? docs : docs.filter((d) => d.category === category);

  return (
    <>
      <PageHeader
        title="Documents"
        subtitle="Files and templates shared by your Komply analyst"
      />
      <div className="px-8 py-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex gap-2 flex-wrap">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`px-3 py-1.5 text-[11px] font-light tracking-loose-body border transition-colors ${
                  category === c
                    ? "border-ink text-ink"
                    : "border-rule text-ash hover:border-ash"
                }`}
              >
                {c === "all" ? "All" : c}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-0">
          {filtered.map((d) => (
            <div
              key={d.id}
              className="border-t border-rule py-5 flex items-start justify-between gap-6 hover:bg-rule/10 transition-colors"
            >
              <div className="flex items-start gap-4 flex-1">
                <span className="text-2xl mt-0.5">
                  {getFileIcon(d.file_type)}
                </span>
                <div className="flex-1">
                  <p className="font-body text-sm font-light text-ink mb-1">
                    {d.name}
                  </p>
                  <div className="flex items-center gap-3 flex-wrap">
                    {d.category && (
                      <span className="text-[10px] font-light tracking-[0.15em] uppercase text-ash border border-rule px-2 py-0.5">
                        {d.category}
                      </span>
                    )}
                    {d.file_size && (
                      <span className="text-[11px] font-light text-ash">
                        {formatSize(d.file_size)}
                      </span>
                    )}
                    <span className="text-[11px] font-light text-ash">
                      {new Date(d.created_at).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  {d.description && (
                    <p className="font-body text-[12px] font-light text-ash mt-1 leading-relaxed">
                      {d.description}
                    </p>
                  )}
                </div>
              </div>
              <a
                href={d.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-light text-ash hover:text-ink transition-colors border-b border-ash/40 pb-px whitespace-nowrap mt-1"
              >
                Download →
              </a>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
