import React, { useEffect, useState, useRef } from 'react';
import { FaFireExtinguisher, FaPhoneAlt } from 'react-icons/fa';
import { MdLocationOn } from 'react-icons/md';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UserIcon, HomeIcon, ClockIcon } from '@heroicons/react/24/outline';

const MAPBOX_TOKEN = 'pk.eyJ1IjoibWFpdHJreWVlMjkiLCJhIjoiY20wdjhtbXhvMWRkYTJxb3UwYmo2NXRlZCJ9.BIf7Ebj0qCJtAV9HE-utBQ';

function getProfileFromJWT() {
  try {
    const jwt = localStorage.getItem('jwt') || localStorage.getItem('token');
    if (!jwt) return null;
    const payload = JSON.parse(atob(jwt.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    return {
      name: payload.name || payload.sub || 'Unknown',
      phone: payload.phone || payload.phoneNumber || '',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(payload.name || payload.sub || 'User')}&background=1a202c&color=fff&size=128`,
    };
  } catch {
    return null;
  }
}

function decodeJWT(token) {
  if (!token) return {};
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
  } catch {
    return {};
  }
}

const mockProfile = {
  name: 'Jane Smith',
  phone: '+91 9876543211',
  avatar: 'https://ui-avatars.com/api/?name=Jane+Smith&background=1a202c&color=fff&size=128',
};

const profile = getProfileFromJWT() || mockProfile;
const mockHistory = [
  { id: 1, date: '2025-07-23', status: 'Completed', from: '18.53, 73.81', to: '18.54, 73.82', issue: 'Building Fire' },
  { id: 2, date: '2025-07-22', status: 'Completed', from: '18.51, 73.80', to: '18.52, 73.83', issue: 'Forest Fire' },
  { id: 3, date: '2025-07-21', status: 'Cancelled', from: '18.50, 73.79', to: '18.53, 73.84', issue: 'Vehicle Accident' },
];

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

export default function FireTruckDriverPage() {
  const [appointment, setAppointment] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [completed, setCompleted] = useState(false);
  const [slideValue, setSlideValue] = useState(0);
  const [sliderAnimating, setSliderAnimating] = useState(false);
  const [completionSlideIn, setCompletionSlideIn] = useState(false);
  const sliderRef = useRef();
  const [routeInfo, setRouteInfo] = useState(null);
  const [activePage, setActivePage] = useState('dashboard');

  // Profile states
  const [profile, setProfile] = useState(getProfileFromJWT() || mockProfile);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState('');

  // Location update functionality
  const [locationUpdateLoading, setLocationUpdateLoading] = useState(false);
  const [locationUpdateMessage, setLocationUpdateMessage] = useState('');
  const [autoLocationUpdate, setAutoLocationUpdate] = useState(false);
  const [locationUpdateInterval, setLocationUpdateInterval] = useState(null);

  // Custom animated cursor
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const [cursorVariant, setCursorVariant] = useState('default');

  const cursorXSpring = useSpring(cursorX, { damping: 25, stiffness: 700 });
  const cursorYSpring = useSpring(cursorY, { damping: 25, stiffness: 700 });

  // Fetch profile from API
  const fetchProfile = async () => {
    console.log('Fetching profile from API...');
    console.log('JWT token:', localStorage.getItem('jwt') || localStorage.getItem('token'));
    
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

      const response = await fetch('http://localhost:8080/fire/truck-driver/v1/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const profileData = await response.json();
        console.log('Profile data received:', profileData);
        
        setProfile({
          id: profileData.userId || profile.id,
          name: profileData.name || profile.name,
          phone: profileData.mobile || profile.phone,
          email: profileData.email,
          licenseNumber: profileData.licenseNumber,
          govId: profileData.govId,
          fireTruckRegNumber: profileData.fireTruckRegNumber,
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
      console.error('Error fetching profile:', err);
      setProfileError('Network error. Please try again.');
      toast.error('Network error. Please try again.');
    } finally {
      setProfileLoading(false);
    }
  };

  // Fetch profile when profile page is active
  useEffect(() => {
    if (activePage === 'profile') {
      fetchProfile();
    }
  }, [activePage]);

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

  useEffect(() => {
    const fetchAppointment = async () => {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('jwt') || localStorage.getItem('token');
      if (!token) {
        setError('Authentication token not found. Please login again.');
        toast.error('Authentication token not found. Please login again.');
        setLoading(false);
        return;
      }
      try {
        const res = await fetch('http://localhost:8080/fire/truck-driver/v1/current-request', {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setAppointment(data);
          if (data) {
              toast.info('New assignment received!', { autoClose: 5000 });
          } else {
              toast.info('No active assignments.');
          }
        } else {
          const data = await res.json();
          setError(data.message || 'Failed to fetch appointment location.');
          toast.error(data.message || 'Failed to fetch appointment location.');
        }
      } catch (err) {
        setError('Network error. Please try again.');
        toast.error('Network error. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchAppointment();
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) {
        setError('Geolocation is not supported by your browser.');
        toast.error('Geolocation is not supported by your browser.');
        return;
    }
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setUserLocation({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude
        });
      },
      (err) => {
          console.error('Geolocation error:', err);
          setError(`Geolocation error: ${err.message}. Please enable location services.`);
          toast.error(`Geolocation error: ${err.message}`);
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  // Update location with live coordinates
  const handleLocationUpdate = async (latitude, longitude) => {
    setLocationUpdateLoading(true);
    setLocationUpdateMessage('');
    try {
      const token = localStorage.getItem('jwt') || localStorage.getItem('token');
      if (!token) {
        setLocationUpdateMessage('Authentication token not found. Please login again.');
        return;
      }

      // Get truck ID from JWT token
      const userInfo = decodeJWT(token);
      const truckId = userInfo.userId || userInfo.id;

      if (!truckId) {
        setLocationUpdateMessage('Truck ID not found in token.');
        return;
      }

      // Format coordinates to 4 decimal places
      const formattedLatitude = parseFloat(latitude).toFixed(4);
      const formattedLongitude = parseFloat(longitude).toFixed(4);

      const res = await fetch('http://localhost:8080/fire/truck-driver/v1/update-location', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          truckId: truckId,
          latitude: parseFloat(formattedLatitude),
          longitude: parseFloat(formattedLongitude)
        })
      });

      if (res.ok) {
        setLocationUpdateMessage('Location updated successfully!');
        toast.success('Location updated successfully!');
      } else {
        const errorData = await res.json();
        setLocationUpdateMessage(errorData.message || 'Failed to update location');
        toast.error(errorData.message || 'Failed to update location');
      }
    } catch (err) {
      setLocationUpdateMessage('Network error. Please try again.');
      toast.error('Network error. Please try again.');
    } finally {
      setLocationUpdateLoading(false);
    }
  };

  // Toggle automatic location updates
  const toggleAutoLocationUpdate = () => {
    if (autoLocationUpdate) {
      // Stop automatic updates
      if (locationUpdateInterval) {
        clearInterval(locationUpdateInterval);
        setLocationUpdateInterval(null);
      }
      setAutoLocationUpdate(false);
      toast.info('Automatic location updates stopped');
    } else {
      // Start automatic updates
      if (userLocation) {
        const interval = setInterval(() => {
          if (userLocation) {
            handleLocationUpdate(userLocation.latitude, userLocation.longitude);
          }
        }, 30000); // Update every 30 seconds
        setLocationUpdateInterval(interval);
        setAutoLocationUpdate(true);
        toast.success('Automatic location updates started (every 30 seconds)');
      } else {
        toast.error('Location not available. Please enable location services.');
      }
    }
  };

  // Cleanup location update interval on unmount
  useEffect(() => {
    return () => {
      if (locationUpdateInterval) {
        clearInterval(locationUpdateInterval);
      }
    };
  }, [locationUpdateInterval]);

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

      const res = await fetch('http://localhost:8080/fire/truck-driver/v1/complete-booking', {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        setCompleted(true);
        setAppointment(null);
        toast.success('Booking marked as completed!');
      } else {
        const data = await res.json();
        setError(data.message || 'Failed to complete booking.');
        toast.error(data.message || 'Failed to complete booking.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
      setTimeout(() => setCompletionSlideIn(false), 1500);
    }
  };

  useEffect(() => {
    if (slideValue === 100 && !completed && !loading) {
      setSliderAnimating(true);
      const timer = setTimeout(() => {
        handleComplete();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [slideValue, completed, loading]);

  useEffect(() => {
    if (!userLocation || !appointment || !MAPBOX_TOKEN) return;
    const getRoute = async () => {
      try {
        const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${userLocation.longitude},${userLocation.latitude};${appointment.longitude},${appointment.latitude}?geometries=geojson&access_token=${MAPBOX_TOKEN}`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.routes && data.routes[0]) {
          setRouteInfo({
            distance: data.routes[0].distance / 1000,
            duration: data.routes[0].duration / 60,
            geometry: data.routes[0].geometry
          });
        }
      } catch (err) {
        console.error("Error fetching route:", err);
      }
    };
    getRoute();
  }, [userLocation, appointment, MAPBOX_TOKEN]);

  useEffect(() => {
    if (!window.mapboxgl || !appointment || !userLocation || !MAPBOX_TOKEN) return;

    window.mapboxgl.accessToken = MAPBOX_TOKEN;
    const map = new window.mapboxgl.Map({
      container: 'firetruck-map',
      style: 'mapbox://styles/mapbox/streets-v11', // Neutral map style
      center: [appointment.longitude, appointment.latitude],
      zoom: 13
    });

    new window.mapboxgl.Marker({ color: '#dc2626' }) // Red marker for destination
      .setLngLat([appointment.longitude, appointment.latitude])
      .setPopup(new window.mapboxgl.Popup({ offset: 25 }).setText('Appointment Location'))
      .addTo(map);

    new window.mapboxgl.Marker({ color: '#2563eb' }) // Blue marker for user location
      .setLngLat([userLocation.longitude, userLocation.latitude])
      .setPopup(new window.mapboxgl.Popup({ offset: 25 }).setText('Your Location'))
      .addTo(map);

    if (routeInfo && routeInfo.geometry) {
      map.on('load', () => {
        if (map.getSource('route')) {
            map.removeLayer('route');
            map.removeSource('route');
        }
        map.addSource('route', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: routeInfo.geometry
          }
        });
        map.addLayer({
          id: 'route',
          type: 'line',
          source: 'route',
          layout: { 'line-join': 'round', 'line-cap': 'round' },
          paint: { 'line-color': '#2563eb', 'line-width': 4 } // Blue route line
        });
      });
    }

    if (userLocation && appointment) {
        const bounds = new window.mapboxgl.LngLatBounds();
        bounds.extend([userLocation.longitude, userLocation.latitude]);
        bounds.extend([appointment.longitude, appointment.latitude]);
        if (routeInfo && routeInfo.geometry && routeInfo.geometry.coordinates) {
            routeInfo.geometry.coordinates.forEach(coord => {
                bounds.extend(coord);
            });
        }
        map.fitBounds(bounds, { padding: 80 });
    }

    return () => map.remove();
  }, [appointment, userLocation, routeInfo, MAPBOX_TOKEN]);

  useEffect(() => {
    if (window.mapboxgl) return;
    const script = document.createElement('script');
    script.src = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js';
    script.async = true;
    document.body.appendChild(script);
    const link = document.createElement('link');
    link.href = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => {
      document.body.removeChild(script);
      document.head.removeChild(link);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen flex flex-col bg-black font-inter text-white relative overflow-hidden">
      {/* Google Fonts Import */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
          .font-inter {
            font-family: 'Inter', sans-serif;
          }
        `}
      </style>

      {/* Custom Animated Cursor */}
      <motion.div
        className="fixed z-[9999] pointer-events-none"
        style={{
          left: 0,
          top: 0,
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: cursorVariant === 'hover' ? 1.5 : 1,
          opacity: cursorVariant === 'hover' ? 0.8 : 0.6,
        }}
        transition={{ duration: 0.2 }}
      >
        <div className="w-4 h-4 bg-white rounded-full shadow-lg border border-white/30"></div>
      </motion.div>

      {/* React Logo */}


      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={true} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />

      {/* Top Bar */}
      <header className="flex items-center justify-between bg-white/10 backdrop-blur-md text-white px-6 py-3 shadow-lg border-b border-white/20">
        <div className="flex items-center gap-3">
          <img src={profile.avatar} alt="avatar" className="w-12 h-12 rounded-full border-2 border-red-400 shadow-lg" />
          <div>
            <div className="font-bold text-lg text-white">{profile.name}</div>
            <div className="text-sm text-white/80 flex items-center gap-1"><FaPhoneAlt className="inline mr-1 text-red-400" />{profile.phone}</div>
          </div>
        </div>
        <button 
          onClick={handleLogout} 
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
          onMouseEnter={handleCursorEnter}
          onMouseLeave={handleCursorLeave}
        >
          Logout
        </button>
      </header>

      <div className="flex flex-1 w-full max-w-7xl mx-auto">
        {/* Sidebar/Menu - Enhanced Styling */}
        <nav className="w-56 min-w-[180px] bg-white/10 backdrop-blur-md border-r border-white/20 flex flex-col py-6 px-4 gap-2 shadow-lg">
          <motion.button
            onClick={() => setActivePage('dashboard')}
            className={`text-left px-4 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 ${activePage === 'dashboard' ? 'bg-red-600 text-white shadow-lg' : 'hover:bg-white/20 text-white'}`}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onMouseEnter={handleCursorEnter}
            onMouseLeave={handleCursorLeave}
          >
            <HomeIcon className="h-5 w-5" /> Dashboard
          </motion.button>
          <motion.button
            onClick={() => setActivePage('history')}
            className={`text-left px-4 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 ${activePage === 'history' ? 'bg-red-600 text-white shadow-lg' : 'hover:bg-white/20 text-white'}`}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onMouseEnter={handleCursorEnter}
            onMouseLeave={handleCursorLeave}
          >
            <ClockIcon className="h-5 w-5" /> Booking History
          </motion.button>
          <motion.button
            onClick={() => setActivePage('profile')}
            className={`text-left px-4 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 ${activePage === 'profile' ? 'bg-red-600 text-white shadow-lg' : 'hover:bg-white/20 text-white'}`}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onMouseEnter={handleCursorEnter}
            onMouseLeave={handleCursorLeave}
          >
            <UserIcon className="h-5 w-5" /> Profile
          </motion.button>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6 bg-black">
          {activePage === 'dashboard' && (
            <motion.div variants={containerVariants} initial="hidden" animate="visible">
              <div className="flex items-center justify-between w-full mb-6">
                <div className="flex items-center gap-3">
                  <FaFireExtinguisher className="text-3xl text-red-400" />
                  <h1 className="text-2xl font-bold text-white">Fire Truck Driver Dashboard</h1>
                </div>
                <button
                  onClick={() => window.location.href = '/fire-dashboard'}
                  className="bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-lg font-semibold hover:bg-white/20 transition-all duration-200 border border-white/20 shadow-lg"
                  onMouseEnter={handleCursorEnter}
                  onMouseLeave={handleCursorLeave}
                >
                  Go to Fire Admin
                </button>
              </div>

              {/* Location Management */}
              <motion.div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6" variants={itemVariants}>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <MdLocationOn className="text-xl text-red-600" />
                  Location Management
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="bg-gray-50 border-l-4 border-gray-300 p-4 rounded-lg">
                      <div className="font-semibold text-gray-800 mb-1">Current Location:</div>
                      <div className="font-mono text-base text-gray-700">
                        {userLocation ? `${userLocation.latitude.toFixed(4)}, ${userLocation.longitude.toFixed(4)}` : 'Getting location...'}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => userLocation && handleLocationUpdate(userLocation.latitude, userLocation.longitude)}
                        disabled={locationUpdateLoading || !userLocation}
                        className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 transition-all duration-200 shadow"
                        onMouseEnter={handleCursorEnter}
                        onMouseLeave={handleCursorLeave}
                      >
                        {locationUpdateLoading ? 'Updating...' : 'Update Location'}
                      </button>
                      <button
                        onClick={toggleAutoLocationUpdate}
                        disabled={!userLocation}
                        className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all duration-200 shadow ${
                          autoLocationUpdate 
                            ? 'bg-green-600 text-white hover:bg-green-700' 
                            : 'bg-gray-600 text-white hover:bg-gray-700'
                        } ${!userLocation ? 'opacity-50' : ''}`}
                        onMouseEnter={handleCursorEnter}
                        onMouseLeave={handleCursorLeave}
                      >
                        {autoLocationUpdate ? 'Stop Auto' : 'Start Auto'}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-gray-50 border-l-4 border-gray-300 p-4 rounded-lg">
                      <div className="font-semibold text-gray-800 mb-1">Auto Update Status:</div>
                      <div className={`font-semibold ${autoLocationUpdate ? 'text-green-600' : 'text-gray-600'}`}>
                        {autoLocationUpdate ? 'Active (every 30 seconds)' : 'Inactive'}
                      </div>
                    </div>
                    {locationUpdateMessage && (
                      <div className={`p-3 rounded-md text-sm ${
                        locationUpdateMessage.includes('success') 
                          ? 'bg-green-100 text-green-700 border border-green-200' 
                          : 'bg-red-100 text-red-700 border border-red-200'
                      }`}>
                        {locationUpdateMessage}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>

              {error && <div className="mb-4 p-3 rounded-md bg-red-100 text-red-700 border border-red-200 w-full text-center">{error}</div>}
              {loading && <div className="mb-4 text-blue-600 text-center">Loading...</div>}

              {appointment && userLocation ? (
                <motion.div className="w-full mb-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6" variants={itemVariants}>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2"><MdLocationOn className="text-xl text-blue-600" />Current Assignment</h3>
                  {/* Map container - no explicit background color, uses Mapbox's default style */}
                  <div id="firetruck-map" className="w-full h-80 rounded-lg shadow border mb-4 relative" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 border-l-4 border-gray-300 p-4 rounded-lg">
                      <div className="font-semibold text-gray-800 mb-1">Appointment Location:</div>
                      <div className="font-mono text-base text-gray-700">{appointment.latitude}, {appointment.longitude}</div>
                    </div>
                    <div className="bg-gray-50 border-l-4 border-gray-300 p-4 rounded-lg">
                      <div className="font-semibold text-gray-800 mb-1">Your Location:</div>
                      <div className="font-mono text-base text-gray-700">{userLocation.latitude.toFixed(4)}, {userLocation.longitude.toFixed(4)}</div>
                    </div>
                  </div>
                  {routeInfo && (
                    <div className="mt-4 flex flex-col items-center">
                      <div className="flex gap-4 items-center mb-3">
                        <span className="text-gray-700 font-semibold">Distance: {routeInfo.distance.toFixed(2)} km</span>
                        <span className="text-gray-700 font-semibold">Time: {Math.round(routeInfo.duration)} min</span>
                      </div>
                      <a
                        href={`https://www.google.com/maps/dir/${userLocation.latitude},${userLocation.longitude}/${appointment.latitude},${appointment.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 shadow"
                      >
                        Open in Google Maps
                      </a>
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div className="w-full mb-6 bg-gray-100 p-6 rounded-xl shadow border border-gray-200 text-gray-700 text-center" variants={itemVariants}>
                    No active assignment at the moment. Please wait for new requests.
                </motion.div>
              )}

              {appointment && !completed ? (
                <div className="flex flex-col items-center w-full relative h-32">
                  {completionSlideIn && (
                    <motion.div
                      className="absolute inset-0 bg-green-500 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-2xl z-10"
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={completionOverlayVariants}
                    >
                      <div className="flex items-center gap-3">
                        <motion.svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
                          animate={{ y: [0, -10, 0] }}
                          transition={{ repeat: Infinity, duration: 0.8 }}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </motion.svg>
                        Completing Request...
                      </div>
                    </motion.div>
                  )}

                  <motion.div className="mb-4 w-full flex flex-col items-center" variants={itemVariants}>
                    <label className="block text-gray-700 font-medium mb-2">Slide to Complete Task</label>
                    <div className="w-72 p-4 bg-gray-50 rounded-2xl shadow flex flex-col items-center relative transition-all duration-300">
                      <input
                        ref={sliderRef}
                        type="range"
                        min="0"
                        max="100"
                        value={slideValue}
                        onChange={e => setSlideValue(Number(e.target.value))}
                        disabled={loading || completed || completionSlideIn}
                        className={`w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 transition-all duration-300 ${sliderAnimating ? 'bg-green-300' : ''}`}
                        style={{ accentColor: '#2563eb' }}
                      />
                      {/* Custom thumb with arrow */}
                      <style>{`
                        input[type='range']::-webkit-slider-thumb {
                          -webkit-appearance: none;
                          appearance: none;
                          width: 40px;
                          height: 40px;
                          border-radius: 8px;
                          background: #2563eb;
                          box-shadow: 0 2px 8px rgba(37,99,235,0.15);
                          display: flex;
                          align-items: center;
                          justify-content: center;
                          transition: background 0.2s;
                          position: relative;
                        }
                        input[type='range']:focus::-webkit-slider-thumb {
                          outline: 2px solid #2563eb;
                        }
                        input[type='range']::-webkit-slider-thumb::before {
                          content: '';
                          display: block;
                          position: absolute;
                          left: 12px;
                          top: 10px;
                          width: 0;
                          height: 0;
                          border-top: 10px solid transparent;
                          border-bottom: 10px solid transparent;
                          border-left: 18px solid #fff;
                        }
                        input[type='range']::-webkit-slider-thumb::after {
                          display: none;
                        }
                        input[type='range']::-moz-range-thumb {
                          width: 40px;
                          height: 40px;
                          border-radius: 8px;
                          background: #2563eb;
                          box-shadow: 0 2px 8px rgba(37,99,235,0.15);
                          border: none;
                          position: relative;
                        }
                        input[type='range']:focus::-moz-range-thumb {
                          outline: 2px solid #2563eb;
                        }
                        input[type='range']::-moz-range-thumb {
                          background: #2563eb url('data:image/svg+xml;utf8,<svg width="24" height="24" xmlns="http://www.w3.org/2000/svg"><polygon points="6,4 20,12 6,20" fill="white"/></svg>') no-repeat center center;
                          background-size: 24px 24px;
                        }
                        /* Hide the default arrow for Firefox */
                        input[type='range']::-moz-focus-outer { border: 0; }
                      `}</style>
                      <div className="flex justify-between w-full text-xs mt-2">
                        <span>Start</span>
                        <span>End</span>
                      </div>
                      {sliderAnimating && (
                        <motion.div className="flex items-center mt-2 text-green-600"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 }}
                        >
                          <svg className="w-6 h-6 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                          Releasing control...
                        </motion.div>
                      )}
                      {loading && (
                        <motion.div className="flex items-center mt-2 text-blue-600"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
                          Processing...
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                </div>
              ) : (
                <motion.div
                  className="p-4 bg-green-100 text-green-700 rounded border border-green-200 font-semibold w-full text-center"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  Booking marked as completed! Ready for next assignment.
                </motion.div>
              )}
            </motion.div>
          )}
          {activePage === 'history' && (
            <motion.div className="bg-white rounded-xl shadow p-6" variants={containerVariants} initial="hidden" animate="visible">
              <h2 className="text-xl font-bold mb-4 text-gray-800">Booking History</h2>
              <table className="min-w-full text-sm">
                <thead>
                  <motion.tr className="bg-gray-100" variants={itemVariants}>
                    <th className="px-4 py-2 text-left text-gray-700">ID</th>
                    <th className="px-4 py-2 text-left text-gray-700">Date</th>
                    <th className="px-4 py-2 text-left text-gray-700">Issue Type</th>
                    <th className="px-4 py-2 text-left text-gray-700">Status</th>
                    <th className="px-4 py-2 text-left text-gray-700">From</th>
                    <th className="px-4 py-2 text-left text-gray-700">To</th>
                  </motion.tr>
                </thead>
                <tbody>
                  {mockHistory.map(h => (
                    <motion.tr key={h.id} className="border-b last:border-b-0 hover:bg-gray-50" variants={itemVariants}>
                      <td className="px-4 py-2 text-center">{h.id}</td>
                      <td className="px-4 py-2 text-center">{h.date}</td>
                      <td className="px-4 py-2 text-center">{h.issue}</td>
                      <td className={`px-4 py-2 text-center font-semibold ${h.status === 'Completed' ? 'text-green-600' : 'text-red-500'}`}>{h.status}</td>
                      <td className="px-4 py-2 text-center">{h.from}</td>
                      <td className="px-4 py-2 text-center">{h.to}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          )}
          {activePage === 'profile' && (
            <motion.div className="bg-white rounded-xl shadow p-6 max-w-2xl mx-auto" variants={containerVariants} initial="hidden" animate="visible">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">Profile</h2>
                <button
                  onClick={fetchProfile}
                  disabled={profileLoading}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 disabled:opacity-50 transition-colors duration-200 shadow-md"
                  onMouseEnter={handleCursorEnter}
                  onMouseLeave={handleCursorLeave}
                >
                  {profileLoading ? 'Refreshing...' : 'Refresh Profile'}
                </button>
              </div>
              
              {profileError && (
                <div className="mb-4 p-3 rounded-md bg-red-100 text-red-700 border border-red-200">
                  {profileError}
                </div>
              )}
              
              {profileLoading && (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  <span className="ml-2 text-gray-600">Loading profile...</span>
                </div>
              )}
              
              {!profileLoading && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col items-center gap-4">
                    <img src={profile.avatar} alt="avatar" className="w-24 h-24 rounded-full border-2 border-blue-500 shadow-md" />
                    <div className="text-center">
                      <div className="font-bold text-lg text-gray-900">{profile.name}</div>
                      <div className="text-gray-600 flex items-center justify-center gap-1 mt-1">
                        <FaPhoneAlt className="text-blue-500" />
                        {profile.phone}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="font-semibold text-gray-800 mb-2">Personal Information</div>
                      <div className="space-y-2 text-sm">
                        <div><span className="font-medium">Email:</span> {profile.email || 'N/A'}</div>
                        <div><span className="font-medium">Role:</span> {profile.role || 'N/A'}</div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="font-semibold text-gray-800 mb-2">License & ID</div>
                      <div className="space-y-2 text-sm">
                        <div><span className="font-medium">License Number:</span> {profile.licenseNumber || 'N/A'}</div>
                        <div><span className="font-medium">Government ID:</span> {profile.govId || 'N/A'}</div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="font-semibold text-gray-800 mb-2">Vehicle Information</div>
                      <div className="space-y-2 text-sm">
                        <div><span className="font-medium">Fire Truck Reg Number:</span> {profile.fireTruckRegNumber || 'N/A'}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="mt-6 flex justify-center">
                <motion.button
                  className="bg-blue-500 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors duration-200 shadow-md"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onMouseEnter={handleCursorEnter}
                  onMouseLeave={handleCursorLeave}
                >
                  Edit Profile
                </motion.button>
              </div>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
}