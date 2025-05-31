import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { User, BookOpen, LogOut, GraduationCap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

interface SidebarProps {
  onExpandChange: (expanded: boolean) => void;
}

function Sidebar({ onExpandChange }: SidebarProps) {
  const location = useLocation();
  const { logout } = useAuth();
  const { isDarkMode } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  const handleMouseEnter = () => {
    setIsExpanded(true);
    onExpandChange(true);
  };

  const handleMouseLeave = () => {
    setIsExpanded(false);
    onExpandChange(false);
  };

  const isActive = (path: any) => {
    if (isDarkMode) {
      return location.pathname === path 
        ? 'bg-gray-700 text-blue-400' 
        : 'text-gray-300 hover:bg-gray-700 hover:text-blue-400';
    }
    return location.pathname === path 
      ? 'bg-blue-50 text-blue-600' 
      : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600';
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
      } fixed top-16 left-0 h-[calc(100vh-4rem)] ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r flex flex-col transition-all duration-300 ease-in-out z-10`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="p-4 flex items-center justify-between overflow-hidden">
        <h2
          className={`text-lg font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} transition-opacity duration-200 ${
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
        <Link
          to="/my-diplomas"
          className={`${isActive('/my-diplomas')} group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200`}
          title={!isExpanded ? 'My Diplomas' : ''}
        >
          <GraduationCap
            className={`mr-3 h-5 w-5 flex-shrink-0 transition-transform duration-200 ${
              isExpanded ? 'scale-100' : 'scale-110'
            }`}
          />
          <span
            className={`transition-all duration-200 ${
              isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0'
            } overflow-hidden`}
          >
            My Diplomas
          </span>
        </Link>
      </nav>
      {/* Logout Section */}
      <div className={`p-2 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <button
          onClick={handleLogout}
          className={`group flex items-center px-3 py-2 text-sm font-medium ${
            isDarkMode 
              ? 'text-red-400 hover:bg-gray-700 hover:text-red-300' 
              : 'text-red-600 hover:bg-red-50 hover:text-red-800'
          } rounded-md transition-colors duration-200 w-full text-left`}
          title={!isExpanded ? 'Logout' : ''}
        >
          <LogOut
            className={`mr-3 h-5 w-5 flex-shrink-0 transition-transform duration-200 ${
              isExpanded ? 'scale-100' : 'scale-110'
            } ${isDarkMode ? 'group-hover:text-red-300' : 'group-hover:text-red-800'}`}
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