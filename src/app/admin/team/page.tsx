"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  Plus,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  Edit2,
  CheckCircle2,
  Clock,
  X,
  Mail,
  Lock,
  User,
  KeyRound,
  Eye,
  EyeOff,
  Copy,
  Check,
  AlertCircle,
  Sparkles,
} from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  username: string;
  email: string;
  password?: string;
  role: "Super Admin" | "Admin" | "Moderator";
  status: "Active" | "Suspended";
  lastLogin: string | null;
  permissions?: string[];
  createdAt?: string;
}

export default function AdminTeamPage() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    role: "Admin" as "Super Admin" | "Admin" | "Moderator",
    status: "Active" as "Active" | "Suspended",
  });

  useEffect(() => {
    fetchTeam();
  }, []);

  async function fetchTeam() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/team");
      const data = await res.json();
      if (data.success) {
        setTeam(data.team || []);
      }
    } catch (e) {
      console.error("Failed to load team:", e);
    } finally {
      setLoading(false);
    }
  }

  function showNotification(type: "success" | "error", text: string) {
    setFeedbackMsg({ type, text });
    setTimeout(() => setFeedbackMsg(null), 4000);
  }

  function openCreateModal() {
    setIsEditMode(false);
    setEditId(null);
    setForm({
      name: "",
      username: "",
      email: "",
      password: "",
      role: "Admin",
      status: "Active",
    });
    setIsModalOpen(true);
  }

  function openEditModal(member: TeamMember) {
    setIsEditMode(true);
    setEditId(member.id);
    setForm({
      name: member.name,
      username: member.username || "",
      email: member.email,
      password: member.password || "",
      role: member.role,
      status: member.status,
    });
    setIsModalOpen(true);
  }

  function handleGeneratePassword() {
    const chars = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789!@#$%";
    let generated = "";
    for (let i = 0; i < 10; i++) {
      generated += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setForm((prev) => ({ ...prev, password: generated }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (isEditMode && editId) {
        // PUT update
        const res = await fetch("/api/admin/team", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editId, ...form }),
        });
        const data = await res.json();
        if (data.success) {
          setIsModalOpen(false);
          showNotification("success", `Team member @${form.username} updated successfully!`);
          fetchTeam();
        } else {
          showNotification("error", data.message || "Failed to update member");
        }
      } else {
        // POST create
        const res = await fetch("/api/admin/team", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const data = await res.json();
        if (data.success) {
          setIsModalOpen(false);
          showNotification("success", `New team member @${form.username} added as ${form.role}!`);
          fetchTeam();
        } else {
          showNotification("error", data.message || "Failed to create member");
        }
      }
    } catch (e) {
      showNotification("error", "Network error while saving team member.");
    }
  }

  async function handleDelete(id: string, username: string) {
    if (username === "wefounder") {
      alert("The root Super Admin account (@wefounder) is permanently protected.");
      return;
    }
    if (!confirm(`Are you sure you want to remove @${username}? They will no longer be able to log in.`)) return;

    try {
      const res = await fetch(`/api/admin/team?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        showNotification("success", `@${username} has been removed.`);
        setTeam((prev) => prev.filter((u) => u.id !== id));
      } else {
        showNotification("error", data.message || "Failed to remove member");
      }
    } catch (e) {
      showNotification("error", "Failed to delete team member");
    }
  }

  function togglePasswordVisibility(id: string) {
    setVisiblePasswords((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function handleCopyCredentials(member: TeamMember) {
    const text = `Written Expressa Admin Portal Login:
URL: ${window.location.origin}/admin/login
Username: ${member.username}
Password: ${member.password || "founder@we"}
Role: ${member.role}`;
    navigator.clipboard.writeText(text);
    setCopiedId(member.id);
    setTimeout(() => setCopiedId(null), 2500);
  }

  // Filtered members
  const filteredTeam = team.filter((m) => {
    if (activeFilter === "ALL") return true;
    if (activeFilter === "SUPER_ADMIN") return m.role === "Super Admin";
    if (activeFilter === "ADMIN") return m.role === "Admin";
    if (activeFilter === "MODERATOR") return m.role === "Moderator";
    return true;
  });

  const superAdminsCount = team.filter((m) => m.role === "Super Admin").length;
  const adminsCount = team.filter((m) => m.role === "Admin").length;
  const moderatorsCount = team.filter((m) => m.role === "Moderator").length;

  return (
    <div className="space-y-5 sm:space-y-6 max-w-6xl">
      {/* Toast Feedback */}
      {feedbackMsg && (
        <div
          className={`p-3.5 rounded-2xl flex items-center justify-between text-xs font-semibold shadow-sm animate-in fade-in slide-in-from-top-2 duration-150 ${
            feedbackMsg.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          <div className="flex items-center gap-2">
            {feedbackMsg.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span>{feedbackMsg.text}</span>
          </div>
          <button onClick={() => setFeedbackMsg(null)} className="text-neutral-400 hover:text-neutral-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-[#111318] flex items-center gap-2 flex-wrap">
            <span>Team &amp; Role Access Control</span>
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-600 font-sans font-bold">
              {team.length} Active Accounts
            </span>
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            Authorize and manage <strong>Super Admins</strong>, <strong>Admins</strong>, and <strong>Moderators</strong> who can sign in to the Written Expressa admin portal.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#C8102E] text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-[#a00d24] transition-colors shadow-sm shadow-[#C8102E]/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Admin / Moderator</span>
        </button>
      </div>

      {/* Responsive KPI Cards: 2-col on mobile, 4-col on desktop */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-3.5 sm:p-4 bg-white border border-neutral-200/80 rounded-2xl shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-neutral-500">Total Team</span>
            <Users className="w-4 h-4 text-neutral-400" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-zinc-950 mt-1">{team.length}</div>
          <div className="text-[10px] text-neutral-400 mt-0.5">Configured logins</div>
        </div>

        <div className="p-3.5 sm:p-4 bg-purple-50/50 border border-purple-200/80 rounded-2xl shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-purple-700">Super Admins</span>
            <ShieldAlert className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-purple-950 mt-1">{superAdminsCount}</div>
          <div className="text-[10px] text-purple-600/80 mt-0.5">Root access &amp; config</div>
        </div>

        <div className="p-3.5 sm:p-4 bg-blue-50/50 border border-blue-200/80 rounded-2xl shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-blue-700">Admins</span>
            <ShieldCheck className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-blue-950 mt-1">{adminsCount}</div>
          <div className="text-[10px] text-blue-600/80 mt-0.5">Operations &amp; catalog</div>
        </div>

        <div className="p-3.5 sm:p-4 bg-emerald-50/50 border border-emerald-200/80 rounded-2xl shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-emerald-700">Moderators</span>
            <Shield className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-emerald-950 mt-1">{moderatorsCount}</div>
          <div className="text-[10px] text-emerald-600/80 mt-0.5">Reviews &amp; enquiries</div>
        </div>
      </div>

      {/* Role Filter Tabs (Scrollable on small devices) */}
      <div className="flex items-center gap-2 border-b border-neutral-200 pb-2 overflow-x-auto flex-nowrap scrollbar-none">
        <button
          onClick={() => setActiveFilter("ALL")}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shrink-0 ${
            activeFilter === "ALL"
              ? "bg-[#111318] text-white"
              : "text-neutral-600 hover:bg-neutral-100"
          }`}
        >
          All Accounts ({team.length})
        </button>
        <button
          onClick={() => setActiveFilter("SUPER_ADMIN")}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shrink-0 ${
            activeFilter === "SUPER_ADMIN"
              ? "bg-purple-600 text-white"
              : "text-neutral-600 hover:bg-neutral-100"
          }`}
        >
          Super Admins ({superAdminsCount})
        </button>
        <button
          onClick={() => setActiveFilter("ADMIN")}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shrink-0 ${
            activeFilter === "ADMIN"
              ? "bg-blue-600 text-white"
              : "text-neutral-600 hover:bg-neutral-100"
          }`}
        >
          Admins ({adminsCount})
        </button>
        <button
          onClick={() => setActiveFilter("MODERATOR")}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shrink-0 ${
            activeFilter === "MODERATOR"
              ? "bg-emerald-600 text-white"
              : "text-neutral-600 hover:bg-neutral-100"
          }`}
        >
          Moderators ({moderatorsCount})
        </button>
      </div>

      {/* MOBILE CARD VIEW (Visible only on screens below md: 768px) */}
      <div className="block md:hidden space-y-3">
        {loading ? (
          <div className="py-8 text-center text-neutral-400 text-xs">
            Loading team accounts...
          </div>
        ) : filteredTeam.length === 0 ? (
          <div className="py-8 text-center text-neutral-400 text-xs bg-white rounded-2xl border border-neutral-200">
            No team members found in this category.
          </div>
        ) : (
          filteredTeam.map((member) => {
            const isRoot = member.username === "wefounder" || member.id === "usr_wefounder";
            const isVisible = !!visiblePasswords[member.id];
            const passwordDisplay = member.password || "founder@we";

            return (
              <div
                key={member.id}
                className="bg-white border border-neutral-200/90 rounded-2xl p-4 shadow-2xs space-y-3"
              >
                {/* Header: Avatar, Name & Status */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-9 h-9 rounded-full text-white text-xs font-bold flex items-center justify-center shrink-0 shadow-2xs ${
                        member.role === "Super Admin"
                          ? "bg-gradient-to-br from-purple-700 to-indigo-800"
                          : member.role === "Admin"
                          ? "bg-gradient-to-br from-blue-600 to-cyan-700"
                          : "bg-gradient-to-br from-emerald-600 to-teal-700"
                      }`}
                    >
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join("")
                        .toUpperCase()}
                    </div>
                    <div>
                      <div className="font-bold text-zinc-950 text-xs flex items-center gap-1.5">
                        <span>{member.name}</span>
                        {isRoot && (
                          <span className="text-[9px] px-1.5 py-0.2 bg-amber-100 text-amber-800 font-bold rounded">
                            Root
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-neutral-500 truncate max-w-[180px]">
                        {member.email}
                      </div>
                    </div>
                  </div>

                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                      member.status === "Active"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-red-50 text-red-700 border border-red-200"
                    }`}
                  >
                    {member.status}
                  </span>
                </div>

                {/* Details Strip */}
                <div className="p-2.5 bg-neutral-50 rounded-xl border border-neutral-200/70 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-neutral-400 uppercase">Login Username:</span>
                    <span className="font-mono font-bold text-zinc-950 bg-white px-2 py-0.5 rounded border border-neutral-200 text-[11px]">
                      @{member.username}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-neutral-400 uppercase">Role:</span>
                    <span
                      className={`inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded-md text-[10px] border ${
                        member.role === "Super Admin"
                          ? "bg-purple-50 text-purple-700 border-purple-200"
                          : member.role === "Admin"
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : "bg-emerald-50 text-emerald-700 border-emerald-200"
                      }`}
                    >
                      {member.role === "Super Admin" ? (
                        <ShieldAlert className="w-3 h-3 text-purple-600" />
                      ) : member.role === "Admin" ? (
                        <ShieldCheck className="w-3 h-3 text-blue-600" />
                      ) : (
                        <Shield className="w-3 h-3 text-emerald-600" />
                      )}
                      {member.role}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-neutral-400 uppercase">Password:</span>
                    <div className="flex items-center gap-1">
                      <code className="text-zinc-950 font-bold bg-white px-1.5 py-0.5 rounded border border-neutral-200 font-mono text-[11px]">
                        {isVisible ? passwordDisplay : "••••••••"}
                      </code>
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility(member.id)}
                        className="p-1 text-neutral-400 hover:text-zinc-950 rounded"
                        title={isVisible ? "Hide" : "Show"}
                      >
                        {isVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCopyCredentials(member)}
                        className="p-1 text-neutral-400 hover:text-zinc-950 rounded"
                        title="Copy credentials"
                      >
                        {copiedId === member.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-between pt-1 text-[11px] text-neutral-400">
                  <span>
                    Last active:{" "}
                    {member.lastLogin
                      ? new Date(member.lastLogin).toLocaleDateString([], {
                          month: "short",
                          day: "numeric",
                        })
                      : "Never"}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openEditModal(member)}
                      className="px-2.5 py-1 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-zinc-900 font-bold text-xs flex items-center gap-1"
                    >
                      <Edit2 className="w-3 h-3 text-blue-600" />
                      <span>Edit</span>
                    </button>
                    {!isRoot && (
                      <button
                        onClick={() => handleDelete(member.id, member.username)}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50"
                        title="Remove member"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* DESKTOP TABLE VIEW (Visible on md: 768px and up) */}
      <div className="hidden md:block bg-white border border-neutral-200/80 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50/80 border-b border-neutral-200 text-zinc-950 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Member Name</th>
                <th className="py-3 px-4">Login Username</th>
                <th className="py-3 px-4">Role &amp; Permissions</th>
                <th className="py-3 px-4">Login Password</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Last Active</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-neutral-400">
                    Loading team accounts...
                  </td>
                </tr>
              ) : filteredTeam.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-neutral-400">
                    No team members found in this category.
                  </td>
                </tr>
              ) : (
                filteredTeam.map((member) => {
                  const isRoot = member.username === "wefounder" || member.id === "usr_wefounder";
                  const isVisible = !!visiblePasswords[member.id];
                  const passwordDisplay = member.password || "founder@we";

                  return (
                    <tr key={member.id} className="hover:bg-neutral-50/60 transition-colors">
                      {/* Name & Email */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-full text-white text-xs font-bold flex items-center justify-center shrink-0 shadow-2xs ${
                              member.role === "Super Admin"
                                ? "bg-gradient-to-br from-purple-700 to-indigo-800"
                                : member.role === "Admin"
                                ? "bg-gradient-to-br from-blue-600 to-cyan-700"
                                : "bg-gradient-to-br from-emerald-600 to-teal-700"
                            }`}
                          >
                            {member.name
                              .split(" ")
                              .map((n) => n[0])
                              .slice(0, 2)
                              .join("")
                              .toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-zinc-950 flex items-center gap-1.5">
                              <span>{member.name}</span>
                              {isRoot && (
                                <span className="text-[9px] px-1.5 py-0.2 bg-amber-100 text-amber-800 font-bold rounded">
                                  Primary Root
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-neutral-500">{member.email}</div>
                          </div>
                        </div>
                      </td>

                      {/* Login Username */}
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-zinc-950 bg-neutral-100 px-2 py-1 rounded-md text-[11px] border border-neutral-200">
                          @{member.username}
                        </span>
                      </td>

                      {/* Role */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 font-bold px-2.5 py-1 rounded-lg text-[11px] border ${
                            member.role === "Super Admin"
                              ? "bg-purple-50 text-purple-700 border-purple-200"
                              : member.role === "Admin"
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : "bg-emerald-50 text-emerald-700 border-emerald-200"
                          }`}
                        >
                          {member.role === "Super Admin" ? (
                            <ShieldAlert className="w-3.5 h-3.5 text-purple-600" />
                          ) : member.role === "Admin" ? (
                            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                          ) : (
                            <Shield className="w-3.5 h-3.5 text-emerald-600" />
                          )}
                          {member.role}
                        </span>
                      </td>

                      {/* Password with Eye & Copy */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <code className="text-zinc-950 font-bold bg-neutral-100 px-2 py-0.5 rounded border border-neutral-200 font-mono text-[11px]">
                            {isVisible ? passwordDisplay : "••••••••"}
                          </code>
                          <button
                            type="button"
                            onClick={() => togglePasswordVisibility(member.id)}
                            className="p-1 text-neutral-400 hover:text-zinc-950 rounded"
                            title={isVisible ? "Hide password" : "Show password"}
                          >
                            {isVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleCopyCredentials(member)}
                            className="p-1 text-neutral-400 hover:text-zinc-950 rounded"
                            title="Copy login credentials"
                          >
                            {copiedId === member.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            member.status === "Active"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-red-50 text-red-700 border border-red-200"
                          }`}
                        >
                          {member.status}
                        </span>
                      </td>

                      {/* Last Active */}
                      <td className="py-3.5 px-4 text-neutral-500 text-[11px]">
                        {member.lastLogin
                          ? new Date(member.lastLogin).toLocaleDateString([], {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "Never"}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openEditModal(member)}
                            className="p-1.5 rounded-lg text-neutral-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                            title="Edit account credentials"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          {!isRoot && (
                            <button
                              onClick={() => handleDelete(member.id, member.username)}
                              className="p-1.5 rounded-lg text-neutral-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                              title="Remove user"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Member Modal (Mobile responsive with safe scroll height) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl sm:rounded-3xl max-w-md w-full p-4 sm:p-6 shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 mb-4 sticky top-0 bg-white z-10">
              <div>
                <h3 className="text-base font-bold font-serif text-[#111318]">
                  {isEditMode ? "Edit Team Member Account" : "Add Admin / Moderator Account"}
                </h3>
                <p className="text-[11px] text-neutral-500">
                  Configure login username, password, and portal permissions
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              {/* Full Name */}
              <div>
                <label className="block text-zinc-950 font-bold mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Rahul Sharma"
                  style={{ color: "#09090b" }}
                  className="w-full p-2.5 sm:p-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:border-[#C8102E] text-zinc-950 font-bold bg-white text-base sm:text-xs"
                />
              </div>

              {/* Login Username */}
              <div>
                <label className="block text-zinc-950 font-bold mb-1">
                  Login Username * (Used on /admin/login)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-neutral-400">@</span>
                  <input
                    type="text"
                    required
                    value={form.username}
                    onChange={(e) =>
                      setForm({ ...form, username: e.target.value.toLowerCase().replace(/\s+/g, "") })
                    }
                    placeholder="e.g. rahul_admin"
                    style={{ color: "#09090b" }}
                    className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:border-[#C8102E] text-zinc-950 font-bold bg-white text-base sm:text-xs"
                  />
                </div>
                <span className="text-[10px] text-neutral-500 mt-0.5 block">
                  Lowercase, no spaces. Members use this username to sign in.
                </span>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-zinc-950 font-bold mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="rahul@writtenexpressa.in"
                  style={{ color: "#09090b" }}
                  className="w-full p-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:border-[#C8102E] text-zinc-950 font-bold bg-white text-base sm:text-xs"
                />
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-zinc-950 font-bold">
                    Login Password {isEditMode ? "(Leave blank to keep current)" : "*"}
                  </label>
                  <button
                    type="button"
                    onClick={handleGeneratePassword}
                    className="text-[10px] font-bold text-[#C8102E] hover:underline flex items-center gap-1"
                  >
                    <KeyRound className="w-3 h-3" />
                    Generate Strong Password
                  </button>
                </div>
                <input
                  type="text"
                  required={!isEditMode}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder={isEditMode ? "Enter new password if changing" : "Enter secure password"}
                  style={{ color: "#09090b" }}
                  className="w-full p-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:border-[#C8102E] text-zinc-950 font-bold bg-white font-mono text-base sm:text-xs"
                />
              </div>

              {/* Role */}
              <div>
                <label className="block text-zinc-950 font-bold mb-1">
                  Assign Administrative Role *
                </label>
                <select
                  value={form.role}
                  onChange={(e) =>
                    setForm({ ...form, role: e.target.value as "Super Admin" | "Admin" | "Moderator" })
                  }
                  style={{ color: "#09090b" }}
                  className="w-full p-2.5 rounded-xl border border-neutral-300 text-zinc-950 font-bold bg-white focus:outline-none focus:border-[#C8102E] text-base sm:text-xs"
                >
                  <option value="Super Admin">Super Admin — Unrestricted system, team, &amp; database control</option>
                  <option value="Admin">Admin — Orders, Enquiries, Pricing, Services, Portfolio, Notifications</option>
                  <option value="Moderator">Moderator — Testimonials approval, content draft, enquiries view</option>
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="block text-zinc-950 font-bold mb-1">Account Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as "Active" | "Suspended" })}
                  style={{ color: "#09090b" }}
                  className="w-full p-2.5 rounded-xl border border-neutral-300 text-zinc-950 font-bold bg-white focus:outline-none focus:border-[#C8102E] text-base sm:text-xs"
                >
                  <option value="Active">Active (Permitted to log in)</option>
                  <option value="Suspended">Suspended (Login blocked)</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2 pt-4 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-neutral-200 hover:bg-neutral-50 font-bold text-neutral-700 cursor-pointer text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#C8102E] text-white hover:bg-[#a00d24] font-bold transition-colors cursor-pointer shadow-sm shadow-[#C8102E]/20 text-center"
                >
                  {isEditMode ? "Save Changes" : "Create Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
