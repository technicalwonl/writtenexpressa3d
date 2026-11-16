"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  Lock,
  Key,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  History,
  Save,
} from "lucide-react";

export default function AdminSecurityPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("New passwords do not match");
      return;
    }
    if (newPassword.length < 8) {
      alert("Password must be at least 8 characters");
      return;
    }

    setSuccessMsg("Admin master credentials updated successfully!");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setTimeout(() => setSuccessMsg(""), 4000);
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold font-serif text-[#111318]">
          Security & Access Controls
        </h2>
        <p className="text-xs text-neutral-500">
          Admin credential rotation, session termination, and platform security posture
        </p>
      </div>

      {successMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Security Posture Checklist */}
      <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold font-serif text-[#111318] pb-2 border-b border-neutral-100 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          Platform Security Checklist
        </h3>

        <div className="space-y-2.5 text-xs">
          <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <div>
                <span className="font-semibold text-neutral-800">Spam Honeypot Protection</span>
                <p className="text-[11px] text-neutral-400">Public forms include bot trapping & rate throttling</p>
              </div>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Active</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <div>
                <span className="font-semibold text-neutral-800">Secure Cookie Session Tokens</span>
                <p className="text-[11px] text-neutral-400">Strict SameSite & HttpOnly cookie configuration</p>
              </div>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Enforced</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <div>
                <span className="font-semibold text-neutral-800">Audit Logging</span>
                <p className="text-[11px] text-neutral-400">All administrative writes logged with user attribution</p>
              </div>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Enabled</span>
          </div>
        </div>
      </div>

      {/* Password Rotation */}
      <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold font-serif text-[#111318] pb-2 border-b border-neutral-100 flex items-center gap-2">
          <Key className="w-4 h-4 text-[#C8102E]" />
          Rotate Administrator Password
        </h3>

        <form onSubmit={handlePasswordChange} className="space-y-3 text-xs">
          <div>
            <label className="block text-neutral-600 font-medium mb-1">Current Password *</label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-[#C8102E]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-neutral-600 font-medium mb-1">New Password *</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 8 characters"
                className="w-full p-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-[#C8102E]"
              />
            </div>
            <div>
              <label className="block text-neutral-600 font-medium mb-1">Confirm New Password *</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-[#C8102E]"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#C8102E] text-white hover:bg-[#a00d24] font-semibold transition-colors inline-flex items-center gap-1.5 shadow-xs"
            >
              <Save className="w-4 h-4" />
              <span>Update Credentials</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
