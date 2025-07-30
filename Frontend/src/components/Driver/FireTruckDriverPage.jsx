import React, { useEffect, useState, useRef } from 'react';
import { FaFireExtinguisher, FaPhoneAlt } from 'react-icons/fa';
import { MdLocationOn } from 'react-icons/md';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UserIcon, HomeIcon, ClockIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

// IMPORTANT: Replace with your actual Google Maps API Key and consider environment variables
const Maps_API_KEY = 'AIzaSyCnwJl8uyVjTS8ql060q5d0az43nvVsyUw'; // <<<--- Replace this

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

  // Booking History states
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState('');

  // Custom animated cursor
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const [cursorVariant, setCursorVariant] = useState('default');

  const cursorXSpring = useSpring(cursorX, { damping: 25, stiffness: 700 });
  const cursorYSpring = useSpring(cursorY, { damping: 25, stiffness: 700 });

  // Google Maps refs
  const googleMapRef = useRef(null);
  const mapInstance = useRef(null);
  const directionsRendererRef = useRef(null);
  const markersRef = useRef([]);
  const [currentAddress, setCurrentAddress] = useState('');
  const [appointmentAddress, setAppointmentAddress] = useState('');

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

  // Fetch booking history from API
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

      const res = await fetch('http://localhost:8080/fire/truck-driver/v1/history', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        // Assuming data is an array of history items
        setHistory(data);
        toast.success('Booking history loaded successfully!');
      } else {
        const errorData = await res.json();
        setHistoryError(errorData.message || 'Failed to fetch booking history.');
        toast.error(errorData.message || 'Failed to fetch booking history.');
      }
    } catch (err) {
      console.error('Error fetching history:', err);
      setHistoryError('Network error. Please try again.');
      toast.error('Network error. Please try again.');
    } finally {
      setHistoryLoading(false);
    }
  };

  // Fetch profile when profile page is active
  useEffect(() => {
    if (activePage === 'profile') {
      fetchProfile();
    }
    if (activePage === 'history') {
      fetchHistory();
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


  const handleLogout = () => {
    localStorage.removeItem('jwt');
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  // Geocode function for address
  async function geocodeLatLng(lat, lng, setter) {
    if (!window.google || !window.google.maps) {
      console.warn("Google Maps API not loaded for geocoding.");
      return;
    }
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === "OK" && results && results[0]) {
        setter(results[0].formatted_address);
      } else {
        setter("Address not found");
        console.error("Geocoder failed due to: " + status);
      }
    });
  }

  // Fetch addresses when locations change
  useEffect(() => {
    if (window.google && userLocation) {
      geocodeLatLng(userLocation.latitude, userLocation.longitude, setCurrentAddress);
    }
    if (window.google && appointment) {
      geocodeLatLng(appointment.latitude, appointment.longitude, setAppointmentAddress);
    }
  }, [userLocation, appointment]);

  // Google Maps loader
  useEffect(() => {
    // Only load if Google Maps API is not already available and we have locations to show
    if (!window.google && appointment && userLocation && Maps_API_KEY) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${Maps_API_KEY}`;
      script.async = true;
      script.onload = () => {
        renderGoogleMap();
      };
      document.body.appendChild(script);
      return () => {
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      };
    } else if (window.google && appointment && userLocation) {
      // If API is already loaded, just render the map
      renderGoogleMap();
    }
  }, [appointment, userLocation, Maps_API_KEY]); // Added Maps_API_KEY to dependencies

  // Render Google Map
  function renderGoogleMap() {
    if (!googleMapRef.current || !window.google || !appointment || !userLocation) {
      console.warn("Cannot render Google Map: Missing ref, Google API, appointment, or user location.");
      return;
    }

    // Remove old markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // Remove previous directions if any
    if (directionsRendererRef.current) {
      directionsRendererRef.current.setMap(null);
      directionsRendererRef.current = null;
    }

    // Create map
    mapInstance.current = new window.google.maps.Map(googleMapRef.current, {
      center: { lat: appointment.latitude, lng: appointment.longitude },
      zoom: 13,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    });

    // Add markers
    const destMarker = new window.google.maps.Marker({
      position: { lat: appointment.latitude, lng: appointment.longitude },
      map: mapInstance.current,
      title: 'Appointment Location',
      icon: {
        url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png' // Red for destination
      }
    });
    const userMarker = new window.google.maps.Marker({
      position: { lat: userLocation.latitude, lng: userLocation.longitude },
      map: mapInstance.current,
      title: 'Your Location',
      icon: {
        url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png' // Blue for user
      }
    });
    markersRef.current.push(destMarker, userMarker);

    // Fit bounds
    const bounds = new window.google.maps.LatLngBounds();
    bounds.extend({ lat: appointment.latitude, lng: appointment.longitude });
    bounds.extend({ lat: userLocation.latitude, lng: userLocation.longitude });
    mapInstance.current.fitBounds(bounds);

    // Draw directions (route)
    const directionsService = new window.google.maps.DirectionsService();
    const directionsRenderer = new window.google.maps.DirectionsRenderer({
      map: mapInstance.current,
      suppressMarkers: true, // We add custom markers above
      polylineOptions: {
        strokeColor: "#dc2626", // Red for firetruck route
        strokeWeight: 5,
      }
    });
    directionsRendererRef.current = directionsRenderer;

    directionsService.route(
      {
        origin: { lat: userLocation.latitude, lng: userLocation.longitude },
        destination: { lat: appointment.latitude, lng: appointment.longitude },
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          directionsRenderer.setDirections(result);
        } else {
          console.error("Directions request failed due to " + status);
        }
      }
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-inter text-black relative overflow-hidden" style={{ backgroundColor: 'var(--neutral-bg-main)' }}>
      {/* Inject custom color variables */}
      <style>
        {`
          :root {
            /* Primary Green Tones */
            --green-sidebar-accent: #2D4739;
            --green-header-btn: #3A5543;
            --green-bg-tint: #E6ECE8;
            --green-progress: #88A596;

            /* Neutral Tones */
            --neutral-bg-main: #E8E6E0;
            --neutral-bg-card: #F7F6F2;
            --neutral-text-placeholder: #B0B0AC;
            --neutral-text-header: #333333;

            /* Accent and Alert Colors */
            --accent-success: #2DA66D;
            --accent-danger: #D95C5C;
            --accent-btn-dark: #3A5C47;
            --accent-avatar-bg: #F3F2EF;
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

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={true} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />

      {/* Top Bar */}
      <header
        className="flex items-center justify-between text-white px-6 py-3 shadow-lg border-b border-white/20"
        style={{
          backgroundColor: 'var(--neutral-bg-main)', // Use main background from palette
          color: 'var(--neutral-text-header)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div className="flex items-center gap-3">
          <img src={profile.avatar} alt="avatar" className="w-12 h-12 rounded-full border-2 border-blue-400 shadow-lg" />
          <div>
            <div className="font-bold text-lg" style={{ color: 'var(--neutral-text-header)' }}>{profile.name}</div>
            <div className="text-sm flex items-center gap-1" style={{ color: 'var(--neutral-text-placeholder)' }}>
              <FaPhoneAlt className="inline mr-1 text-blue-400" />
              {profile.phone}
            </div>
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


      <div className="w-full max-w-7xl mx-auto">
        {/* Horizontal Navbar - Enhanced Styling */}
        <nav
          className="flex flex-row items-center justify-center gap-4 py-4 px-4 border-b border-white/20 shadow-lg"
          style={{ backgroundColor: 'var(--green-sidebar-accent)' }}
        >
          <motion.button
            onClick={() => setActivePage('dashboard')}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg font-semibold transition-all duration-200 text-base ${activePage === 'dashboard' ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-white/20 text-white'}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onMouseEnter={handleCursorEnter}
            onMouseLeave={handleCursorLeave}
          >
            <HomeIcon className="h-5 w-5" /> Dashboard
          </motion.button>
          <motion.button
            onClick={() => setActivePage('history')}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg font-semibold transition-all duration-200 text-base ${activePage === 'history' ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-white/20 text-white'}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onMouseEnter={handleCursorEnter}
            onMouseLeave={handleCursorLeave}
          >
            <ClockIcon className="h-5 w-5" /> Booking History
          </motion.button>
          <motion.button
            onClick={() => setActivePage('profile')}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg font-semibold transition-all duration-200 text-base ${activePage === 'profile' ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-white/20 text-white'}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onMouseEnter={handleCursorEnter}
            onMouseLeave={handleCursorLeave}
          >
            <UserIcon className="h-5 w-5" /> Profile
          </motion.button>
        </nav>

        {/* Main Content */}
        <main
          className="flex-1 p-6"
          style={{ backgroundColor: 'var(--neutral-bg-card)' }} // Use card/section background from palette
        >
          {activePage === 'dashboard' && (
            <motion.div variants={containerVariants} initial="hidden" animate="visible">

              {/* Location Update Controls */}
              <motion.div
                className="bg-white/10 backdrop-blur-md rounded-xl shadow-lg border border-white/20 p-6 mb-6"
                variants={itemVariants}
                onMouseEnter={handleCursorEnter}
                onMouseLeave={handleCursorLeave}
              >
                <h3 className="text-lg font-semibold text-black mb-4 flex items-center gap-2">
                  <MdLocationOn className="text-xl text-red-400" />
                  Location Management
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h4 className="text-black font-semibold mb-2">Current Location</h4>
                    {userLocation ? (
                      <div className="text-sm text-black/80">
                        <p>Latitude: {userLocation.latitude.toFixed(6)}</p>
                        <p>Longitude: {userLocation.longitude.toFixed(6)}</p>
                        <p className="mt-1 text-xs text-black/60">Address: {currentAddress || "Loading address..."}</p>
                      </div>
                    ) : (
                      <p className="text-sm text-red-400">Location not available</p>
                    )}
                  </div>

                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h4 className="text-black font-semibold mb-2">Location Updates</h4>
                    <div className="space-y-2">
                      <button
                        onClick={() => userLocation && handleLocationUpdate(userLocation.latitude, userLocation.longitude)}
                        disabled={locationUpdateLoading || !userLocation}
                        className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                      >
                        {locationUpdateLoading ? 'Updating...' : 'Update Location Now'}
                      </button>

                      <button
                        onClick={toggleAutoLocationUpdate}
                        disabled={!userLocation}
                        className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${autoLocationUpdate
                          ? 'bg-blue-600 hover:bg-blue-700 text-white'
                          : 'bg-green-600 hover:bg-green-700 text-white'
                        }`}
                      >
                        {autoLocationUpdate ? 'Stop Auto Updates' : 'Start Auto Updates'}
                      </button>
                    </div>
                    {appointment && (
                      <div className="mt-3 text-xs text-black/80">
                        <div className="font-semibold">Appointment Address:</div>
                        <div>{appointmentAddress || "Loading address..."}</div>
                      </div>
                    )}
                  </div>
                </div>

                {locationUpdateMessage && (
                  <motion.div
                    className={`mt-4 p-3 rounded-lg text-sm border ${locationUpdateMessage.includes('success')
                        ? 'bg-green-500/20 text-green-700 border-green-500/30'
                        : 'bg-red-500/20 text-red-700 border-red-500/30'
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
                <motion.div className="w-full mb-6 rounded-xl shadow-sm border border-gray-200 p-6" variants={itemVariants} style={{ backgroundColor: 'var(--neutral-bg-card)' }}>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <MdLocationOn className="text-xl text-red-600" />
                    Current Assignment
                  </h3>
                  {/* Google Map container */}
                  <div
                    ref={googleMapRef}
                    className="w-full h-80 rounded-lg shadow border mb-4 relative"
                    style={{ background: "#E6ECE8" }}
                  />
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
                  <div className="mt-4 flex flex-col items-center gap-2">
                    <a
                      href={`https://www.google.com/maps/dir/${userLocation.latitude},${userLocation.longitude}/${appointment.latitude},${appointment.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-red-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors duration-200 shadow"
                    >
                      Navigate in Google Maps
                    </a>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  className="w-full mb-6 bg-gray-100 p-6 rounded-xl shadow border border-gray-200 text-gray-700 text-center"
                  variants={itemVariants}
                >
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
      width: 28px;
      height: 28px;
      border-radius: 50%;
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
      left: 8px;
      top: 7px;
      width: 0;
      height: 0;
      border-top: 7px solid transparent;
      border-bottom: 7px solid transparent;
      border-left: 12px solid #fff;
    }
    input[type='range']::-webkit-slider-thumb::after {
      display: none;
    }
    input[type='range']::-moz-range-thumb {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: #2563eb;
      box-shadow: 0 2px 8px rgba(37,99,235,0.15);
      border: none;
      position: relative;
    }
    input[type='range']:focus::-moz-range-thumb {
      outline: 2px solid #2563eb;
    }
    input[type='range']::-moz-range-thumb {
      background: #2563eb url('data:image/svg+xml;utf8,<svg width="18" height="18" xmlns="http://www.w3.org/2000/svg"><polygon points="6,3 16,9 6,15" fill="white"/></svg>') no-repeat center center;
      background-size: 18px 18px;
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
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${h.status === 'COMPLETED'
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
              <h2 className="text-xl font-bold mb-4 text-black">Profile</h2>

              {profileLoading && (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
                  <span className="ml-2 text-black">Loading profile...</span>
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
                  <div className="font-bold text-lg text-black">{profile.name}</div>

                  <div className="w-full space-y-3">
                    {profile.id && (
                      <div className="flex items-center gap-2 text-black/80">
                        <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        <span>ID: {profile.id}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-black/80">
                      <FaPhoneAlt className="text-blue-400" />
                      <span>{profile.phone}</span>
                    </div>

                    {profile.email && (
                      <div className="flex items-center gap-2 text-black/80">
                        <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span>{profile.email}</span>
                      </div>
                    )}

                    {profile.licenseNumber && (
                      <div className="flex items-center gap-2 text-black/80">
                        <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span>License: {profile.licenseNumber}</span>
                      </div>
                    )}

                    {profile.govId && (
                      <div className="flex items-center gap-2 text-black/80">
                        <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V4a2 2 0 114 0v2m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                        </svg>
                        <span>Gov ID: {profile.govId}</span>
                      </div>
                    )}

                    {profile.fireTruckRegNumber && ( // Changed from ambulanceRegNumber
                      <div className="flex items-center gap-2 text-black/80">
                        <FaFireExtinguisher className="text-blue-400" /> {/* Changed icon */}
                        <span>Fire Truck: {profile.fireTruckRegNumber}</span>
                      </div>
                    )}

                    {profile.role && (
                      <div className="flex items-center gap-2 text-black/80">
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