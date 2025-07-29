import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { tokenUtils } from '../../services/api';

// Component to protect routes that require authentication
export const ProtectedRoute = ({ children, requiredRole = null }) => {
  const location = useLocation();
  
  // Check if user is authenticated
  if (!tokenUtils.isAuthenticated()) {
    // Redirect to login page with return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // If specific role is required, check user role
  if (requiredRole) {
    const userInfo = tokenUtils.getUserFromToken();
    if (!userInfo || userInfo.role !== requiredRole) {
      // Redirect to appropriate dashboard based on actual role
      const redirectPath = getDashboardPath(userInfo?.role);
      return <Navigate to={redirectPath} replace />;
    }
  }
  
  return children;
};

// Component to redirect authenticated users away from auth pages
export const PublicRoute = ({ children }) => {
  if (tokenUtils.isAuthenticated()) {
    const userInfo = tokenUtils.getUserFromToken();
    const redirectPath = getDashboardPath(userInfo?.role);
    return <Navigate to={redirectPath} replace />;
  }
  
  return children;
};

// Helper function to get dashboard path based on user role
const getDashboardPath = (role) => {
  switch (role) {
    case 'USER':
      return '/user-dashboard';
    case 'AMBULANCE_DRIVER':
      return '/ambulance-dashboard';
    case 'FIRE_DRIVER':
      return '/fire-dashboard';
    case 'POLICE_OFFICER':
      return '/police-dashboard';
    default:
      return '/user-dashboard';
  }
};

// Higher-order component for role-based access control
export const withAuth = (Component, requiredRole = null) => {
  return function AuthenticatedComponent(props) {
    return (
      <ProtectedRoute requiredRole={requiredRole}>
        <Component {...props} />
      </ProtectedRoute>
    );
  };
};

// Hook to check if user has specific role
export const useRoleCheck = (requiredRole) => {
  const userInfo = tokenUtils.getUserFromToken();
  return userInfo?.role === requiredRole;
};

// Hook to get current user info
export const useCurrentUser = () => {
  const userInfo = tokenUtils.getUserFromToken();
  const isAuthenticated = tokenUtils.isAuthenticated();
  
  return {
    user: userInfo,
    isAuthenticated,
    hasRole: (role) => userInfo?.role === role,
    isUser: () => userInfo?.role === 'USER',
    isAmbulanceDriver: () => userInfo?.role === 'AMBULANCE_DRIVER',
    isFireDriver: () => userInfo?.role === 'FIRE_DRIVER',
    isPoliceOfficer: () => userInfo?.role === 'POLICE_OFFICER',
  };
};
