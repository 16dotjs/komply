"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ConfirmModal, Modal, ModalHeader, inputClass, selectClass, labelClass } from "@/components/admin/Modal";
import type { Database } from "@/lib/supabase/database.types";

type Client = Database["public"]["Tables"]["clients"]["Row"];
type Gap = Database["public"]["Tables"]["gap_reports"]["Row"];
type RoadmapItem = Database["public"]["Tables"]["roadmap_items"]["Row"];
type Doc = Database["public"]["Tables"]["documents"]["Row"];
type Task = Database["public"]["Tables"]["remediation_tasks"]["Row"];

type Tab = "gap" | "roadmap" | "documents" | "tasks";
const TABS: { id: Tab; label: string }[] = [
  { id: "gap", label: "Gap Report" },
  { id: "roadmap", label: "Roadmap" },
  { id: "documents", label: "Documents" },
  { id: "tasks", label: "Tasks" },
];

const FRAMEWORKS = ["CBN", "NDPC", "SEC", "FIRS", "NCC", "FATF"];

const emptyGapForm = { title: "", framework: "", severity: "medium", description: "", action: "", status: "open" };
const emptyRoadmapForm = { title: "", description: "", status: "pending", due: "", order: "" };
const emptyDocForm = { name: "", description: "", category: "", type: "" };
const emptyTaskForm = { title: "", description: "", priority: "medium", status: "not_started", due: "", framework: "" };

