import './styles/App.css'
import { 
  Login, 
  Register, 
  AmbulanceDashboard, 
  FireDashboard, 
  PoliceDashboard, 
  UserDashboard, 
  NavigationMap,
  ForgotPassword
} from './components'
import FireTruckDriverPage from './components/Driver/FireTruckDriverPage';
import AmbulanceDriverPage from './components/Driver/AmbulanceDriverPage';
import AdminDashboard from './components/Dashboard/AdminDashboard.jsx';
import { Landing } from './pages'
import { AuthProvider } from './contexts/AuthContext.jsx'
import { ProtectedRoute, PublicRoute } from './components/common/ProtectedRoute'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/landing" element={<Landing />} />
          
          {/* Authentication routes */}
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
          
          {/* Dashboard routes - require authentication and specific roles */}
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
          
          {/* Ambulance routes */}
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
          
          {/* Fire routes */}
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
          
          {/* Police routes */}
          <Route path="/police-dashboard" element={
            <ProtectedRoute requiredRole="POLICE_OFFICER">
              <PoliceDashboard />
            </ProtectedRoute>
          } />
          <Route path="/police-admin-dashboard" element={
            <ProtectedRoute requiredRole="POLICE_STATION_ADMIN">
              <PoliceDashboard />
            </ProtectedRoute>
          } />
          
          {/* Driver-specific routes */}
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
          
          {/* Navigation routes */}
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
          
          {/* Catch-all route for 404 */}
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
  )
}

export default App
