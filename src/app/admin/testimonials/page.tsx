"use client";

import React, { useState, useEffect } from "react";
import {
  Star,
  Plus,
  CheckCircle2,
  XCircle,
  Trash2,
  Search,
  X,
  Sparkles,
} from "lucide-react";

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form, setForm] = useState({
    customerName: "",
    servicePurchased: "PowerPoint Presentations",
    rating: 5,
    reviewText: "",
    status: "Approved",
    featured: true,
    consentVerified: true,
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  async function fetchTestimonials() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/testimonials");
      const data = await res.json();
      if (data.success) {
        setTestimonials(data.testimonials || []);
      }
    } catch (e) {
      console.error("Failed to load testimonials:", e);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: string, status: string) {
    try {
      const res = await fetch("/api/admin/testimonials", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        setTestimonials((prev) =>
          prev.map((t) => (t.id === id ? { ...t, status } : t))
        );
      }
    } catch (e) {
      alert("Failed to update status");
    }
  }

  async function toggleFeatured(id: string, current: boolean) {
    try {
      const res = await fetch("/api/admin/testimonials", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, featured: !current }),
      });
      if (res.ok) {
        setTestimonials((prev) =>
          prev.map((t) => (t.id === id ? { ...t, featured: !current } : t))
        );
      }
    } catch (e) {
      alert("Failed to update featured flag");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this review permanently?")) return;
    try {
      const res = await fetch(`/api/admin/testimonials?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setTestimonials((prev) => prev.filter((t) => t.id !== id));
      }
    } catch (e) {
      alert("Failed to delete review");
    }
  }

  async function handleAddTestimonial(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setIsModalOpen(false);
        fetchTestimonials();
      } else {
        alert("Failed to add review");
      }
    } catch (e) {
      alert("Error adding review");
    }
  }

  const pendingCount = testimonials.filter((t) => t.status?.toLowerCase() === "pending").length;
  const featuredCount = testimonials.filter((t) => Boolean(t.featured)).length;

  const filtered = testimonials.filter((t) => {
    if (filterStatus === "All") return true;
    if (filterStatus === "Featured on Home") return Boolean(t.featured);
    return t.status?.toLowerCase() === filterStatus.toLowerCase();
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-serif text-[#111318]">
            Testimonials & Client Feedback Moderation
          </h2>
          <p className="text-xs text-neutral-500">
            Moderate authentic client feedback, ratings, and choose which reviews are featured on the homepage
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1.5 bg-[#C8102E] text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-[#a00d24] transition-colors shadow-xs shadow-[#C8102E]/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add Authentic Review</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {[
          { label: "All", count: testimonials.length },
          { label: "Featured on Home", count: featuredCount },
          { label: "Approved", count: testimonials.filter((t) => t.status?.toLowerCase() === "approved").length },
          { label: "Pending", count: pendingCount },
          { label: "Rejected", count: testimonials.filter((t) => t.status?.toLowerCase() === "rejected").length },
        ].map((tab) => (
          <button
            key={tab.label}
            onClick={() => setFilterStatus(tab.label)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              filterStatus === tab.label
                ? "bg-[#111318] text-white shadow-xs"
                : "bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50"
            }`}
          >
            <span>{tab.label}</span>
            {tab.count > 0 && (
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  filterStatus === tab.label
                    ? "bg-white/20 text-white"
                    : tab.label === "Pending" && tab.count > 0
                    ? "bg-amber-100 text-amber-800"
                    : "bg-neutral-100 text-neutral-600"
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          <div className="col-span-3 py-16 text-center text-neutral-400 text-xs">
            Loading reviews...
          </div>
        ) : filtered.length === 0 ? (
          <div className="col-span-3 py-16 text-center text-neutral-400 text-xs">
            No reviews found for status: {filterStatus}
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-neutral-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:border-[#C8102E]/30 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1 text-amber-500">
                    {Array.from({ length: item.rating || 5 }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      item.status === "Approved"
                        ? "bg-emerald-50 text-emerald-700"
                        : item.status === "Pending"
                        ? "bg-amber-50 text-amber-700"
                        : "bg-neutral-100 text-neutral-500"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <p className="text-xs text-neutral-700 italic leading-relaxed line-clamp-4">
                  "{item.reviewText}"
                </p>

                <div className="mt-4 pt-3 border-t border-neutral-100">
                  <div className="text-xs font-bold text-[#111318]">{item.customerName}</div>
                  <div className="text-[11px] text-neutral-400">{item.servicePurchased}</div>
                </div>
              </div>

              {/* Moderation Controls */}
              <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between">
                <button
                  onClick={() => toggleFeatured(item.id, Boolean(item.featured))}
                  className={`text-[11px] font-semibold flex items-center gap-1 ${
                    item.featured ? "text-[#C8102E]" : "text-neutral-400 hover:text-neutral-600"
                  }`}
                >
                  <Star className={`w-3.5 h-3.5 ${item.featured ? "fill-[#C8102E]" : ""}`} />
                  {item.featured ? "Featured on Home" : "Feature"}
                </button>

                <div className="flex items-center gap-1.5">
                  {item.status !== "Approved" && (
                    <button
                      onClick={() => updateStatus(item.id, "Approved")}
                      title="Approve"
                      className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {item.status !== "Rejected" && (
                    <button
                      onClick={() => updateStatus(item.id, "Rejected")}
                      title="Reject"
                      className="p-1.5 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(item.id)}
                    title="Delete"
                    className="p-1.5 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 mb-4">
              <h3 className="text-base font-bold font-serif text-[#111318]">
                Add Verified Student Review
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-neutral-400 hover:text-neutral-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddTestimonial} className="space-y-3 text-xs">
              <div>
                <label className="block text-neutral-800 font-bold mb-1">Customer / Student Name *</label>
                <input
                  type="text"
                  required
                  value={form.customerName}
                  onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                  style={{ color: "#09090b" }}
                  className="w-full p-2.5 rounded-xl bg-white border border-neutral-300 text-zinc-950 font-bold focus:outline-hidden focus:border-[#C8102E]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-800 font-bold mb-1">Service Delivered</label>
                  <select
                    value={form.servicePurchased}
                    onChange={(e) => setForm({ ...form, servicePurchased: e.target.value })}
                    style={{ color: "#09090b" }}
                    className="w-full p-2.5 rounded-xl bg-white border border-neutral-300 text-zinc-950 font-bold focus:outline-hidden focus:border-[#C8102E]"
                  >
                    <option value="PowerPoint Presentations" style={{ color: "#09090b" }} className="text-zinc-950 font-bold">PowerPoint Presentations</option>
                    <option value="Notes & Academic Records" style={{ color: "#09090b" }} className="text-zinc-950 font-bold">Notes & Academic Records</option>
                    <option value="Academic Project Assistance" style={{ color: "#09090b" }} className="text-zinc-950 font-bold">Academic Project Assistance</option>
                    <option value="Project Documentation" style={{ color: "#09090b" }} className="text-zinc-950 font-bold">Project Documentation</option>
                    <option value="Custom Magazines" style={{ color: "#09090b" }} className="text-zinc-950 font-bold">Custom Magazines</option>
                    <option value="Web & Technical Services" style={{ color: "#09090b" }} className="text-zinc-950 font-bold">Web & Technical Services</option>
                  </select>
                </div>
                <div>
                  <label className="block text-neutral-800 font-bold mb-1">Rating (1 - 5)</label>
                  <select
                    value={form.rating}
                    onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
                    style={{ color: "#09090b" }}
                    className="w-full p-2.5 rounded-xl bg-white border border-neutral-300 text-zinc-950 font-bold focus:outline-hidden focus:border-[#C8102E]"
                  >
                    <option value={5} style={{ color: "#09090b" }} className="text-zinc-950 font-bold">5 Stars (Exceptional)</option>
                    <option value={4} style={{ color: "#09090b" }} className="text-zinc-950 font-bold">4 Stars (Very Good)</option>
                    <option value={3} style={{ color: "#09090b" }} className="text-zinc-950 font-bold">3 Stars (Average)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-neutral-800 font-bold mb-1">Review Feedback *</label>
                <textarea
                  rows={3}
                  required
                  value={form.reviewText}
                  onChange={(e) => setForm({ ...form, reviewText: e.target.value })}
                  placeholder="Paste direct feedback from WhatsApp or client confirmation..."
                  style={{ color: "#09090b" }}
                  className="w-full p-2.5 rounded-xl bg-white border border-neutral-300 text-zinc-950 font-bold focus:outline-hidden focus:border-[#C8102E] resize-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="consentCheck"
                  checked={form.consentVerified}
                  onChange={(e) => setForm({ ...form, consentVerified: e.target.checked })}
                  className="w-4 h-4 text-[#C8102E] rounded border-neutral-300"
                />
                <label htmlFor="consentCheck" className="text-xs text-neutral-700 font-medium">
                  Client has consented to display their name and feedback publicly
                </label>
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
                  Publish Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
