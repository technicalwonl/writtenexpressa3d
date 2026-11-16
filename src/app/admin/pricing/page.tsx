"use client";

import React, { useState, useEffect } from "react";
import {
  DollarSign,
  Save,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Edit2,
  RefreshCw,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export default function AdminPricingPage() {
  const [pricingList, setPricingList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    fetchPricing();
  }, []);

  async function fetchPricing() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/pricing");
      const data = await res.json();
      if (data.success) {
        setPricingList(data.pricing || []);
      }
    } catch (e) {
      console.error("Failed to load pricing:", e);
    } finally {
      setLoading(false);
    }
  }

  function handleInputChange(id: string, field: string, value: any) {
    setPricingList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  }

  async function handleSaveRow(item: any) {
    setSavingId(item.id);
    setSuccessMsg("");
    try {
      const res = await fetch("/api/admin/pricing", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
      if (res.ok) {
        setSuccessMsg(`Saved updates for ${item.serviceName}`);
        setTimeout(() => setSuccessMsg(""), 3000);
      } else {
        alert("Failed to save pricing");
      }
    } catch (e) {
      alert("Error saving pricing");
    } finally {
      setSavingId(null);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-serif text-[#111318]">
            Centralized Pricing Matrix
          </h2>
          <p className="text-xs text-neutral-500">
            Single source of truth for all public service tiers, rates, and quotes across Written Expressa
          </p>
        </div>

        <div className="flex items-center gap-2">
          {successMsg && (
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 animate-in fade-in">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {successMsg}
            </span>
          )}
          <button
            onClick={fetchPricing}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-neutral-300 hover:bg-neutral-50 text-neutral-700 transition-colors flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reload
          </button>
        </div>
      </div>

      {/* Rules Banner */}
      <div className="p-4 bg-white border border-neutral-200/80 rounded-2xl shadow-xs flex items-start gap-3">
        <div className="p-2 rounded-xl bg-[#C8102E]/10 text-[#C8102E] flex-shrink-0">
          <Sparkles className="w-4 h-4" />
        </div>
        <div className="text-xs text-neutral-600 leading-relaxed">
          <strong className="text-[#111318]">Centralization Rule:</strong> Changes made here immediately synchronize with public service cards, modal estimators, and customer quotations. No code modification required.
        </div>
      </div>

      {/* Pricing Matrix Table */}
      <div className="bg-white border border-neutral-200/80 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50/70 border-b border-neutral-200 text-neutral-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Service</th>
                <th className="py-3.5 px-4">Pricing Model</th>
                <th className="py-3.5 px-4">Display Tier Details</th>
                <th className="py-3.5 px-4">Min Price (₹)</th>
                <th className="py-3.5 px-4">Max Price (₹)</th>
                <th className="py-3.5 px-4">Custom Quote</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-neutral-400">
                    Loading pricing matrix...
                  </td>
                </tr>
              ) : (
                pricingList.map((item) => (
                  <tr key={item.id} className="hover:bg-neutral-50/60 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-[#111318]">{item.serviceName}</div>
                      <div className="text-[10px] text-neutral-400 font-mono">{item.id}</div>
                    </td>

                    <td className="py-3 px-4">
                      <select
                        value={item.type}
                        onChange={(e) => handleInputChange(item.id, "type", e.target.value)}
                        className="p-1.5 bg-neutral-100/70 rounded-lg border border-neutral-200 text-xs font-medium"
                      >
                        <option value="Fixed Tier Pricing">Fixed Tier Pricing</option>
                        <option value="Indicative Range Pricing">Indicative Range Pricing</option>
                        <option value="Indicative Scope Pricing">Indicative Scope Pricing</option>
                        <option value="Package Pricing">Package Pricing</option>
                        <option value="Custom Quotation">Custom Quotation</option>
                      </select>
                    </td>

                    <td className="py-3 px-4 min-w-[220px]">
                      <input
                        type="text"
                        value={item.details || ""}
                        onChange={(e) => handleInputChange(item.id, "details", e.target.value)}
                        className="w-full p-1.5 rounded-lg border border-neutral-200 focus:outline-none focus:border-[#C8102E]"
                      />
                    </td>

                    <td className="py-3 px-4 w-28">
                      <input
                        type="number"
                        disabled={item.isCustom}
                        value={item.minPrice ?? 0}
                        onChange={(e) =>
                          handleInputChange(item.id, "minPrice", Number(e.target.value))
                        }
                        className="w-full p-1.5 rounded-lg border border-neutral-200 focus:outline-none focus:border-[#C8102E] disabled:bg-neutral-100 disabled:text-neutral-400 font-semibold"
                      />
                    </td>

                    <td className="py-3 px-4 w-28">
                      <input
                        type="number"
                        disabled={item.isCustom}
                        value={item.maxPrice ?? 0}
                        onChange={(e) =>
                          handleInputChange(item.id, "maxPrice", Number(e.target.value))
                        }
                        className="w-full p-1.5 rounded-lg border border-neutral-200 focus:outline-none focus:border-[#C8102E] disabled:bg-neutral-100 disabled:text-neutral-400 font-semibold"
                      />
                    </td>

                    <td className="py-3 px-4">
                      <input
                        type="checkbox"
                        checked={Boolean(item.isCustom)}
                        onChange={(e) =>
                          handleInputChange(item.id, "isCustom", e.target.checked)
                        }
                        className="w-4 h-4 text-[#C8102E] rounded border-neutral-300"
                      />
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleSaveRow(item)}
                        disabled={savingId === item.id}
                        className="px-3 py-1.5 rounded-lg bg-[#111318] text-white hover:bg-[#C8102E] text-xs font-semibold transition-colors disabled:opacity-50 inline-flex items-center gap-1.5 shadow-xs"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>{savingId === item.id ? "Saving..." : "Save"}</span>
                      </button>
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
