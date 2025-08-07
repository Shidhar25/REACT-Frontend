import React, { useEffect, useState, useRef } from 'react';
import { FaFireExtinguisher, FaPhoneAlt, FaHome, FaBook, FaUser, FaSignOutAlt, FaTruck } from 'react-icons/fa';
import { MdLocationOn, MdHistory, MdPerson } from 'react-icons/md';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UserIcon, HomeIcon, ClockIcon } from '@heroicons/react/24/outline';
import { ClipboardCheck, ShieldCheck, User, Phone, Mail, Fingerprint, IdCard } from 'lucide-react';
import reactLogo from '../../assets/react-logo.png';
import fireDriverImg from '../../assets/fireDriver.png';
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

const ProfileItem = ({ icon, label, value }) => (
  <div className="flex items-center space-x-3 pt-2">
    <div className="w-5 h-5">{icon}</div>
    <div className="flex justify-between w-full">
      <span className="text-gray-500">{label}:</span>
      <span className="font-medium text-gray-800">{value}</span>
    </div>
  </div>
);

export default function FireTruckDriverPage() {
  const [appointment, setAppointment] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [fireDriverLocation, setFireDriverLocation] = useState(null);
  const [bookingNotes, setBookingNotes] = useState('');
  const [bookingIssueType, setBookingIssueType] = useState('');
  const [fireTruckDistance, setFireTruckDistance] = useState(null);
  const [fireTruckDuration, setFireTruckDuration] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [completed, setCompleted] = useState(false);
  const [slideValue, setSlideValue] = useState(0);
  const [sliderAnimating, setSliderAnimating] = useState(false);
  const [completionSlideIn, setCompletionSlideIn] = useState(false);
  const sliderRef = useRef();
  const [activePage, setActivePage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
  const [bookingDetailsLoading, setBookingDetailsLoading] = useState(false);
  const [bookingDetailsError, setBookingDetailsError] = useState('');

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

  // Sidebar menu items
  const sidebarMenu = [
    { label: 'Dashboard', icon: <FaHome />, page: 'dashboard' },
    { label: 'Booking History', icon: <MdHistory />, page: 'history' },
    { label: 'Profile', icon: <MdPerson />, page: 'profile' },
  ];

  // Fetch profile from API and then booking history using fireTruckLicence
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
      const response = await fetch('http://localhost:8080/fire/truck-driver/v1/me', {
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
          licenseNumber: profileData.licenseNumber,
          govId: profileData.govId,
          fireTruckRegNumber: profileData.fireTruckRegNumber,
          role: profileData.role,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(profileData.name || 'User')}&background=1a202c&color=fff&size=128`
        });
        toast.success('Profile updated successfully!');
        // Fetch booking history using fireTruckRegNumber (fireTruckLicence)
        if (profileData.fireTruckRegNumber) {
          fetchBookingHistoryByLicence(profileData.fireTruckRegNumber);
        }
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

  // Fetch booking history by fireTruckLicence and set latest booking location
  const fetchBookingHistoryByLicence = async (fireTruckLicence) => {
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
      const res = await fetch(`http://localhost:8080/fire/truck-driver/v1/get-History/${fireTruckLicence}`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
        toast.success('Booking history loaded successfully!');
        // Set latest booking location as fire truck location
        if (data && Array.isArray(data) && data.length > 0) {
          const latestBooking = data[0];
          if (latestBooking && latestBooking.latitude && latestBooking.longitude) {
            setFireDriverLocation({ latitude: latestBooking.latitude, longitude: latestBooking.longitude });
          }
        }
      } else {
        const errorData = await res.json();
        setHistoryError(errorData.message || 'Failed to fetch booking history.');
        toast.error(errorData.message || 'Failed to fetch booking history.');
      }
    } catch (err) {
      setHistoryError('Network error. Please try again.');
      toast.error('Network error. Please try again.');
    } finally {
      setHistoryLoading(false);
    }
  };


  // Fetch booking details by id and set fire driver location
  const fetchBookingDetails = async (id) => {
    setBookingDetailsLoading(true);
    setBookingDetailsError('');
    try {
      const token = localStorage.getItem('jwt') || localStorage.getItem('token');
      if (!token) {
        setBookingDetailsError('Authentication token not found. Please login again.');
        toast.error('Authentication token not found. Please login again.');
        setBookingDetailsLoading(false);
        return;
      }
      const res = await fetch(`http://localhost:8080/user/booking/${id}`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const booking = await res.json();
        // Show notes and issue type
        setBookingNotes(booking.notes || '');
        setBookingIssueType(booking.issueType || '');
        // Set fire driver location from booking
        if (booking && booking.assignedFireTrucks && Array.isArray(booking.assignedFireTrucks)) {
          const truck = booking.assignedFireTrucks.find(truck => truck.status === 'EN_ROUTE');
          if (truck) {
            setFireDriverLocation({ latitude: truck.latitude, longitude: truck.longitude });
            // Calculate time and distance using Google Maps Distance Matrix API
            if (booking.latitude && booking.longitude) {
              getDistanceAndDuration(truck.latitude, truck.longitude, booking.latitude, booking.longitude);
            }
          }
        }
      } else {
        const errorData = await res.json();
        setBookingDetailsError(errorData.message || 'Failed to fetch booking details.');
        toast.error(errorData.message || 'Failed to fetch booking details.');
      }
    } catch (err) {
      setBookingDetailsError('Network error. Please try again.');
      toast.error('Network error. Please try again.');
    } finally {
      setBookingDetailsLoading(false);
    }
  };

  // Get time and distance using Google Maps Distance Matrix API
  const getDistanceAndDuration = (originLat, originLng, destLat, destLng) => {
    if (!window.google || !window.google.maps) return;
    const service = new window.google.maps.DistanceMatrixService();
    service.getDistanceMatrix({
      origins: [{ lat: originLat, lng: originLng }],
      destinations: [{ lat: destLat, lng: destLng }],
      travelMode: window.google.maps.TravelMode.DRIVING,
    }, (response, status) => {
      if (status === 'OK') {
        const result = response.rows[0].elements[0];
        setFireTruckDistance(result.distance ? result.distance.text : null);
        setFireTruckDuration(result.duration ? result.duration.text : null);
      } else {
        setFireTruckDistance(null);
        setFireTruckDuration(null);
      }
    });
  };

  useEffect(() => {
    fetchProfile();
    // fetchHistory(); // Now handled by fetchProfile after profile fetch
  }, []);



  // Fetch profile when profile page is active
  // useEffect(() => {
  //   if (activePage === 'profile') {
  //     fetchProfile();
  //   }
  //   if (activePage === 'history') {
  //     fetchHistory();
  //   }
  // }, [activePage]);

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

  // Use fireDriverLocation as current location if available
  useEffect(() => {
    if (fireDriverLocation) {
      setUserLocation(fireDriverLocation);
    } else {
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
    }
  }, [fireDriverLocation]);

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
      {/* Mobile Sidebar Overlay */}
      <div className={`fixed inset-0 z-50 bg-black/40 transition-opacity duration-300 ${sidebarOpen ? 'block' : 'hidden'} md:hidden`} onClick={() => setSidebarOpen(false)} />
      <aside className={`fixed top-0 left-0 z-50 h-full w-72 bg-white shadow-lg transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:hidden rounded-r-3xl`}>
        <div className="flex flex-col h-full">
          {/* Profile Section */}
          <div className="flex flex-col items-center py-8 border-b">
            <img src={profile.avatar || fireDriverImg} alt="avatar" className="w-20 h-20 rounded-full object-cover border-2 border-blue-400 shadow-md mb-2" />
            <div className="font-bold text-lg text-black">{profile.name || 'Fire Driver'}</div>
            <div className="text-xs text-gray-500">{profile.role || 'Fire Truck Driver'}</div>
          </div>
          {/* Menu */}
          <nav className="flex flex-col gap-1 px-4 py-6 flex-1">
            {sidebarMenu.map((item) => (
              <button
                key={item.page}
                onClick={() => { setActivePage(item.page); setSidebarOpen(false); }}
                className={`flex items-center gap-3 px-4 py-3 rounded-full text-base font-medium transition-all
                  ${activePage === item.page ? 'bg-gray-100 text-black font-semibold' : 'hover:bg-gray-50 text-gray-700'}`}
              >
                <span className="text-xl">{item.icon}</span>
                {item.label}
              </button>
            ))}
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 rounded-full text-base font-medium text-red-600 hover:bg-red-50 mt-8"
            >
              <FaSignOutAlt className="text-xl" />
              Logout
            </button>
          </nav>
        </div>
      </aside>

      {/* Top Bar */}
      <div className="border-b border-gray-200 " >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          {/* Hamburger for mobile */}
          <button className="md:hidden text-2xl" onClick={() => setSidebarOpen(true)}>
            &#9776;
          </button>
          {/* Logo and Title */}
          <div className="flex items-center gap-4">
            <img src={reactLogo} alt="Logo" className="h-10 w-10 object-contain rounded-xl bg-white p-2 shadow-sm" />
            <h1 className="text-lg font-semibold text-gray-800">Fire Driver</h1>
          </div>
          {/* Right - User Info & Actions */}
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm text-gray-600">Welcome {profile.name}</p>
              <p className="text-xs text-gray-400">Updated: {new Date().toLocaleTimeString()}</p>
            </div>
            <img src={fireDriverImg} alt="Admin" className="h-8 w-8 rounded-full object-cover border-2 border-white shadow" onClick={() => setActivePage('profile')} />
            <button onClick={handleLogout} title="Logout" className="text-red-600 hover:text-red-800 transition hidden sm:block">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1" /></svg>
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Navbar (hidden on mobile) */}
      {/* <div className="w-full max-w-7xl mx-auto hidden md:flex justify-center bg-[#E8E6E0] py-4">
        <nav className="bg-[#fef4f4] border border-red-200 rounded-full shadow-lg px-4 py-2 flex space-x-4 max-w-3xl">
          <button onClick={() => setActivePage('dashboard')} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all ${activePage === 'dashboard' ? 'bg-red-100 text-red-700 border-red-300 shadow' : 'bg-transparent text-gray-700 border-transparent hover:bg-red-50 hover:text-red-700'}`}>Dashboard</button>
          <button onClick={() => setActivePage('history')} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all ${activePage === 'history' ? 'bg-red-100 text-red-700 border-red-300 shadow' : 'bg-transparent text-gray-700 border-transparent hover:bg-red-50 hover:text-red-700'}`}>Booking History</button>
          <button onClick={() => setActivePage('profile')} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all ${activePage === 'profile' ? 'bg-red-100 text-red-700 border-red-300 shadow' : 'bg-transparent text-gray-700 border-transparent hover:bg-red-50 hover:text-red-700'}`}>Profile</button>
        </nav>
      </div> */}

