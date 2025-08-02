import './styles/App.css';
import {
  Register,
  AmbulanceDashboard,
  FireDashboard,
  PoliceDashboard,
  UserDashboard,
  NavigationMap,
  ForgotPassword
} from './components';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify'; 

import FireTruckDriverPage from './components/Driver/FireTruckDriverPage';
import AmbulanceDriverPage from './components/Driver/AmbulanceDriverPage';
import AdminDashboard from './components/Dashboard/AdminDashboard.jsx';
import Login from './components/Auth/login.jsx';
import { Landing } from './pages';
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx';
import { ProtectedRoute, PublicRoute } from './components/common/ProtectedRoute';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import PoliceOfficerPage from './components/Driver/PoliceOfficerPage.jsx';

function SessionReset() {
  useEffect(() => {
    const url = new URL(window.location.href);
    if (url.searchParams.get('reset') === 'true') {
      localStorage.clear();
      sessionStorage.clear();
      document.cookie.split(";").forEach(c => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });
      console.log('[SessionReset] Cleared session data via ?reset=true');
    }
  }, []);
  return null;
}

const getDashboardPath = (role) => {
  switch (role?.toUpperCase()) {
    case 'USER': return '/user-dashboard';
    case 'ADMIN': return '/admin-dashboard';
    case 'AMBULANCE_DRIVER': return '/ambulance-driver';
    case 'AMBULANCE_ADMIN': return '/ambulance-admin-dashboard';
    case 'FIRE_DRIVER': return '/fire-truck-driver';
    case 'FIRE_STATION_ADMIN': return '/fire-admin-dashboard';
    case 'POLICE_OFFICER': return '/police-dashboard';
    case 'POLICE_STATION_ADMIN': return '/police-admin-dashboard';
    default: return null;
  }
};

function RoleRedirectHandler() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated || !user?.role) return;

    const currentPath = location.pathname;
    const isOnPublicPath = ['/', '/login', '/landing'].includes(currentPath);

    if (isOnPublicPath) {
      const redirectPath = getDashboardPath(user.role);
      if (redirectPath && currentPath !== redirectPath) {
        console.log(`[AutoRedirect] Authenticated role '${user.role}' → navigating to ${redirectPath}`);
        navigate(redirectPath, { replace: true });
      }
    }
  }, [isAuthenticated, user, location.pathname]);

  return null;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <SessionReset />
        <RoleRedirectHandler />

        {/* ✅ Toast notifications container */}
        <ToastContainer position="top-right" autoClose={3000} />

        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/landing" element={<Landing />} />

          {/* Auth */}
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          <Route path="/register" element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          } />
          <Route path="/forgot-password" element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          } />

          {/* User Roles */}
          <Route path="/user-dashboard" element={
            <ProtectedRoute requiredRole="USER">
              <UserDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin-dashboard" element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          } />

          {/* Ambulance */}
          <Route path="/ambulance-dashboard" element={
            <ProtectedRoute requiredRole="AMBULANCE_DRIVER">
              <AmbulanceDashboard />
            </ProtectedRoute>
          } />
          <Route path="/ambulance-admin-dashboard" element={
            <ProtectedRoute requiredRole="AMBULANCE_ADMIN">
              <AmbulanceDashboard />
            </ProtectedRoute>
          } />

          {/* Fire */}
          <Route path="/fire-dashboard" element={
            <ProtectedRoute requiredRole="FIRE_DRIVER">
              <FireDashboard />
            </ProtectedRoute>
          } />
          <Route path="/fire-admin-dashboard" element={
            <ProtectedRoute requiredRole="FIRE_STATION_ADMIN">
              <FireDashboard />
            </ProtectedRoute>
          } />

          {/* Police */}
          <Route path="/police-dashboard" element={
            <ProtectedRoute requiredRole="POLICE_OFFICER">
              <PoliceOfficerPage/>
            </ProtectedRoute>
          } />
          <Route path="/police-admin-dashboard" element={
            <ProtectedRoute requiredRole="POLICE_STATION_ADMIN">
              <PoliceDashboard />
            </ProtectedRoute>
          } />

          {/* Driver pages */}
          <Route path="/fire-truck-driver" element={
            <ProtectedRoute requiredRole="FIRE_DRIVER">
              <FireTruckDriverPage />
            </ProtectedRoute>
          } />
          <Route path="/ambulance-driver" element={
            <ProtectedRoute requiredRole="AMBULANCE_DRIVER">
              <AmbulanceDriverPage />
            </ProtectedRoute>
          } />

          {/* Navigation */}
          <Route path="/navigation/:requestId" element={
            <ProtectedRoute>
              <NavigationMap />
            </ProtectedRoute>
          } />
          <Route path="/navigation/:vehicleType/:requestId" element={
            <ProtectedRoute>
              <NavigationMap />
            </ProtectedRoute>
          } />

          {/* 404 */}
          <Route path="*" element={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                <p className="text-gray-600 mb-8">Page not found</p>
                <button
                  onClick={() => window.history.back()}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Go Back
                </button>
              </div>
            </div>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
