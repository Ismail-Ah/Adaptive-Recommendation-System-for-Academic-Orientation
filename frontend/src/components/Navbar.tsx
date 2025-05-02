import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import ThemeToggle from './ThemeToggle';

interface NavbarProps {
  className?: string;
}

const Navbar: React.FC<NavbarProps> = ({ className }) => {
  const { isAuthenticated, logout, user } = useAuth();
  const { isDarkMode } = useTheme();
  const location = useLocation();

  // Fonction pour obtenir les initiales de l'utilisateur
  const getInitials = (name: string | undefined): string => {
    if (!name) return '';
    const names = name.split(' ');
    return names.map((n) => n[0]).join('').toUpperCase();
  };

  return (
    <nav className={`${className} ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className={`ml-2 text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>EduGuide</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            {user ? (
              <>
                <div className="flex items-center space-x-2">
                  <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-900'} font-medium`}>{user.name}</span>
                  <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                    {getInitials(user.name)}
                  </div>
                </div>
              </>
            ) : (
              <>
                {location.pathname === '/about' ? (
                  <Link to="/" className={`px-3 py-2 rounded-md text-sm font-medium ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-black-600 hover:text-blue-600'}`}>
                    Accueil
                  </Link>
                ) : (
                  <Link to="/about" className={`px-3 py-2 rounded-md text-sm font-medium ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-black-600 hover:text-blue-600'}`}>
                    À Propos
                  </Link>
                )}
                <Link to="/login" className={`px-3 py-2 rounded-md text-sm font-medium ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-black-600 hover:text-blue-600'}`}>
                  Connexion
                </Link>
                <Link
                  to="/register"
                  className={`px-4 py-2 rounded-md text-sm font-medium ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
                >
                  Inscription
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
