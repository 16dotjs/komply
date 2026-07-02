"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Modal, ConfirmModal, ModalHeader, inputClass, selectClass, labelClass } from "@/components/admin/Modal";
import type { Database } from "@/lib/supabase/database.types";

type Client = Database["public"]["Tables"]["clients"]["Row"];

const FRAMEWORKS = ["CBN", "NDPC", "SEC", "FIRS", "NCC", "FATF"];
const STAGES = [
  "Pre-revenue / MVP",
  "Revenue-stage (Seed – Series A)",
  "Growth (Series B+)",
  "Regulated entity already",
];

const emptyForm = { company: "", email: "", stage: "", model: "", frameworks: [] as string[] };

export default function AdminClientsPage() {
  const supabase = createClient();
  const [clients, setClients] = useState<Client[] | null>(null);
  const [search, setSearch] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const [deleteTarget, setDeleteTarget] = useState<{ id: string; company: string } | null>(null);

  useEffect(() => {
    loadClients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadClients() {
    const { data, error } = await supabase
      .from("clients")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      console.error(error);
      return;
    }
    setClients(data ?? []);
  }

  function openAddModal() {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEditModal(c: Client) {
    setEditingId(c.id);
    setForm({
      company: c.company || "",
      email: c.email || "",
      stage: c.stage || "",
      model: c.business_model || "",
      frameworks: c.frameworks || [],
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

  async function saveClient() {
    if (!form.company.trim() || !form.email.trim()) {
      alert("Company and email are required.");
      return;
    }

    const payload = {
      company: form.company.trim(),
      email: form.email.trim(),
      stage: form.stage,
      business_model: form.model.trim(),
      frameworks: form.frameworks,
    };

    const { error } = editingId
      ? await supabase.from("clients").update(payload).eq("id", editingId)
      : await supabase.from("clients").insert([payload]);

    if (error) {
      alert("Failed to save. Try again.");
      console.error(error);
      return;
    }

    setModalOpen(false);
    loadClients();
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    const { error } = await supabase.from("clients").delete().eq("id", deleteTarget.id);
    if (error) {
      alert("Failed to delete. Try again.");
      console.error(error);
      return;
    }
    setDeleteTarget(null);
    loadClients();
  }

  const filtered = (clients ?? []).filter((c) => {
    const q = search.toLowerCase();
    return (
      !q ||
      (c.company || "").toLowerCase().includes(q) ||
      (c.email || "").toLowerCase().includes(q)
    );
  });

  return (
    <>
      <div className="border-b border-rule px-8 py-5 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight-display">
            Clients
          </h1>
          <p className="text-[11px] font-light tracking-loose-body text-ash mt-0.5">
            Active onboarded clients
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-ink text-paper text-sm font-light px-5 py-2.5 hover:bg-clay transition-colors duration-300"
        >
          + Add client
        </button>
      </div>

      <div className="px-8 py-4 border-b border-rule">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search company or email..."
          className="bg-transparent border border-rule px-3 py-2 text-sm font-light font-body text-ink w-64 transition-colors"
        />
      </div>

      <div className="px-8 py-6">
        {clients === null && (
          <div className="py-20 text-center">
            <p className="text-sm font-light text-ash">Loading clients...</p>
          </div>
        )}

        {clients !== null && filtered.length === 0 && (
          <div className="py-20 text-center">
            <p className="font-display text-2xl font-semibold tracking-tight-display text-ink mb-2">
              No clients yet.
            </p>
            <p className="text-sm font-light text-ash">
              Approve a request to add your first client.
            </p>
          </div>
        )}

        {clients !== null && filtered.length > 0 && (
          <table className="w-full">
            <thead>
              <tr className="border-b border-rule">
                <th className="text-left text-[10px] font-light tracking-[0.2em] uppercase text-ash pb-3 pr-6">Company</th>
                <th className="text-left text-[10px] font-light tracking-[0.2em] uppercase text-ash pb-3 pr-6">Email</th>
                <th className="text-left text-[10px] font-light tracking-[0.2em] uppercase text-ash pb-3 pr-6">Stage</th>
                <th className="text-left text-[10px] font-light tracking-[0.2em] uppercase text-ash pb-3 pr-6">Frameworks</th>
                <th className="text-left text-[10px] font-light tracking-[0.2em] uppercase text-ash pb-3 pr-6">Added</th>
                <th className="text-left text-[10px] font-light tracking-[0.2em] uppercase text-ash pb-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className="border-b border-rule hover:bg-rule/20 transition-colors">
                  <td className="py-4 pr-6 text-sm font-light text-ink">{c.company || "—"}</td>
                  <td className="py-4 pr-6 text-sm font-light text-ash">{c.email || "—"}</td>
                  <td className="py-4 pr-6 text-sm font-light text-ash">{c.stage || "—"}</td>
                  <td className="py-4 pr-6 text-sm font-light text-ash">
                    {(c.frameworks || []).join(", ") || "—"}
                  </td>
                  <td className="py-4 pr-6 text-sm font-light text-ash">
                    {new Date(c.created_at).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => openEditModal(c)}
                        className="text-[11px] font-light text-ash hover:text-ink transition-colors border-b border-ash/40 pb-px"
                      >
                        Edit →
                      </button>
                      <Link
                        href={`/admin/clients/${c.id}`}
                        className="text-[11px] font-light text-ash hover:text-ink transition-colors border-b border-ash/40 pb-px"
                      >
                        Manage →
                      </Link>
                      <button
                        onClick={() => setDeleteTarget({ id: c.id, company: c.company || "" })}
                        className="text-[11px] font-light text-clay hover:text-ink transition-colors border-b border-clay/40 pb-px"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <ModalHeader
          eyebrow={editingId ? "Edit client" : "Add client"}
          title="Client details"
          onClose={() => setModalOpen(false)}
        />

        <div className="space-y-5 mb-8">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className={labelClass}>Company name</label>
              <input
                value={form.company}
                onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
                placeholder="Acme Fintech Ltd"
                className={inputClass}
              />
            </div>
            <div className="space-y-2">
              <label className={labelClass}>Work email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="ceo@company.com"
                className={inputClass}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className={labelClass}>Stage</label>
            <select
              value={form.stage}
              onChange={(e) => setForm((f) => ({ ...f, stage: e.target.value }))}
              className={selectClass}
            >
              <option value="" disabled>Select stage</option>
              {STAGES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className={labelClass}>Business model</label>
            <input
              value={form.model}
              onChange={(e) => setForm((f) => ({ ...f, model: e.target.value }))}
              placeholder="e.g. Cross-border payments for SMEs"
              className={inputClass}
            />
          </div>

          <div className="space-y-2">
            <label className={labelClass}>Applicable frameworks</label>
            <div className="grid grid-cols-2 gap-2">
              {FRAMEWORKS.map((fw) => (
                <label
                  key={fw}
                  className="flex items-center gap-2 text-sm font-light text-ink cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={form.frameworks.includes(fw)}
                    onChange={() => toggleFramework(fw)}
                  />
                  {fw === "SEC" ? "SEC Nigeria" : fw}
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-rule pt-6 flex gap-4">
          <button
            onClick={saveClient}
            className="bg-ink text-paper text-sm font-light px-6 py-3 hover:bg-clay transition-colors duration-300"
          >
            Save client
          </button>
          <button
            onClick={() => setModalOpen(false)}
            className="border border-rule text-sm font-light px-6 py-3 text-ash hover:border-ash transition-colors"
          >
            Cancel
          </button>
        </div>
      </Modal>

      <ConfirmModal
        open={deleteTarget !== null}
        title="Remove client?"
        body={
          <>
            You are about to remove{" "}
            <span className="text-ink font-normal">{deleteTarget?.company}</span>{" "}
            from Komply. This will delete all their data including gap
            reports, roadmap items, and documents. This cannot be undone.
          </>
        }
        confirmLabel="Yes, remove client"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}
