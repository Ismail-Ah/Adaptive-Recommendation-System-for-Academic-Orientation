import React from 'react';
import Sidebar from './Sidebar1';
import { Outlet } from 'react-router-dom';

function DashboardLayout() {
  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;