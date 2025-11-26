'use client';

import { AdminHeader } from '@/app/components/shared/app/Header';
import { Sidebar } from '@/app/components/shared/app/Sidebar';
import React from 'react';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {

  return (
    <main>
      <div className="flex text-sm">
        <Sidebar />
        <div className="bg-neutral-lightest flex flex-1 flex-col">
          <AdminHeader />
          <div className="px-8 py-8">{children}</div>
        </div>
      </div>
    </main>
  );
};

export default AdminLayout;
