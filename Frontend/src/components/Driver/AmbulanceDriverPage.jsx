import React, { useEffect, useState, useRef } from 'react';
import { FaAmbulance, FaPhoneAlt, FaStar, FaCheckCircle } from 'react-icons/fa';
import { MdAccessTime, MdCloud, MdAssignment, MdLocalHospital, MdLocationOn } from 'react-icons/md';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UserIcon, HomeIcon, ClockIcon, MapIcon as MapOutlineIcon } from '@heroicons/react/24/outline';

const MAPBOX_TOKEN = 'pk.eyJ1IjoibWFpdHJreWVlMjkiLCJhIjoiY20wdjhtbXhvMWRkYTJxb3UwYmo2NXRlZCJ9.BIf7Ebj0qCJtAV9HE-utBQ';

function decodeJWT(token) {
  if (!token) return {};
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
  } catch {
    return {};
  }
}

function getProfileFromJWT() {
  try {
    const jwt = localStorage.getItem('jwt') || localStorage.getItem('token');
    if (!jwt) return null;
    const payload = decodeJWT(jwt);
    return {
      id: payload.id || payload.userId || payload.sub,
      name: payload.name || payload.sub || 'Unknown',
      phone: payload.phone || payload.phoneNumber || '',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(payload.name || payload.sub || 'User')}&background=2563eb&color=fff&size=128`,
    };
  } catch {
    return null;
  }
}

const mockProfile = {
  id: null,
  name: 'John Doe',
  phone: '+91 9876543210',
  avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=2563eb&color=fff&size=128',
};
const mockHistory = [
  { id: 1, date: '2025-07-23', status: 'Completed', from: '18.53, 73.81', to: '18.54, 73.82', issue: 'Cardiac Arrest' },
  { id: 2, date: '2025-07-22', status: 'Completed', from: '18.51, 73.80', to: '18.52, 73.83', issue: 'Road Accident' },
  { id: 3, date: '2025-07-21', status: 'Cancelled', from: '18.50, 73.79', to: '18.53, 73.84', issue: 'Minor Injury' },
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

export default function AmbulanceDriverPage() {
  const [appointment, setAppointment] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [completed, setCompleted] = useState(false);
  const [slideValue, setSlideValue] = useState(0);
  const [sliderAnimating, setSliderAnimating] = useState(false);
  const sliderRef = useRef();
  const [routeInfo, setRouteInfo] = useState(null);
  const [activePage, setActivePage] = useState('dashboard');
  const [profile, setProfile] = useState(getProfileFromJWT() || mockProfile);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState('');

  // History states
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState('');

  const [completionSlideIn, setCompletionSlideIn] = useState(false);
  
  // Live location update states
  const [locationUpdateLoading, setLocationUpdateLoading] = useState(false);
  const [locationUpdateMessage, setLocationUpdateMessage] = useState('');
  const [autoLocationUpdate, setAutoLocationUpdate] = useState(false);
  const [locationUpdateInterval, setLocationUpdateInterval] = useState(null);
  const [shiftStartTime] = useState(new Date('2025-01-07T06:00:00'));
  const [currentTime, setCurrentTime] = useState(new Date());
  const [vehicleStatus] = useState({
    ambulanceId: 'AMB-001',
    fuelLevel: 85,
    maintenanceStatus: 'Good',
    lastService: '15 days ago'
  });
  const [weatherInfo] = useState({
    temperature: 24,
    condition: 'Clear',
    humidity: 65
  });
  const [performanceMetrics] = useState({
    callsCompleted: 12,
    averageResponseTime: '8.5 min',
    rating: 4.8,
    totalDistance: '156 km'
  });

  // Custom animated cursor
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

  const fetchProfile = async () => {
    console.log('Current profile state:', profile);
    console.log('JWT token:', localStorage.getItem('jwt') || localStorage.getItem('token'));
    
    setProfileLoading(true);
    setProfileError('');
    
    try {
      const response = await fetch('http://localhost:8080/ambulance-driver/v1/me', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('jwt') || localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const profileData = await response.json();
      console.log('Fetched profile data:', profileData);
      
      setProfile({
        id: profileData.userID || profile.id,
        name: profileData.name || profile.name,
        phone: profileData.mobile || profile.phone,
        email: profileData.email,
        licenseNumber: profileData.licenseNumber,
        govId: profileData.govId,
        ambulanceRegNumber: profileData.ambulanceRegNumber,
        role: profileData.role,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(profileData.name || profile.name)}&background=2563eb&color=fff&size=128`,
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      setProfileError('Failed to fetch profile data. Please try again.');
    } finally {
      setProfileLoading(false);
    }
  };

  // Fetch history from API
  const fetchHistory = async () => {
    console.log('Fetching history from API...');
    console.log('JWT token:', localStorage.getItem('jwt') || localStorage.getItem('token'));
    
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

      const response = await fetch('http://localhost:8080/ambulance-driver/v1/get-history', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const historyData = await response.json();
        console.log('History data received:', historyData);
        
        setHistory(historyData);
        toast.success('History updated successfully!');
      } else {
        const errorData = await response.json();
        setHistoryError(errorData.message || 'Failed to fetch history');
        toast.error(errorData.message || 'Failed to fetch history');
      }
    } catch (err) {
      console.error('Error fetching history:', err);
      setHistoryError('Network error. Please try again.');
      toast.error('Network error. Please try again.');
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    // Fetch profile when profile page is accessed
    if (activePage === 'profile') {
      fetchProfile();
    }
  }, [activePage]);

  useEffect(() => {
    // Fetch history when history page is accessed
    if (activePage === 'history') {
      fetchHistory();
    }
  }, [activePage]);

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
        const res = await fetch('http://localhost:8080/ambulance-driver/v1/get/current-request/location', {
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
        const newLocation = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude
        };
        setUserLocation(newLocation);
        
        // Auto-update location if enabled
        if (autoLocationUpdate) {
          handleLocationUpdate(newLocation.latitude, newLocation.longitude);
        }
      },
      (err) => {
          console.error('Geolocation error:', err);
          setError(`Geolocation error: ${err.message}. Please enable location services.`);
          toast.error(`Geolocation error: ${err.message}`);
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [autoLocationUpdate]);

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

      const res = await fetch('http://localhost:8080/ambulance-driver/v1/complete-booking', {
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

      // Get driver ID from JWT token
      const userInfo = decodeJWT(token);
      const driverId = userInfo.userId || userInfo.id;

      if (!driverId) {
        setLocationUpdateMessage('Driver ID not found in token.');
        return;
      }

      const res = await fetch('http://localhost:8080/ambulance/location/update', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ambulanceId: driverId, // Using driver ID as ambulance ID
          latitude: latitude,
          longitude: longitude
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

  useEffect(() => {
    if (slideValue === 100 && !completed && !loading) {
      setSliderAnimating(true);
      const timer = setTimeout(() => {
        handleComplete();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [slideValue, completed, loading]);

  // Cleanup location update interval on unmount
  useEffect(() => {
    return () => {
      if (locationUpdateInterval) {
        clearInterval(locationUpdateInterval);
      }
    };
  }, [locationUpdateInterval]);

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
      container: 'ambulance-map',
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
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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

  const StatCard = ({ title, value, icon, className = '', iconClassName = '' }) => (
    <motion.div
      className={`bg-white/10 backdrop-blur-md rounded-lg p-4 shadow-lg border border-white/20 flex items-center justify-between ${className}`}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      onMouseEnter={handleCursorEnter}
      onMouseLeave={handleCursorLeave}
    >
      <div>
        <p className="text-sm text-white/80 font-medium">{title}</p>
        <p className="text-xl font-bold text-white">{value}</p>
      </div>
      <div className={`text-3xl ${iconClassName}`}>{icon}</div>
    </motion.div>
  );

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
      {/* <div className="fixed top-4 left-4 z-50">
        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
          <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M14.23 12.004a2.236 2.236 0 0 1-2.235 2.236 2.236 2.236 0 0 1-2.236-2.236 2.236 2.236 0 0 1 2.235-2.236 2.236 2.236 0 0 1 2.236 2.236zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.276 0-.56.06-.83.18C3.627 2.678 4.718 5.578 6.004 8.762c-1.721 3.36-3.168 6.51-3.168 8.018 0 1.297 1.134 2.53 3.206 2.53 1.72 0 3.63-.98 5.54-2.73 1.91 1.75 3.82 2.73 5.54 2.73 2.072 0 3.206-1.233 3.206-2.53 0-1.508-1.447-4.658-3.168-8.018 1.286-3.184 2.377-6.084 2.886-7.268-.27-.12-.554-.18-.83-.18z"/>
          </svg>
        </div>
      </div> */}

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={true} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />

      {/* Top Bar */}
      <header className="flex items-center justify-between bg-white/10 backdrop-blur-md text-white px-6 py-3 shadow-lg border-b border-white/20">
        <div className="flex items-center gap-3">
          <img src={profile.avatar} alt="avatar" className="w-12 h-12 rounded-full border-2 border-blue-400 shadow-lg" />
          <div>
            <div className="font-bold text-lg text-white">{profile.name}</div>
            <div className="text-sm text-white/80 flex items-center gap-1"><FaPhoneAlt className="inline mr-1 text-blue-400" />{profile.phone}</div>
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
            className={`text-left px-4 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 ${activePage === 'dashboard' ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-white/20 text-white'}`}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onMouseEnter={handleCursorEnter}
            onMouseLeave={handleCursorLeave}
          >
            <HomeIcon className="h-5 w-5" /> Dashboard
          </motion.button>
          <motion.button
            onClick={() => setActivePage('history')}
            className={`text-left px-4 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 ${activePage === 'history' ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-white/20 text-white'}`}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onMouseEnter={handleCursorEnter}
            onMouseLeave={handleCursorLeave}
          >
            <ClockIcon className="h-5 w-5" /> Booking History
          </motion.button>
          <motion.button
            onClick={() => setActivePage('profile')}
            className={`text-left px-4 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 ${activePage === 'profile' ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-white/20 text-white'}`}
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

              {/* Location Update Controls */}
              <motion.div 
                className="bg-white/10 backdrop-blur-md rounded-xl shadow-lg border border-white/20 p-6 mb-6" 
                variants={itemVariants}
                onMouseEnter={handleCursorEnter}
                onMouseLeave={handleCursorLeave}
              >
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <MdLocationOn className="text-xl text-blue-400" />
                  Location Management
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h4 className="text-white font-semibold mb-2">Current Location</h4>
                    {userLocation ? (
                      <div className="text-sm text-white/80">
                        <p>Latitude: {userLocation.latitude.toFixed(6)}</p>
                        <p>Longitude: {userLocation.longitude.toFixed(6)}</p>
                      </div>
                    ) : (
                      <p className="text-sm text-red-400">Location not available</p>
                    )}
                  </div>
                  
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h4 className="text-white font-semibold mb-2">Location Updates</h4>
                    <div className="space-y-2">
                      <button
                        onClick={() => userLocation && handleLocationUpdate(userLocation.latitude, userLocation.longitude)}
                        disabled={locationUpdateLoading || !userLocation}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                      >
                        {locationUpdateLoading ? 'Updating...' : 'Update Location Now'}
                      </button>
                      
                      <button
                        onClick={toggleAutoLocationUpdate}
                        disabled={!userLocation}
                        className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                          autoLocationUpdate 
                            ? 'bg-red-600 hover:bg-red-700 text-white' 
                            : 'bg-green-600 hover:bg-green-700 text-white'
                        }`}
                      >
                        {autoLocationUpdate ? 'Stop Auto Updates' : 'Start Auto Updates'}
                      </button>
                    </div>
                  </div>
                </div>

                {locationUpdateMessage && (
                  <motion.div
                    className={`mt-4 p-3 rounded-lg text-sm border ${
                      locationUpdateMessage.includes('success')
                        ? 'bg-green-500/20 text-green-300 border-green-500/30'
                        : 'bg-red-500/20 text-red-300 border-red-500/30'
                    }`}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {locationUpdateMessage}
                  </motion.div>
                )}
              </motion.div>



              {error && <div className="mb-4 p-3 rounded-md bg-red-100 text-red-700 border border-red-200 w-full text-center">{error}</div>}
              {loading && <div className="mb-4 text-blue-600 text-center">Loading...</div>}

              {appointment && userLocation ? (
                <motion.div className="w-full mb-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6" variants={itemVariants}>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2"><MdLocationOn className="text-xl text-blue-600" />Current Assignment</h3>
                  {/* Map container - no explicit background color, uses Mapbox's default style */}
                  <div id="ambulance-map" className="w-full h-80 rounded-lg shadow border mb-4 relative" />
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
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">Booking History</h2>
                <button
                  onClick={fetchHistory}
                  disabled={historyLoading}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 disabled:opacity-50 transition-colors duration-200 shadow-md"
                  onMouseEnter={handleCursorEnter}
                  onMouseLeave={handleCursorLeave}
                >
                  {historyLoading ? 'Refreshing...' : 'Refresh History'}
                </button>
              </div>
              
              {historyError && (
                <div className="mb-4 p-3 rounded-md bg-red-100 text-red-700 border border-red-200">
                  {historyError}
                </div>
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
                      <p className="text-lg font-medium">No booking history found</p>
                      <p className="text-sm">Your completed bookings will appear here</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-sm">
                        <thead>
                          <motion.tr className="bg-gray-100" variants={itemVariants}>
                            <th className="px-4 py-3 text-left text-gray-700 font-semibold">ID</th>
                            <th className="px-4 py-3 text-left text-gray-700 font-semibold">User ID</th>
                            <th className="px-4 py-3 text-left text-gray-700 font-semibold">Requester Email</th>
                            <th className="px-4 py-3 text-left text-gray-700 font-semibold">Requested At</th>
                            <th className="px-4 py-3 text-left text-gray-700 font-semibold">Location</th>
                            <th className="px-4 py-3 text-left text-gray-700 font-semibold">Status</th>
                          </motion.tr>
                        </thead>
                        <tbody>
                          {history.map((h, index) => (
                            <motion.tr 
                              key={h.id || index} 
                              className="border-b last:border-b-0 hover:bg-gray-50 transition-colors duration-200" 
                              variants={itemVariants}
                            >
                              <td className="px-4 py-3 text-gray-800 font-medium">{h.id}</td>
                              <td className="px-4 py-3 text-gray-600">{h.userId}</td>
                              <td className="px-4 py-3 text-gray-600">{h.emailOfRequester}</td>
                              <td className="px-4 py-3 text-gray-600">
                                {new Date(h.requestedAt).toLocaleString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </td>
                              <td className="px-4 py-3 text-gray-600">
                                <div className="text-xs">
                                  <div>Lat: {h.latitude?.toFixed(4)}</div>
                                  <div>Lng: {h.longitude?.toFixed(4)}</div>
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                  h.status === 'COMPLETED' 
                                    ? 'bg-green-100 text-green-800' 
                                    : h.status === 'EN_ROUTE' 
                                    ? 'bg-blue-100 text-blue-800'
                                    : h.status === 'CANCELLED'
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {h.status}
                                </span>
                              </td>
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
              <h2 className="text-xl font-bold mb-4 text-white">Profile</h2>
              
              {profileLoading && (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
                  <span className="ml-2 text-white">Loading profile...</span>
                </div>
              )}
              
              {profileError && (
                <div className="bg-red-900/50 border border-red-700 text-red-400 p-3 rounded-md mb-4">
                  {profileError}
                </div>
              )}
              
              {!profileLoading && !profileError && (
                <div className="flex flex-col items-center gap-4">
                  <img src={profile.avatar} alt="avatar" className="w-24 h-24 rounded-full border-2 border-blue-400 shadow-md" />
                  <div className="font-bold text-lg text-white">{profile.name}</div>
                  
                  <div className="w-full space-y-3">
                    {profile.id && (
                      <div className="flex items-center gap-2 text-white/80">
                        <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        <span>ID: {profile.id}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2 text-white/80">
                      <FaPhoneAlt className="text-blue-400" />
                      <span>{profile.phone}</span>
                    </div>
                    
                    {profile.email && (
                      <div className="flex items-center gap-2 text-white/80">
                        <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span>{profile.email}</span>
                      </div>
                    )}
                    
                    {profile.licenseNumber && (
                      <div className="flex items-center gap-2 text-white/80">
                        <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span>License: {profile.licenseNumber}</span>
                      </div>
                    )}
                    
                    {profile.govId && (
                      <div className="flex items-center gap-2 text-white/80">
                        <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V4a2 2 0 114 0v2m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                        </svg>
                        <span>Gov ID: {profile.govId}</span>
                      </div>
                    )}
                    
                    {profile.ambulanceRegNumber && (
                      <div className="flex items-center gap-2 text-white/80">
                        <FaAmbulance className="text-blue-400" />
                        <span>Ambulance: {profile.ambulanceRegNumber}</span>
                      </div>
                    )}
                    
                    {profile.role && (
                      <div className="flex items-center gap-2 text-white/80">
                        <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span>Role: {profile.role}</span>
                      </div>
                    )}
                  </div>
                  
                  <motion.button
                    className="mt-4 bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 shadow-md"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={fetchProfile}
                  >
                    Refresh Profile
                  </motion.button>
                </div>
              )}
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
}