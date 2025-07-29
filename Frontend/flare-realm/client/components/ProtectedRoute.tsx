import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, getUserRole, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  // Allow AMBULANCE_DRIVER userType to access driver routes
  if (
    location.pathname.startsWith("/driver") &&
    (user?.userType === "AMBULANCE_DRIVER" || getUserRole() === "DRIVER" || getUserRole() === "ADMIN")
  ) {
    return <>{children}</>;
  }

  if (allowedRoles) {
    const userRole = getUserRole();
    if (!userRole || !allowedRoles.includes(userRole)) {
      if (userRole === 'DRIVER') {
        return <Navigate to="/driver" replace />;
      } else if (userRole === 'ADMIN') {
        return <Navigate to="/admin" replace />;
      } else {
        return <Navigate to="/index" replace />;
      }
    }
  }

  return <>{children}</>;
}; 