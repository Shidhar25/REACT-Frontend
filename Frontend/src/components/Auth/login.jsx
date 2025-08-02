import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI, tokenUtils } from '../../services/api';
import LoginImage from '../../assets/login.png';
import AmbulanceGif from '../../assets/background.gif';
import { BellAlertIcon } from '@heroicons/react/24/outline';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fireDriverChoice, setFireDriverChoice] = useState(null);
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
      if (!token) throw new Error('No authentication token received from server');
      
      tokenUtils.setToken(token);
      const userInfo = tokenUtils.getUserFromToken();
      if (!userInfo) throw new Error('Invalid token format');

      const normalizedRole = userInfo.role?.toUpperCase();
      switch (normalizedRole) {
        case 'USER':
          navigate('/user-dashboard');
          break;
        case 'AMBULANCE_DRIVER':
          navigate('/ambulance-driver');
          break;
        case 'FIRE_DRIVER':
          setPendingFireDriverUser(userInfo);
          setFireDriverChoice('pending');
          setLoading(false);
          return;
        case 'POLICE_OFFICER':
          navigate('/police-dashboard');
          break;
        case 'FIRE_STATION_ADMIN':
          navigate('/fire-admin-dashboard');
          break;
        case 'ADMIN':
          navigate('/admin-dashboard');
          break;
        case 'AMBULANCE_ADMIN':
          navigate('/ambulance-admin-dashboard');
          break;
        case 'POLICE_STATION_ADMIN':
          navigate('/police-admin-dashboard');
          break;
        default:
          navigate('/login');
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
    if (choice === 'admin') navigate('/fire-dashboard');
    else if (choice === 'driver') navigate('/fire-truck-driver');
  };

  const handleOAuthLogin = (provider) => {
    window.location.href = `http://localhost:8080/oauth2/authorization/${provider}`;
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

    <img src={AmbulanceGif} alt="Ambulance" className="fixed inset-0 w-full h-full object-cover brightness-50" />

    <div className="flex w-full max-w-4xl bg-white/10 rounded-xl shadow-2xl overflow-hidden relative z-10 border border-white/20 glow-effect">
      <div className="hidden md:flex flex-col justify-center items-center bg-white/10 p-8 w-1/2">
        <img src={LoginImage} alt="Login Visual" className="w-80 h-80 object-cover rounded-xl shadow-md" />
      </div>

      <div className="flex-1 flex flex-col justify-center p-8">
        <div className="max-w-md w-full space-y-8 mx-auto py-8 px-6 shadow-xl rounded-xl border border-gray-100 bg-white/10">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 bg-blue-500 rounded-full flex items-center justify-center shadow-md">
              <BellAlertIcon className="text-white text-2xl" />
            </div>
            <h2 className="mt-6 text-3xl font-bold text-white">Welcome Back</h2>
            <p className="mt-2 text-sm text-white">Access your emergency services dashboard</p>
          </div>

          {fireDriverChoice === 'pending' ? (
            <div className="py-8 px-6 flex flex-col items-center">
              <h3 className="text-xl font-semibold text-white mb-4">Choose Your Fire Role</h3>
              <div className="flex gap-4 mb-4">
                <button onClick={() => handleFireDriverChoice('admin')} className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors shadow-md">Fire Admin</button>
                <button onClick={() => handleFireDriverChoice('driver')} className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors shadow-md">Fire Truck Driver</button>
              </div>
              <p className="text-white text-sm">Select your role to continue.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Email Address</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Enter your email" />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Enter your password" />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded" />
                  <label htmlFor="remember-me" className="ml-2 block text-white">Remember me</label>
                </div>
                <div className="text-sm">
                  <Link to="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">Forgot password?</Link>
                </div>
              </div>

              <button type="submit" disabled={loading} className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-600 disabled:opacity-50 transition-colors shadow-md">
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
                <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
              )}
            </form>
          )}

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
              <button
                onClick={() => window.location.href = 'http://localhost:8080/oauth2/authorization/google'}
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <span className="sr-only">Sign in with Google</span>
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor"> {/* Google Icon Path Here */} </svg>
                Google
              </button>

              <button
                onClick={() => window.location.href = 'http://localhost:8080/oauth2/authorization/github'}
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <span className="sr-only">Sign in with GitHub</span>
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"> {/* GitHub Icon Path Here */} </svg>
                GitHub
              </button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <span className="text-white">Don't have an account? </span>
            <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">Sign up</Link>
          </div>

          <div className="text-center mt-8">
            <p className="text-sm text-white">
              Emergency? Call <span className="font-semibold text-red-600">911</span> immediately
            </p>
            <div className="mt-4">
              <button onClick={() => navigate('/')} className="text-blue-600 hover:text-blue-700 text-sm font-medium">
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