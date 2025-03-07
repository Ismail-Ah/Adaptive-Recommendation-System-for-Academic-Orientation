import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface AuthGuardProps {
  children: ReactNode;
  requiredRole?: 'admin' | 'user';
}

export const AuthGuard = ({ children, requiredRole }: AuthGuardProps) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/error" replace />;
  }

  return <>{children}</>;
};