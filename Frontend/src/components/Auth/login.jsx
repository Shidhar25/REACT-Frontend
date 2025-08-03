import { useState } from 'react';
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
  
  // OAuth state management
  const [isOAuthUser, setIsOAuthUser] = useState(false);
  const [oauthUserData, setOauthUserData] = useState(null);
  const [oauthProvider, setOauthProvider] = useState('');
  
  const navigate = useNavigate();

  // OAuth completion form state
  const [oauthForm, setOauthForm] = useState({
    phoneNumber: '',
    governmentId: '',
    role: 'USER',
    securityQuestion: 'PET_NAME',
    securityAnswer: '',
    // Role-specific fields
    licenseNumber: '',
    vehicleRegNumber: '',
    hospitalID: '',
    fireStationId: '',
    policeStationId: '',
  });

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

  // Handle OAuth login
  const handleOAuthLogin = async (provider) => {
    setLoading(true);
    setError('');
    try {
      // Redirect to OAuth provider
      window.location.href = `http://localhost:8080/oauth2/authorization/${provider}`;
    } catch (err) {
      setError('OAuth login failed. Please try again.');
      setLoading(false);
    }
  };

  // Handle OAuth callback (this would be called after OAuth redirect)
  const handleOAuthCallback = async (oauthData) => {
    try {
      const response = await fetch('http://localhost:8080/auth/oauth/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(oauthData),
      });

      const data = await response.json();
      
      if (response.ok) {
        if (data.isNewUser) {
          // New OAuth user - show completion form
          setIsOAuthUser(true);
          setOauthUserData(data.user);
          setOauthProvider(data.provider);
          setOauthForm({
            ...oauthForm,
            email: data.user.email,
            fullName: data.user.name,
          });
        } else {
          // Existing OAuth user - proceed with login
          tokenUtils.setToken(data.token);
          const userInfo = tokenUtils.getUserFromToken();
          navigateToUserDashboard(userInfo);
        }
      } else {
        setError(data.message || 'OAuth authentication failed');
      }
    } catch (err) {
      setError('OAuth callback failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle OAuth profile completion
  const handleOAuthProfileCompletion = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8080/auth/oauth/complete-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...oauthForm,
          oauthProvider,
          oauthUserId: oauthUserData.id,
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        tokenUtils.setToken(data.token);
        const userInfo = tokenUtils.getUserFromToken();
        navigateToUserDashboard(userInfo);
      } else {
        setError(data.message || 'Profile completion failed');
      }
    } catch (err) {
      setError('Profile completion failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const navigateToUserDashboard = (userInfo) => {
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
        navigate('/');
    }
  };

  const handleFireDriverChoice = (choice) => {
    if (!pendingFireDriverUser) return;
    if (choice === 'admin') navigate('/fire-dashboard');
    else if (choice === 'driver') navigate('/fire-truck-driver');
  };

  const handleOAuthFormChange = (e) => {
    const { name, value } = e.target;
    setOauthForm({ ...oauthForm, [name]: value });
  };

  // OAuth profile completion form
  if (isOAuthUser) {
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
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.08) 2px, transparent 2px),
              linear-gradient(90deg, rgba(255,255,255,0.08) 2px, transparent 2px)
            `,
            backgroundSize: '240px 240px'
          }}></div>
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.05) 3px, transparent 3px),
              linear-gradient(90deg, rgba(255,255,255,0.05) 3px, transparent 3px)
            `,
            backgroundSize: '480px 480px'
          }}></div>
        </div>

        <div className="w-full max-w-4xl bg-white/10 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden relative z-10 border border-white/20">
          <div className="flex flex-col justify-center p-6">
            <div className="max-w-2xl w-full space-y-6 mx-auto py-6 px-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
              <div className="text-center">
                <div className="mx-auto h-12 w-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg mb-4">
                  <img src={reactLogo} alt="Login Visual" className="w-20 h-20 object-cover rounded-xl" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2" style={{
                  fontFamily: 'Inter, system-ui, sans-serif',
                  textShadow: '0 4px 12px rgba(0,0,0,0.3), 0 0 20px rgba(255,255,255,0.3), 0 0 40px rgba(59,130,246,0.2)',
                  filter: 'drop-shadow(0 0 8px rgba(59,130,246,0.4))',
                }}>
                  Complete Your Profile
                </h2>
                <p className="text-cyan-100 text-sm font-medium">Welcome! Please complete your profile to continue</p>
              </div>

              <form onSubmit={handleOAuthProfileCompletion} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">Full Name</label>
                    <input 
                      type="text" 
                      value={oauthForm.fullName} 
                      disabled
                      className="w-full px-3 py-3 border border-white/20 rounded-lg bg-white/5 backdrop-blur-sm text-white/60 cursor-not-allowed" 
                    />
                    <p className="text-xs text-white/60 mt-1">From {oauthProvider}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">Email Address</label>
                    <input 
                      type="email" 
                      value={oauthForm.email} 
                      disabled
                      className="w-full px-3 py-3 border border-white/20 rounded-lg bg-white/5 backdrop-blur-sm text-white/60 cursor-not-allowed" 
                    />
                    <p className="text-xs text-white/60 mt-1">From {oauthProvider}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">Phone Number *</label>
                    <input 
                      name="phoneNumber" 
                      type="tel" 
                      value={oauthForm.phoneNumber} 
                      onChange={handleOAuthFormChange} 
                      required 
                      className="w-full px-3 py-3 border border-white/20 rounded-lg bg-white/10 backdrop-blur-sm text-white placeholder-white/60 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-300" 
                      placeholder="Enter your phone number"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">Government ID (PAN) *</label>
                    <input 
                      name="governmentId" 
                      value={oauthForm.governmentId} 
                      onChange={handleOAuthFormChange} 
                      required 
                      className="w-full px-3 py-3 border border-white/20 rounded-lg bg-white/10 backdrop-blur-sm text-white placeholder-white/60 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-300" 
                      placeholder="ABCDE1234F"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">Role *</label>
                    <select 
                      name="role" 
                      value={oauthForm.role} 
                      onChange={handleOAuthFormChange} 
                      required
                      className="w-full px-3 py-3 border border-white/20 rounded-lg bg-white/10 backdrop-blur-sm text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-300"
                    >
                      <option value="USER">User (Default Requester)</option>
                      <option value="AMBULANCE_DRIVER">Ambulance Driver</option>
                      <option value="FIRE_DRIVER">Fire Truck Driver</option>
                      <option value="POLICE_OFFICER">Police Officer</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">Security Answer *</label>
                    <input 
                      name="securityAnswer" 
                      value={oauthForm.securityAnswer} 
                      onChange={handleOAuthFormChange} 
                      required 
                      className="w-full px-3 py-3 border border-white/20 rounded-lg bg-white/10 backdrop-blur-sm text-white placeholder-white/60 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-300" 
                      placeholder="Enter your security answer"
                    />
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
                      Completing profile...
                    </div>
                  ) : (
                    'Complete Profile'
                  )}
                </button>

                {error && (
                  <div className="bg-red-500/20 border border-red-300/30 text-red-200 px-4 py-3 rounded-xl text-sm backdrop-blur-sm">
                    {error}
                  </div>
                )}
              </form>

              <div className="text-center mt-6 pt-4 border-t border-white/10">
                <button 
                  onClick={() => {
                    setIsOAuthUser(false);
                    setOauthUserData(null);
                    setOauthProvider('');
                    setOauthForm({
                      phoneNumber: '',
                      governmentId: '',
                      role: 'USER',
                      securityQuestion: 'PET_NAME',
                      securityAnswer: '',
                      licenseNumber: '',
                      vehicleRegNumber: '',
                      hospitalID: '',
                      fireStationId: '',
                      policeStationId: '',
                    });
                  }} 
                  className="text-cyan-300 hover:text-cyan-200 text-sm font-semibold transition-colors"
                >
                  ← Back to Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
              <p className="text-cyan-100 text-sm font-medium">Access your emergency services dashboard</p>
            </div>

            {fireDriverChoice === 'pending' ? (
              <div className="py-8 px-6 flex flex-col items-center">
                <h3 className="text-xl font-semibold text-white mb-6">Choose Your Fire Role</h3>
                <div className="flex gap-4 mb-6">
                  <button 
                    onClick={() => handleFireDriverChoice('admin')} 
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    Fire Admin
                  </button>
                  <button 
                    onClick={() => handleFireDriverChoice('driver')} 
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    Fire Truck Driver
                  </button>
                </div>
                <p className="text-white/80 text-sm">Select your role to continue.</p>
              </div>
            ) : (
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
            )}

            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/20" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white/5 text-white/80 backdrop-blur-sm rounded-lg">Or continue with</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleOAuthLogin('google')}
                  disabled={loading}
                  className="w-full inline-flex justify-center py-3 px-4 border border-white/20 rounded-xl shadow-sm bg-white/10 backdrop-blur-sm text-sm font-medium text-white hover:bg-white/20 transition-all duration-300 disabled:opacity-50"
                >
                  <span className="sr-only">Sign in with Google</span>
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Google
                </button>

                <button
                  onClick={() => handleOAuthLogin('github')}
                  disabled={loading}
                  className="w-full inline-flex justify-center py-3 px-4 border border-white/20 rounded-xl shadow-sm bg-white/10 backdrop-blur-sm text-sm font-medium text-white hover:bg-white/20 transition-all duration-300 disabled:opacity-50"
                >
                  <span className="sr-only">Sign in with GitHub</span>
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                  </svg>
                  GitHub
                </button>
              </div>
            </div>

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