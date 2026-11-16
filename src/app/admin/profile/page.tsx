"use client";

import React, { useState } from "react";
import {
  User,
  Mail,
  Shield,
  Save,
  CheckCircle2,
  Bell,
  Sparkles,
} from "lucide-react";

export default function AdminProfilePage() {
  const [profile, setProfile] = useState({
    name: "Sai Sheshank",
    email: "admin@writtenexpressa.com",
    role: "Super Admin",
    phone: "+91 98765 43210",
    emailAlerts: true,
    whatsappAlerts: true,
  });
  const [saved, setSaved] = useState(false);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold font-serif text-[#111318]">
          Administrator Profile
        </h2>
        <p className="text-xs text-neutral-500">
          Personal identity, security badge, and operational notification preferences
        </p>
      </div>

      {saved && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Profile preferences saved successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-5 text-xs">
        {/* User Card */}
        <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-xs flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#111318] text-white font-serif font-black text-2xl flex items-center justify-center flex-shrink-0 shadow-md">
            SS
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold font-serif text-[#111318]">{profile.name}</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#C8102E]/10 text-[#C8102E]">
                {profile.role}
              </span>
            </div>
            <div className="text-xs text-neutral-500 mt-0.5">{profile.email}</div>
            <div className="text-[11px] text-neutral-400 mt-1 flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
              Full Unrestricted Root Permissions
            </div>
          </div>
        </div>

        {/* Profile Inputs */}
        <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-xs space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 pb-2 border-b border-neutral-100">
            Account Details
          </h4>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-neutral-600 font-medium mb-1">Display Name</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-[#C8102E]"
              />
            </div>
            <div>
              <label className="block text-neutral-600 font-medium mb-1">Email Address</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-[#C8102E]"
              />
            </div>
          </div>

          <div>
            <label className="block text-neutral-600 font-medium mb-1">Personal WhatsApp / Mobile</label>
            <input
              type="text"
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-[#C8102E]"
            />
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-xs space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 pb-2 border-b border-neutral-100 flex items-center gap-1.5">
            <Bell className="w-3.5 h-3.5" />
            Alert Preferences
          </h4>

          <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl">
            <div>
              <span className="font-semibold text-neutral-800">Email Notification on New Enquiry</span>
              <p className="text-[11px] text-neutral-400">Receive immediate email dispatch whenever a user contacts</p>
            </div>
            <input
              type="checkbox"
              checked={profile.emailAlerts}
              onChange={(e) => setProfile({ ...profile, emailAlerts: e.target.checked })}
              className="w-4 h-4 text-[#C8102E] rounded border-neutral-300"
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl">
            <div>
              <span className="font-semibold text-neutral-800">WhatsApp Alert on Order Confirmation</span>
              <p className="text-[11px] text-neutral-400">Send WhatsApp ping when work order is created</p>
            </div>
            <input
              type="checkbox"
              checked={profile.whatsappAlerts}
              onChange={(e) => setProfile({ ...profile, whatsappAlerts: e.target.checked })}
              className="w-4 h-4 text-[#C8102E] rounded border-neutral-300"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-[#C8102E] text-white hover:bg-[#a00d24] font-semibold transition-colors inline-flex items-center gap-1.5 shadow-xs"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile</span>
          </button>
        </div>
      </form>
    </div>
  );
}
