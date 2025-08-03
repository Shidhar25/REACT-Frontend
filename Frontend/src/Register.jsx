import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BellAlertIcon } from '@heroicons/react/24/outline';

const roles = [
  { value: 'USER', label: 'User (Requester)' },
  { value: 'AMBULANCE_DRIVER', label: 'Ambulance Driver' },
  { value: 'FIRE_DRIVER', label: 'Fire Truck Driver' },
  { value: 'POLICE_OFFICER', label: 'Police Officer' },
];

export default function Register() {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    governmentId: '',
    password: '',
    role: 'USER',
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8080/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setMessage('Registration successful!');
        setForm({ fullName: '', email: '', phoneNumber: '', governmentId: '', password: '', role: 'USER' });
        setTimeout(() => navigate('/login'), 2000);
      } else {
        const data = await res.json();
        setMessage(data.message || 'Registration failed.');
      }
    } catch (err) {
      setMessage('Network error.');
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

      <div className="w-full max-w-2xl bg-white/10 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden relative z-10 border border-white/20">
        <div className="flex flex-col justify-center p-6">
          <div className="max-w-md w-full space-y-6 mx-auto py-6 px-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg mb-4">
                <BellAlertIcon className="text-white text-2xl" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2" style={{
                fontFamily: 'Inter, system-ui, sans-serif',
                textShadow: '0 4px 12px rgba(0,0,0,0.3), 0 0 20px rgba(255,255,255,0.3), 0 0 40px rgba(34,197,94,0.2)',
                filter: 'drop-shadow(0 0 8px rgba(34,197,94,0.4))',
              }}>
                Create Account
              </h2>
              <p className="text-cyan-100 text-sm font-medium">Join our emergency response network</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-white mb-2">Full Name</label>
                <input 
                  name="fullName" 
                  value={form.fullName} 
                  onChange={handleChange} 
                  required 
                  className="w-full px-3 py-3 border border-white/20 rounded-lg bg-white/10 backdrop-blur-sm text-white placeholder-white/60 focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none transition-all duration-300" 
                  placeholder="Enter your full name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-white mb-2">Email Address</label>
                <input 
                  name="email" 
                  type="email" 
                  value={form.email} 
                  onChange={handleChange} 
                  required 
                  className="w-full px-3 py-3 border border-white/20 rounded-lg bg-white/10 backdrop-blur-sm text-white placeholder-white/60 focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none transition-all duration-300" 
                  placeholder="Enter your email"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-white mb-2">Phone Number</label>
                <input 
                  name="phoneNumber" 
                  value={form.phoneNumber} 
                  onChange={handleChange} 
                  required 
                  className="w-full px-3 py-3 border border-white/20 rounded-lg bg-white/10 backdrop-blur-sm text-white placeholder-white/60 focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none transition-all duration-300" 
                  placeholder="Enter your phone number"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-white mb-2">Government ID</label>
                <input 
                  name="governmentId" 
                  value={form.governmentId} 
                  onChange={handleChange} 
                  required 
                  className="w-full px-3 py-3 border border-white/20 rounded-lg bg-white/10 backdrop-blur-sm text-white placeholder-white/60 focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none transition-all duration-300" 
                  placeholder="Enter your government ID"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-white mb-2">Password</label>
                <input 
                  name="password" 
                  type="password" 
                  value={form.password} 
                  onChange={handleChange} 
                  required 
                  className="w-full px-3 py-3 border border-white/20 rounded-lg bg-white/10 backdrop-blur-sm text-white placeholder-white/60 focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none transition-all duration-300" 
                  placeholder="Enter your password"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-white mb-2">Role</label>
                <select 
                  name="role" 
                  value={form.role} 
                  onChange={handleChange} 
                  className="w-full px-3 py-3 border border-white/20 rounded-lg bg-white/10 backdrop-blur-sm text-white focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none transition-all duration-300"
                >
                  {roles.map((role) => (
                    <option key={role.value} value={role.value} className="bg-gray-800 text-white">{role.label}</option>
                  ))}
                </select>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 px-4 rounded-lg font-bold hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:transform-none"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Creating account...
                  </div>
                ) : (
                  'Create Account'
                )}
              </button>

              {message && (
                <div className={`px-4 py-3 rounded-lg text-sm backdrop-blur-sm ${
                  message.includes('success') 
                    ? 'bg-green-500/20 border border-green-300/30 text-green-200' 
                    : 'bg-red-500/20 border border-red-300/30 text-red-200'
                }`}>
                  {message}
                </div>
              )}
            </form>

            <div className="mt-6 text-center">
              <span className="text-white/80">Already have an account? </span>
              <Link to="/login" className="font-semibold text-cyan-300 hover:text-cyan-200 transition-colors">Sign in</Link>
            </div>

            <div className="text-center mt-6 pt-4 border-t border-white/10">
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