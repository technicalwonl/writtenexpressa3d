"use client";

import React, { useState, useEffect } from "react";
import {
  ShoppingBag,
  Plus,
  Search,
  Filter,
  DollarSign,
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
  User,
  Phone,
  FileText,
  Edit2,
  Trash2,
  X,
} from "lucide-react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<any | null>(null);

  // Form state
  const [form, setForm] = useState({
    id: "",
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    serviceName: "Notes & Academic Records",
    projectTitle: "",
    agreedAmount: 0,
    advanceReceived: 0,
    paymentStatus: "Paid",
    orderStatus: "In Progress",
    assignedTo: "Academic Team",
    deliveryDate: "",
    notes: "",
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/orders");
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders || []);
      }
    } catch (e) {
      console.error("Failed to load orders:", e);
    } finally {
      setLoading(false);
    }
  }

  function openCreateModal() {
    setEditingOrder(null);
    setForm({
      id: `ORD-2026-${Math.floor(100 + Math.random() * 900)}`,
      customerName: "",
      customerPhone: "",
      customerEmail: "",
      serviceName: "Notes & Academic Records",
      projectTitle: "",
      agreedAmount: 0,
      advanceReceived: 0,
      paymentStatus: "Payment Partially Received",
      orderStatus: "In Progress",
      assignedTo: "Production Lead",
      deliveryDate: new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0],
      notes: "",
    });
    setIsModalOpen(true);
  }

  function openEditModal(order: any) {
    setEditingOrder(order);
    setForm({
      id: order.id,
      customerName: order.customerName,
      customerPhone: order.customerPhone || "",
      customerEmail: order.customerEmail || "",
      serviceName: order.serviceName,
      projectTitle: order.projectTitle,
      agreedAmount: order.agreedAmount,
      advanceReceived: order.advanceReceived,
      paymentStatus: order.paymentStatus,
      orderStatus: order.orderStatus,
      assignedTo: order.assignedTo || "Production Lead",
      deliveryDate: order.deliveryDate || "",
      notes: order.notes || "",
    });
    setIsModalOpen(true);
  }

  async function handleSaveOrder(e: React.FormEvent) {
    e.preventDefault();
    const balance = Math.max(0, Number(form.agreedAmount) - Number(form.advanceReceived));
    const payload = {
      ...form,
      remainingBalance: balance,
    };

    try {
      const method = editingOrder ? "PUT" : "POST";
      const res = await fetch("/api/admin/orders", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchOrders();
      } else {
        alert("Failed to save order");
      }
    } catch (err) {
      alert("Error saving order");
    }
  }

  async function handleDeleteOrder(id: string) {
    if (!confirm("Delete this order record permanently?")) return;
    try {
      const res = await fetch(`/api/admin/orders?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setOrders((prev) => prev.filter((o) => o.id !== id));
      }
    } catch (e) {
      alert("Failed to delete order");
    }
  }

  // Aggregate stats
  const totalBooked = orders.reduce((sum, o) => sum + Number(o.agreedAmount || 0), 0);
  const totalCollected = orders.reduce((sum, o) => sum + Number(o.advanceReceived || 0), 0);
  const totalOutstanding = orders.reduce((sum, o) => sum + Number(o.remainingBalance || 0), 0);

  const filtered = orders.filter((o) => {
    const matchesFilter =
      filterStatus === "All" || o.orderStatus?.toLowerCase() === filterStatus.toLowerCase();
    const matchesSearch =
      (o.customerName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.id || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.projectTitle || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.serviceName || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-serif text-[#111318]">
            Orders & Production Execution
          </h2>
          <p className="text-xs text-neutral-500">
            Real client work orders, fulfillment milestones, and payment balances
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-1.5 bg-[#C8102E] text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-[#a00d24] transition-colors shadow-xs shadow-[#C8102E]/20"
        >
          <Plus className="w-4 h-4" />
          <span>New Work Order</span>
        </button>
      </div>

      {/* Financial Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
            Total Work Value Booked
          </div>
          <div className="text-2xl font-serif font-black text-[#111318] mt-1">
            ₹{totalBooked.toLocaleString()}
          </div>
          <div className="text-[11px] text-neutral-400 mt-1">
            Across {orders.length} verified projects
          </div>
        </div>

        <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">
            Advance / Paid Received
          </div>
          <div className="text-2xl font-serif font-black text-emerald-600 mt-1">
            ₹{totalCollected.toLocaleString()}
          </div>
          <div className="text-[11px] text-neutral-400 mt-1">
            Collection rate:{" "}
            {totalBooked > 0 ? ((totalCollected / totalBooked) * 100).toFixed(0) : 0}%
          </div>
        </div>

        <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#C8102E]">
            Remaining Balance Due
          </div>
          <div className="text-2xl font-serif font-black text-[#C8102E] mt-1">
            ₹{totalOutstanding.toLocaleString()}
          </div>
          <div className="text-[11px] text-neutral-400 mt-1">Due upon draft milestone delivery</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          {["All", "In Progress", "Delivered", "Completed", "Draft"].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                filterStatus === st
                  ? "bg-[#111318] text-white"
                  : "bg-neutral-100/80 text-neutral-600 hover:bg-neutral-200/60"
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search orders, clients, titles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-neutral-200 focus:outline-none focus:border-[#C8102E] transition-colors"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-neutral-200/80 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50/70 border-b border-neutral-200 text-neutral-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Order ID & Date</th>
                <th className="py-3.5 px-4">Client Details</th>
                <th className="py-3.5 px-4">Project & Service</th>
                <th className="py-3.5 px-4">Financials</th>
                <th className="py-3.5 px-4">Payment</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-neutral-400">
                    Loading orders...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-neutral-400">
                    No orders match your criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((ord) => (
                  <tr key={ord.id} className="hover:bg-neutral-50/70 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-mono font-bold text-[#111318]">{ord.id}</div>
                      <div className="text-[10px] text-neutral-400">
                        {ord.createdAt
                          ? new Date(ord.createdAt).toLocaleDateString([], {
                              month: "short",
                              day: "numeric",
                            })
                          : "Active"}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-[#111318]">{ord.customerName}</div>
                      <div className="text-[11px] text-neutral-500">
                        {ord.customerPhone || ord.customerEmail}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-neutral-800 line-clamp-1">
                        {ord.projectTitle}
                      </div>
                      <div className="text-[11px] text-neutral-400">{ord.serviceName}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-[#111318]">₹{ord.agreedAmount}</div>
                      <div className="text-[10px] text-neutral-500">
                        Paid: ₹{ord.advanceReceived} | Bal:{" "}
                        <span className="font-semibold text-[#C8102E]">
                          ₹{ord.remainingBalance}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          ord.paymentStatus === "Paid"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {ord.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          ord.orderStatus === "Completed" || ord.orderStatus === "Delivered"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-blue-50 text-blue-700"
                        }`}
                      >
                        {ord.orderStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(ord)}
                          title="Edit Order"
                          className="p-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteOrder(ord.id)}
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

      {/* Modal for Create / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 mb-4">
              <h3 className="text-base font-bold font-serif text-[#111318]">
                {editingOrder ? "Edit Work Order" : "Create New Work Order"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-neutral-400 hover:text-neutral-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveOrder} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-600 font-medium mb-1">Customer Name *</label>
                  <input
                    type="text"
                    required
                    value={form.customerName}
                    onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                    className="w-full p-2 rounded-xl border border-neutral-200 focus:outline-none focus:border-[#C8102E]"
                  />
                </div>
                <div>
                  <label className="block text-neutral-600 font-medium mb-1">Phone / WhatsApp</label>
                  <input
                    type="text"
                    value={form.customerPhone}
                    onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
                    className="w-full p-2 rounded-xl border border-neutral-200 focus:outline-none focus:border-[#C8102E]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-600 font-medium mb-1">Project Title *</label>
                <input
                  type="text"
                  required
                  value={form.projectTitle}
                  onChange={(e) => setForm({ ...form, projectTitle: e.target.value })}
                  placeholder="e.g. Foot Step Power Generation Capstone Documentation"
                  className="w-full p-2 rounded-xl border border-neutral-200 focus:outline-none focus:border-[#C8102E]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-600 font-medium mb-1">Service Vertical</label>
                  <select
                    value={form.serviceName}
                    onChange={(e) => setForm({ ...form, serviceName: e.target.value })}
                    className="w-full p-2 rounded-xl border border-neutral-200 focus:outline-none focus:border-[#C8102E]"
                  >
                    <option value="Notes & Academic Records">Notes & Academic Records</option>
                    <option value="PowerPoint Presentations">PowerPoint Presentations</option>
                    <option value="Academic Project Assistance">Academic Project Assistance</option>
                    <option value="Project Documentation">Project Documentation</option>
                    <option value="Custom Magazines">Custom Magazines</option>
                    <option value="Web & Technical Services">Web & Technical Services</option>
                    <option value="Expressa Art Store">Expressa Art Store</option>
                  </select>
                </div>
                <div>
                  <label className="block text-neutral-600 font-medium mb-1">Delivery Target Date</label>
                  <input
                    type="date"
                    value={form.deliveryDate}
                    onChange={(e) => setForm({ ...form, deliveryDate: e.target.value })}
                    className="w-full p-2 rounded-xl border border-neutral-200 focus:outline-none focus:border-[#C8102E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 bg-neutral-50 rounded-xl">
                <div>
                  <label className="block text-neutral-600 font-medium mb-1">Agreed Amount (₹) *</label>
                  <input
                    type="number"
                    required
                    value={form.agreedAmount}
                    onChange={(e) => setForm({ ...form, agreedAmount: Number(e.target.value) })}
                    className="w-full p-2 bg-white rounded-lg border border-neutral-200 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-neutral-600 font-medium mb-1">Advance Received (₹)</label>
                  <input
                    type="number"
                    value={form.advanceReceived}
                    onChange={(e) => setForm({ ...form, advanceReceived: Number(e.target.value) })}
                    className="w-full p-2 bg-white rounded-lg border border-neutral-200 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-600 font-medium mb-1">Payment Status</label>
                  <select
                    value={form.paymentStatus}
                    onChange={(e) => setForm({ ...form, paymentStatus: e.target.value })}
                    className="w-full p-2 rounded-xl border border-neutral-200"
                  >
                    <option value="Paid">Paid in Full</option>
                    <option value="Payment Partially Received">Payment Partially Received</option>
                    <option value="Unpaid">Unpaid</option>
                  </select>
                </div>
                <div>
                  <label className="block text-neutral-600 font-medium mb-1">Order Pipeline Status</label>
                  <select
                    value={form.orderStatus}
                    onChange={(e) => setForm({ ...form, orderStatus: e.target.value })}
                    className="w-full p-2 rounded-xl border border-neutral-200"
                  >
                    <option value="In Progress">In Progress</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Completed">Completed</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-neutral-600 font-medium mb-1">Internal Notes</label>
                <textarea
                  rows={2}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="e.g. Schematics approved by client. Draft thesis shared."
                  className="w-full p-2 rounded-xl border border-neutral-200 focus:outline-none focus:border-[#C8102E]"
                />
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
                  {editingOrder ? "Save Changes" : "Create Order"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
