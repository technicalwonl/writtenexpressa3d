"use client";

import React, { useState, useEffect } from "react";
import {
  Share2,
  Plus,
  Users,
  TrendingUp,
  DollarSign,
  Copy,
  Check,
  Trash2,
  X,
} from "lucide-react";

export default function AdminReferralsPage() {
  const [referrals, setReferrals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form, setForm] = useState({
    code: "",
    referrerName: "",
    email: "",
    rewardEarned: 0,
    status: "Active",
  });

  useEffect(() => {
    fetchReferrals();
  }, []);

  async function fetchReferrals() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/referrals");
      const data = await res.json();
      if (data.success) {
        setReferrals(data.referrals || []);
      }
    } catch (e) {
      console.error("Failed to load referrals:", e);
    } finally {
      setLoading(false);
    }
  }

  function handleCopy(code: string) {
    navigator.clipboard.writeText(`https://writtenexpressa.com/?ref=${code}`);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  }

  async function handleAddReferral(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/referrals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setIsModalOpen(false);
        fetchReferrals();
      } else {
        alert("Failed to add referral");
      }
    } catch (e) {
      alert("Error adding referral");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Remove this referral affiliate code?")) return;
    try {
      const res = await fetch(`/api/admin/referrals?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setReferrals((prev) => prev.filter((r) => r.id !== id));
      }
    } catch (e) {
      alert("Failed to delete referral");
    }
  }

  const totalRewards = referrals.reduce((sum, r) => sum + Number(r.rewardEarned || 0), 0);
  const totalConversions = referrals.reduce((sum, r) => sum + Number(r.converted || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-serif text-[#111318]">
            Campus Ambassador & Referral Engine
          </h2>
          <p className="text-xs text-neutral-500">
            Track student partner attribution, traffic generation, and reward disbursements
          </p>
        </div>

        <button
          onClick={() => {
            setForm({
              code: `CAMPUS${Math.floor(100 + Math.random() * 900)}`,
              referrerName: "",
              email: "",
              rewardEarned: 0,
              status: "Active",
            });
            setIsModalOpen(true);
          }}
          className="inline-flex items-center gap-1.5 bg-[#C8102E] text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-[#a00d24] transition-colors shadow-xs shadow-[#C8102E]/20"
        >
          <Plus className="w-4 h-4" />
          <span>New Ambassador Code</span>
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
            Active Ambassadors
          </div>
          <div className="text-2xl font-serif font-black text-[#111318] mt-1">
            {referrals.length}
          </div>
          <div className="text-[11px] text-neutral-400 mt-1">Colleges & student clubs</div>
        </div>

        <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">
            Referred Orders Closed
          </div>
          <div className="text-2xl font-serif font-black text-emerald-600 mt-1">
            {totalConversions}
          </div>
          <div className="text-[11px] text-neutral-400 mt-1">Verified work orders</div>
        </div>

        <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#C8102E]">
            Affiliate Rewards Accrued
          </div>
          <div className="text-2xl font-serif font-black text-[#C8102E] mt-1">
            ₹{totalRewards.toLocaleString()}
          </div>
          <div className="text-[11px] text-neutral-400 mt-1">Student commission earned</div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-neutral-200/80 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50/70 border-b border-neutral-200 text-neutral-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Affiliate Code</th>
                <th className="py-3 px-4">Ambassador Name</th>
                <th className="py-3 px-4">Visits</th>
                <th className="py-3 px-4">Inquiries</th>
                <th className="py-3 px-4">Converted</th>
                <th className="py-3 px-4">Rewards (₹)</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-neutral-400">
                    Loading referrals...
                  </td>
                </tr>
              ) : referrals.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-neutral-400">
                    No ambassador codes created yet.
                  </td>
                </tr>
              ) : (
                referrals.map((item) => (
                  <tr key={item.id} className="hover:bg-neutral-50/60 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-[#111318] bg-neutral-100 px-2 py-0.5 rounded-md">
                          {item.code}
                        </span>
                        <button
                          onClick={() => handleCopy(item.code)}
                          title="Copy Link"
                          className="p-1 text-neutral-400 hover:text-neutral-700 rounded"
                        >
                          {copiedCode === item.code ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-[#111318]">{item.referrerName}</div>
                      <div className="text-[11px] text-neutral-400">{item.email}</div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-neutral-700">{item.visits || 0}</td>
                    <td className="py-3 px-4 font-semibold text-neutral-700">{item.enquiries || 0}</td>
                    <td className="py-3 px-4 font-bold text-emerald-600">{item.converted || 0}</td>
                    <td className="py-3 px-4 font-bold text-[#C8102E]">₹{item.rewardEarned || 0}</td>
                    <td className="py-3 px-4">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50"
                        title="Delete"
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
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 mb-4">
              <h3 className="text-base font-bold font-serif text-[#111318]">
                Create Ambassador Code
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-neutral-400 hover:text-neutral-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddReferral} className="space-y-3 text-xs">
              <div>
                <label className="block text-neutral-600 font-medium mb-1">Coupon / Referral Code *</label>
                <input
                  type="text"
                  required
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  className="w-full p-2 rounded-xl border border-neutral-200 font-mono font-bold uppercase focus:outline-none focus:border-[#C8102E]"
                />
              </div>

              <div>
                <label className="block text-neutral-600 font-medium mb-1">Ambassador Full Name *</label>
                <input
                  type="text"
                  required
                  value={form.referrerName}
                  onChange={(e) => setForm({ ...form, referrerName: e.target.value })}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full p-2 rounded-xl border border-neutral-200 focus:outline-none focus:border-[#C8102E]"
                />
              </div>

              <div>
                <label className="block text-neutral-600 font-medium mb-1">Contact Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="e.g. rahul@college.edu"
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
                  Create Code
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
