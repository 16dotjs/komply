"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Modal, ModalHeader, inputClass, selectClass, labelClass } from "@/components/admin/Modal";
import type { Database } from "@/lib/supabase/database.types";

type Request = Database["public"]["Tables"]["requests"]["Row"];

function statusStyle(status: string) {
  return status === "approved"
    ? { color: "#4a7c59" }
    : status === "rejected"
      ? { color: "#BF4A2B" }
      : { color: "#8A857E" };
}

export default function AdminDashboardPage() {
  const supabase = createClient();
  const [requests, setRequests] = useState<Request[] | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<Request | null>(null);
  const [modalStatus, setModalStatus] = useState<string>("pending");
  const [internalNotes, setInternalNotes] = useState("");

  useEffect(() => {
    loadRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadRequests() {
    const { data, error } = await supabase
      .from("requests")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      console.error(error);
      return;
    }
    setRequests(data ?? []);
  }

  function openModal(r: Request) {
    setSelected(r);
    setModalStatus(r.status || "pending");
    setInternalNotes("");
    setModalOpen(true);
  }

  async function updateRequest() {
    if (!selected) return;
    const updates: Partial<Request> = { status: modalStatus as Request["status"] };
    if (internalNotes.trim()) updates.notes = internalNotes.trim();

    const { error } = await supabase
      .from("requests")
      .update(updates)
      .eq("id", selected.id);

    if (error) {
      alert("Failed to update. Try again.");
      return;
    }

    setRequests((prev) =>
      prev
        ? prev.map((r) => (r.id === selected.id ? { ...r, ...updates } : r))
        : prev,
    );
    setModalOpen(false);

    if (modalStatus === "approved") {
      const ok = window.confirm(
        `Request approved. Send a portal invite to ${selected.email}?`,
      );
      if (ok) inviteClient({ ...selected, ...updates });
    }
  }

  async function inviteClient(request: Request) {
    const { error } = await supabase.from("clients").insert([
      {
        company: request.company,
        email: request.email,
        stage: request.stage,
        business_model: request.what_you_do,
        request_id: request.id,
        invite_status: "invited",
        invited_at: new Date().toISOString(),
      },
    ]);

    if (error && !error.message.includes("duplicate")) {
      alert("Could not create client record: " + error.message);
      return;
    }

    await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/send-email`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          type: "client_welcome",
          data: { company: request.company, email: request.email },
        }),
      },
    );

    alert(`Client record created and welcome email sent to ${request.email}`);
  }

  const pendingCount = requests?.filter((r) => r.status === "pending").length ?? 0;
  const filtered = (requests ?? []).filter((r) => {
    const matchesStatus = statusFilter === "all" || r.status === statusFilter;
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      (r.company || "").toLowerCase().includes(q) ||
      (r.email || "").toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  return (
    <>
      <div className="border-b border-rule px-8 py-5 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight-display">
            Requests
          </h1>
          <p className="text-[11px] font-light tracking-loose-body text-ash mt-0.5">
            Incoming access requests
          </p>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="font-display text-2xl font-semibold text-ink">
              {requests === null ? "—" : pendingCount}
            </p>
            <p className="text-[10px] font-light tracking-[0.15em] uppercase text-ash">
              Pending
            </p>
          </div>
          <div className="w-px h-8 bg-rule" />
          <div className="text-right">
            <p className="font-display text-2xl font-semibold text-ink">
              {requests === null ? "—" : requests.length}
            </p>
            <p className="text-[10px] font-light tracking-[0.15em] uppercase text-ash">
              Total
            </p>
          </div>
        </div>
      </div>

      <div className="px-8 py-4 border-b border-rule flex items-center gap-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className={selectClass}
        >
          <option value="all">All requests</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search company or email..."
          className="bg-transparent border border-rule px-3 py-2 text-sm font-light font-body text-ink w-64 transition-colors"
        />
      </div>

      <div className="px-8 py-6">
        {requests === null && (
          <div className="py-20 text-center">
            <p className="text-sm font-light text-ash">Loading requests...</p>
          </div>
        )}

        {requests !== null && filtered.length === 0 && (
          <div className="py-20 text-center">
            <p className="font-display text-2xl font-semibold tracking-tight-display text-ink mb-2">
              No requests yet.
            </p>
            <p className="text-sm font-light text-ash">
              Submissions from the contact form will appear here.
            </p>
          </div>
        )}

        {requests !== null && filtered.length > 0 && (
          <table className="w-full">
            <thead>
              <tr className="border-b border-rule">
                <th className="text-left text-[10px] font-light tracking-[0.2em] uppercase text-ash pb-3 pr-6">Company</th>
                <th className="text-left text-[10px] font-light tracking-[0.2em] uppercase text-ash pb-3 pr-6">Email</th>
                <th className="text-left text-[10px] font-light tracking-[0.2em] uppercase text-ash pb-3 pr-6">Stage</th>
                <th className="text-left text-[10px] font-light tracking-[0.2em] uppercase text-ash pb-3 pr-6">Status</th>
                <th className="text-left text-[10px] font-light tracking-[0.2em] uppercase text-ash pb-3 pr-6">Date</th>
                <th className="text-left text-[10px] font-light tracking-[0.2em] uppercase text-ash pb-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr
                  key={r.id}
                  onClick={() => openModal(r)}
                  className="border-b border-rule hover:bg-rule/20 transition-colors cursor-pointer"
                >
                  <td className="py-4 pr-6 text-sm font-light text-ink">{r.company || "—"}</td>
                  <td className="py-4 pr-6 text-sm font-light text-ash">{r.email || "—"}</td>
                  <td className="py-4 pr-6 text-sm font-light text-ash">{r.stage || "—"}</td>
                  <td className="py-4 pr-6">
                    <span
                      className="text-[10px] font-light tracking-[0.15em] uppercase"
                      style={statusStyle(r.status)}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="py-4 pr-6 text-sm font-light text-ash">
                    {new Date(r.created_at).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="py-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openModal(r);
                      }}
                      className="text-[11px] font-light text-ash hover:text-ink transition-colors border-b border-ash/40 pb-px"
                    >
                      View →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        {selected && (
          <>
            <ModalHeader
              eyebrow="Request detail"
              title={selected.company || "—"}
              onClose={() => setModalOpen(false)}
            />

            <div className="space-y-5 mb-8">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className={labelClass}>Email</p>
                  <p className="text-sm font-light text-ink">{selected.email || "—"}</p>
                </div>
                <div>
                  <p className={labelClass}>Stage</p>
                  <p className="text-sm font-light text-ink">{selected.stage || "—"}</p>
                </div>
                <div>
                  <p className={labelClass}>Urgency</p>
                  <p className="text-sm font-light text-ink">{selected.urgency || "—"}</p>
                </div>
                <div>
                  <p className={labelClass}>Submitted</p>
                  <p className="text-sm font-light text-ink">
                    {new Date(selected.created_at).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <div>
                <p className={labelClass}>What they do</p>
                <p className="text-sm font-light text-ink leading-relaxed">
                  {selected.what_you_do || "—"}
                </p>
              </div>

              <div>
                <p className={labelClass}>Compliance concern</p>
                <p className="text-sm font-light text-ink leading-relaxed">
                  {selected.concern || "—"}
                </p>
              </div>

              <div>
                <p className={labelClass}>Additional notes</p>
                <p className="text-sm font-light text-ink leading-relaxed">
                  {selected.notes || "—"}
                </p>
              </div>
            </div>

            <div className="border-t border-rule pt-6 space-y-4">
              <div className="space-y-2">
                <label className={labelClass}>Update status</label>
                <select
                  value={modalStatus}
                  onChange={(e) => setModalStatus(e.target.value)}
                  className={selectClass}
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className={labelClass}>Internal notes</label>
                <textarea
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                  rows={3}
                  placeholder="Add internal notes about this request..."
                  className={`${inputClass} resize-none`}
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={updateRequest}
                  className="bg-ink text-paper text-sm font-light px-6 py-3 hover:bg-clay transition-colors duration-300"
                >
                  Save changes
                </button>
                <button
                  onClick={() => setModalOpen(false)}
                  className="border border-rule text-sm font-light px-6 py-3 text-ash hover:border-ash transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </>
        )}
      </Modal>
    </>
  );
}
