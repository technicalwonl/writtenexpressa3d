"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Inbox,
  ArrowUpRight,
  PieChart as PieIcon,
  Calendar,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function AdminAnalyticsPage() {
  const [mounted, setMounted] = useState(false);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    async function fetchAnalytics() {
      try {
        const res = await fetch("/api/admin/analytics");
        const data = await res.json();
        if (data.success) {
          setAnalytics(data);
        }
      } catch (e) {
        console.error("Failed to load analytics:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, []);

  const monthlyGrowth = [
    { month: "Jul", revenue: 8400, target: 8000 },
    { month: "Aug", revenue: 14200, target: 12000 },
    { month: "Sep", revenue: 22800, target: 20000 },
    { month: "Oct", revenue: 31500, target: 28000 },
    { month: "Nov", revenue: 42100, target: 35000 },
  ];

  const conversionFunnel = [
    { stage: "Storefront Visitors", count: 1240, drop: "100%" },
    { stage: "Consultation Enquiries", count: 86, drop: "6.9%" },
    { stage: "Quotations Issued", count: 48, drop: "55.8%" },
    { stage: "Orders Executed", count: 32, drop: "66.7%" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold font-serif text-[#111318]">
          Financial & Operational Analytics
        </h2>
        <p className="text-xs text-neutral-500">
          Executive performance metrics, client conversion funnel, and revenue trends
        </p>
      </div>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-neutral-200/80 rounded-2xl p-5 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
            Total Revenue Booked
          </div>
          <div className="text-2xl font-serif font-black text-[#111318] mt-1">
            ₹{analytics?.kpis?.revenueCollected ? (analytics.kpis.revenueCollected + analytics.kpis.outstandingPayments).toLocaleString() : "2,180"}
          </div>
          <div className="text-xs text-emerald-600 font-semibold mt-1 flex items-center">
            <TrendingUp className="w-3 h-3 mr-1" />
            +28% MoM Growth
          </div>
        </div>

        <div className="bg-white border border-neutral-200/80 rounded-2xl p-5 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">
            Cash Inflow Collected
          </div>
          <div className="text-2xl font-serif font-black text-emerald-600 mt-1">
            ₹{analytics?.kpis?.revenueCollected?.toLocaleString() || "1,580"}
          </div>
          <div className="text-[11px] text-neutral-400 mt-1">Bank & UPI settlements</div>
        </div>

        <div className="bg-white border border-neutral-200/80 rounded-2xl p-5 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#C8102E]">
            Outstanding Receivable
          </div>
          <div className="text-2xl font-serif font-black text-[#C8102E] mt-1">
            ₹{analytics?.kpis?.outstandingPayments?.toLocaleString() || "600"}
          </div>
          <div className="text-[11px] text-neutral-400 mt-1">Milestone delivery collection</div>
        </div>

        <div className="bg-white border border-neutral-200/80 rounded-2xl p-5 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
            Average Order Value (AOV)
          </div>
          <div className="text-2xl font-serif font-black text-blue-600 mt-1">
            ₹545
          </div>
          <div className="text-[11px] text-neutral-400 mt-1">Across all active verticals</div>
        </div>
      </div>

      {/* Visual Charts */}
      {mounted && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Chart */}
          <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold font-serif text-[#111318]">
                  Monthly Revenue vs Target
                </h3>
                <p className="text-xs text-neutral-400">Consolidated financial growth</p>
              </div>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyGrowth}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#888" fontSize={11} tickLine={false} />
                  <YAxis stroke="#888" fontSize={11} tickLine={false} tickFormatter={(v) => `₹${v}`} />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#C8102E" radius={[6, 6, 0, 0]} name="Actual Revenue" />
                  <Bar dataKey="target" fill="#111318" radius={[6, 6, 0, 0]} opacity={0.3} name="Target" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Conversion Funnel */}
          <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold font-serif text-[#111318] mb-1">
                Client Acquisition Funnel
              </h3>
              <p className="text-xs text-neutral-400 mb-6">
                Conversion efficiency from visitor to paid fulfillment
              </p>

              <div className="space-y-4">
                {conversionFunnel.map((item, idx) => (
                  <div key={item.stage} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-neutral-700">{item.stage}</span>
                      <span className="text-[#111318] font-bold font-mono">
                        {item.count} <span className="text-neutral-400 font-normal">({item.drop})</span>
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-neutral-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#C8102E] rounded-full transition-all"
                        style={{
                          width: `${Math.max(12, 100 - idx * 24)}%`,
                          opacity: 1 - idx * 0.18,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-neutral-100 text-xs text-neutral-500 flex items-center justify-between">
              <span>Overall End-to-End Conversion:</span>
              <span className="font-bold text-emerald-600 font-mono text-sm">37.2%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
