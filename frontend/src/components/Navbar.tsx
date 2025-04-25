import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface NavbarProps {
  className?: string; // Propriété className optionnelle
}

const Navbar: React.FC<NavbarProps> = ({ className }) => {
  const { user } = useAuth();
  const location = useLocation();

  // Fonction pour obtenir les initiales de l'utilisateur
  const getInitials = (name: string | undefined): string => {
    if (!name) return '';
    const names = name.split(' ');
    return names.map((n) => n[0]).join('').toUpperCase();
  };

  return (
    <nav className={`bg-white shadow-sm ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="ml-2 text-xl font-bold text-gray-900">EduGuide</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-900 font-medium">{user.name}</span>
                  <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                    {getInitials(user.name)}
                  </div>
                </div>
              </>
            ) : (
              <>
                {location.pathname === '/about' ? (
                  <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium text-black-600 hover:text-blue-600">
                    Accueil
                  </Link>
                ) : (
                  <Link to="/about" className="px-3 py-2 rounded-md text-sm font-medium text-black-600 hover:text-blue-600">
                    À Propos
                  </Link>
                )}
                <Link to="/login" className="px-3 py-2 rounded-md text-sm font-medium text-black-600 hover:text-blue-600">
                  Connexion
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
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