<div className="w-full max-w-7xl mx-auto">
  {/* Horizontal Navbar - Enhanced Styling */}
  <div className="w-full flex justify-center py-4 sm:py-6">
    <nav
      className="bg-[#fef4f4] border border-red-200 rounded-full shadow-lg px-2 sm:px-4 py-2 flex space-x-2 sm:space-x-4 overflow-x-auto max-w-full sm:max-w-3xl"
      style={{ backgroundColor: '#fff4f4' }}
    >
      {/* Mobile: icons only, Desktop: icons + text */}
      <motion.button
        onClick={() => setActivePage('dashboard')}
        className={`flex items-center justify-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all
          ${activePage === 'dashboard' ? 'bg-red-100 text-red-700 border-red-300 shadow' : 'bg-transparent text-gray-700 border-transparent hover:bg-red-50 hover:text-red-700'}
          sm:justify-start`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        onMouseEnter={handleCursorEnter}
        onMouseLeave={handleCursorLeave}
      >
        <HomeIcon className="h-5 w-5" />
        <span className="hidden sm:inline">Dashboard</span>
      </motion.button>

      <motion.button
        onClick={() => setActivePage('history')}
        className={`flex items-center justify-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all
          ${activePage === 'history' ? 'bg-red-100 text-red-700 border-red-300 shadow' : 'bg-transparent text-gray-700 border-transparent hover:bg-red-50 hover:text-red-700'}
          sm:justify-start`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        onMouseEnter={handleCursorEnter}
        onMouseLeave={handleCursorLeave}
      >
        <ClockIcon className="h-5 w-5" />
        <span className="hidden sm:inline">Booking History</span>
      </motion.button>

      <motion.button
        onClick={() => setActivePage('profile')}
        className={`flex items-center justify-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all
          ${activePage === 'profile' ? 'bg-red-100 text-red-700 border-red-300 shadow' : 'bg-transparent text-gray-700 border-transparent hover:bg-red-50 hover:text-red-700'}
          sm:justify-start`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        onMouseEnter={handleCursorEnter}
        onMouseLeave={handleCursorLeave}
      >
        <UserIcon className="h-5 w-5" />
        <span className="hidden sm:inline">Profile</span>
      </motion.button>
    </nav>
  </div>

        {/* Main Content */}
        <main
          className="flex-1 p-2 sm:p-6"
          style={{ backgroundColor: 'var(--neutral-bg-card)' }}
        >
          {activePage === 'dashboard' && (
            <motion.div variants={containerVariants} initial="hidden" animate="visible">
              {/* Dashboard Layout: Map (left), Location (right), Recent EN_ROUTE booking */}
              <motion.div className="w-full mb-6 rounded-xl shadow-sm border border-gray-200 p-2 sm:p-6" variants={itemVariants} style={{ backgroundColor: 'var(--neutral-bg-card)' }}>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <MdLocationOn className="text-xl text-blue-600" />
                  Dashboard Overview
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {/* Left: Google Map */}
                  <div className="bg-gray-50 rounded-lg shadow p-2 sm:p-4 flex flex-col items-center justify-center">
                    <div className="font-semibold text-gray-800 mb-2">Map View</div>
                    <div
                      ref={googleMapRef}
                      className="w-full h-60 sm:h-80 rounded-lg shadow border relative"
                      style={{ background: "#E6ECE8" }}
                    />
                    {userLocation && appointment && (
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&origin=${userLocation.latitude},${userLocation.longitude}&destination=${appointment.latitude},${appointment.longitude}&travelmode=driving`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 inline-block bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 shadow"
                      >
                        Navigate in Google Maps
                      </a>
                    )}
                  </div>
                  {/* Right: Current Location & Recent Booking */}
                  <div className="flex flex-col gap-4 sm:gap-6">
                    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <h4 className="text-black font-semibold mb-2">Current Location (Fire Truck)</h4>
                      {fireDriverLocation ? (
                        <div className="text-sm text-black/80">
                          <p>Latitude: {fireDriverLocation.latitude?.toFixed(6)}</p>
                          <p>Longitude: {fireDriverLocation.longitude?.toFixed(6)}</p>
                          <p className="mt-1 text-xs text-black/60">Address: {currentAddress || "Loading address..."}</p>
                          {fireTruckDistance && fireTruckDuration && (
                            <div className="mt-2 text-xs text-black/80">
                              <span className="font-semibold">Distance:</span> {fireTruckDistance}<br />
                              <span className="font-semibold">Estimated Time:</span> {fireTruckDuration}
                            </div>
                          )}
                          {bookingNotes && (
                            <div className="mt-2 text-xs text-black/80">
                              <span className="font-semibold">Notes:</span> {bookingNotes}
                            </div>
                          )}
                          {bookingIssueType && (
                            <div className="mt-2 text-xs text-black/80">
                              <span className="font-semibold">Issue Type:</span> {bookingIssueType}
                            </div>
                          )}
                        </div>
                      ) : (
                        <p className="text-sm text-red-400">Location not available</p>
                      )}
                    </div>

                    {/* Recent EN_ROUTE Booking from History */}
                    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <h4 className="text-black font-semibold mb-2">Recent Booking (EN_ROUTE)</h4>
                      {history && history.length > 0 ? (
                        (() => {
                          const recentEnRoute = history.find(h => h.status === 'EN_ROUTE');
                          if (recentEnRoute) {
                            return (
                              <div className="text-sm text-black/80">
                                <p><span className="font-semibold">ID:</span> {recentEnRoute.id}</p>
                                <p><span className="font-semibold">User ID:</span> {recentEnRoute.userId}</p>
                                <p><span className="font-semibold">Email:</span> {recentEnRoute.emailOfRequester}</p>
                                <p><span className="font-semibold">Requested At:</span> {new Date(recentEnRoute.requestedAt).toLocaleString('en-US', {
                                  year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                })}</p>
                                <p><span className="font-semibold">Location:</span> {recentEnRoute.latitude?.toFixed(4)}, {recentEnRoute.longitude?.toFixed(4)}</p>
                                <p><span className="font-semibold">Status:</span> <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">{recentEnRoute.status}</span></p>
                                {profile.fireTruckRegNumber && (
                                  <p><span className="font-semibold">Fire Truck:</span> {profile.fireTruckRegNumber}</p>
                                )}
                              </div>
                            );
                          } else {
                            return <p className="text-sm text-gray-500">No EN_ROUTE bookings found.</p>;
                          }
                        })()
                      ) : (
                        <p className="text-sm text-gray-500">No booking history found.</p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>

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

              <motion.div
                className="w-full mb-6 rounded-xl shadow-sm border border-gray-200 p-2 sm:p-6"
                variants={itemVariants}
                onMouseEnter={handleCursorEnter}
                onMouseLeave={handleCursorLeave}
              >
                <h3 className="text-lg font-semibold text-black mb-4 flex items-center gap-2">
                  <MdLocationOn className="text-xl text-blue-400" />
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
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                      >
                        {locationUpdateLoading ? 'Updating...' : 'Update Location Now'}
                      </button>

                      <button
                        onClick={toggleAutoLocationUpdate}
                        disabled={!userLocation}
                        className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${autoLocationUpdate
                          ? 'bg-red-600 hover:bg-red-700 text-white'
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
            </motion.div>



          )}
          {activePage === 'history' && (
            <motion.div className="bg-white rounded-xl shadow p-2 sm:p-6 overflow-x-auto" variants={containerVariants} initial="hidden" animate="visible">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800">Booking History</h2>
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
                      <table className="min-w-full text-xs sm:text-sm">
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
  <motion.div
    className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8"
    variants={containerVariants}
    initial="hidden"
    animate="visible"
  >
    <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-gray-100">

      {/* Header */}
      <div className="flex items-center gap-2 mb-8">
        <FaFireExtinguisher className="text-red-600 w-6 h-6" />
        <h2 className="text-xl font-bold text-gray-800">Fire Truck Driver Profile</h2>
      </div>

      {/* Loading */}
      {profileLoading && (
        <motion.div className="text-center py-10 text-blue-600 font-semibold" variants={itemVariants}>
          Loading profile data...
        </motion.div>
      )}

      {/* Error */}
      {profileError && (
        <motion.div className="text-center py-10 text-red-600 font-semibold" variants={itemVariants}>
          {profileError}
        </motion.div>
      )}

      {/* Profile Data */}
      {!profileLoading && !profileError && (
        <motion.div
          variants={itemVariants}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8 border border-gray-200 rounded-xl p-6 bg-gradient-to-br from-white via-blue-50 to-white shadow-sm hover:shadow-md transition-shadow">

            {/* Avatar */}
            <div className="relative w-32 h-32 shrink-0">
              <img
                src={fireDriverImg}
                alt="Profile"
                className="w-full h-full rounded-full object-cover border-4 border-white shadow-md"
              />
              <div className="absolute -inset-1 rounded-full bg-red-400 opacity-10 blur-lg"></div>
            </div>

            {/* Info Fields */}
            <div className="w-full">
              <dl className="divide-y divide-gray-200 text-sm text-gray-700 space-y-3">
                <ProfileItem icon={<Fingerprint className="text-red-500 w-4 h-4" />} label="ID" value={profile.id} />
                <ProfileItem icon={<User className="text-red-500 w-4 h-4" />} label="Name" value={profile.name} />
                <ProfileItem icon={<Mail className="text-red-500 w-4 h-4" />} label="Email" value={profile.email} />
                <ProfileItem icon={<Phone className="text-red-500 w-4 h-4" />} label="Phone" value={profile.phone} />
                <ProfileItem icon={<IdCard className="text-red-500 w-4 h-4" />} label="Gov ID" value={profile.govId} />
                <ProfileItem icon={<ClipboardCheck className="text-red-500 w-4 h-4" />} label="License" value={profile.licenseNumber} />

              </dl>
            </div>

          </div>

        </motion.div>
      )}
    </div>
  </motion.div>
)}
        </main>
      </div>
    </div>
  );
}