"use client";

import React, { useState, useEffect } from "react";
import {
  History,
  Search,
  RefreshCw,
  Clock,
  User,
  Shield,
  Layers,
  DollarSign,
  FileText,
} from "lucide-react";

export default function AdminActivityLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterAction, setFilterAction] = useState("All");

  useEffect(() => {
    fetchLogs();
  }, []);

  async function fetchLogs() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/activity-logs");
      const data = await res.json();
      if (data.success) {
        setLogs(data.logs || []);
      }
    } catch (e) {
      console.error("Failed to load activity logs:", e);
    } finally {
      setLoading(false);
    }
  }

  const filtered = logs.filter((log) => {
    const matchesAction =
      filterAction === "All" || log.action?.toUpperCase() === filterAction.toUpperCase();
    const matchesSearch =
      (log.details || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.entity || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.user || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchesAction && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-serif text-[#111318]">
            Audit Trail & Activity Log
          </h2>
          <p className="text-xs text-neutral-500">
            Immutable tracking of all admin changes, pricing modifications, orders, and logins
          </p>
        </div>

        <button
          onClick={fetchLogs}
          className="inline-flex items-center gap-1.5 bg-white border border-neutral-300 text-neutral-700 px-3 py-1.5 rounded-xl text-xs font-semibold hover:bg-neutral-50 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Audit</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          {["All", "CREATE", "UPDATE", "DELETE", "LOGIN"].map((act) => (
            <button
              key={act}
              onClick={() => setFilterAction(act)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                filterAction === act
                  ? "bg-[#111318] text-white"
                  : "bg-neutral-100/80 text-neutral-600 hover:bg-neutral-200/60"
              }`}
            >
              {act}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search audit trail..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-neutral-200 focus:outline-none focus:border-[#C8102E] transition-colors"
          />
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white border border-neutral-200/80 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50/70 border-b border-neutral-200 text-neutral-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Timestamp</th>
                <th className="py-3.5 px-4">Action</th>
                <th className="py-3.5 px-4">Entity</th>
                <th className="py-3.5 px-4">Details</th>
                <th className="py-3.5 px-4 text-right">User</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 font-mono text-[11px]">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-neutral-400 font-sans">
                    Loading audit records...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-neutral-400 font-sans">
                    No activity logs recorded.
                  </td>
                </tr>
              ) : (
                filtered.map((log) => (
                  <tr key={log.id} className="hover:bg-neutral-50/70 transition-colors">
                    <td className="py-3 px-4 text-neutral-400 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString([], {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          log.action === "CREATE"
                            ? "bg-emerald-50 text-emerald-700"
                            : log.action === "UPDATE"
                            ? "bg-blue-50 text-blue-700"
                            : log.action === "DELETE"
                            ? "bg-red-50 text-red-700"
                            : "bg-neutral-100 text-neutral-700"
                        }`}
                      >
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-neutral-800">{log.entity}</td>
                    <td className="py-3 px-4 text-neutral-700 font-sans text-xs">
                      {log.details}
                    </td>
                    <td className="py-3 px-4 text-right font-sans text-neutral-500 whitespace-nowrap">
                      {log.user || "Admin"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