export default function ClientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const clientId = params.id as string;
  const supabase = createClient();

  const [client, setClient] = useState<Client | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("gap");
  const [generating, setGenerating] = useState(false);

  const [gaps, setGaps] = useState<Gap[] | null>(null);
  const [roadmap, setRoadmap] = useState<RoadmapItem[] | null>(null);
  const [docs, setDocs] = useState<Doc[] | null>(null);
  const [tasks, setTasks] = useState<Task[] | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [gapForm, setGapForm] = useState(emptyGapForm);
  const [roadmapForm, setRoadmapForm] = useState(emptyRoadmapForm);
  const [docForm, setDocForm] = useState(emptyDocForm);
  const [docFile, setDocFile] = useState<File | null>(null);
  const [taskForm, setTaskForm] = useState(emptyTaskForm);
  const [uploading, setUploading] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<{ table: string; id: string; tab: Tab } | null>(null);

  useEffect(() => {
    if (!clientId) {
      router.push("/admin/clients");
      return;
    }
    loadClient();
    loadGaps();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientId]);

  async function loadClient() {
    const { data } = await supabase.from("clients").select("*").eq("id", clientId).single();
    setClient(data);
  }

  async function loadGaps() {
    const { data } = await supabase
      .from("gap_reports")
      .select("*")
      .eq("client_id", clientId)
      .order("created_at", { ascending: false });
    setGaps(data ?? []);
  }
  async function loadRoadmap() {
    const { data } = await supabase
      .from("roadmap_items")
      .select("*")
      .eq("client_id", clientId)
      .order("order_index", { ascending: true });
    setRoadmap(data ?? []);
  }
  async function loadDocuments() {
    const { data } = await supabase
      .from("documents")
      .select("*")
      .eq("client_id", clientId)
      .order("created_at", { ascending: false });
    setDocs(data ?? []);
  }
  async function loadTasks() {
    const { data } = await supabase
      .from("remediation_tasks")
      .select("*")
      .eq("client_id", clientId)
      .order("created_at", { ascending: true });
    setTasks(data ?? []);
  }

  function switchTab(tab: Tab) {
    setActiveTab(tab);
    if (tab === "gap" && gaps === null) loadGaps();
    if (tab === "roadmap" && roadmap === null) loadRoadmap();
    if (tab === "documents" && docs === null) loadDocuments();
    if (tab === "tasks" && tasks === null) loadTasks();
  }

  function openModal() {
    if (activeTab === "gap") setGapForm(emptyGapForm);
    if (activeTab === "roadmap") setRoadmapForm(emptyRoadmapForm);
    if (activeTab === "documents") {
      setDocForm(emptyDocForm);
      setDocFile(null);
    }
    if (activeTab === "tasks") setTaskForm(emptyTaskForm);
    setModalOpen(true);
  }

  async function saveItem() {
    if (activeTab === "gap") {
      if (!gapForm.title.trim()) return alert("Title is required.");
      const { error } = await supabase.from("gap_reports").insert([
        {
          client_id: clientId,
          title: gapForm.title.trim(),
          framework: gapForm.framework,
          severity: gapForm.severity as Gap["severity"],
          description: gapForm.description.trim(),
          action: gapForm.action.trim(),
          status: gapForm.status as Gap["status"],
        },
      ]);
      if (error) return alert("Failed to save. Try again.");
      setModalOpen(false);
      loadGaps();
    }

    if (activeTab === "roadmap") {
      if (!roadmapForm.title.trim()) return alert("Title is required.");
      const { error } = await supabase.from("roadmap_items").insert([
        {
          client_id: clientId,
          title: roadmapForm.title.trim(),
          description: roadmapForm.description.trim(),
          status: roadmapForm.status as RoadmapItem["status"],
          due_date: roadmapForm.due || null,
          order_index: parseInt(roadmapForm.order) || 0,
        },
      ]);
      if (error) return alert("Failed to save. Try again.");
      setModalOpen(false);
      loadRoadmap();
    }

    if (activeTab === "documents") {
      if (!docForm.name.trim()) return alert("Document name is required.");
      if (!docFile) return alert("Please select a file to upload.");
      if (docFile.size > 20 * 1024 * 1024) return alert("File is too large. Maximum size is 20MB.");

      setUploading(true);
      try {
        const filePath = `${clientId}/${Date.now()}-${docFile.name}`;
        const { error: uploadError } = await supabase.storage
          .from("documents")
          .upload(filePath, docFile, { cacheControl: "3600", upsert: false });
        if (uploadError) throw uploadError;

        const { data: urlData } = await supabase.storage
          .from("documents")
          .createSignedUrl(filePath, 60 * 60 * 24 * 365);

        const { error } = await supabase.from("documents").insert([
          {
            client_id: clientId,
            name: docForm.name.trim(),
            description: docForm.description.trim(),
            file_url: urlData?.signedUrl ?? "",
            file_type: docForm.type || docFile.type,
            file_size: docFile.size,
            category: docForm.category,
          },
        ]);
        if (error) throw error;

        setModalOpen(false);
        setDocFile(null);
        loadDocuments();
      } catch (err) {
        console.error(err);
        alert("Upload failed. Try again.");
      } finally {
        setUploading(false);
      }
    }

    if (activeTab === "tasks") {
      if (!taskForm.title.trim()) return alert("Title is required.");
      const { error } = await supabase.from("remediation_tasks").insert([
        {
          client_id: clientId,
          title: taskForm.title.trim(),
          description: taskForm.description.trim(),
          priority: taskForm.priority as Task["priority"],
          status: taskForm.status as Task["status"],
          due_date: taskForm.due || null,
          framework: taskForm.framework || null,
        },
      ]);
      if (error) return alert("Failed to save. Try again.");
      setModalOpen(false);
      loadTasks();
    }
  }

  async function confirmDeleteItem() {
    if (!deleteTarget) return;
    const { table, id, tab } = deleteTarget;
    await supabase.from(table as "gap_reports").delete().eq("id", id);
    setDeleteTarget(null);
    if (tab === "gap") loadGaps();
    if (tab === "roadmap") loadRoadmap();
    if (tab === "documents") loadDocuments();
    if (tab === "tasks") loadTasks();
  }

  async function generateAnalysis() {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      alert("Session expired. Please sign in again.");
      router.push("/admin/login");
      return;
    }

    setGenerating(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/generate-gap-analysis`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ client_id: clientId }),
        },
      );
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Unknown error");

      alert(
        `Analysis complete.\n\nRisk score: ${data.summary.risk_score}/100\nGaps found: ${data.summary.gaps}\nRecommended license: ${data.summary.recommended_license || "N/A"}\nChecklist items: ${data.summary.checklist_items}`,
      );
      loadGaps();
    } catch (err) {
      console.error(err);
      alert("Failed to generate analysis. Check console for details.");
    } finally {
      setGenerating(false);
    }
  }

  return (
    <>
      <div className="border-b border-rule px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <a href="/admin/clients" className="text-[11px] font-light text-ash hover:text-ink transition-colors">
            ← Clients
          </a>
          <div className="w-px h-4 bg-rule" />
          <div>
            <h1 className="font-display text-2xl font-semibold tracking-tight-display">
              {client?.company || "—"}
            </h1>
            <p className="text-[11px] font-light tracking-loose-body text-ash mt-0.5">
              {client?.email || "—"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-light tracking-[0.15em] uppercase text-ash border border-rule px-3 py-1.5">
            {client?.stage || "—"}
          </span>
          <button
            onClick={generateAnalysis}
            disabled={generating}
            className="bg-clay text-paper text-sm font-light px-5 py-2.5 hover:bg-ink transition-colors duration-300 disabled:opacity-60"
          >
            {generating ? "Generating..." : "Generate analysis"}
          </button>
        </div>
      </div>

      <div className="px-8 border-b border-rule flex items-center">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => switchTab(t.id)}
            className="tab"
            style={
              activeTab === t.id
                ? { color: "#111110", borderBottomColor: "#BF4A2B" }
                : undefined
            }
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* GAP TAB */}
      {activeTab === "gap" && (
        <div className="px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <p className="text-[10px] font-light tracking-[0.2em] uppercase text-ash">Gap items</p>
            <button onClick={openModal} className="bg-ink text-paper text-sm font-light px-5 py-2.5 hover:bg-clay transition-colors duration-300">
              + Add gap
            </button>
          </div>
          {gaps === null && <div className="py-10 text-center"><p className="text-sm font-light text-ash">Loading...</p></div>}
          {gaps !== null && gaps.length === 0 && <div className="py-10 text-center"><p className="text-sm font-light text-ash">No gap items yet. Add the first one.</p></div>}
          {gaps !== null && gaps.length > 0 && (
            <table className="w-full">
              <thead>
                <tr className="border-b border-rule">
                  <th className="text-left text-[10px] font-light tracking-[0.2em] uppercase text-ash pb-3 pr-6">Title</th>
                  <th className="text-left text-[10px] font-light tracking-[0.2em] uppercase text-ash pb-3 pr-6">Framework</th>
                  <th className="text-left text-[10px] font-light tracking-[0.2em] uppercase text-ash pb-3 pr-6">Severity</th>
                  <th className="text-left text-[10px] font-light tracking-[0.2em] uppercase text-ash pb-3 pr-6">Status</th>
                  <th className="text-left text-[10px] font-light tracking-[0.2em] uppercase text-ash pb-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {gaps.map((g) => (
                  <tr key={g.id} className="border-b border-rule hover:bg-rule/20 transition-colors">
                    <td className="py-3 pr-6 text-sm font-light text-ink">{g.title}</td>
                    <td className="py-3 pr-6 text-sm font-light text-ash">{g.framework || "—"}</td>
                    <td className="py-3 pr-6">
                      <span className="text-[10px] font-light tracking-[0.15em] uppercase" style={{ color: g.severity === "critical" || g.severity === "high" ? "#BF4A2B" : "#8A857E" }}>
                        {g.severity}
                      </span>
                    </td>
                    <td className="py-3 pr-6 text-sm font-light text-ash">{g.status}</td>
                    <td className="py-3">
                      <button onClick={() => setDeleteTarget({ table: "gap_reports", id: g.id, tab: "gap" })} className="text-[11px] font-light text-clay hover:text-ink transition-colors">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* ROADMAP TAB */}
      {activeTab === "roadmap" && (
        <div className="px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <p className="text-[10px] font-light tracking-[0.2em] uppercase text-ash">Roadmap steps</p>
            <button onClick={openModal} className="bg-ink text-paper text-sm font-light px-5 py-2.5 hover:bg-clay transition-colors duration-300">
              + Add step
            </button>
          </div>
          {roadmap === null && <div className="py-10 text-center"><p className="text-sm font-light text-ash">Loading...</p></div>}
          {roadmap !== null && roadmap.length === 0 && <div className="py-10 text-center"><p className="text-sm font-light text-ash">No roadmap steps yet.</p></div>}
          {roadmap !== null && roadmap.length > 0 && (
            <table className="w-full">
              <thead>
                <tr className="border-b border-rule">
                  <th className="text-left text-[10px] font-light tracking-[0.2em] uppercase text-ash pb-3 pr-6">Step</th>
                  <th className="text-left text-[10px] font-light tracking-[0.2em] uppercase text-ash pb-3 pr-6">Title</th>
                  <th className="text-left text-[10px] font-light tracking-[0.2em] uppercase text-ash pb-3 pr-6">Status</th>
                  <th className="text-left text-[10px] font-light tracking-[0.2em] uppercase text-ash pb-3 pr-6">Due date</th>
                  <th className="text-left text-[10px] font-light tracking-[0.2em] uppercase text-ash pb-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {roadmap.map((r) => (
                  <tr key={r.id} className="border-b border-rule hover:bg-rule/20 transition-colors">
                    <td className="py-3 pr-6 text-sm font-light text-ash">{r.order_index}</td>
                    <td className="py-3 pr-6 text-sm font-light text-ink">{r.title}</td>
                    <td className="py-3 pr-6">
                      <span className="text-[10px] font-light tracking-[0.15em] uppercase" style={{ color: r.status === "complete" ? "#4a7c59" : r.status === "in_progress" ? "#BF4A2B" : "#8A857E" }}>
                        {r.status}
                      </span>
                    </td>
                    <td className="py-3 pr-6 text-sm font-light text-ash">{r.due_date || "—"}</td>
                    <td className="py-3">
                      <button onClick={() => setDeleteTarget({ table: "roadmap_items", id: r.id, tab: "roadmap" })} className="text-[11px] font-light text-clay hover:text-ink transition-colors">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* DOCUMENTS TAB */}
      {activeTab === "documents" && (
        <div className="px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <p className="text-[10px] font-light tracking-[0.2em] uppercase text-ash">Shared documents</p>
            <button onClick={openModal} className="bg-ink text-paper text-sm font-light px-5 py-2.5 hover:bg-clay transition-colors duration-300">
              + Add document
            </button>
          </div>
          {docs === null && <div className="py-10 text-center"><p className="text-sm font-light text-ash">Loading...</p></div>}
          {docs !== null && docs.length === 0 && <div className="py-10 text-center"><p className="text-sm font-light text-ash">No documents yet.</p></div>}
          {docs !== null && docs.length > 0 && (
            <table className="w-full">
              <thead>
                <tr className="border-b border-rule">
                  <th className="text-left text-[10px] font-light tracking-[0.2em] uppercase text-ash pb-3 pr-6">Name</th>
                  <th className="text-left text-[10px] font-light tracking-[0.2em] uppercase text-ash pb-3 pr-6">Category</th>
                  <th className="text-left text-[10px] font-light tracking-[0.2em] uppercase text-ash pb-3 pr-6">Added</th>
                  <th className="text-left text-[10px] font-light tracking-[0.2em] uppercase text-ash pb-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {docs.map((d) => (
                  <tr key={d.id} className="border-b border-rule hover:bg-rule/20 transition-colors">
                    <td className="py-3 pr-6 text-sm font-light text-ink">{d.name}</td>
                    <td className="py-3 pr-6 text-sm font-light text-ash">{d.category || "—"}</td>
                    <td className="py-3 pr-6 text-sm font-light text-ash">
                      {new Date(d.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="py-3 flex gap-4">
                      <a href={d.file_url} target="_blank" rel="noopener noreferrer" className="text-[11px] font-light text-ash hover:text-ink transition-colors border-b border-ash/40 pb-px">
                        View →
                      </a>
                      <button onClick={() => setDeleteTarget({ table: "documents", id: d.id, tab: "documents" })} className="text-[11px] font-light text-clay hover:text-ink transition-colors">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* TASKS TAB */}
      {activeTab === "tasks" && (
        <div className="px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <p className="text-[10px] font-light tracking-[0.2em] uppercase text-ash">Remediation tasks</p>
            <button onClick={openModal} className="bg-ink text-paper text-sm font-light px-5 py-2.5 hover:bg-clay transition-colors duration-300">
              + Add task
            </button>
          </div>
          {tasks === null && <div className="py-10 text-center"><p className="text-sm font-light text-ash">Loading...</p></div>}
          {tasks !== null && tasks.length === 0 && <div className="py-10 text-center"><p className="text-sm font-light text-ash">No tasks yet. Add the first one.</p></div>}
          {tasks !== null && tasks.length > 0 && (
            <table className="w-full">
              <thead>
                <tr className="border-b border-rule">
                  <th className="text-left text-[10px] font-light tracking-[0.2em] uppercase text-ash pb-3 pr-6">Title</th>
                  <th className="text-left text-[10px] font-light tracking-[0.2em] uppercase text-ash pb-3 pr-6">Priority</th>
                  <th className="text-left text-[10px] font-light tracking-[0.2em] uppercase text-ash pb-3 pr-6">Status</th>
                  <th className="text-left text-[10px] font-light tracking-[0.2em] uppercase text-ash pb-3 pr-6">Due date</th>
                  <th className="text-left text-[10px] font-light tracking-[0.2em] uppercase text-ash pb-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((t) => (
                  <tr key={t.id} className="border-b border-rule hover:bg-rule/20 transition-colors">
                    <td className="py-3 pr-6 text-sm font-light text-ink">{t.title}</td>
                    <td className="py-3 pr-6">
                      <span className="text-[10px] font-light tracking-[0.15em] uppercase" style={{ color: t.priority === "critical" || t.priority === "high" ? "#BF4A2B" : t.priority === "medium" ? "#8A857E" : "#C4C0BB" }}>
                        {t.priority || "—"}
                      </span>
                    </td>
                    <td className="py-3 pr-6">
                      <span className="text-[10px] font-light tracking-[0.15em] uppercase" style={{ color: t.status === "complete" ? "#4a7c59" : t.status === "in_progress" ? "#8A857E" : "#BF4A2B" }}>
                        {t.status}
                      </span>
                    </td>
                    <td className="py-3 pr-6 text-sm font-light text-ash">{t.due_date || "—"}</td>
                    <td className="py-3">
                      <button onClick={() => setDeleteTarget({ table: "remediation_tasks", id: t.id, tab: "tasks" })} className="text-[11px] font-light text-clay hover:text-ink transition-colors">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* ADD ITEM MODAL — form varies by activeTab */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <ModalHeader
          eyebrow={
            activeTab === "gap" ? "Add gap item" :
            activeTab === "roadmap" ? "Add roadmap step" :
            activeTab === "documents" ? "Add document" : "Add task"
          }
          title={
            activeTab === "gap" ? "Gap detail" :
            activeTab === "roadmap" ? "Step detail" :
            activeTab === "documents" ? "Document detail" : "Task detail"
          }
          onClose={() => setModalOpen(false)}
        />

        {activeTab === "gap" && (
          <div className="space-y-5">
            <div className="space-y-2">
              <label className={labelClass}>Title</label>
              <input value={gapForm.title} onChange={(e) => setGapForm((f) => ({ ...f, title: e.target.value }))} placeholder="e.g. Missing AML policy documentation" className={inputClass} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className={labelClass}>Framework</label>
                <select value={gapForm.framework} onChange={(e) => setGapForm((f) => ({ ...f, framework: e.target.value }))} className={selectClass}>
                  <option value="">Select framework</option>
                  {FRAMEWORKS.map((fw) => <option key={fw}>{fw}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className={labelClass}>Severity</label>
                <select value={gapForm.severity} onChange={(e) => setGapForm((f) => ({ ...f, severity: e.target.value }))} className={selectClass}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className={labelClass}>Description</label>
              <textarea value={gapForm.description} onChange={(e) => setGapForm((f) => ({ ...f, description: e.target.value }))} rows={3} placeholder="Explain the gap in detail..." className={`${inputClass} resize-none`} />
            </div>
            <div className="space-y-2">
              <label className={labelClass}>Recommended action</label>
              <textarea value={gapForm.action} onChange={(e) => setGapForm((f) => ({ ...f, action: e.target.value }))} rows={2} placeholder="What should the client do to fix this?" className={`${inputClass} resize-none`} />
            </div>
            <div className="space-y-2">
              <label className={labelClass}>Status</label>
              <select value={gapForm.status} onChange={(e) => setGapForm((f) => ({ ...f, status: e.target.value }))} className={selectClass}>
                <option value="open">Open</option>
                <option value="in_progress">In progress</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
          </div>
        )}

        {activeTab === "roadmap" && (
          <div className="space-y-5">
            <div className="space-y-2">
              <label className={labelClass}>Step title</label>
              <input value={roadmapForm.title} onChange={(e) => setRoadmapForm((f) => ({ ...f, title: e.target.value }))} placeholder="e.g. Submit CBN PSB license application" className={inputClass} />
            </div>
            <div className="space-y-2">
              <label className={labelClass}>Description</label>
              <textarea value={roadmapForm.description} onChange={(e) => setRoadmapForm((f) => ({ ...f, description: e.target.value }))} rows={3} placeholder="What does this step involve?" className={`${inputClass} resize-none`} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className={labelClass}>Status</label>
                <select value={roadmapForm.status} onChange={(e) => setRoadmapForm((f) => ({ ...f, status: e.target.value }))} className={selectClass}>
                  <option value="pending">Pending</option>
                  <option value="in_progress">In progress</option>
                  <option value="complete">Complete</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className={labelClass}>Due date</label>
                <input type="date" value={roadmapForm.due} onChange={(e) => setRoadmapForm((f) => ({ ...f, due: e.target.value }))} className={inputClass} />
              </div>
            </div>
            <div className="space-y-2">
              <label className={labelClass}>Order index</label>
              <input type="number" min={1} value={roadmapForm.order} onChange={(e) => setRoadmapForm((f) => ({ ...f, order: e.target.value }))} placeholder="1" className={inputClass} />
            </div>
          </div>
        )}

        {activeTab === "documents" && (
          <div className="space-y-5">
            <div className="space-y-2">
              <label className={labelClass}>Document name</label>
              <input value={docForm.name} onChange={(e) => setDocForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. AML Policy Template" className={inputClass} />
            </div>
            <div className="space-y-2">
              <label className={labelClass}>Description</label>
              <textarea value={docForm.description} onChange={(e) => setDocForm((f) => ({ ...f, description: e.target.value }))} rows={2} placeholder="Brief description of this document..." className={`${inputClass} resize-none`} />
            </div>
            <div className="space-y-2">
              <label className={labelClass}>Upload file</label>
              <input
                type="file"
                accept=".pdf,.doc,.docx,.xlsx,.csv,.png,.jpg"
                onChange={(e) => setDocFile(e.target.files?.[0] ?? null)}
                className="w-full bg-transparent border border-rule px-4 py-3 text-sm font-light font-body text-ash transition-colors cursor-pointer"
              />
              <p className="text-[11px] font-light text-ash">PDF, Word, Excel, images — max 20MB</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className={labelClass}>Category</label>
                <select value={docForm.category} onChange={(e) => setDocForm((f) => ({ ...f, category: e.target.value }))} className={selectClass}>
                  <option value="">Select category</option>
                  <option>Gap Report</option>
                  <option>Policy Template</option>
                  <option>License Application</option>
                  <option>Regulatory Circular</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className={labelClass}>File type</label>
                <select value={docForm.type} onChange={(e) => setDocForm((f) => ({ ...f, type: e.target.value }))} className={selectClass}>
                  <option value="">Select type</option>
                  <option value="application/pdf">PDF</option>
                  <option value="application/word">Word</option>
                  <option value="application/sheet">Spreadsheet</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {activeTab === "tasks" && (
          <div className="space-y-5">
            <div className="space-y-2">
              <label className={labelClass}>Task title</label>
              <input value={taskForm.title} onChange={(e) => setTaskForm((f) => ({ ...f, title: e.target.value }))} placeholder="e.g. Draft AML policy document" className={inputClass} />
            </div>
            <div className="space-y-2">
              <label className={labelClass}>Description</label>
              <textarea value={taskForm.description} onChange={(e) => setTaskForm((f) => ({ ...f, description: e.target.value }))} rows={3} placeholder="What does this task involve?" className={`${inputClass} resize-none`} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className={labelClass}>Priority</label>
                <select value={taskForm.priority} onChange={(e) => setTaskForm((f) => ({ ...f, priority: e.target.value }))} className={selectClass}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className={labelClass}>Status</label>
                <select value={taskForm.status} onChange={(e) => setTaskForm((f) => ({ ...f, status: e.target.value }))} className={selectClass}>
                  <option value="not_started">Not started</option>
                  <option value="in_progress">In progress</option>
                  <option value="complete">Complete</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className={labelClass}>Due date</label>
                <input type="date" value={taskForm.due} onChange={(e) => setTaskForm((f) => ({ ...f, due: e.target.value }))} className={inputClass} />
              </div>
              <div className="space-y-2">
                <label className={labelClass}>Framework</label>
                <select value={taskForm.framework} onChange={(e) => setTaskForm((f) => ({ ...f, framework: e.target.value }))} className={selectClass}>
                  <option value="">Select framework</option>
                  {FRAMEWORKS.map((fw) => <option key={fw}>{fw}</option>)}
                </select>
              </div>
            </div>
          </div>
        )}

        <div className="border-t border-rule pt-6 mt-6 flex gap-4">
          <button onClick={saveItem} disabled={uploading} className="bg-ink text-paper text-sm font-light px-6 py-3 hover:bg-clay transition-colors duration-300 disabled:opacity-60">
            {uploading ? "Uploading..." : "Save"}
          </button>
          <button onClick={() => setModalOpen(false)} className="border border-rule text-sm font-light px-6 py-3 text-ash hover:border-ash transition-colors">
            Cancel
          </button>
        </div>
      </Modal>

      <ConfirmModal
        open={deleteTarget !== null}
        title="Delete this item?"
        body="This action cannot be undone. The item will be permanently removed from this client's record."
        confirmLabel="Yes, delete"
        onConfirm={confirmDeleteItem}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}
