"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, User, ArrowRight } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usernameOrEmail: identifier, password }),
      });
      const data = await res.json();

      if (data.success) {
        router.push("/admin/dashboard");
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch (err) {
      setError("An error occurred during authentication.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center p-3 sm:p-4">
      <div className="max-w-md w-full bg-white border border-neutral-200/80 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-xl space-y-5 sm:space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden border border-neutral-200 bg-white p-1 mx-auto shadow-sm">
            <img src="/images/logo.png" alt="Written Expressa" className="w-full h-full object-contain rounded-xl" />
          </div>
          <h1 className="text-lg sm:text-xl font-bold font-serif text-[#111318]">
            Written Expressa Control Center
          </h1>
          <p className="text-xs text-neutral-500">
            Sign in to access administration &amp; management
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-[#C8102E] text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="block text-zinc-950 font-bold mb-1.5 text-xs sm:text-xs">
              Admin Username or Email
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Enter your username or email"
                style={{ color: "#09090b" }}
                className="w-full pl-9 pr-3 py-3 sm:py-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:border-[#C8102E] focus:ring-1 focus:ring-[#C8102E] text-zinc-950 font-bold bg-white text-base sm:text-xs placeholder:text-neutral-400 placeholder:font-normal"
              />
            </div>
          </div>

          <div>
            <label className="block text-zinc-950 font-bold mb-1.5 text-xs sm:text-xs">
              Admin Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                style={{ color: "#09090b" }}
                className="w-full pl-9 pr-3 py-3 sm:py-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:border-[#C8102E] focus:ring-1 focus:ring-[#C8102E] text-zinc-950 font-bold bg-white text-base sm:text-xs placeholder:text-neutral-400 placeholder:font-normal"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 sm:py-3 rounded-xl bg-[#C8102E] text-white hover:bg-[#a00d24] font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-sm shadow-[#C8102E]/20 disabled:opacity-50 cursor-pointer"
          >
            <span>{loading ? "Authenticating..." : "Access Control Center"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-neutral-100">
          <Link
            href="/"
            className="text-xs text-neutral-500 hover:text-zinc-950 font-medium transition-colors inline-block py-1"
          >
            ← Return to Public Website
          </Link>
        </div>
      </div>
    </div>
  );
}
