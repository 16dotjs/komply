"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Modal, ModalHeader, inputClass, selectClass, labelClass } from "@/components/admin/Modal";
import type { Database, Severity } from "@/lib/supabase/database.types";

type Alert = Database["public"]["Tables"]["alerts"]["Row"];

const REGULATORS = ["CBN", "NDPC", "SEC", "FIRS", "NCC", "FATF", "EFCC", "CAC"];
const FRAMEWORKS = ["CBN", "NDPC", "SEC", "FIRS", "NCC", "FATF"];

const emptyForm = {
  title: "",
  regulator: "",
  severity: "medium" as Severity,
  summary: "",
  body: "",
  frameworks: [] as string[],
  published: false,
};

function sevColor(s: string) {
  return s === "critical" || s === "high" ? "#BF4A2B" : s === "medium" ? "#8A857E" : "#C4C0BB";
}

export default function AdminAlertsPage() {
  const supabase = createClient();
  const [alerts, setAlerts] = useState<Alert[] | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [regulatorFilter, setRegulatorFilter] = useState("all");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    loadAlerts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadAlerts() {
    const { data, error } = await supabase
      .from("alerts")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      console.error(error);
      return;
    }
    setAlerts(data ?? []);
  }

  function openAddModal() {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEditModal(a: Alert) {
    setEditingId(a.id);
    setForm({
      title: a.title || "",
      regulator: a.regulator || "",
      severity: a.severity || "medium",
      summary: a.summary || "",
      body: a.body || "",
      frameworks: a.frameworks || [],
      published: a.published,
    });
    setModalOpen(true);
  }

  function toggleFramework(fw: string) {
    setForm((f) => ({
      ...f,
      frameworks: f.frameworks.includes(fw)
        ? f.frameworks.filter((x) => x !== fw)
        : [...f.frameworks, fw],
    }));
  }

  async function saveAlert() {
    if (!form.title.trim() || !form.summary.trim()) {
      alert("Title and summary are required.");
      return;
    }

    const payload = {
      title: form.title.trim(),
      regulator: form.regulator,
      severity: form.severity,
      summary: form.summary.trim(),
      body: form.body.trim(),
      frameworks: form.frameworks,
      published: form.published,
    };

    const { error } = editingId
      ? await supabase.from("alerts").update(payload).eq("id", editingId)
      : await supabase.from("alerts").insert([payload]);

    if (error) {
      alert("Failed to save. Try again.");
      console.error(error);
      return;
    }

    setModalOpen(false);
    loadAlerts();
  }

  const filtered = (alerts ?? []).filter((a) => {
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "published" && a.published) ||
      (statusFilter === "draft" && !a.published);
    const matchesRegulator = regulatorFilter === "all" || a.regulator === regulatorFilter;
    return matchesStatus && matchesRegulator;
  });

  return (
    <>
      <div className="border-b border-rule px-8 py-5 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight-display">
            Alerts
          </h1>
          <p className="text-[11px] font-light tracking-loose-body text-ash mt-0.5">
            Regulatory alerts published to clients
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-ink text-paper text-sm font-light px-5 py-2.5 hover:bg-clay transition-colors duration-300"
        >
          + New alert
        </button>
      </div>

      <div className="px-8 py-4 border-b border-rule flex items-center gap-4">
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={selectClass}>
          <option value="all">All alerts</option>
          <option value="published">Published</option>
          <option value="draft">Drafts</option>
        </select>
        <select value={regulatorFilter} onChange={(e) => setRegulatorFilter(e.target.value)} className={selectClass}>
          <option value="all">All regulators</option>
          {REGULATORS.slice(0, 6).map((r) => (
            <option key={r} value={r}>{r === "SEC" ? "SEC Nigeria" : r}</option>
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
              Create your first regulatory alert to publish to clients.
            </p>
          </div>
        )}

        {alerts !== null && filtered.length > 0 && (
          <table className="w-full">
            <thead>
              <tr className="border-b border-rule">
                <th className="text-left text-[10px] font-light tracking-[0.2em] uppercase text-ash pb-3 pr-6">Title</th>
                <th className="text-left text-[10px] font-light tracking-[0.2em] uppercase text-ash pb-3 pr-6">Regulator</th>
                <th className="text-left text-[10px] font-light tracking-[0.2em] uppercase text-ash pb-3 pr-6">Severity</th>
                <th className="text-left text-[10px] font-light tracking-[0.2em] uppercase text-ash pb-3 pr-6">Status</th>
                <th className="text-left text-[10px] font-light tracking-[0.2em] uppercase text-ash pb-3 pr-6">Date</th>
                <th className="text-left text-[10px] font-light tracking-[0.2em] uppercase text-ash pb-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr
                  key={a.id}
                  onClick={() => openEditModal(a)}
                  className="border-b border-rule hover:bg-rule/20 transition-colors cursor-pointer"
                >
                  <td className="py-4 pr-6 text-sm font-light text-ink max-w-xs truncate">{a.title || "—"}</td>
                  <td className="py-4 pr-6 text-sm font-light text-ash">{a.regulator || "—"}</td>
                  <td className="py-4 pr-6">
                    <span className="text-[10px] font-light tracking-[0.15em] uppercase" style={{ color: sevColor(a.severity) }}>
                      {a.severity || "—"}
                    </span>
                  </td>
                  <td className="py-4 pr-6">
                    {a.published ? (
                      <span style={{ color: "#4a7c59" }} className="text-[10px] font-light tracking-[0.15em] uppercase">
                        Published
                      </span>
                    ) : (
                      <span className="text-[10px] font-light tracking-[0.15em] uppercase text-ash">Draft</span>
                    )}
                  </td>
                  <td className="py-4 pr-6 text-sm font-light text-ash">
                    {new Date(a.created_at).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="py-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditModal(a);
                      }}
                      className="text-[11px] font-light text-ash hover:text-ink transition-colors border-b border-ash/40 pb-px"
                    >
                      Edit →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <ModalHeader
          eyebrow={editingId ? "Edit alert" : "New alert"}
          title="Alert details"
          onClose={() => setModalOpen(false)}
        />

        <div className="space-y-5 mb-8">
          <div className="space-y-2">
            <label className={labelClass}>Title</label>
            <input
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="e.g. CBN Issues New AML Circular"
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className={labelClass}>Regulator</label>
              <select
                value={form.regulator}
                onChange={(e) => setForm((f) => ({ ...f, regulator: e.target.value }))}
                className={selectClass}
              >
                <option value="" disabled>Select regulator</option>
                {REGULATORS.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className={labelClass}>Severity</label>
              <select
                value={form.severity}
                onChange={(e) => setForm((f) => ({ ...f, severity: e.target.value as Severity }))}
                className={selectClass}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className={labelClass}>Plain-language summary</label>
            <textarea
              value={form.summary}
              onChange={(e) => setForm((f) => ({ ...f, summary: e.target.value }))}
              rows={3}
              placeholder="What this means in plain English for a fintech founder..."
              className={`${inputClass} resize-none`}
            />
          </div>

          <div className="space-y-2">
            <label className={labelClass}>Full body (optional)</label>
            <textarea
              value={form.body}
              onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
              rows={5}
              placeholder="Detailed breakdown, action items, deadlines..."
              className={`${inputClass} resize-none`}
            />
          </div>

          <div className="space-y-2">
            <label className={labelClass}>Applicable frameworks</label>
            <div className="grid grid-cols-3 gap-2">
              {FRAMEWORKS.map((fw) => (
                <label key={fw} className="flex items-center gap-2 text-sm font-light text-ink cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.frameworks.includes(fw)}
                    onChange={() => toggleFramework(fw)}
                  />
                  {fw}
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className={labelClass}>Status</label>
            <select
              value={form.published ? "true" : "false"}
              onChange={(e) => setForm((f) => ({ ...f, published: e.target.value === "true" }))}
              className={selectClass}
            >
              <option value="false">Draft — not visible to clients</option>
              <option value="true">Published — visible to clients</option>
            </select>
          </div>
        </div>

        <div className="border-t border-rule pt-6 flex gap-4">
          <button
            onClick={saveAlert}
            className="bg-ink text-paper text-sm font-light px-6 py-3 hover:bg-clay transition-colors duration-300"
          >
            Save alert
          </button>
          <button
            onClick={() => setModalOpen(false)}
            className="border border-rule text-sm font-light px-6 py-3 text-ash hover:border-ash transition-colors"
          >
            Cancel
          </button>
        </div>
      </Modal>
    </>
  );
}
