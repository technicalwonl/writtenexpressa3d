"use client";

import React, { useState, useEffect } from "react";
import {
  HelpCircle,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Search,
  X,
  Filter,
} from "lucide-react";

export default function AdminFAQsPage() {
  const [faqs, setFaqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<any | null>(null);

  const [form, setForm] = useState({
    id: "",
    question: "",
    answer: "",
    category: "General Information",
    published: true,
  });

  const categories = [
    "General Information",
    "Services",
    "Pricing",
    "WhatsApp Ordering",
    "Payment",
    "Delivery",
    "Revisions",
    "Academic Projects",
    "Documentation",
    "Magazines",
    "Technical Projects",
    "Customer Support",
  ];

  useEffect(() => {
    fetchFaqs();
  }, []);

  async function fetchFaqs() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/faqs");
      const data = await res.json();
      if (data.success) {
        setFaqs(data.faqs || []);
      }
    } catch (e) {
      console.error("Failed to load FAQs:", e);
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setEditingFaq(null);
    setForm({
      id: `faq_${Date.now()}`,
      question: "",
      answer: "",
      category: "General Information",
      published: true,
    });
    setIsModalOpen(true);
  }

  function openEdit(item: any) {
    setEditingFaq(item);
    setForm({
      id: item.id,
      question: item.question,
      answer: item.answer,
      category: item.category,
      published: item.published ?? true,
    });
    setIsModalOpen(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    try {
      const method = editingFaq ? "PUT" : "POST";
      const res = await fetch("/api/admin/faqs", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setIsModalOpen(false);
        fetchFaqs();
      } else {
        alert("Failed to save FAQ");
      }
    } catch (e) {
      alert("Error saving FAQ");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this FAQ?")) return;
    try {
      const res = await fetch(`/api/admin/faqs?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setFaqs((prev) => prev.filter((f) => f.id !== id));
      }
    } catch (e) {
      alert("Failed to delete FAQ");
    }
  }

  const filtered = faqs.filter((f) => {
    const matchesCat = categoryFilter === "All" || f.category === categoryFilter;
    const matchesQuery =
      (f.question || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (f.answer || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-serif text-[#111318]">
            FAQ & Knowledge Base Management
          </h2>
          <p className="text-xs text-neutral-500">
            Publish clear answers to client questions and enhance Google FAQPage search indexing
          </p>
        </div>

        <button
          onClick={openCreate}
          className="inline-flex items-center gap-1.5 bg-[#C8102E] text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-[#a00d24] transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add New FAQ</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          {["All", "Services", "Pricing", "WhatsApp Ordering", "Payment", "Delivery", "Revisions"].map(
            (cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  categoryFilter === cat
                    ? "bg-[#111318] text-white"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                }`}
              >
                {cat}
              </button>
            )
          )}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search FAQs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-neutral-200 focus:outline-none focus:border-[#C8102E]"
          />
        </div>
      </div>

      {/* FAQs List */}
      <div className="space-y-3">
        {loading ? (
          <div className="py-16 text-center text-xs text-neutral-400">Loading FAQs...</div>
        ) : filtered.length === 0 ? (
          <div className="bg-white border border-neutral-200/80 rounded-2xl p-12 text-center text-xs text-neutral-400">
            No FAQs match your search or filter criteria.
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-neutral-200/80 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-neutral-300 transition-colors"
            >
              <div className="space-y-1 max-w-3xl">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#C8102E] bg-red-50 px-2 py-0.5 rounded">
                    {item.category}
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    {item.published ? "Published" : "Draft"}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-zinc-900">{item.question}</h3>
                <p className="text-xs text-zinc-600 leading-relaxed">{item.answer}</p>
              </div>

              <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                <button
                  onClick={() => openEdit(item)}
                  className="p-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors"
                  title="Edit FAQ"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  title="Delete FAQ"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 mb-4">
              <h3 className="text-base font-bold font-serif text-[#111318]">
                {editingFaq ? "Edit FAQ" : "Add New FAQ"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-neutral-400 hover:text-neutral-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-600 font-medium mb-1">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-neutral-200"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-neutral-600 font-medium mb-1">Question *</label>
                <input
                  type="text"
                  required
                  value={form.question}
                  onChange={(e) => setForm({ ...form, question: e.target.value })}
                  placeholder="e.g. Can I order directly through WhatsApp?"
                  className="w-full p-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-[#C8102E]"
                />
              </div>

              <div>
                <label className="block text-neutral-600 font-medium mb-1">Answer *</label>
                <textarea
                  rows={4}
                  required
                  value={form.answer}
                  onChange={(e) => setForm({ ...form, answer: e.target.value })}
                  placeholder="Write clear, accurate answer..."
                  className="w-full p-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-[#C8102E]"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="pubCheck"
                  checked={form.published}
                  onChange={(e) => setForm({ ...form, published: e.target.checked })}
                  className="w-4 h-4 text-[#C8102E] rounded border-neutral-300"
                />
                <label htmlFor="pubCheck" className="text-xs text-neutral-700 font-medium">
                  Publish on public website FAQ section
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
                  Save FAQ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
