import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, PlusCircle, UploadCloud, BarChart, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext'; // Adjust if needed

export const AdminSidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const isActive = (path: string) => {
    return location.pathname === path
      ? 'bg-blue-50 text-blue-600'
      : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600';
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div
      className="w-20 bg-white h-[calc(100vh-4rem)] border-r border-gray-200 flex flex-col fixed top-16 left- z-40"
    >
      <div className="p-4 flex items-center justify-center">
        {/* Empty top spacer */}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-4 px-2 flex flex-col items-center">
        <Link
          to="/admin-dashboard"
          className={`${isActive('/admin-dashboard')} flex flex-col items-center p-2 rounded-lg transition-colors duration-200`}
          title="Dashboard"
        >
          <Home className="h-6 w-6" />
          <span className="text-[10px] mt-1 font-medium">Home</span>
        </Link>

        <Link
          to="/DiplomaForm"
          className={`${isActive('/DiplomaForm')} flex flex-col items-center p-2 rounded-lg transition-colors duration-200`}
          title="Add Diploma"
        >
          <PlusCircle className="h-6 w-6" />
          <span className="text-[10px] mt-1 font-medium">Add</span>
        </Link>
        

        <Link
          to="/csv-upload"
          className={`${isActive('/csv-upload')} flex flex-col items-center p-2 rounded-lg transition-colors duration-200`}
          title="Upload CSV"
        >
          <UploadCloud className="h-6 w-6" />
          <span className="text-[10px] mt-1 font-medium">Upload</span>
        </Link>

        <Link
          to="/DiplomaStatistics"
          className={`${isActive('/DiplomaStatistics')} flex flex-col items-center p-2 rounded-lg transition-colors duration-200`}
          title="Statistics"
        >
          <BarChart className="h-6 w-6" />
          <span className="text-[10px] mt-1 font-medium">Stats</span>
        </Link>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-200 flex items-center justify-center">
        <button
          onClick={handleLogout}
          className="flex flex-col items-center text-red-600 hover:text-red-800 transition-colors duration-200"
          title="Logout"
        >
          <LogOut className="h-6 w-6" />
          <span className="text-[10px] mt-1 font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};
