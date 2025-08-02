import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1,
      duration: 0.5,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  hover: { scale: 1.02, boxShadow: "0px 8px 16px rgba(255, 255, 255, 0.1)" },
};

const completionOverlayVariants = {
  hidden: { x: "100%", opacity: 0 },
  visible: { x: "0%", opacity: 1, transition: { type: "spring", stiffness: 100, damping: 20 } },
  exit: { x: "-100%", opacity: 0, transition: { ease: "easeOut", duration: 0.5 } }
};

const mockProfile = {
  name: 'John Doe',
  phone: '+91 9999999999',
  avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=1a202c&color=fff&size=128',
};

export default function PoliceOfficerPage() {
  const [profile, setProfile] = useState(mockProfile);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [completed, setCompleted] = useState(false);
  const [slideValue, setSlideValue] = useState(0);
  const [sliderAnimating, setSliderAnimating] = useState(false);
  const [completionSlideIn, setCompletionSlideIn] = useState(false);
  const sliderRef = useRef();
  const [activePage, setActivePage] = useState('dashboard');
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState('');
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const [cursorVariant, setCursorVariant] = useState('default');
  const cursorXSpring = useSpring(cursorX, { damping: 25, stiffness: 700 });
  const cursorYSpring = useSpring(cursorY, { damping: 25, stiffness: 700 });

  useEffect(() => {
    const moveCursor = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, [cursorX, cursorY]);

  const handleCursorEnter = () => setCursorVariant('hover');
  const handleCursorLeave = () => setCursorVariant('default');

  // Fetch police officer profile
  const fetchProfile = async () => {
    setProfileLoading(true);
    setProfileError('');
    try {
      const token = localStorage.getItem('jwt') || localStorage.getItem('token');
      if (!token) {
        setProfileError('Authentication token not found. Please login again.');
        toast.error('Authentication token not found. Please login again.');
        setProfileLoading(false);
        return;
      }
      const response = await fetch('http://localhost:8080/police-officer/v1/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const profileData = await response.json();
        setProfile({
          id: profileData.userId || profile.id,
          name: profileData.name || profile.name,
          phone: profileData.mobile || profile.phone,
          email: profileData.email,
          badgeNumber: profileData.badgeNumber,
          govId: profileData.govId,
          role: profileData.role,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(profileData.name || 'User')}&background=1a202c&color=fff&size=128`
        });
        toast.success('Profile updated successfully!');
      } else {
        const errorData = await response.json();
        setProfileError(errorData.message || 'Failed to fetch profile');
        toast.error(errorData.message || 'Failed to fetch profile');
      }
    } catch (err) {
      setProfileError('Network error. Please try again.');
      toast.error('Network error. Please try again.');
    } finally {
      setProfileLoading(false);
    }
  };

  // Fetch current emergency request location
  const fetchAssignment = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('jwt') || localStorage.getItem('token');
      if (!token) {
        setError('Authentication token not found. Please login again.');
        toast.error('Authentication token not found. Please login again.');
        setLoading(false);
        return;
      }
      const response = await fetch('http://localhost:8080/police-officer/v1/current-request/location', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setAssignment(data);
        toast.info('New assignment received!', { autoClose: 5000 });
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to fetch assignment location.');
        toast.error(errorData.message || 'Failed to fetch assignment location.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Mark assignment as completed
  const handleComplete = async () => {
    setSliderAnimating(false);
    setCompletionSlideIn(true);
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('jwt') || localStorage.getItem('token');
      if (!token) {
        setError('Authentication token not found. Please login again.');
        toast.error('Authentication token not found. Please login again.');
        setLoading(false);
        setCompletionSlideIn(false);
        return;
      }
      const response = await fetch('http://localhost:8080/police-officer/v1/complete-assignment', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        setCompleted(true);
        setAssignment(null);
        toast.success('Assignment marked as completed!');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to complete assignment.');
        toast.error(errorData.message || 'Failed to complete assignment.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
      setTimeout(() => setCompletionSlideIn(false), 1500);
    }
  };

  // Fetch assignment history
  const fetchHistory = async () => {
    setHistoryLoading(true);
    setHistoryError('');
    try {
      const token = localStorage.getItem('jwt') || localStorage.getItem('token');
      if (!token) {
        setHistoryError('Authentication token not found. Please login again.');
        toast.error('Authentication token not found. Please login again.');
        setHistoryLoading(false);
        return;
      }
      const response = await fetch('http://localhost:8080/police-officer/v1/assignment-history', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setHistory(Array.isArray(data) ? data : []);
        toast.success('Assignment history loaded!');
      } else {
        const errorData = await response.json();
        setHistoryError(errorData.message || 'Failed to fetch assignment history.');
        toast.error(errorData.message || 'Failed to fetch assignment history.');
      }
    } catch (err) {
      setHistoryError('Network error. Please try again.');
      toast.error('Network error. Please try again.');
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchAssignment();
    fetchHistory();
  }, []);

  useEffect(() => {
    if (slideValue === 100 && !completed && !loading) {
      setSliderAnimating(true);
      const timer = setTimeout(() => {
        handleComplete();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [slideValue, completed, loading]);

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen flex flex-col font-inter text-black relative overflow-hidden" style={{ backgroundColor: 'var(--neutral-bg-main)' }}>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={true} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      {/* Custom Admin Navbar */}
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={profile.avatar} alt="Logo" className="h-14 w-14 object-contain rounded-xl bg-white p-2 shadow-sm" />
            <div>
              <h1 className="text-xl font-semibold text-gray-800">Police Officer</h1>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-sm text-gray-600">Welcome {profile.name}</p>
              <p className="text-xs text-gray-400">Updated: {new Date().toLocaleTimeString()}</p>
            </div>
            <img src={profile.avatar} alt="Admin" className="h-10 w-10 rounded-full object-cover border-2 border-white shadow" />
            <div className="flex items-center gap-2">
              <button onClick={() => window.location.href = '/'} title="Home" className="text-gray-600 hover:text-green-600 transition">
                <span role="img" aria-label="home">🏠</span>
              </button>
              <button onClick={handleLogout} title="Logout" className="text-red-600 hover:text-red-800 transition">
                <span role="img" aria-label="logout">🚪</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full max-w-7xl mx-auto">
        <div className="w-full flex justify-center bg-[#E8E6E0] py-6">
          <nav className="bg-[#fef4f4] border border-red-200 rounded-full shadow-lg px-4 py-2 flex space-x-4 overflow-x-auto max-w-3xl" style={{ backgroundColor: '#fff4f4' }}>
            <motion.button onClick={() => setActivePage('dashboard')} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all ${activePage === 'dashboard' ? 'bg-red-100 text-red-700 border-red-300 shadow' : 'bg-transparent text-gray-700 border-transparent hover:bg-red-50 hover:text-red-700'}`} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} onMouseEnter={handleCursorEnter} onMouseLeave={handleCursorLeave}>
              <span role="img" aria-label="dashboard">📊</span> Dashboard
            </motion.button>
            <motion.button onClick={() => setActivePage('history')} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all ${activePage === 'history' ? 'bg-red-100 text-red-700 border-red-300 shadow' : 'bg-transparent text-gray-700 border-transparent hover:bg-red-50 hover:text-red-700'}`} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} onMouseEnter={handleCursorEnter} onMouseLeave={handleCursorLeave}>
              <span role="img" aria-label="history">🕓</span> Assignment History
            </motion.button>
            <motion.button onClick={() => setActivePage('profile')} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all ${activePage === 'profile' ? 'bg-red-100 text-red-700 border-red-300 shadow' : 'bg-transparent text-gray-700 border-transparent hover:bg-red-50 hover:text-red-700'}`} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} onMouseEnter={handleCursorEnter} onMouseLeave={handleCursorLeave}>
              <span role="img" aria-label="profile">👮‍♂️</span> Profile
            </motion.button>
          </nav>
        </div>
        <main className="flex-1 p-6" style={{ backgroundColor: 'var(--neutral-bg-card)' }}>
          {activePage === 'dashboard' && (
            <motion.div variants={containerVariants} initial="hidden" animate="visible">
              {error && <div className="mb-4 p-3 rounded-md bg-red-100 text-red-700 border border-red-200 w-full text-center">{error}</div>}
              {loading && <div className="mb-4 text-blue-600 text-center">Loading...</div>}
              <motion.div className="w-full mb-6 rounded-xl shadow-sm border border-gray-200 p-6" variants={itemVariants} style={{ backgroundColor: 'var(--neutral-bg-card)' } }>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <span role="img" aria-label="location">📍</span> Dashboard Overview
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg shadow p-4 flex flex-col items-center justify-center">
                    <div className="font-semibold text-gray-800 mb-2">Current Assignment Location</div>
                    {assignment ? (
                      <div className="text-sm text-black/80">
                        <p>Latitude: {assignment.latitude}</p>
                        <p>Longitude: {assignment.longitude}</p>
                        <p className="mt-1 text-xs text-black/60">Address: {assignment.address || "Loading address..."}</p>
                      </div>
                    ) : (
                      <p className="text-sm text-red-400">No current assignment</p>
                    )}
                  </div>
                  <div className="flex flex-col gap-6">
                    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <h4 className="text-black font-semibold mb-2">Assignment Controls</h4>
                      {assignment && !completed ? (
                        <motion.div className="mb-4 w-full flex flex-col items-center" variants={itemVariants}>
                          <label className="block text-gray-700 font-medium mb-2">Slide to Complete Assignment</label>
                          <div className="w-72 p-4 bg-gray-50 rounded-2xl shadow flex flex-col items-center relative transition-all duration-300">
                            <input ref={sliderRef} type="range" min="0" max="100" value={slideValue} onChange={e => setSlideValue(Number(e.target.value))} disabled={loading || completed || completionSlideIn} className={`w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 transition-all duration-300 ${sliderAnimating ? 'bg-green-300' : ''}`} style={{ accentColor: '#2563eb' }} />
                            <div className="flex justify-between w-full text-xs mt-2">
                              <span>Start</span>
                              <span>End</span>
                            </div>
                            {sliderAnimating && (
                              <motion.div className="flex items-center mt-2 text-green-600" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                                <span role="img" aria-label="check">✅</span> Releasing control...
                              </motion.div>
                            )}
                            {loading && (
                              <motion.div className="flex items-center mt-2 text-blue-600" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                                <span role="img" aria-label="loading">⏳</span> Processing...
                              </motion.div>
                            )}
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div className="p-4 bg-green-100 text-green-700 rounded border border-green-200 font-semibold w-full text-center" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}>
                          Assignment marked as completed! Ready for next assignment.
                        </motion.div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
          {activePage === 'history' && (
            <motion.div className="bg-white rounded-xl shadow p-6" variants={containerVariants} initial="hidden" animate="visible">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">Assignment History</h2>
              </div>
              {historyError && (
                <div className="mb-4 p-3 rounded-md bg-red-100 text-red-700 border border-red-200">{historyError}</div>
              )}
              {historyLoading && (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  <span className="ml-2 text-gray-600">Loading history...</span>
                </div>
              )}
              {!historyLoading && !historyError && (
                <>
                  {history.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <div className="text-4xl mb-4">📋</div>
                      <p className="text-lg font-medium">No assignment history found</p>
                      <p className="text-sm">Your completed assignments will appear here</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-sm">
                        <thead>
                          <motion.tr className="bg-gray-100" variants={itemVariants}>
                            <th className="px-4 py-3 text-left text-gray-700 font-semibold">ID</th>
                            <th className="px-4 py-3 text-left text-gray-700 font-semibold">Requester Email</th>
                            <th className="px-4 py-3 text-left text-gray-700 font-semibold">Requested At</th>
                            <th className="px-4 py-3 text-left text-gray-700 font-semibold">Location</th>
                            <th className="px-4 py-3 text-left text-gray-700 font-semibold">Status</th>
                          </motion.tr>
                        </thead>
                        <tbody>
                          {history.map((h, index) => (
                            <motion.tr key={h.id || index} className="border-b last:border-b-0 hover:bg-gray-50 transition-colors duration-200" variants={itemVariants}>
                              <td className="px-4 py-3 text-gray-800 font-medium">{h.id}</td>
                              <td className="px-4 py-3 text-gray-600">{h.emailOfRequester}</td>
                              <td className="px-4 py-3 text-gray-600">{new Date(h.requestedAt).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                              <td className="px-4 py-3 text-gray-600">{h.latitude}, {h.longitude}</td>
                              <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs font-semibold ${h.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : h.status === 'EN_ROUTE' ? 'bg-blue-100 text-blue-800' : h.status === 'CANCELLED' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>{h.status}</span></td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              )}
            </motion.div>
          )}
          {activePage === 'profile' && (
            <motion.div className="bg-white/10 backdrop-blur-md rounded-xl shadow p-6 max-w-md mx-auto border border-white/20" variants={containerVariants} initial="hidden" animate="visible">
              <h2 className="text-xl font-bold mb-4 text-black">Profile</h2>
              {profileLoading && (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
                  <span className="ml-2 text-black">Loading profile...</span>
                </div>
              )}
              {profileError && (
                <div className="bg-red-900/50 border border-red-700 text-red-400 p-3 rounded-md mb-4">{profileError}</div>
              )}
              {!profileLoading && !profileError && (
                <div className="flex flex-col items-center gap-4">
                  <img src={profile.avatar} alt="avatar" className="w-24 h-24 rounded-full border-2 border-blue-400 shadow-md" />
                  <div className="font-bold text-lg text-black">{profile.name}</div>
                  <div className="w-full space-y-3">
                    {profile.id && (<div className="flex items-center gap-2 text-black/80"><span role="img" aria-label="id">🆔</span> <span>ID: {profile.id}</span></div>)}
                    <div className="flex items-center gap-2 text-black/80"><span role="img" aria-label="phone">📞</span> <span>{profile.phone}</span></div>
                    {profile.email && (<div className="flex items-center gap-2 text-black/80"><span role="img" aria-label="email">✉️</span> <span>{profile.email}</span></div>)}
                    {profile.badgeNumber && (<div className="flex items-center gap-2 text-black/80"><span role="img" aria-label="badge">🔖</span> <span>Badge: {profile.badgeNumber}</span></div>)}
                    {profile.govId && (<div className="flex items-center gap-2 text-black/80"><span role="img" aria-label="govid">🗂️</span> <span>Gov ID: {profile.govId}</span></div>)}
                    {profile.role && (<div className="flex items-center gap-2 text-black/80"><span role="img" aria-label="role">👮‍♂️</span> <span>Role: {profile.role}</span></div>)}
                  </div>
                  <motion.button className="mt-4 bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 shadow-md" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={fetchProfile}>Refresh Profile</motion.button>
                </div>
              )}
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
}
