"use client";

import { AdminHeader } from "@/components/shared/app/Header";
import { Sidebar } from "@/components/shared/app/Sidebar";
import React from "react";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main>
      <div className="flex text-sm min-h-screen">
        <Sidebar />
        <div className="bg-gray-50 flex flex-1 flex-col">
          <AdminHeader />
          <div className="max-w-7xl w-full mx-auto px-6 py-8">{children}</div>
        </div>
      </div>
    </main>
  );
};

export default AdminLayout;
