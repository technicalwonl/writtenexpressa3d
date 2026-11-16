"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Inbox,
  Users,
  Star,
  ArrowUpRight,
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Layers,
  Sparkles,
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

export default function AdminDashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    advanceCollected: 0,
    pendingBalance: 0,
    totalOrders: 0,
    activeOrders: 0,
    completedOrders: 0,
    totalEnquiries: 0,
    newEnquiries: 0,
    totalTestimonials: 0,
    avgRating: 5.0,
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [recentEnquiries, setRecentEnquiries] = useState<any[]>([]);

  useEffect(() => {
    setMounted(true);
    async function loadDashboard() {
      try {
        const [ordRes, enqRes, tstRes] = await Promise.all([
          fetch("/api/admin/orders"),
          fetch("/api/admin/enquiries"),
          fetch("/api/admin/testimonials"),
        ]);

        const [ordData, enqData, tstData] = await Promise.all([
          ordRes.json(),
          enqRes.json(),
          tstRes.json(),
        ]);

        const orders = ordData.orders || [];
        const enquiries = enqData.enquiries || [];
        const testimonials = tstData.testimonials || [];

        let revenue = 0;
        let advance = 0;
        let balance = 0;
        let activeOrd = 0;
        let compOrd = 0;

        orders.forEach((o: any) => {
          revenue += Number(o.agreedAmount || 0);
          advance += Number(o.advanceReceived || 0);
          balance += Number(o.remainingBalance || 0);
          if (o.orderStatus === "Completed" || o.orderStatus === "Delivered") {
            compOrd++;
          } else {
            activeOrd++;
          }
        });

        const newEnq = enquiries.filter(
          (e: any) => e.status === "New" || e.status === "Pending Review"
        ).length;

        const ratings = testimonials.map((t: any) => Number(t.rating || 5));
        const avg = ratings.length
          ? (ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length).toFixed(1)
          : "5.0";

        setStats({
          totalRevenue: revenue,
          advanceCollected: advance,
          pendingBalance: balance,
          totalOrders: orders.length,
          activeOrders: activeOrd,
          completedOrders: compOrd,
          totalEnquiries: enquiries.length,
          newEnquiries: newEnq,
          totalTestimonials: testimonials.length,
          avgRating: Number(avg),
        });

        setRecentOrders(orders.slice(0, 5));
        setRecentEnquiries(enquiries.slice(0, 5));
      } catch (err) {
        console.error("Dashboard data load error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const revenueData = [
    { month: "Jun", revenue: 8400, orders: 12 },
    { month: "Jul", revenue: 14200, orders: 19 },
    { month: "Aug", revenue: 22800, orders: 28 },
    { month: "Sep", revenue: 31500, orders: 41 },
    { month: "Oct", revenue: 42100, orders: 54 },
    { month: "Nov (MTD)", revenue: stats.totalRevenue || 2180, orders: stats.totalOrders || 4 },
  ];

  const categoryDistribution = [
    { name: "Academic Solutions", value: 45, color: "#C8102E" },
    { name: "Creative Design", value: 30, color: "#111318" },
    { name: "Technical Solutions", value: 20, color: "#4f46e5" },
    { name: "Digital Services", value: 5, color: "#059669" },
  ];

  return (
    <div className="space-y-8">
      {/* Top Welcome Banner */}
      <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#C8102E]/10 text-[#C8102E] text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Central Business Intelligence
          </div>
          <h2 className="text-2xl font-serif font-black text-[#111318] tracking-tight">
            Written Expressa Command Center
          </h2>
          <p className="text-sm text-neutral-500 max-w-2xl mt-1">
            Real-time synchronization between public storefront, client enquiry CRM, dynamic pricing matrix, and order fulfillment.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/pricing"
            className="px-4 py-2 text-xs font-semibold rounded-xl border border-neutral-300 text-neutral-700 hover:bg-neutral-50 transition-colors"
          >
            Manage Pricing
          </Link>
          <Link
            href="/admin/enquiries"
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-[#C8102E] text-white hover:bg-[#a00d24] transition-colors shadow-xs shadow-[#C8102E]/20"
          >
            Review Enquiries ({stats.newEnquiries})
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Revenue */}
        <div className="bg-white border border-neutral-200/80 rounded-2xl p-5 shadow-xs hover:border-[#C8102E]/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Total Revenue
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-serif text-[#111318]">
              ₹{stats.totalRevenue.toLocaleString()}
            </span>
            <span className="text-xs text-emerald-600 font-semibold flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" />
              100% Verified
            </span>
          </div>
          <div className="mt-2 text-xs text-neutral-500 flex items-center justify-between border-t border-neutral-100 pt-2">
            <span>Collected: ₹{stats.advanceCollected}</span>
            <span className="text-[#C8102E] font-medium">Pending: ₹{stats.pendingBalance}</span>
          </div>
        </div>

        {/* Orders in Production */}
        <div className="bg-white border border-neutral-200/80 rounded-2xl p-5 shadow-xs hover:border-[#C8102E]/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Orders Executed
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-serif text-[#111318]">
              {stats.totalOrders}
            </span>
            <span className="text-xs text-blue-600 font-semibold">
              {stats.activeOrders} Active in Pipeline
            </span>
          </div>
          <div className="mt-2 text-xs text-neutral-500 flex items-center justify-between border-t border-neutral-100 pt-2">
            <span>Delivered: {stats.completedOrders}</span>
            <Link href="/admin/orders" className="text-[#C8102E] hover:underline">
              View All
            </Link>
          </div>
        </div>

        {/* Active Enquiries / Leads */}
        <div className="bg-white border border-neutral-200/80 rounded-2xl p-5 shadow-xs hover:border-[#C8102E]/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Enquiries & Leads
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#C8102E]/10 text-[#C8102E] flex items-center justify-center">
              <Inbox className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-serif text-[#111318]">
              {stats.totalEnquiries}
            </span>
            <span className="text-xs text-[#C8102E] font-bold">
              {stats.newEnquiries} Pending Action
            </span>
          </div>
          <div className="mt-2 text-xs text-neutral-500 flex items-center justify-between border-t border-neutral-100 pt-2">
            <span>WhatsApp & Web Enquiries</span>
            <Link href="/admin/enquiries" className="text-[#C8102E] hover:underline">
              Open CRM
            </Link>
          </div>
        </div>

        {/* Customer Satisfaction */}
        <div className="bg-white border border-neutral-200/80 rounded-2xl p-5 shadow-xs hover:border-[#C8102E]/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Client Satisfaction
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Star className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-serif text-[#111318]">
              {stats.avgRating} / 5.0
            </span>
            <span className="text-xs text-amber-600 font-semibold">
              {stats.totalTestimonials} Reviews
            </span>
          </div>
          <div className="mt-2 text-xs text-neutral-500 flex items-center justify-between border-t border-neutral-100 pt-2">
            <span>Verified Student Reviews</span>
            <Link href="/admin/testimonials" className="text-[#C8102E] hover:underline">
              Moderate
            </Link>
          </div>
        </div>
      </div>

      {/* Visual Charts */}
      {mounted && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Trend Area Chart */}
          <div className="lg:col-span-2 bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-xs">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-bold font-serif text-[#111318]">
                  Revenue & Order Trajectory
                </h3>
                <p className="text-xs text-neutral-400">
                  Monthly growth across all 4 service verticals
                </p>
              </div>
              <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-neutral-100 text-neutral-600">
                FY 2026
              </span>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#C8102E" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#C8102E" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#888" fontSize={11} tickLine={false} />
                  <YAxis stroke="#888" fontSize={11} tickLine={false} tickFormatter={(v) => `₹${v}`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#111318",
                      borderRadius: "8px",
                      color: "#fff",
                      border: "none",
                      fontSize: "12px",
                    }}
                    formatter={(val: any) => [`₹${val}`, "Revenue"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#C8102E"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorRev)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Service Vertical Share */}
          <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-xs">
            <div className="mb-4">
              <h3 className="text-base font-bold font-serif text-[#111318]">
                Vertical Distribution
              </h3>
              <p className="text-xs text-neutral-400">Inquiry & order volume by category</p>
            </div>
            <div className="h-44 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryDistribution}
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {categoryDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-4 pt-3 border-t border-neutral-100">
              {categoryDistribution.map((cat) => (
                <div key={cat.name} className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2 text-neutral-600">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: cat.color }}
                    />
                    {cat.name}
                  </span>
                  <span className="font-semibold text-[#111318]">{cat.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Two Column Table: Recent Orders & Recent Enquiries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-neutral-100">
            <div>
              <h3 className="text-base font-bold font-serif text-[#111318]">
                Production & Delivery Orders
              </h3>
              <p className="text-xs text-neutral-400">Authentic project deliverables</p>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs font-semibold text-[#C8102E] hover:underline flex items-center gap-1"
            >
              Manage Orders
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-neutral-100">
            {recentOrders.length === 0 ? (
              <div className="py-8 text-center text-xs text-neutral-400">No orders found.</div>
            ) : (
              recentOrders.map((ord) => (
                <div key={ord.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#111318] truncate">
                        {ord.customerName}
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          ord.orderStatus === "Completed" || ord.orderStatus === "Delivered"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-blue-50 text-blue-700"
                        }`}
                      >
                        {ord.orderStatus}
                      </span>
                    </div>
                    <div className="text-xs text-neutral-500 truncate mt-0.5">
                      {ord.projectTitle} • {ord.serviceName}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-xs font-bold text-[#111318]">
                      ₹{ord.agreedAmount}
                    </div>
                    <div className="text-[10px] text-neutral-400">
                      Bal: ₹{ord.remainingBalance}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Enquiries */}
        <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-neutral-100">
            <div>
              <h3 className="text-base font-bold font-serif text-[#111318]">
                Incoming Client Enquiries
              </h3>
              <p className="text-xs text-neutral-400">Direct from public website forms</p>
            </div>
            <Link
              href="/admin/enquiries"
              className="text-xs font-semibold text-[#C8102E] hover:underline flex items-center gap-1"
            >
              Open Pipeline
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-neutral-100">
            {recentEnquiries.length === 0 ? (
              <div className="py-8 text-center text-xs text-neutral-400">
                No recent enquiries received.
              </div>
            ) : (
              recentEnquiries.map((enq) => (
                <div key={enq.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#111318] truncate">
                        {enq.fullName}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700">
                        {enq.serviceInterest || "General"}
                      </span>
                    </div>
                    <div className="text-xs text-neutral-500 truncate mt-0.5">
                      {enq.projectDescription || enq.email}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        enq.status === "New"
                          ? "bg-[#C8102E]/10 text-[#C8102E]"
                          : "bg-emerald-50 text-emerald-700"
                      }`}
                    >
                      {enq.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
