"use client";

import React, { useState, useEffect } from "react";
import {
  Webhook,
  CheckCircle2,
  AlertCircle,
  Clock,
  Edit2,
  Save,
  X,
  ExternalLink,
  MessageSquare,
  Database,
  CreditCard,
  BarChart2,
  Mail,
} from "lucide-react";

export default function AdminIntegrationsPage() {
  const [integrations, setIntegrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [formDetails, setFormDetails] = useState("");
  const [formStatus, setFormStatus] = useState("Connected");

  useEffect(() => {
    fetchIntegrations();
  }, []);

  async function fetchIntegrations() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/integrations");
      const data = await res.json();
      if (data.success) {
        setIntegrations(data.integrations || []);
      }
    } catch (e) {
      console.error("Failed to load integrations:", e);
    } finally {
      setLoading(false);
    }
  }

  function openEdit(item: any) {
    setEditingItem(item);
    setFormDetails(item.details || "");
    setFormStatus(item.status || "Connected");
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!editingItem) return;
    try {
      const res = await fetch("/api/admin/integrations", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingItem.id,
          status: formStatus,
          details: formDetails,
        }),
      });
      if (res.ok) {
        setEditingItem(null);
        fetchIntegrations();
      } else {
        alert("Failed to update integration");
      }
    } catch (e) {
      alert("Error saving integration");
    }
  }

  const iconMap: Record<string, React.ReactNode> = {
    WhatsApp: <MessageSquare className="w-5 h-5 text-emerald-600" />,
    Supabase: <Database className="w-5 h-5 text-emerald-600" />,
    Google: <BarChart2 className="w-5 h-5 text-blue-600" />,
    Razorpay: <CreditCard className="w-5 h-5 text-indigo-600" />,
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold font-serif text-[#111318]">
          API & External Integrations
        </h2>
        <p className="text-xs text-neutral-500">
          Manage database sync, WhatsApp business gateway, payments, and analytics credentials
        </p>
      </div>

      {/* Integration Cards */}
      <div className="space-y-4">
        {loading ? (
          <div className="py-16 text-center text-xs text-neutral-400">Loading integrations...</div>
        ) : (
          integrations.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-neutral-200/80 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-neutral-300 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-neutral-50 rounded-xl flex-shrink-0">
                  {iconMap[item.provider] || <Webhook className="w-5 h-5 text-neutral-700" />}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold font-serif text-[#111318]">
                      {item.name}
                    </h3>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        item.status.includes("Connected")
                          ? "bg-emerald-50 text-emerald-700"
                          : item.status.includes("Configured")
                          ? "bg-blue-50 text-blue-700"
                          : "bg-neutral-100 text-neutral-600"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                    {item.details}
                  </p>

                  {item.lastSync && (
                    <div className="text-[10px] text-neutral-400 mt-2 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>Last verified: {new Date(item.lastSync).toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-shrink-0">
                <button
                  onClick={() => openEdit(item)}
                  className="px-3 py-1.5 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-xs font-semibold text-neutral-700 transition-colors flex items-center gap-1.5"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  Configure
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 mb-4">
              <h3 className="text-base font-bold font-serif text-[#111318]">
                Configure {editingItem.name}
              </h3>
              <button
                onClick={() => setEditingItem(null)}
                className="p-1 text-neutral-400 hover:text-neutral-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-600 font-medium mb-1">Status</label>
                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-neutral-200 font-medium"
                >
                  <option value="Connected">Connected & Operational</option>
                  <option value="Configured (Local / Cloud Ready)">Configured (Local / Cloud Ready)</option>
                  <option value="Architecture Ready">Architecture Ready</option>
                  <option value="Disabled">Disabled</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-600 font-medium mb-1">
                  Connection Parameter / Notes
                </label>
                <textarea
                  rows={3}
                  value={formDetails}
                  onChange={(e) => setFormDetails(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-neutral-200 font-mono text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 rounded-xl border border-neutral-200 hover:bg-neutral-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#C8102E] text-white hover:bg-[#a00d24] font-semibold"
                >
                  Save Configuration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
