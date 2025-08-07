import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI, tokenUtils } from '../../services/api';
import loginImage from '../../assets/loginImage.png';
import reactLogo from '../../assets/react-logo.png';
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
          navigate('/fire-truck-driver');
          break;
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


  return (
    <div 
      className="min-h-screen relative flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 text-white overflow-hidden"
      style={{
        background: '#4b6cb7',
        background: '-webkit-linear-gradient(to bottom, #4b6cb7, #182848)',
        background: 'linear-gradient(to bottom, #4b6cb7, #182848)',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Global Background Pattern */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900/50 to-black/50 pointer-events-none"></div>
      
      {/* Global Grid Background Pattern */}
      <div className="fixed inset-0 opacity-15 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}></div>
        {/* Additional larger grid for depth */}
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.08) 2px, transparent 2px),
            linear-gradient(90deg, rgba(255,255,255,0.08) 2px, transparent 2px)
          `,
          backgroundSize: '240px 240px'
        }}></div>
        {/* Extra large grid for structure */}
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.05) 3px, transparent 3px),
            linear-gradient(90deg, rgba(255,255,255,0.05) 3px, transparent 3px)
          `,
          backgroundSize: '480px 480px'
        }}></div>
      </div>

      <div className="flex w-full max-w-5xl bg-white/10 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden relative z-10 border border-white/20">
        <div className="hidden md:flex flex-col justify-center items-center bg-white/10 p-6 w-1/2">
          <img src={loginImage} alt="Login Visual" className="w-132 h-132 object-cover rounded-xl" />
        </div>

        <div className="flex-1 flex flex-col justify-center p-6">
          <div className="max-w-sm w-full space-y-6 mx-auto py-6 px-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg mb-4">
                <img src={reactLogo} alt="Login Visual" className="w-20 h-20 object-cover rounded-xl" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2" style={{
                fontFamily: 'Inter, system-ui, sans-serif',
                textShadow: '0 4px 12px rgba(0,0,0,0.3), 0 0 20px rgba(255,255,255,0.3), 0 0 40px rgba(59,130,246,0.2)',
                filter: 'drop-shadow(0 0 8px rgba(59,130,246,0.4))',
              }}>
                Welcome Back
              </h2>
            </div> 
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Email Address</label>
                  <input 
                    type="email" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    required 
                    className="w-full px-3 py-3 border border-white/20 rounded-lg bg-white/10 backdrop-blur-sm text-white placeholder-white/60
                      focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                      focus:outline-none transition-all duration-300" 
                    placeholder="Enter your email" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Password</label>
                  <input 
                    type="password" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    required 
                    className="w-full px-3 py-3 border border-white/20 rounded-lg bg-white/10 backdrop-blur-sm text-white placeholder-white/60 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-300" 
                    placeholder="Enter your password" 
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input 
                      id="remember-me" 
                      name="remember-me" 
                      type="checkbox" 
                      className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-white/30 rounded bg-white/10" 
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-white/80">Remember me</label>
                  </div>
                  <div className="text-sm">
                    <Link to="/forgot-password" className="font-medium text-cyan-300 hover:text-cyan-200 transition-colors">Forgot password?</Link>
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading} 
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 px-4 rounded-lg font-bold hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:transform-none"
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
                  <div className="bg-red-500/20 border border-red-300/30 text-red-200 px-4 py-3 rounded-xl text-sm backdrop-blur-sm">
                    {error}
                  </div>
                )}
              </form>
            



            <div className="mt-8 text-center">
              <span className="text-white/80">Don't have an account? </span>
              <Link to="/register" className="font-semibold text-cyan-300 hover:text-cyan-200 transition-colors">Sign up</Link>
            </div>

            <div className="text-center mt-8 pt-6 border-t border-white/10">
             
              <button 
                onClick={() => navigate('/')} 
                className="text-cyan-300 hover:text-cyan-200 text-sm font-semibold transition-colors flex items-center justify-center mx-auto"
              >
                ← Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;