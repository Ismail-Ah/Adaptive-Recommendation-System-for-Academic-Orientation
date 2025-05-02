import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';
import { AdminSidebar } from './Sidebar';

export const AdminLayout: React.FC = () => {
  const { isAuthenticated, isAdmin, user } = useAuth();
  
  console.log('AdminLayout - User:', user);
  console.log('AdminLayout - isAdmin check:', isAdmin());
  console.log('AdminLayout - isAuthenticated:', isAuthenticated);

  if (!isAuthenticated) {
    console.log('AdminLayout - Not authenticated, redirecting to login');
    return <Navigate to="/login" />;
  }

  if (!isAdmin()) {
    console.log('AdminLayout - Not admin, redirecting to home');
    return <Navigate to="/" />;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left sidebar */}
      <div className="w-20 bg-white border-r border-gray-200 flex flex-col items-center py-6">
        <AdminSidebar />
      </div>

      {/* Main content */}
      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};