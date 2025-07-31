import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { authAPI, tokenUtils } from '../../services/api'; // Assuming these paths are correct
import LoginImage from '../../assets/login.png';
import { BellAlertIcon } from '@heroicons/react/24/outline'; // Using BellAlertIcon for emergency
import AmbulanceGif from '../../assets/background.gif';
function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fireDriverChoice, setFireDriverChoice] = useState(null); // 'pending', 'admin', 'driver'
  const [pendingFireDriverUser, setPendingFireDriverUser] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setFireDriverChoice(null);
    setPendingFireDriverUser(null);
    try {
      const credentials = { email, password };
      const data = await authAPI.login(credentials);
      const token = data.token || data.jwt || data.accessToken;
      if (!token) {
        throw new Error('No authentication token received from server');
      }
      tokenUtils.setToken(token);
      const userInfo = tokenUtils.getUserFromToken();
      if (!userInfo) {
        throw new Error('Invalid token format');
      }
      
      // Debug logging to check the role
      console.log('User info from token:', userInfo);
      console.log('User role:', userInfo.role);
      console.log('Role type:', typeof userInfo.role);
      if (userInfo.role === 'FIRE_DRIVER') {
        setPendingFireDriverUser(userInfo);
        setFireDriverChoice('pending');
        setLoading(false);
        return;
      }
      // Navigate based on user role
      console.log('About to navigate based on role:', userInfo.role);
      // Normalize the role to handle case sensitivity
      const normalizedRole = userInfo.role?.toUpperCase();
      console.log('Normalized role:', normalizedRole);
      switch (normalizedRole) {
        case 'USER': // default requester
          console.log('Navigating to user-dashboard');
          navigate('/user-dashboard');
          break;
        case 'AMBULANCE_DRIVER': // Assigned to ambulance
          console.log('Navigating to ambulance-driver');
          navigate('/ambulance-driver');
          break;
        case 'FIRE_DRIVER': // Handles fire truck
          console.log('Navigating to fire-truck-driver');
          navigate('/fire-truck-driver');
          break;
        case 'POLICE_OFFICER':
          console.log('Navigating to police-dashboard');
          navigate('/police-dashboard');
          break;
        case 'FIRE_STATION_ADMIN':
          console.log('Navigating to fire-admin-dashboard');
          navigate('/fire-admin-dashboard');
          break;
        case 'ADMIN':
          console.log('Navigating to admin-dashboard');
          navigate('/admin-dashboard');
          break;
        case 'AMBULANCE_ADMIN':
          console.log('Navigating to ambulance-admin-dashboard');
          navigate('/ambulance-admin-dashboard');
          break;
        case 'POLICE_STATION_ADMIN':
          console.log('Navigating to police-admin-dashboard');
          navigate('/police-admin-dashboard');
          break;
        default:
           console.log('No matching role found, navigating to user-dashboard. Role was:', userInfo.role);
            navigate('/login');
          // If no matching role, redirect to user-dashboard or login
            break;

      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
      tokenUtils.removeToken();
    } finally {
      setLoading(false);
    }
  };

  const handleFireDriverChoice = (choice) => {
    if (!pendingFireDriverUser) return;
    if (choice === 'admin') {
      navigate('/fire-dashboard'); // Navigate to Fire Admin dashboard
    } else if (choice === 'driver') {
      navigate('/fire-truck-driver'); // Navigate to Fire Truck Driver dashboard
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 text-white overflow-hidden">
      <style jsx>{`
        .glow-effect {
          box-shadow: 
            0 0 20px rgba(59, 130, 246, 0.3),
            0 0 40px rgba(59, 130, 246, 0.2),
            0 0 60px rgba(59, 130, 246, 0.1),
            0 0 80px rgba(59, 130, 246, 0.05);
          animation: glow 3s ease-in-out infinite alternate;
        }
        
        @keyframes glow {
          from {
            box-shadow: 
              0 0 20px rgba(59, 130, 246, 0.3),
              0 0 40px rgba(59, 130, 246, 0.2),
              0 0 60px rgba(59, 130, 246, 0.1),
              0 0 80px rgba(59, 130, 246, 0.05);
          }
          to {
            box-shadow: 
              0 0 30px rgba(59, 130, 246, 0.4),
              0 0 60px rgba(59, 130, 246, 0.3),
              0 0 90px rgba(59, 130, 246, 0.2),
              0 0 120px rgba(59, 130, 246, 0.1);
          }
        }
      `}</style>
      {/* Full background GIF */}
      <img
        src={AmbulanceGif}
        alt="Ambulance background"
        className="fixed inset-0 w-full h-full object-cover object-center z-0 select-none pointer-events-none"
        style={{ filter: 'brightness(0.3) blur(2px)', opacity: 1.2 }}
        draggable="false"
      />
      {/* Removed the bg-white/40 overlay for increased GIF visibility */}
      {/* <div className="fixed inset-0 bg-white/40 z-0" /> */}
      
      {/* Changed bg-white/90 to bg-white/10 and removed backdrop-blur-lg */}
      <div className="flex w-full max-w-4xl bg-white/10 rounded-xl shadow-2xl overflow-hidden relative z-10 border border-white/20 glow-effect">
        {/* Left Image (hidden on small screens) */}
        {/* Changed bg-white/20 to bg-white/10 for transparency */}
        <div className="hidden md:flex flex-col justify-center items-center bg-white/10 p-8 w-1/2"> {/* Transparent glassy background */}
          <img src={LoginImage} alt="Login Visual" className="w-80 h-80 object-cover rounded-xl shadow-md" />
        </div>
        {/* Right Form */}
        {/* Removed backdrop-blur-md from this div as well for full transparency */}
        <div className="flex-1 flex flex-col justify-center p-8"> 
          {/* Changed bg-white/90 to bg-white/10 and removed backdrop-blur-md */}
          <div className="max-w-md w-full space-y-8 mx-auto py-8 px-6 shadow-xl rounded-xl border border-gray-100 bg-white/10"> {/* Fully transparent card */}
            {/* Header */}
            <div className="text-center">
              <div className="mx-auto h-12 w-12 bg-blue-500 rounded-full flex items-center justify-center shadow-md"> {/* Blue accent */}
                <BellAlertIcon className="text-white text-2xl" /> {/* Bell icon for emergency theme */}
              </div>
              <h2 className="mt-6 text-3xl font-bold text-white">
                Welcome Back
              </h2>
              <p className="mt-2 text-sm text-white">
                Access your emergency services dashboard
              </p>
            </div>
            {/* Fire Driver Choice UI */}
            {fireDriverChoice === 'pending' && (
              <div className="py-8 px-6 flex flex-col items-center"> {/* No shadow/border here as parent already has it */}
                <h3 className="text-xl font-semibold text-white mb-4">Choose Your Fire Role</h3>
                <div className="flex gap-4 mb-4">
                  <button
                    onClick={() => handleFireDriverChoice('admin')}
                    className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors duration-200 shadow-md"
                  >
                    Fire Admin
                  </button>
                  <button
                    onClick={() => handleFireDriverChoice('driver')}
                    className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors duration-200 shadow-md"
                  >
                    Fire Truck Driver
                  </button>
                </div>
                <p className="text-white text-sm">Select your role to continue.</p>
              </div>
            )}
            {/* Login Form */}
            {fireDriverChoice !== 'pending' && (
            <div className="py-8 px-6"> {/* No shadow/border here as parent already has it */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    placeholder="Enter your password"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-white">
                      Remember me
                    </label>
                  </div>
                  <div className="text-sm">
                    <Link to="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                      Forgot password?
                    </Link>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-600 disabled:opacity-50 transition-colors duration-200 shadow-md"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Signing in...
                    </div>
                  ) : (
                    'Sign In'
                  )}
                </button>

                {error && (
                  <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-white">Or continue with</span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                    <span className="sr-only">Sign in with Google</span>
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                  </button>
                  <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                    <span className="sr-only">Sign in with GitHub</span>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="mt-6 text-center">
                <span className="text-white">Don't have an account? </span>
                <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
                  Sign up
                </Link>
              </div>
            </div>
            )}

            {/* Emergency Contact Info */}
            <div className="text-center mt-8"> {/* Added margin top for spacing */}
              <p className="text-sm text-white">
                Emergency? Call <span className="font-semibold text-red-600">911</span> immediately
              </p>
              <div className="mt-4">
                <button
                  onClick={() => navigate('/')} // Navigate back to home/login
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  ← Back to Home
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;