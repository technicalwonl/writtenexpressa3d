"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Briefcase,
  Plus,
  Edit2,
  Trash2,
  Star,
  ExternalLink,
  Search,
  X,
  Upload,
  FileText,
  Video,
  Presentation,
  CheckCircle2,
  Loader2,
} from "lucide-react";

export default function AdminPortfolioPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const categories = [
    "Academic Projects",
    "PowerPoint Presentations",
    "Notes & Documentation",
    "Technical Projects",
    "Custom Magazines",
    "Creative Designs",
    "Websites & Applications",
    "IoT & Embedded Projects",
    "AI & Machine Learning",
  ];

  const [form, setForm] = useState({
    id: "",
    title: "",
    category: "Academic Projects",
    mediaType: "document",
    mediaUrl: "",
    previewImage: "/hero-sequence/frame_075.webp",
    shortDescription: "",
    fullDescription: "",
    deliverables: "IEEE Documentation, Source Files",
    toolsUsed: "Proteus, LaTeX, Office",
    clientType: "Engineering Capstone / Academic",
    status: "Published",
    featured: true,
  });

  useEffect(() => {
    fetchPortfolio();
  }, []);

  async function fetchPortfolio() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/portfolio");
      const data = await res.json();
      if (data.success) {
        setProjects(data.portfolio || []);
      }
    } catch (e) {
      console.error("Failed to load portfolio:", e);
    } finally {
      setLoading(false);
    }
  }

  function openCreateModal() {
    setEditingProject(null);
    setForm({
      id: `proj_${Date.now()}`,
      title: "",
      category: "Academic Projects",
      mediaType: "document",
      mediaUrl: "",
      previewImage: "",
      shortDescription: "",
      fullDescription: "",
      deliverables: "Final Deliverable, Verification Report",
      toolsUsed: "Design & Engineering Suite",
      clientType: "Academic Project",
      status: "Published",
      featured: true,
    });
    setUploadError("");
    setIsModalOpen(true);
  }

  function openEditModal(item: any) {
    setEditingProject(item);
    setForm({
      id: item.id,
      title: item.title,
      category: item.category,
      mediaType: item.mediaType || "document",
      mediaUrl: item.mediaUrl || "",
      previewImage: item.previewImage || "",
      shortDescription: item.shortDescription || "",
      fullDescription: item.fullDescription || item.shortDescription || "",
      deliverables: Array.isArray(item.deliverables) ? item.deliverables.join(", ") : item.deliverables || "",
      toolsUsed: Array.isArray(item.toolsUsed) ? item.toolsUsed.join(", ") : item.toolsUsed || "",
      clientType: item.clientType || "Academic Project",
      status: item.status || "Published",
      featured: Boolean(item.featured),
    });
    setUploadError("");
    setIsModalOpen(true);
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError("");

    try {
      const data = new FormData();
      data.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: data,
      });

      const json = await res.json();
      if (json.success && json.file) {
        const cleanName = (json.file.originalName || "")
          .replace(/\.[^/.]+$/, "")
          .replace(/[_-]+/g, " ")
          .trim();
        const autoTitle = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);

        setForm((prev) => ({
          ...prev,
          mediaUrl: json.file.url,
          mediaType: json.file.mediaType,
          previewImage: json.file.mediaType === "image" ? json.file.url : prev.previewImage,
          title: prev.title.trim().length > 0 ? prev.title : autoTitle,
        }));
      } else {
        setUploadError(json.message || "Upload failed");
      }
    } catch (err) {
      setUploadError("Error uploading file to server");
    } finally {
      setUploading(false);
    }
  }

  async function handleSaveProject(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      ...form,
      deliverables: form.deliverables.split(",").map((d) => d.trim()).filter((d) => d.length > 0),
      toolsUsed: form.toolsUsed.split(",").map((t) => t.trim()).filter((t) => t.length > 0),
    };

    try {
      const method = editingProject ? "PUT" : "POST";
      const res = await fetch("/api/admin/portfolio", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setIsModalOpen(false);
        fetchPortfolio();
      } else {
        alert("Failed to save project");
      }
    } catch (err) {
      alert("Error saving project");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this portfolio project permanently?")) return;
    try {
      const res = await fetch(`/api/admin/portfolio?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setProjects((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (e) {
      alert("Failed to delete project");
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-serif text-[#111318]">
            Portfolio & Media Gallery Management
          </h2>
          <p className="text-xs text-neutral-500">
            Upload student deliverables, presentations, project videos, and manage the public showcase
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/portfolio"
            target="_blank"
            className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors flex items-center gap-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Public Gallery</span>
          </Link>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-1.5 bg-[#C8102E] text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-[#a00d24] transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Upload New Project</span>
          </button>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          <div className="col-span-3 py-16 text-center text-neutral-400 text-xs">
            Loading portfolio items...
          </div>
        ) : (
          projects.map((proj) => (
            <div
              key={proj.id}
              className="bg-white border border-neutral-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:border-[#C8102E]/30 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#C8102E] bg-red-50 px-2 py-0.5 rounded-md">
                    {proj.category}
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase px-1.5 py-0.5 rounded bg-zinc-100">
                      {proj.mediaType || "doc"}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        proj.status === "Published"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-neutral-100 text-neutral-600"
                      }`}
                    >
                      {proj.status}
                    </span>
                  </div>
                </div>

                {/* Media Thumbnail Preview */}
                {proj.mediaUrl && (
                  <div className="relative aspect-16/9 w-full bg-zinc-950 rounded-xl overflow-hidden mb-3 border border-zinc-200/60">
                    {proj.mediaType === "video" || proj.mediaUrl.match(/\.(mp4|webm|mov)$/i) ? (
                      <div className="relative w-full h-full flex items-center justify-center bg-black">
                        <video
                          src={proj.mediaUrl}
                          className="w-full h-full object-cover"
                          muted
                          playsInline
                          preload="metadata"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                          <span className="w-7 h-7 rounded-full bg-[#C8102E] text-white flex items-center justify-center shadow-sm">
                            <Video className="w-3.5 h-3.5 fill-white" />
                          </span>
                        </div>
                      </div>
                    ) : proj.mediaType === "image" || proj.mediaUrl.match(/\.(jpg|jpeg|png|webp|svg|gif)$/i) ? (
                      <img src={proj.mediaUrl} alt={proj.title} className="w-full h-full object-cover" />
                    ) : proj.mediaType === "pdf" || proj.mediaUrl.endsWith(".pdf") ? (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-red-50 text-red-600 p-2 text-center">
                        <FileText className="w-6 h-6 mb-1" />
                        <span className="text-[10px] font-bold uppercase">PDF Deliverable</span>
                      </div>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-100 text-zinc-600 p-2 text-center">
                        <Presentation className="w-6 h-6 text-[#C8102E] mb-1" />
                        <span className="text-[10px] font-bold uppercase">{proj.mediaType || "Document"}</span>
                      </div>
                    )}
                  </div>
                )}

                <h3 className="text-sm font-bold font-serif text-[#111318] line-clamp-2">{proj.title}</h3>
                <p className="text-xs text-neutral-500 mt-1 line-clamp-3 leading-relaxed">
                  {proj.shortDescription}
                </p>

                <div className="text-[11px] text-neutral-400 mt-3">
                  Client: <span className="text-neutral-700 font-medium">{proj.clientType}</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between">
                <span className="text-[10px] font-mono text-neutral-400">{proj.id}</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openEditModal(proj)}
                    className="p-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(proj.id)}
                    className="p-1.5 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal with Real File Upload */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 mb-4">
              <h3 className="text-base font-bold font-serif text-[#111318]">
                {editingProject ? "Edit Portfolio Project" : "Upload & Create Project"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-neutral-400 hover:text-neutral-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="space-y-4 text-xs">
              {/* File Upload Box */}
              <div className="p-4 rounded-xl border-2 border-dashed border-zinc-200 bg-zinc-50 hover:bg-zinc-100/70 transition-colors text-center relative">
                <input
                  type="file"
                  id="portfolioFileUpload"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.pptm,.ppsx,.xls,.xlsx,.txt,.jpg,.jpeg,.png,.webp,.mp4,.webm,.zip"
                />
                <div className="flex flex-col items-center justify-center gap-1.5 pointer-events-none">
                  {uploading ? (
                    <Loader2 className="w-6 h-6 text-[#C8102E] animate-spin" />
                  ) : (
                    <Upload className="w-6 h-6 text-zinc-400" />
                  )}
                  <span className="font-semibold text-zinc-700 text-xs">
                    {uploading
                      ? "Uploading deliverable..."
                      : form.mediaUrl
                      ? `Uploaded: ${form.mediaUrl}`
                      : "Click or drag deliverable file (PDF, PPTX, DOCX, MP4, WebP, JPG)"}
                  </span>
                  <span className="text-[10px] text-zinc-400">Up to 50MB per deliverable</span>
                </div>
              </div>

              {uploadError && (
                <div className="p-2.5 rounded-lg bg-red-50 text-red-600 text-xs">{uploadError}</div>
              )}

              {/* LIVE UPLOAD PREVIEW */}
              {form.mediaUrl && (
                <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-bold text-zinc-800 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Live Upload Preview ({form.mediaType?.toUpperCase() || "FILE"})</span>
                    </span>
                    <a
                      href={form.mediaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#C8102E] font-semibold text-[11px] hover:underline flex items-center gap-1"
                    >
                      <span>Open File in Tab</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  {form.mediaType === "video" || form.mediaUrl.match(/\.(mp4|webm|mov)$/i) ? (
                    <div className="rounded-lg overflow-hidden bg-black aspect-16/9 w-full flex items-center justify-center">
                      <video src={form.mediaUrl} controls className="w-full h-full object-contain" />
                    </div>
                  ) : form.mediaType === "image" || form.mediaUrl.match(/\.(jpg|jpeg|png|webp|svg|gif)$/i) ? (
                    <div className="rounded-lg overflow-hidden bg-zinc-100 p-2 text-center">
                      <img src={form.mediaUrl} alt="Preview" className="max-h-52 w-auto mx-auto object-contain rounded-md" />
                    </div>
                  ) : form.mediaType === "pdf" || form.mediaUrl.endsWith(".pdf") ? (
                    <div className="rounded-lg overflow-hidden border border-zinc-200 bg-white h-52">
                      <iframe src={form.mediaUrl} className="w-full h-full border-0" title="PDF preview" />
                    </div>
                  ) : (
                    <div className="p-4 bg-white rounded-lg border border-zinc-200 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="w-6 h-6 text-[#C8102E]" />
                        <div>
                          <span className="font-bold text-zinc-900 block truncate max-w-[240px]">
                            {form.mediaUrl.split("/").pop()}
                          </span>
                          <span className="text-[10px] text-zinc-500 capitalize">{form.mediaType} Deliverable</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div>
                <label className="block text-zinc-900 font-bold mb-1">Project Title *</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Foot Step Power Generation with Documentation"
                  className="w-full p-2.5 rounded-xl border-2 border-zinc-200 bg-white text-zinc-950 font-bold focus:outline-none focus:border-[#C8102E]"
                  style={{ color: "#09090b" }}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-900 font-bold mb-1">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full p-2.5 rounded-xl border-2 border-zinc-200 bg-white text-zinc-950 font-bold"
                    style={{ color: "#09090b" }}
                  >
                    {categories.map((c) => (
                      <option key={c} value={c} className="text-zinc-950 bg-white font-semibold" style={{ color: "#09090b" }}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-zinc-900 font-bold mb-1">Media Format</label>
                  <select
                    value={form.mediaType}
                    onChange={(e) => setForm({ ...form, mediaType: e.target.value })}
                    className="w-full p-2.5 rounded-xl border-2 border-zinc-200 bg-white text-zinc-950 font-bold"
                    style={{ color: "#09090b" }}
                  >
                    <option value="document" className="text-zinc-950 bg-white font-semibold">Document / PDF</option>
                    <option value="presentation" className="text-zinc-950 bg-white font-semibold">Presentation (PPT / PPTX)</option>
                    <option value="video" className="text-zinc-950 bg-white font-semibold">Video Animation</option>
                    <option value="image" className="text-zinc-950 bg-white font-semibold">Image Mockup</option>
                    <option value="spreadsheet" className="text-zinc-950 bg-white font-semibold">Spreadsheet</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-zinc-900 font-bold mb-1">Short Summary *</label>
                <textarea
                  rows={2}
                  required
                  value={form.shortDescription}
                  onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
                  placeholder="One sentence description for card view..."
                  className="w-full p-2.5 rounded-xl border-2 border-zinc-200 bg-white text-zinc-950 font-semibold focus:outline-none focus:border-[#C8102E]"
                  style={{ color: "#09090b" }}
                />
              </div>

              <div>
                <label className="block text-zinc-900 font-bold mb-1">Detailed Case Study</label>
                <textarea
                  rows={3}
                  value={form.fullDescription}
                  onChange={(e) => setForm({ ...form, fullDescription: e.target.value })}
                  placeholder="Full scope, engineering methodology, formatting compliance..."
                  className="w-full p-2.5 rounded-xl border-2 border-zinc-200 bg-white text-zinc-950 font-semibold focus:outline-none focus:border-[#C8102E]"
                  style={{ color: "#09090b" }}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-900 font-bold mb-1">Deliverables (comma-separated)</label>
                  <input
                    type="text"
                    value={form.deliverables}
                    onChange={(e) => setForm({ ...form, deliverables: e.target.value })}
                    className="w-full p-2.5 rounded-xl border-2 border-zinc-200 bg-white text-zinc-950 font-semibold"
                    style={{ color: "#09090b" }}
                  />
                </div>
                <div>
                  <label className="block text-zinc-900 font-bold mb-1">Tools / Technologies</label>
                  <input
                    type="text"
                    value={form.toolsUsed}
                    onChange={(e) => setForm({ ...form, toolsUsed: e.target.value })}
                    className="w-full p-2.5 rounded-xl border-2 border-zinc-200 bg-white text-zinc-950 font-semibold"
                    style={{ color: "#09090b" }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                    className="w-4 h-4 text-[#C8102E] rounded border-neutral-300"
                  />
                  <span className="text-xs text-neutral-700 font-medium">Feature on Homepage</span>
                </label>

                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="p-1.5 rounded-lg border border-neutral-200 font-medium"
                >
                  <option value="Published">Published</option>
                  <option value="Draft">Draft</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-neutral-200 hover:bg-neutral-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#C8102E] text-white hover:bg-[#a00d24] font-semibold"
                >
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
