"use client";

import React from "react";
import { usePathname } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // If visiting login, render without dashboard shell
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col md:flex-row text-[#111318] antialiased">
      {/* 20-Section Interactive Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <AdminHeader />
        <main className="flex-1 p-3 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
