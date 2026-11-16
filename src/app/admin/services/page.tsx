"use client";

import React, { useState, useEffect } from "react";
import {
  Layers,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Eye,
  Star,
  Box,
  DollarSign,
  X,
  Search,
} from "lucide-react";

export default function AdminServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<any | null>(null);

  // Form state
  const [form, setForm] = useState({
    id: "",
    title: "",
    category: "Academic Solutions",
    status: "Published",
    featured: true,
    description: "",
    ctaText: "GET STARTED",
    ctaActionId: "contact",
    threeDObject: "Floating Book & Paper",
    pricingModel: "Fixed Tier Pricing",
    packagesText: "",
    highlightsText: "",
  });

  useEffect(() => {
    fetchServices();
  }, []);

  async function fetchServices() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/services");
      const data = await res.json();
      if (data.success) {
        setServices(data.services || []);
      }
    } catch (e) {
      console.error("Failed to load services:", e);
    } finally {
      setLoading(false);
    }
  }

  function openCreateModal() {
    setEditingService(null);
    setForm({
      id: `srv_${Date.now()}`,
      title: "",
      category: "Academic Solutions",
      status: "Published",
      featured: true,
      description: "",
      ctaText: "GET STARTED",
      ctaActionId: "contact",
      threeDObject: "Floating 3D Asset",
      pricingModel: "Fixed Tier Pricing",
      packagesText: "Standard: ₹299\nPremium: ₹599",
      highlightsText: "Professional Turnaround\nGuaranteed Quality",
    });
    setIsModalOpen(true);
  }

  function openEditModal(srv: any) {
    setEditingService(srv);
    const packagesStr = (srv.packages || [])
      .map((p: any) => `${p.name}: ${p.price}${p.note ? ` (${p.note})` : ""}`)
      .join("\n");
    const highlightsStr = (srv.highlights || []).join("\n");

    setForm({
      id: srv.id,
      title: srv.title,
      category: srv.category,
      status: srv.status,
      featured: Boolean(srv.featured),
      description: srv.description,
      ctaText: srv.ctaText || "GET STARTED",
      ctaActionId: srv.ctaActionId || "contact",
      threeDObject: srv.threeDObject || "Academic Model",
      pricingModel: srv.pricingModel || "Fixed Tier Pricing",
      packagesText: packagesStr,
      highlightsText: highlightsStr,
    });
    setIsModalOpen(true);
  }

  async function handleSaveService(e: React.FormEvent) {
    e.preventDefault();

    // Parse packages text
    const packages = form.packagesText
      .split("\n")
      .filter((line) => line.trim().length > 0)
      .map((line) => {
        const parts = line.split(":");
        const name = parts[0]?.trim() || "Package";
        const priceAndNote = parts[1]?.trim() || "";
        const noteMatch = priceAndNote.match(/\((.*?)\)/);
        const note = noteMatch ? noteMatch[1] : "";
        const price = priceAndNote.replace(/\(.*?\)/, "").trim();
        return { name, price: price || priceAndNote, note };
      });

    const highlights = form.highlightsText
      .split("\n")
      .map((h) => h.trim())
      .filter((h) => h.length > 0);

    const payload = {
      id: form.id,
      title: form.title,
      category: form.category,
      status: form.status,
      featured: form.featured,
      description: form.description,
      ctaText: form.ctaText,
      ctaActionId: form.ctaActionId,
      threeDObject: form.threeDObject,
      pricingModel: form.pricingModel,
      packages,
      highlights,
    };

    try {
      const method = editingService ? "PUT" : "POST";
      const res = await fetch("/api/admin/services", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchServices();
      } else {
        alert("Failed to save service");
      }
    } catch (err) {
      alert("Error saving service");
    }
  }

  async function handleDeleteService(id: string) {
    if (!confirm("Are you sure you want to remove this service from the catalog?")) return;
    try {
      const res = await fetch(`/api/admin/services?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setServices((prev) => prev.filter((s) => s.id !== id));
      }
    } catch (e) {
      alert("Failed to delete service");
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-serif text-[#111318]">
            Services Catalog & Offerings
          </h2>
          <p className="text-xs text-neutral-500">
            Configure business services, pricing tiers, CTA buttons and 3D visual associations
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-1.5 bg-[#C8102E] text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-[#a00d24] transition-colors shadow-xs shadow-[#C8102E]/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Service</span>
        </button>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          <div className="col-span-3 py-16 text-center text-neutral-400 text-xs">
            Loading services catalog...
          </div>
        ) : (
          services.map((srv) => (
            <div
              key={srv.id}
              className="bg-white border border-neutral-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:border-[#C8102E]/40 transition-all group"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#C8102E] bg-red-50 px-2 py-0.5 rounded-md">
                    {srv.category}
                  </span>
                  <div className="flex items-center gap-1">
                    {srv.featured && (
                      <span className="p-1 rounded-md bg-amber-50 text-amber-600" title="Featured">
                        <Star className="w-3 h-3 fill-amber-500" />
                      </span>
                    )}
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        srv.status === "Published"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-neutral-100 text-neutral-600"
                      }`}
                    >
                      {srv.status}
                    </span>
                  </div>
                </div>

                <h3 className="text-base font-bold font-serif text-[#111318] group-hover:text-[#C8102E] transition-colors">
                  {srv.title}
                </h3>
                <p className="text-xs text-neutral-500 mt-1 line-clamp-3 leading-relaxed">
                  {srv.description}
                </p>

                {/* 3D Representation Tag */}
                <div className="mt-3 flex items-center gap-1.5 text-[11px] text-neutral-500 bg-neutral-50 p-2 rounded-xl">
                  <Box className="w-3.5 h-3.5 text-[#C8102E]" />
                  <span>3D Model: <strong className="text-neutral-700">{srv.threeDObject}</strong></span>
                </div>

                {/* Packages Pill Preview */}
                <div className="mt-3 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-neutral-400">
                    Pricing Tiers ({srv.packages?.length || 0})
                  </span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {(srv.packages || []).map((pkg: any, idx: number) => (
                      <span
                        key={idx}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-700 font-medium"
                      >
                        {pkg.name}: {pkg.price}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="mt-5 pt-3 border-t border-neutral-100 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-neutral-400">
                  CTA: {srv.ctaText}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openEditModal(srv)}
                    className="p-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors"
                    title="Edit Service"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteService(srv.id)}
                    className="p-1.5 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Delete Service"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Service Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 mb-4">
              <h3 className="text-base font-bold font-serif text-[#111318]">
                {editingService ? `Edit Service: ${editingService.title}` : "Create Service"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-neutral-400 hover:text-neutral-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveService} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-600 font-medium mb-1">Service Title *</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full p-2 rounded-xl border border-neutral-200 focus:outline-none focus:border-[#C8102E]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-600 font-medium mb-1">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full p-2 rounded-xl border border-neutral-200"
                  >
                    <option value="Academic Solutions">Academic Solutions</option>
                    <option value="Creative Design">Creative Design</option>
                    <option value="Technical Solutions">Technical Solutions</option>
                    <option value="Digital Services">Digital Services</option>
                  </select>
                </div>
                <div>
                  <label className="block text-neutral-600 font-medium mb-1">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full p-2 rounded-xl border border-neutral-200"
                  >
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-neutral-600 font-medium mb-1">Description *</label>
                <textarea
                  rows={3}
                  required
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full p-2 rounded-xl border border-neutral-200 focus:outline-none focus:border-[#C8102E]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-600 font-medium mb-1">CTA Button Text</label>
                  <input
                    type="text"
                    value={form.ctaText}
                    onChange={(e) => setForm({ ...form, ctaText: e.target.value })}
                    className="w-full p-2 rounded-xl border border-neutral-200"
                  />
                </div>
                <div>
                  <label className="block text-neutral-600 font-medium mb-1">3D Object Representation</label>
                  <input
                    type="text"
                    value={form.threeDObject}
                    onChange={(e) => setForm({ ...form, threeDObject: e.target.value })}
                    className="w-full p-2 rounded-xl border border-neutral-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-600 font-medium mb-1">
                  Pricing Packages (One per line: <code className="text-neutral-400">Name: Price (Note)</code>)
                </label>
                <textarea
                  rows={3}
                  value={form.packagesText}
                  onChange={(e) => setForm({ ...form, packagesText: e.target.value })}
                  placeholder="10 Pages: ₹40 (Academic records)&#10;50 Pages: ₹240"
                  className="w-full p-2 rounded-xl border border-neutral-200 font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-neutral-600 font-medium mb-1">
                  Key Deliverables / Highlights (One per line)
                </label>
                <textarea
                  rows={2}
                  value={form.highlightsText}
                  onChange={(e) => setForm({ ...form, highlightsText: e.target.value })}
                  placeholder="Precise handwritten records&#10;University formatting standard"
                  className="w-full p-2 rounded-xl border border-neutral-200"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featuredCheck"
                  checked={form.featured}
                  onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                  className="w-4 h-4 text-[#C8102E] rounded border-neutral-300"
                />
                <label htmlFor="featuredCheck" className="text-xs text-neutral-700 font-medium">
                  Feature this service on home page hero & navigation
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-100">
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
                  {editingService ? "Update Service" : "Add Service"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
