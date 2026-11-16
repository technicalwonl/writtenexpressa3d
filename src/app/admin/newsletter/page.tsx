"use client";

import React, { useState, useEffect } from "react";
import {
  Mail,
  Download,
  Trash2,
  CheckCircle2,
  Plus,
  Search,
  X,
  Users,
} from "lucide-react";

export default function AdminNewsletterPage() {
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [sourceInput, setSourceInput] = useState("Direct Admin Addition");

  useEffect(() => {
    fetchSubscribers();
  }, []);

  async function fetchSubscribers() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/newsletter");
      const data = await res.json();
      if (data.success) {
        setSubscribers(data.subscribers || []);
      }
    } catch (e) {
      console.error("Failed to load newsletter:", e);
    } finally {
      setLoading(false);
    }
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailInput, source: sourceInput }),
      });
      if (res.ok) {
        setIsModalOpen(false);
        setEmailInput("");
        fetchSubscribers();
      } else {
        alert("Failed to add subscriber");
      }
    } catch (e) {
      alert("Error adding subscriber");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Remove this subscriber?")) return;
    try {
      const res = await fetch(`/api/admin/newsletter?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setSubscribers((prev) => prev.filter((s) => s.id !== id));
      }
    } catch (e) {
      alert("Failed to delete subscriber");
    }
  }

  function exportCSV() {
    const headers = "ID,Email,SubscribedAt,Status,Source\n";
    const rows = subscribers
      .map((s) => `${s.id},"${s.email}",${s.subscribedAt},${s.status},"${s.source}"`)
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `written-expressa-subscribers-${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const filtered = subscribers.filter((s) =>
    (s.email || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-serif text-[#111318]">
            Newsletter & Email Subscribers
          </h2>
          <p className="text-xs text-neutral-500">
            Student community mailing list, resource requests, and promotional broadcasts
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportCSV}
            className="inline-flex items-center gap-1.5 bg-white border border-neutral-300 text-neutral-700 px-3 py-2 rounded-xl text-xs font-semibold hover:bg-neutral-50 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 bg-[#C8102E] text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-[#a00d24] transition-colors shadow-xs shadow-[#C8102E]/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add Subscriber</span>
          </button>
        </div>
      </div>

      {/* Search and Table */}
      <div className="bg-white border border-neutral-200/80 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-neutral-100 flex items-center justify-between">
          <div className="relative w-full max-w-xs">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Filter by email address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-1.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-[#C8102E]"
            />
          </div>
          <span className="text-xs text-neutral-400 font-medium">
            Total Audience: {subscribers.length}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50/70 border-b border-neutral-200 text-neutral-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Email Address</th>
                <th className="py-3 px-4">Subscription Source</th>
                <th className="py-3 px-4">Date Joined</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-neutral-400">
                    Loading subscribers...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-neutral-400">
                    No subscribers found.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-neutral-50/60 transition-colors">
                    <td className="py-3 px-4 font-bold text-[#111318]">{item.email}</td>
                    <td className="py-3 px-4 text-neutral-600">{item.source || "Website"}</td>
                    <td className="py-3 px-4 text-neutral-400 text-[11px]">
                      {item.subscribedAt
                        ? new Date(item.subscribedAt).toLocaleDateString([], {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "Recent"}
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 mb-4">
              <h3 className="text-base font-bold font-serif text-[#111318]">Add Subscriber</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-neutral-400 hover:text-neutral-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAdd} className="space-y-3 text-xs">
              <div>
                <label className="block text-neutral-600 font-medium mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="student@university.ac.in"
                  className="w-full p-2 rounded-xl border border-neutral-200 focus:outline-none focus:border-[#C8102E]"
                />
              </div>

              <div>
                <label className="block text-neutral-600 font-medium mb-1">Source Tag</label>
                <input
                  type="text"
                  value={sourceInput}
                  onChange={(e) => setSourceInput(e.target.value)}
                  className="w-full p-2 rounded-xl border border-neutral-200"
                />
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
                  Subscribe
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
