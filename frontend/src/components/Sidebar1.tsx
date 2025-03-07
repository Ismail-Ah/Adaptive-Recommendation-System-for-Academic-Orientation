import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { User, BookOpen, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext'; // Import useUser for logout

function Sidebar() {
  const location = useLocation();
  const { logout } = useAuth(); // Destructure logout from AuthContext
  const [isExpanded, setIsExpanded] = useState(false); // Start collapsed

  const navigate = useNavigate();

  const isActive = (path:any) => {
    return location.pathname === path ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600';
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
    }
  };

  return (
    <div
      className={`${
        isExpanded ? 'w-64' : 'w-16'
      } bg-white h-[calc(100vh-4rem)] border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className="p-4 flex items-center justify-between overflow-hidden">
        <h2
          className={`text-lg font-semibold text-gray-900 transition-opacity duration-200 ${
            isExpanded ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {isExpanded && 'Dashboard'}
        </h2>
      </div>
      <nav className="flex-1 space-y-1 px-2">
        <Link
          to="/profile"
          className={`${isActive('/profile')} group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200`}
          title={!isExpanded ? 'Profile' : ''}
        >
          <User
            className={`mr-3 h-5 w-5 flex-shrink-0 transition-transform duration-200 ${
              isExpanded ? 'scale-100' : 'scale-110'
            }`}
          />
          <span
            className={`transition-all duration-200 ${
              isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0'
            } overflow-hidden`}
          >
            Profile
          </span>
        </Link>
        <Link
          to="/recommendations"
          className={`${isActive('/recommendations')} group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200`}
          title={!isExpanded ? 'Recommendations' : ''}
        >
          <BookOpen
            className={`mr-3 h-5 w-5 flex-shrink-0 transition-transform duration-200 ${
              isExpanded ? 'scale-100' : 'scale-110'
            }`}
          />
          <span
            className={`transition-all duration-200 ${
              isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0'
            } overflow-hidden`}
          >
            Recommendations
          </span>
        </Link>
      </nav>
      {/* Logout Section */}
      <div className="p-2 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="group flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-800 rounded-md transition-colors duration-200 w-full text-left"
          title={!isExpanded ? 'Logout' : ''}
        >
          <LogOut
            className={`mr-3 h-5 w-5 flex-shrink-0 text-red-600 transition-transform duration-200 ${
              isExpanded ? 'scale-100' : 'scale-110'
            } group-hover:text-red-800`}
          />
          <span
            className={`transition-all duration-200 ${
              isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0'
            } overflow-hidden`}
          >
            Logout
          </span>
        </button>
      </div>
    </div>
  );
}

export default Sidebar;