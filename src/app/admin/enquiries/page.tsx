"use client";

import React, { useState, useEffect } from "react";
import {
  Inbox,
  Search,
  Filter,
  MessageSquare,
  Phone,
  Mail,
  Trash2,
  CheckCircle,
  Clock,
  ExternalLink,
  ChevronRight,
  User,
  Calendar,
  Sparkles,
} from "lucide-react";

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEnquiry, setSelectedEnquiry] = useState<any | null>(null);

  useEffect(() => {
    fetchEnquiries();
  }, []);

  async function fetchEnquiries() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/enquiries");
      const data = await res.json();
      if (data.success) {
        setEnquiries(data.enquiries || []);
      }
    } catch (e) {
      console.error("Failed to load enquiries:", e);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: string, newStatus: string) {
    try {
      const res = await fetch("/api/admin/enquiries", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        setEnquiries((prev) =>
          prev.map((e) => (e.id === id ? { ...e, status: newStatus } : e))
        );
        if (selectedEnquiry && selectedEnquiry.id === id) {
          setSelectedEnquiry({ ...selectedEnquiry, status: newStatus });
        }
      }
    } catch (e) {
      alert("Failed to update status");
    }
  }

  async function deleteEnquiry(id: string) {
    if (!confirm("Are you sure you want to remove this enquiry?")) return;
    try {
      const res = await fetch(`/api/admin/enquiries?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setEnquiries((prev) => prev.filter((e) => e.id !== id));
        if (selectedEnquiry?.id === id) setSelectedEnquiry(null);
      }
    } catch (e) {
      alert("Failed to delete enquiry");
    }
  }

  const filtered = enquiries.filter((item) => {
    const matchesFilter =
      filterStatus === "All" ||
      item.status?.toLowerCase() === filterStatus.toLowerCase();
    const matchesSearch =
      (item.fullName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.email || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.phone || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.serviceInterest || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-serif text-[#111318]">
            Enquiries & CRM Pipeline
          </h2>
          <p className="text-xs text-neutral-500">
            Real leads submitted from public forms & consultation requests
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-neutral-100 text-neutral-700">
            Total Leads: {enquiries.length}
          </span>
          <button
            onClick={fetchEnquiries}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-neutral-300 hover:bg-neutral-50 text-neutral-700 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Filter and Search controls */}
      <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          {["All", "New", "Pending Review", "Contacted", "Quoted", "Converted"].map(
            (status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  filterStatus === status
                    ? "bg-[#C8102E] text-white shadow-xs"
                    : "bg-neutral-100/80 text-neutral-600 hover:bg-neutral-200/60"
                }`}
              >
                {status}
              </button>
            )
          )}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search leads..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-neutral-200 focus:outline-none focus:border-[#C8102E] transition-colors"
          />
        </div>
      </div>

      {/* Main Content: Table & Detail View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table List */}
        <div className="lg:col-span-2 bg-white border border-neutral-200/80 rounded-2xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50/70 border-b border-neutral-200 text-neutral-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Service</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Quick Contact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-neutral-400">
                      Loading inquiries...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-neutral-400">
                      No enquiries match the selected filter.
                    </td>
                  </tr>
                ) : (
                  filtered.map((item) => (
                    <tr
                      key={item.id}
                      onClick={() => setSelectedEnquiry(item)}
                      className={`hover:bg-neutral-50/80 cursor-pointer transition-colors ${
                        selectedEnquiry?.id === item.id ? "bg-red-50/30" : ""
                      }`}
                    >
                      <td className="py-3 px-4">
                        <div className="font-bold text-[#111318]">{item.fullName}</div>
                        <div className="text-[11px] text-neutral-400">{item.email}</div>
                        {item.phone && (
                          <div className="text-[10px] text-neutral-500">{item.phone}</div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-medium text-neutral-800">
                          {item.serviceInterest || "General Inquiry"}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            item.status === "New"
                              ? "bg-[#C8102E]/10 text-[#C8102E]"
                              : item.status === "Converted"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-neutral-100 text-neutral-700"
                          }`}
                        >
                          {item.status || "New"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-neutral-400 text-[11px]">
                        {item.createdAt
                          ? new Date(item.createdAt).toLocaleDateString([], {
                              month: "short",
                              day: "numeric",
                            })
                          : "Recently"}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div
                          className="flex items-center justify-end gap-1.5"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {item.phone && (
                            <a
                              href={`https://wa.me/${item.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                                `Hello ${item.fullName}, thank you for contacting Written Expressa regarding ${item.serviceInterest || "your requirement"}. How can we assist you today?`
                              )}`}
                              target="_blank"
                              rel="noreferrer"
                              title="Chat on WhatsApp"
                              className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                            </a>
                          )}
                          <a
                            href={`mailto:${item.email}?subject=Written Expressa Consultation - ${item.serviceInterest || "Your Project"}`}
                            title="Send Email"
                            className="p-1.5 rounded-lg bg-neutral-100 text-neutral-600 hover:bg-neutral-200 transition-colors"
                          >
                            <Mail className="w-3.5 h-3.5" />
                          </a>
                          <button
                            onClick={() => deleteEnquiry(item.id)}
                            title="Delete"
                            className="p-1.5 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Lead Detailed Pane */}
        <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-xs h-fit">
          {selectedEnquiry ? (
            <div className="space-y-5">
              <div className="flex items-start justify-between border-b border-neutral-100 pb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                    Lead Profile
                  </span>
                  <h3 className="text-lg font-bold font-serif text-[#111318]">
                    {selectedEnquiry.fullName}
                  </h3>
                  <div className="text-xs text-neutral-500 mt-0.5">
                    ID: {selectedEnquiry.id}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedEnquiry(null)}
                  className="text-neutral-400 hover:text-neutral-600 text-xs"
                >
                  Close
                </button>
              </div>

              {/* Status Selector */}
              <div>
                <label className="block text-[11px] font-bold uppercase text-neutral-500 mb-1.5">
                  Update Pipeline Status
                </label>
                <select
                  value={selectedEnquiry.status || "New"}
                  onChange={(e) => updateStatus(selectedEnquiry.id, e.target.value)}
                  className="w-full text-xs p-2 rounded-xl border border-neutral-200 focus:outline-none focus:border-[#C8102E] font-medium"
                >
                  <option value="New">New</option>
                  <option value="Pending Review">Pending Review</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Quoted">Quoted</option>
                  <option value="Converted">Converted to Order</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>

              {/* Contact Information */}
              <div className="space-y-2 text-xs">
                <div className="p-3 bg-neutral-50 rounded-xl space-y-1.5">
                  <div className="flex items-center gap-2 text-neutral-700">
                    <Mail className="w-3.5 h-3.5 text-neutral-400" />
                    <span className="font-medium">{selectedEnquiry.email}</span>
                  </div>
                  {selectedEnquiry.phone && (
                    <div className="flex items-center gap-2 text-neutral-700">
                      <Phone className="w-3.5 h-3.5 text-neutral-400" />
                      <span className="font-medium">{selectedEnquiry.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-neutral-500 text-[11px]">
                    <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                    <span>
                      Received:{" "}
                      {selectedEnquiry.createdAt
                        ? new Date(selectedEnquiry.createdAt).toLocaleString()
                        : "Recent"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Requirements & Description */}
              <div>
                <span className="block text-[11px] font-bold uppercase text-neutral-500 mb-1">
                  Project Requirements
                </span>
                <div className="p-3 bg-neutral-50 rounded-xl text-xs text-neutral-800 leading-relaxed max-h-48 overflow-y-auto">
                  {selectedEnquiry.projectDescription || "No specific details provided."}
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2 pt-2 border-t border-neutral-100">
                {selectedEnquiry.phone && (
                  <a
                    href={`https://wa.me/${selectedEnquiry.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                      `Hello ${selectedEnquiry.fullName}, this is Written Expressa following up on your inquiry for ${selectedEnquiry.serviceInterest || "services"}.`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-emerald-600 text-white font-semibold text-xs hover:bg-emerald-700 transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Open WhatsApp Chat
                  </a>
                )}
                <a
                  href={`mailto:${selectedEnquiry.email}`}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-neutral-100 text-neutral-800 font-semibold text-xs hover:bg-neutral-200 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  Compose Email
                </a>
              </div>
            </div>
          ) : (
            <div className="py-16 text-center text-neutral-400 text-xs">
              <Inbox className="w-8 h-8 mx-auto mb-2 text-neutral-300" />
              Select an enquiry to view project specifications, notes, and initiate direct communication.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
