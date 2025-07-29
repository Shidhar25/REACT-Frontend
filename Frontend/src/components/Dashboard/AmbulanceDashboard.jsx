import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion'; // Import motion from framer-motion
import {
  HomeIcon,
  UserGroupIcon,
  TruckIcon,
  ExclamationCircleIcon,
  TrophyIcon,
  UserCircleIcon,
  PlusCircleIcon,
  MapPinIcon,
  ClockIcon,
  IdentificationIcon,
  BuildingOfficeIcon,
  EnvelopeIcon,
  PhoneIcon,
  KeyIcon,
  CalendarDaysIcon,
  Bars3BottomLeftIcon,
  CurrencyDollarIcon,
  MagnifyingGlassIcon,
  ClipboardDocumentCheckIcon,
} from '@heroicons/react/24/outline';

// Add a simple JWT decode function (if jwt-decode is not available)
function decodeJWT(token) {
  if (!token) return {};
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
  } catch {
    return {};
  }
}

// Framer Motion Variants for animations
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
  hover: { scale: 1.03, boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)" },
};

const headerVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

// Variants for Navbar Icons
const navIconVariants = {
  rest: { scale: 1 },
  hover: { scale: 1.1, rotate: 10, transition: { duration: 0.2 } },
  active: { scale: 1.15, rotate: -5, transition: { duration: 0.2 } },
};


function SectionHeader({ icon, title }) {
  return (
    <motion.h2
      className="flex items-center gap-3 text-2xl md:text-3xl font-bold mb-6 text-gray-800 border-b-2 border-gray-200 pb-2"
      variants={headerVariants}
      initial="hidden"
      animate="visible"
    >
      <span className="text-blue-500 text-3xl">{icon}</span>
      {title}
    </motion.h2>
  );
}

const ReactLogo = () => (
  <svg width="36" height="36" viewBox="0 0 841.9 595.3" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g>
      <circle cx="420.9" cy="296.5" r="45.7" fill="#61DAFB"/>
      <g stroke="#61DAFB" strokeWidth="30" fill="none">
        <ellipse rx="218.7" ry="545.9" transform="rotate(60 420.9 296.5)"/>
        <ellipse rx="218.7" ry="545.9" transform="rotate(120 420.9 296.5)"/>
        <ellipse rx="218.7" ry="545.9" transform="rotate(180 420.9 296.5)"/>
      </g>
    </g>
  </svg>
);

export default function AmbulanceDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    governmentId: '',
    password: '',
    licenseNumber: '',
    vehicleRegNumber: '',
    securityQuestion: 'PET_NAME',
    securityAnswer: '',
    fireStationId: '',
  });
  const [locationForm, setLocationForm] = useState({
    ambulanceId: '',
    latitude: '',
    longitude: '',
    status: 'AVAILABLE'
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchedLocation, setFetchedLocation] = useState(null);
  const [fetchError, setFetchError] = useState('');
  const [fetchLoading, setFetchLoading] = useState(false);
  const [hospitalId, setHospitalId] = useState('');
  const [hospitalAmbulances, setHospitalAmbulances] = useState([]);
  const [hospitalFetchError, setHospitalFetchError] = useState('');
  const [hospitalFetchLoading, setHospitalFetchLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState('');
  const [historyStatusFilter, setHistoryStatusFilter] = useState('');
  const [historySortDesc, setHistorySortDesc] = useState(true);
  const [completeLoadingId, setCompleteLoadingId] = useState(null);
  const [completeMessage, setCompleteMessage] = useState('');
  const [allDrivers, setAllDrivers] = useState([]);
  const [allDriversLoading, setAllDriversLoading] = useState(false);
  const [allDriversError, setAllDriversError] = useState('');
  const [ambulances, setAmbulances] = useState([]);
  const [ambulancesLoading, setAmbulancesLoading] = useState(false);
  const [ambulancesError, setAmbulancesError] = useState('');
  const [recentEmergencies, setRecentEmergencies] = useState([]);
  const [emergenciesLoading, setEmergenciesLoading] = useState(false);
  const [emergenciesError, setEmergenciesError] = useState('');
  const [dashboardStats, setDashboardStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [statsError, setStatsError] = useState('');
  const [profileData, setProfileData] = useState({
    name: 'Ambulance Driver Name',
    badge: 'A-2024-001',
    rank: 'Senior Driver',
    department: 'Emergency Response',
    experience: '10 years',
    email: 'driver@ambulance.gov',
    phone: '+1 (555) 123-4567'
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState(null);

  // New state for individual input errors
  const [formErrors, setFormErrors] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    governmentId: '',
    password: '',
    licenseNumber: '',
    vehicleRegNumber: '',
    securityAnswer: '',
    fireStationId: '',
  });
  const [locationFormErrors, setLocationFormErrors] = useState({
    ambulanceId: '',
    latitude: '',
    longitude: '',
  });

  // Regex patterns
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[6-9]\d{9}$/;
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]$/; // PAN format
  const licenseRegex = /^[A-Z]{2}-[A-Z]+-\d{4}$/i; // Format: STATE-TYPE-NUMBER (e.g., MH-FIRE-0234)
  const vehicleRegRegex = /^[A-Z]{2}\d{2}[A-Z]{2}\d{4}$/i; // Format: STATE + 2 digits + 2 letters + 4 digits (e.g., MH15BA3254)

  useEffect(() => {
    const jwt = localStorage.getItem('jwt');
    if (!jwt) {
      setStatsError('Authentication required. Please log in.');
      return;
    }

    setStatsLoading(true);
    setStatsError('');
    fetch('http://localhost:8080/api/dashboard/stats', {
      headers: { 'Authorization': `Bearer ${jwt}` }
    })
      .then(async res => {
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({ message: 'Failed to parse error response.' }));
          throw new Error(errorData.message || 'Failed to fetch dashboard stats.');
        }
        return res.json();
      })
      .then(data => setDashboardStats(data))
      .catch(err => setStatsError(err.message || 'Could not load dashboard stats.'))
      .finally(() => setStatsLoading(false));
  }, []);

  useEffect(() => {
    if (activeTab === 'drivers' || activeTab === 'rankings') {
      setAmbulancesLoading(true);
      setAmbulancesError('');
      const jwt = localStorage.getItem('jwt');
      if (!jwt) {
        setAmbulancesError('Authentication required to view ambulances.');
        setAmbulancesLoading(false);
        return;
      }
      fetch('http://localhost:8080/ambulance/all', {
        headers: { 'Authorization': `Bearer ${jwt}` }
      })
        .then(async (res) => {
          if (!res.ok) {
            const errorData = await res.json().catch(() => ({ message: 'Failed to parse error response.' }));
            throw new Error(errorData.message || 'Failed to fetch ambulances');
          }
          return res.json();
        })
        .then((data) => {
          const sorted = [...data].sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));
          setAmbulances(sorted);
        })
        .catch((err) => {
          setAmbulancesError(err.message || 'Could not load ambulances.');
        })
        .finally(() => setAmbulancesLoading(false));
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'overview' || activeTab === 'emergencies') {
      setEmergenciesLoading(true);
      setEmergenciesError('');
      const jwt = localStorage.getItem('jwt');
      if (!jwt) {
        setEmergenciesError('Authentication required to view emergencies.');
        setEmergenciesLoading(false);
        return;
      }
      fetch('http://localhost:8080/booking/ambulance', {
        headers: { 'Authorization': `Bearer ${jwt}` }
      })
        .then(async (res) => {
          if (!res.ok) {
            const errorData = await res.json().catch(() => ({ message: 'Failed to parse error response.' }));
            throw new Error(errorData.message || 'Failed to fetch emergencies');
          }
          return res.json();
        })
        .then((data) => {
          const pendingEmergencies = data.filter(emergency => emergency.status === 'PENDING');
          const completedEmergencies = data.filter(emergency => emergency.status === 'COMPLETED');
          setRecentEmergencies([...pendingEmergencies, ...completedEmergencies]);
        })
        .catch((err) => {
          setEmergenciesError(err.message || 'Could not load recent emergencies.');
        })
        .finally(() => setEmergenciesLoading(false));
    }
  }, [activeTab]);

  // Fetch profile data when profile tab is active
  useEffect(() => {
    if (activeTab === 'profile') {
      fetchAmbulanceDriverProfile();
    }
  }, [activeTab]);

  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'fullName':
        if (!value.trim()) error = 'Full Name is required.';
        else if (value.length > 100) error = 'Full Name cannot exceed 100 characters.';
        break;
      case 'email':
        if (!value.trim()) error = 'Email is required.';
        else if (!emailRegex.test(value)) error = 'Please enter a valid email address.';
        break;
      case 'phoneNumber':
        if (!value.trim()) error = 'Phone Number is required.';
        else if (!phoneRegex.test(value)) error = 'Must be a 10-digit Indian number (starts with 6-9).';
        break;
      case 'governmentId':
        if (!value.trim()) error = 'Government ID is required.';
        else if (!panRegex.test(value)) error = 'Enter valid PAN number (e.g., ABCDE1234F).';
        break;
      case 'password':
        if (!value.trim()) error = 'Password is required.';
        else if (value.length < 6) error = 'Password must be at least 6 characters long.';
        break;
      case 'licenseNumber':
        if (!value.trim()) error = 'License Number is required.';
        else if (!licenseRegex.test(value)) error = 'Enter valid License (e.g., MH-FIRE-0234).';
        break;
      case 'vehicleRegNumber':
        if (!value.trim()) error = 'Vehicle Registration is required.';
        else if (!vehicleRegRegex.test(value)) error = 'Enter valid Vehicle Reg (e.g., MH15BA3254).';
        break;
      case 'fireStationId':
        if (!value) error = 'Fire Station ID is required.'; // Allow 0 for empty field, validate onBlur/submit
        else if (isNaN(Number(value)) || Number(value) <= 0) error = 'Fire Station ID must be a positive number.';
        break;
      case 'securityAnswer':
        if (!value.trim()) error = 'Security Answer is required.';
        break;
      default:
        break;
    }
    setFormErrors(prev => ({ ...prev, [name]: error }));
    return error === '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Real-time validation, but debounce for better UX on complex regex if needed
    validateField(name, value);
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  const validateLocationField = (name, value) => {
    let error = '';
    switch (name) {
      case 'ambulanceId':
        if (!value.trim()) error = 'Ambulance ID is required.';
        break;
      case 'latitude':
        if (!value.trim()) error = 'Latitude is required.';
        else if (isNaN(Number(value))) error = 'Latitude must be a number.';
        else if (Number(value) < -90 || Number(value) > 90) error = 'Latitude must be between -90 and 90.';
        break;
      case 'longitude':
        if (!value.trim()) error = 'Longitude is required.';
        else if (isNaN(Number(value))) error = 'Longitude must be a number.';
        else if (Number(value) < -180 || Number(value) > 180) error = 'Longitude must be between -180 and 180.';
        break;
      default:
        break;
    }
    setLocationFormErrors(prev => ({ ...prev, [name]: error }));
    return error === '';
  };

  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    setLocationForm((prev) => ({ ...prev, [name]: value }));
    validateLocationField(name, value);
  };

  const handleLocationBlur = (e) => {
    const { name, value } = e.target;
    validateLocationField(name, value);
  };

  const validateAllRegistrationFields = () => {
    let isValid = true;
    for (const key in form) {
      if (key !== 'fireStationId' && key !== 'securityQuestion' && !form[key].trim()) { // Check for empty strings for text fields
          setFormErrors(prev => ({ ...prev, [key]: `${key.replace(/([A-Z])/g, ' $1').trim()} is required.` }));
          isValid = false;
      } else if (key === 'fireStationId' && (isNaN(Number(form[key])) || Number(form[key]) <= 0)) {
          setFormErrors(prev => ({ ...prev, [key]: 'Fire Station ID must be a positive number.' }));
          isValid = false;
      } else if (!validateField(key, form[key])) { // Run specific regex/length validation
        isValid = false;
      }
    }
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!validateAllRegistrationFields()) {
      setMessage('Please correct the errors in the form before submitting.');
      return;
    }
    setLoading(true);
    try {
      const body = { ...form, fireStationId: Number(form.fireStationId) };
      const res = await fetch('http://localhost:8080/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        setMessage('Ambulance driver registered successfully!');
        setForm({ fullName: '', email: '', phoneNumber: '', governmentId: '', password: '', licenseNumber: '', vehicleRegNumber: '', hospitalID: '' });
        setFormErrors({ fullName: '', email: '', phoneNumber: '', governmentId: '', password: '', licenseNumber: '', vehicleRegNumber: '', hospitalID: '' });
      } else {
        const data = await res.json().catch(() => ({}));
        setMessage(data.message || 'Registration failed.');
      }
    } catch (err) {
      setMessage('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const validateAllLocationUpdateFields = () => {
    let isValid = true;
    for (const key in locationForm) {
        if (key === 'status') continue; // Skip status for validation as it's a select with default valid
        if (!locationForm[key].toString().trim()) { // Check for empty strings/numbers
            setLocationFormErrors(prev => ({ ...prev, [key]: `${key.replace(/([A-Z])/g, ' $1').trim()} is required.` }));
            isValid = false;
        } else if (!validateLocationField(key, locationForm[key])) {
            isValid = false;
        }
    }
    return isValid;
  };

  const handleLocationSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!validateAllLocationUpdateFields()) {
        setMessage('Please correct the errors in the location update form.');
        return;
    }
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8080/ambulance/location-update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(locationForm),
      });
      if (res.ok) {
        setMessage('Location updated successfully!');
        setLocationForm({ ambulanceId: '', latitude: '', longitude: '', status: 'AVAILABLE' });
        setLocationFormErrors({ ambulanceId: '', latitude: '', longitude: '' });
      } else {
        const data = await res.json().catch(() => ({}));
        setMessage(data.message || 'Location update failed.');
      }
    } catch (err) {
      setMessage('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleFetchLocation = async () => {
    setFetchError('');
    setFetchedLocation(null);
    if (!locationForm.ambulanceId.trim()) {
      setFetchError('Please enter an ambulance ID to fetch its location.');
      return;
    }
    setFetchLoading(true);
    try {
      const jwt = localStorage.getItem('jwt');
      if (!jwt) {
        setFetchError('Authentication required to fetch location.');
        setFetchLoading(false);
        return;
      }
      const res = await fetch(`http://localhost:8080/ambulance/location/${locationForm.ambulanceId}`, {
        headers: { 'Authorization': `Bearer ${jwt}` },
      });
      if (res.ok) {
        const data = await res.json();
        setFetchedLocation(data);
        setFetchError('');
      } else {
        const data = await res.json().catch(() => ({}));
        setFetchError(data.message || 'Failed to fetch location. Ambulance not found or internal server error.');
      }
    } catch (err) {
      setFetchError('Network error. Please check your connection.');
    } finally {
      setFetchLoading(false);
    }
  };

  const handleFetchByHospital = async () => {
    setHospitalFetchError('');
    setHospitalAmbulances([]);
    if (!hospitalId || isNaN(Number(hospitalId)) || Number(hospitalId) <= 0) {
      setHospitalFetchError('Please enter a valid positive Hospital ID.');
      return;
    }
    setHospitalFetchLoading(true);
    try {
      const jwt = localStorage.getItem('jwt');
      if (!jwt) {
        setHospitalFetchError('Authentication required to fetch ambulances by hospital.');
        setHospitalFetchLoading(false);
        return;
      }
      const res = await fetch(`http://localhost:8080/ambulance/by-hospital/${hospitalId}`, {
        headers: { 'Authorization': `Bearer ${jwt}` },
      });
      if (res.ok) {
        const data = await res.json();
        setHospitalAmbulances(data);
        setHospitalFetchError('');
      } else {
        const data = await res.json().catch(() => ({}));
        setHospitalFetchError(data.message || 'Failed to fetch ambulances for this hospital. No ambulances found or internal server error.');
      }
    } catch (err) {
      setHospitalFetchError('Network error. Please check your connection.');
    } finally {
      setHospitalFetchLoading(false);
    }
  };

  const handleFetchHistory = async () => {
    setHistoryError('');
    setHistory([]);
    setHistoryLoading(true);
    try {
      const jwt = localStorage.getItem('jwt');
      if (!jwt) {
        setHistoryError('Authentication required to fetch history.');
        setHistoryLoading(false);
        return;
      }
      const res = await fetch('http://localhost:8080/ambulance-driver/v1/get-history', {
        headers: { 'Authorization': `Bearer ${jwt}` },
      });
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      } else {
        const data = await res.json().catch(() => ({}));
        setHistoryError(data.message || 'Failed to fetch history. No history found or internal server error.');
      }
    } catch (err) {
      setHistoryError('Network error. Please check your connection.');
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleCompleteBooking = async (id) => {
    setCompleteLoadingId(id);
    setCompleteMessage('');
    try {
      const jwt = localStorage.getItem('jwt');
      if (!jwt) {
        setCompleteMessage('Authentication required to complete booking.');
        setCompleteLoadingId(null);
        return;
      }
      const res = await fetch('http://localhost:8080/ambulance-driver/v1/complete-booking', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${jwt}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setCompleteMessage('Booking marked as completed successfully.');
        await handleFetchHistory();
      } else {
        const data = await res.json().catch(() => ({}));
        setCompleteMessage(data.message || 'Failed to complete booking. Booking might already be completed or not found.');
      }
    } catch (err) {
      setCompleteMessage('Network error. Please check your connection.');
    } finally {
      setCompleteLoadingId(null);
    }
  };

  const filteredHistory = history
    .filter(item => !historyStatusFilter || item.status === historyStatusFilter)
    .sort((a, b) => historySortDesc
      ? new Date(b.requestedAt) - new Date(a.requestedAt)
      : new Date(a.requestedAt) - new Date(b.requestedAt)
    );

  const handleFetchAllDrivers = async () => {
    setAllDriversError('');
    setAllDriversLoading(true);
    try {
      const jwt = localStorage.getItem('jwt');
      if (!jwt) {
        setAllDriversError('Authentication required to fetch all drivers.');
        setAllDriversLoading(false);
        return;
      }
      const res = await fetch('http://localhost:8080/ambulance/all', {
        headers: { 'Authorization': `Bearer ${jwt}` },
      });
      if (res.ok) {
        const data = await res.json();
        setAllDrivers(data);
      } else {
        const data = await res.json().catch(() => ({}));
        setAllDriversError(data.message || 'Failed to fetch drivers. No drivers found or internal server error.');
      }
    } catch (err) {
      setAllDriversError('Network error. Please check your connection.');
    } finally {
      setAllDriversLoading(false);
    }
  };

  const fetchAmbulanceDriverProfile = async () => {
    setProfileLoading(true);
    setProfileError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/ambulance-driver/v1/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProfileData({
          name: data.name || 'Ambulance Driver Name',
          badge: data.badgeNumber || 'N/A',
          rank: data.rank || 'N/A',
          department: data.department || 'N/A',
          experience: data.experience || 'N/A',
          email: data.email || 'N/A',
          phone: data.phone || 'N/A'
        });
      } else {
        const errorData = await response.json();
        setProfileError(errorData.message || 'Failed to fetch profile data');
        toast.error('Failed to fetch profile data');
      }
    } catch (error) {
      console.error('Error fetching ambulance driver profile:', error);
      setProfileError('Failed to fetch profile data');
      toast.error('Failed to fetch profile data');
    } finally {
      setProfileLoading(false);
    }
  };

  const QuickActionCard = ({ title, description, icon, onClick, bgColorClass }) => (
    <motion.div
      onClick={onClick}
      className={`${bgColorClass} p-6 rounded-lg cursor-pointer flex items-center space-x-4 text-gray-800 relative overflow-hidden transition-all duration-200`}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      whileTap={{ scale: 0.98 }}
    >
      <div className="text-3xl relative z-10 text-gray-600">
        {icon}
      </div>
      <div className="relative z-10">
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm opacity-90">{description}</p>
      </div>
      <motion.div
        className="absolute inset-0 bg-gray-100 opacity-0 group-hover:opacity-70 transition-opacity duration-300 rounded-lg pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0 }}
        whileHover={{ opacity: 0.7 }}
      ></motion.div>
    </motion.div>
  );

  const StatCard = ({ title, value, subtitle, bgColorClass, icon }) => (
    <motion.div
      className={`${bgColorClass} p-6 rounded-lg shadow-md text-gray-800 relative overflow-hidden flex items-center justify-between`}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
    >
      <div className="relative z-10">
        <motion.div
          className="text-4xl text-blue-600 opacity-75"
          initial={{ rotate: 0 }}
          whileHover={{ rotate: 8 }}
          transition={{ duration: 0.2 }}
        >
          {icon}
        </motion.div>
      </div>
      <div className="text-right relative z-10">
        <h3 className="text-3xl font-bold">{value}</h3>
        <p className="text-sm opacity-90">{title}</p>
        {subtitle && <p className="text-xs opacity-80">{subtitle}</p>}
      </div>
      <motion.div
        className="absolute inset-0 bg-gray-100 opacity-0 group-hover:opacity-70 transition-opacity duration-300 rounded-lg pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0 }}
        whileHover={{ opacity: 0.7 }}
      ></motion.div>
    </motion.div>
  );


  const jwt = localStorage.getItem('jwt');
  const userInfo = decodeJWT(jwt);

  return (
    <div className="min-h-screen bg-gray-50 font-inter text-gray-800">
      {/* Google Fonts Preconnect and Import (Add this to your public/index.html or a global CSS file) */}
      {/* For demonstration, added directly here. In a real project, use <link> in HTML or @import in global CSS. */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
          .font-inter {
            font-family: 'Inter', sans-serif;
          }
        `}
      </style>

      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <ReactLogo />
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Ambulance Admin Dashboard</h1>
                <p className="text-gray-500">Emergency Medical Services Management</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Ambulance Administrator</p>
                <p className="text-xs text-gray-500">Last updated: {new Date().toLocaleTimeString()}</p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => navigate('/')}
                  className="text-gray-600 hover:text-gray-800 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  Home
                </button>
                <button
                  onClick={() => {
                    localStorage.removeItem('jwt');
                    navigate('/login');
                  }}
                  className="text-gray-600 hover:text-gray-800 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  Logout
                </button>
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold hover:bg-blue-600 transition">
                  <TruckIcon className="h-6 w-6" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Navigation Tabs */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', name: 'Overview', icon: <Bars3BottomLeftIcon className="h-5 w-5" /> },
              { id: 'drivers', name: 'Drivers', icon: <UserGroupIcon className="h-5 w-5" /> },
              { id: 'vehicles', name: 'Vehicles', icon: <TruckIcon className="h-5 w-5" /> },
              { id: 'emergencies', name: 'Emergencies', icon: <ExclamationCircleIcon className="h-5 w-5" /> },
              { id: 'rankings', name: 'Rankings', icon: <TrophyIcon className="h-5 w-5" /> },
              { id: 'profile', name: 'Profile', icon: <UserCircleIcon className="h-5 w-5" /> },
              { id: 'register', name: 'Register', icon: <PlusCircleIcon className="h-5 w-5" /> }
            ].map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 flex items-center group
                  ${activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-blue-500 hover:border-blue-300'
                  }`}
                initial="rest"
                whileHover="hover"
                animate={activeTab === tab.id ? "active" : "rest"}
              >
                <motion.span
                  className="mr-2 inline-block align-middle"
                  variants={navIconVariants}
                >
                  {tab.icon}
                </motion.span>
                {tab.name}
              </motion.button>
            ))}
          </nav>
        </div>
      </div>
      {/* Main Content */}
      <motion.div
        className="max-w-7xl mx-auto px-4 py-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {activeTab === 'overview' && (
          <motion.div className="space-y-10" variants={itemVariants}>
            {/* Quick Actions */}
            <div>
              <SectionHeader icon={<ClipboardDocumentCheckIcon />} title="Quick Actions" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <QuickActionCard
                  title="Register Driver"
                  description="Add a new ambulance driver to the system."
                  icon={<UserGroupIcon className="h-6 w-6" />}
                  onClick={() => setActiveTab('register')}
                  bgColorClass="bg-white"
                />
                <QuickActionCard
                  title="Update Location"
                  description="Manually update an ambulance's current location."
                  icon={<MapPinIcon className="h-6 w-6" />}
                  onClick={() => setActiveTab('vehicles')}
                  bgColorClass="bg-white"
                />
                <QuickActionCard
                  title="View Emergencies"
                  description="Monitor all active and resolved emergency calls."
                  icon={<ExclamationCircleIcon className="h-6 w-6" />}
                  onClick={() => setActiveTab('emergencies')}
                  bgColorClass="bg-white"
                />
                <QuickActionCard
                  title="Driver Rankings"
                  description="Analyze performance and efficiency of drivers."
                  icon={<TrophyIcon className="h-6 w-6" />}
                  onClick={() => setActiveTab('rankings')}
                  bgColorClass="bg-white"
                />
                <QuickActionCard
                  title="Profile Management"
                  description="Manage your ambulance service administrator profile."
                  icon={<UserCircleIcon className="h-6 w-6" />}
                  onClick={() => setActiveTab('profile')}
                  bgColorClass="bg-white"
                />
                 <QuickActionCard
                  title="Ambulance History"
                  description="View past requests and completed bookings."
                  icon={<CalendarDaysIcon className="h-6 w-6" />}
                  onClick={() => { setActiveTab('vehicles'); handleFetchHistory(); }}
                  bgColorClass="bg-white"
                />
              </div>
            </div>

            {/* Statistics */}
            <div>
              <SectionHeader icon={<CurrencyDollarIcon />} title="Dashboard Statistics" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statsLoading ? (
                  <motion.div className="col-span-4 text-center py-8 text-blue-600 font-semibold" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>Loading statistics...</motion.div>
                ) : statsError ? (
                  <motion.div className="col-span-4 text-center py-8 text-red-600 font-semibold" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{statsError}</motion.div>
                ) : dashboardStats ? (
                  <>
                    <StatCard
                      title="Total Ambulances"
                      value={dashboardStats.total_ambulances}
                      subtitle="Active ambulances"
                      bgColorClass="bg-white"
                      icon={<TruckIcon />}
                    />
                    <StatCard
                      title="Available Ambulances"
                      value={dashboardStats.available_ambulances}
                      subtitle="Ready for service"
                      bgColorClass="bg-white"
                      icon={<UserGroupIcon />}
                    />
                    <StatCard
                      title="Total Bookings"
                      value={dashboardStats.ambulance_bookings}
                      subtitle="Today's calls"
                      bgColorClass="bg-white"
                      icon={<ExclamationCircleIcon />}
                    />
                    <StatCard
                      title="Avg Completion Time"
                      value={`${dashboardStats.average_completion_time_minutes} min`}
                      subtitle="Emergency response"
                      bgColorClass="bg-white"
                      icon={<ClockIcon />}
                    />
                  </>
                ) : null}
              </div>
            </div>

            {/* Recent Emergencies */}
            <div>
              <SectionHeader icon={<ExclamationCircleIcon />} title="Recent Emergencies" />
              {emergenciesLoading ? (
                <motion.div className="text-center py-8 text-blue-600 font-semibold" variants={itemVariants}>Loading emergencies...</motion.div>
              ) : emergenciesError ? (
                <motion.div className="text-center py-8 text-red-600 font-semibold" variants={itemVariants}>{emergenciesError}</motion.div>
              ) : recentEmergencies.length === 0 ? (
                <motion.div className="text-center py-8 text-gray-500" variants={itemVariants}>No recent emergencies found.</motion.div>
              ) : (
                <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <motion.table className="min-w-full divide-y divide-gray-200" initial="hidden" animate="visible" variants={containerVariants}>
                      <motion.thead className="bg-gray-50" variants={itemVariants}>
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">ID</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Issue</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Created At</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Victim Phone</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Pickup Lat</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Pickup Lng</th>
                        </tr>
                      </motion.thead>
                      <motion.tbody className="bg-white divide-y divide-gray-200">
                        {recentEmergencies.map((em, index) => (
                          <motion.tr key={em.booking_id} className="hover:bg-gray-50" variants={itemVariants}>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-800">{em.booking_id}</td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-800">{em.issue_type}</td>
                            <td className="px-4 py-2 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${em.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{em.status}</span>
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-800">{new Date(em.created_at).toLocaleString()}</td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-800">{em.victim_phone_number}</td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-800">{em.pickup_latitude}</td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-800">{em.pickup_longitude}</td>
                          </motion.tr>
                        ))}
                      </motion.tbody>
                    </motion.table>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'drivers' && (
          <motion.div className="bg-white rounded-lg shadow-md p-8 border border-gray-200" variants={containerVariants} initial="hidden" animate="visible">
            <SectionHeader icon={<UserGroupIcon />} title="Ambulance Drivers" />
            <motion.div className="mb-6 flex flex-col md:flex-row md:items-center gap-4" variants={itemVariants}>
              <button
                type="button"
                onClick={handleFetchAllDrivers}
                disabled={allDriversLoading}
                className="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
              >
                {allDriversLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Fetching...
                  </>
                ) : (
                  <>
                    <MagnifyingGlassIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                    Get All Drivers
                  </>
                )}
              </button>
              {allDriversError && (
                <motion.div className="p-3 rounded-md bg-red-50 text-red-700 text-sm border border-red-200" variants={itemVariants}>{allDriversError}</motion.div>
              )}
            </motion.div>
            <div className="overflow-x-auto">
              <motion.table className="min-w-full divide-y divide-gray-200 border border-gray-300 rounded-lg" initial="hidden" animate="visible" variants={containerVariants}>
                <motion.thead className="bg-gray-50" variants={itemVariants}>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Driver</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">License</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Vehicle</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Phone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Latitude</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Longitude</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Last Updated</th>
                  </tr>
                </motion.thead>
                <motion.tbody className="bg-white divide-y divide-gray-200">
                  {allDriversLoading ? (
                    <motion.tr variants={itemVariants}>
                      <td colSpan="8" className="text-center py-4 text-blue-600">Loading drivers...</td>
                    </motion.tr>
                  ) : allDrivers.length === 0 ? (
                    <motion.tr variants={itemVariants}>
                      <td colSpan="8" className="text-center py-4 text-gray-500">No drivers found. Click "Get All Drivers" to fetch.</td>
                    </motion.tr>
                  ) : (
                    allDrivers.map((driver) => (
                      <motion.tr key={driver.id} className="hover:bg-gray-50" variants={itemVariants}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{driver.driverName || 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{driver.licenseNumber || 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{driver.vehicleRegNumber || 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${driver.status === 'AVAILABLE' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{driver.status}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{driver.driverPhone || 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{driver.latitude?.toFixed(4) || 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{driver.longitude?.toFixed(4) || 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{driver.lastUpdated ? new Date(driver.lastUpdated).toLocaleString() : 'N/A'}</td>
                      </motion.tr>
                    ))
                  )}
                </motion.tbody>
              </motion.table>
            </div>
          </motion.div>
        )}

        {activeTab === 'vehicles' && (
          <motion.div className="space-y-8" variants={containerVariants} initial="hidden" animate="visible">
            <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
              <SectionHeader icon={<TruckIcon />} title="Ambulance & Location Management" />

              {/* Fetch Location Section */}
              <motion.div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200" variants={itemVariants}>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Fetch Ambulance Location</h3>
                <div className="flex flex-col md:flex-row md:items-end gap-4">
                  <div className="flex-1">
                    <label htmlFor="ambulanceIdFetch" className="block text-sm font-medium text-gray-700 mb-2">Ambulance ID</label>
                    <input
                      id="ambulanceIdFetch"
                      name="ambulanceId"
                      value={locationForm.ambulanceId}
                      onChange={handleLocationChange}
                      onBlur={handleLocationBlur}
                      className={`w-full px-4 py-3 border ${locationFormErrors.ambulanceId ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-sm`}
                      placeholder="e.g., 123"
                    />
                     {locationFormErrors.ambulanceId && <p className="mt-1 text-sm text-red-600">{locationFormErrors.ambulanceId}</p>}
                  </div>
                  <button
                    type="button"
                    onClick={handleFetchLocation}
                    disabled={fetchLoading}
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
                  >
                    {fetchLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Fetching...
                      </>
                    ) : (
                      <>
                        <MagnifyingGlassIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                        Get Location
                      </>
                    )}
                  </button>
                </div>
                {fetchError && (
                  <motion.div className="mt-4 p-3 rounded-md bg-red-50 text-red-700 text-sm border border-red-200" role="alert" variants={itemVariants}>{fetchError}</motion.div>
                )}
                {fetchedLocation && (
                  <motion.div className="mt-4 p-4 rounded-md bg-blue-50 border border-blue-200 text-blue-900" variants={itemVariants}>
                    <h4 className="font-semibold text-lg mb-2">Ambulance Location Details:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                      <div><span className="font-medium">ID:</span> {fetchedLocation.id}</div>
                      <div><span className="font-medium">Reg Number:</span> {fetchedLocation.regNumber || 'N/A'}</div>
                      <div><span className="font-medium">Driver Name:</span> {fetchedLocation.driverName || 'N/A'}</div>
                      <div><span className="font-medium">Driver Phone:</span> {fetchedLocation.driverPhone || 'N/A'}</div>
                      <div><span className="font-medium">Status:</span> <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${fetchedLocation.status === 'AVAILABLE' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{fetchedLocation.status}</span></div>
                      <div><span className="font-medium">Latitude:</span> {fetchedLocation.latitude?.toFixed(6) || 'N/A'}</div>
                      <div><span className="font-medium">Longitude:</span> {fetchedLocation.longitude?.toFixed(6) || 'N/A'}</div>
                      <div><span className="font-medium">Last Updated:</span> {fetchedLocation.lastUpdated ? new Date(fetchedLocation.lastUpdated).toLocaleString() : 'N/A'}</div>
                    </div>
                  </motion.div>
                )}
              </motion.div>

              {/* Fetch by Hospital Section */}
              <motion.div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200" variants={itemVariants}>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Ambulances by Hospital</h3>
                <div className="flex flex-col md:flex-row md:items-end gap-4">
                  <div className="flex-1">
                    <label htmlFor="hospitalId" className="block text-sm font-medium text-gray-700 mb-2">Hospital ID</label>
                    <input
                      id="hospitalId"
                      name="hospitalId"
                      value={hospitalId}
                      onChange={e => setHospitalId(e.target.value)}
                      type="number"
                      min="1"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                      placeholder="e.g., 1"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleFetchByHospital}
                    disabled={hospitalFetchLoading}
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
                  >
                    {hospitalFetchLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Fetching...
                      </>
                    ) : (
                      <>
                        <BuildingOfficeIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                        Get by Hospital
                      </>
                    )}
                  </button>
                </div>
                {hospitalFetchError && (
                  <motion.div className="mt-4 p-3 rounded-md bg-red-50 text-red-700 text-sm border border-red-200" role="alert" variants={itemVariants}>{hospitalFetchError}</motion.div>
                )}
                {hospitalAmbulances.length > 0 && (
                  <motion.div className="mt-4 overflow-x-auto" variants={itemVariants}>
                    <table className="min-w-full divide-y divide-gray-200 border border-gray-300 rounded-lg">
                      <motion.thead className="bg-gray-100" variants={itemVariants}>
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">ID</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Reg Number</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Driver Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Latitude</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Longitude</th>
                        </tr>
                      </motion.thead>
                      <motion.tbody className="bg-white divide-y divide-gray-200">
                        {hospitalAmbulances.map((amb) => (
                          <motion.tr key={amb.id} className="hover:bg-gray-50" variants={itemVariants}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{amb.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{amb.regNumber}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{amb.driverName}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${amb.status === 'AVAILABLE' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{amb.status}</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{amb.latitude?.toFixed(6)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{amb.longitude?.toFixed(6)}</td>
                          </motion.tr>
                        ))}
                      </motion.tbody>
                    </table>
                  </motion.div>
                )}
              </motion.div>

              {/* Update Ambulance Location Form */}
              <motion.div className="p-6 bg-gray-50 rounded-lg border border-gray-200" variants={itemVariants}>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Update Ambulance Live Location</h3>
                <form onSubmit={handleLocationSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <motion.div variants={itemVariants}>
                      <label htmlFor="ambulanceIdUpdate" className="block text-sm font-medium text-gray-700 mb-2">Ambulance ID</label>
                      <input
                        id="ambulanceIdUpdate"
                        name="ambulanceId"
                        value={locationForm.ambulanceId}
                        onChange={handleLocationChange}
                        onBlur={handleLocationBlur}
                        required
                        className={`w-full px-4 py-3 border ${locationFormErrors.ambulanceId ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-sm`}
                        placeholder="Enter ambulance ID"
                      />
                      {locationFormErrors.ambulanceId && <p className="mt-1 text-sm text-red-600">{locationFormErrors.ambulanceId}</p>}
                    </motion.div>
                    <motion.div variants={itemVariants}>
                      <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                      <select
                        id="status"
                        name="status"
                        value={locationForm.status}
                        onChange={handleLocationChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-sm bg-white"
                      >
                        <option value="AVAILABLE">Available</option>
                        <option value="ON_CALL">On Call</option>
                        <option value="MAINTENANCE">Maintenance</option>
                        <option value="OFFLINE">Offline</option>
                      </select>
                    </motion.div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <motion.div variants={itemVariants}>
                      <label htmlFor="latitude" className="block text-sm font-medium text-gray-700 mb-2">Latitude</label>
                      <input
                        id="latitude"
                        name="latitude"
                        value={locationForm.latitude}
                        onChange={handleLocationChange}
                        onBlur={handleLocationBlur}
                        type="number"
                        step="any"
                        required
                        className={`w-full px-4 py-3 border ${locationFormErrors.latitude ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-sm`}
                        placeholder="e.g., 28.7041"
                      />
                      {locationFormErrors.latitude && <p className="mt-1 text-sm text-red-600">{locationFormErrors.latitude}</p>}
                    </motion.div>
                    <motion.div variants={itemVariants}>
                      <label htmlFor="longitude" className="block text-sm font-medium text-gray-700 mb-2">Longitude</label>
                      <input
                        id="longitude"
                        name="longitude"
                        value={locationForm.longitude}
                        onChange={handleLocationChange}
                        onBlur={handleLocationBlur}
                        type="number"
                        step="any"
                        required
                        className={`w-full px-4 py-3 border ${locationFormErrors.longitude ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-sm`}
                        placeholder="e.g., 77.1025"
                      />
                      {locationFormErrors.longitude && <p className="mt-1 text-sm text-red-600">{locationFormErrors.longitude}</p>}
                    </motion.div>
                  </div>
                  <motion.button
                    type="submit"
                    disabled={loading}
                    className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
                    variants={itemVariants}
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Updating...
                      </>
                    ) : (
                      <>
                        <MapPinIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                        Update Location
                      </>
                    )}
                  </motion.button>
                  {message && (
                    <motion.div
                      className={`mt-4 p-3 rounded-md text-sm border ${
                        message.includes('success')
                          ? 'bg-green-50 text-green-700 border-green-200'
                          : 'bg-red-50 text-red-700 border-red-200'
                      }`}
                      role="alert"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {message}
                    </motion.div>
                  )}
                </form>
              </motion.div>

              {/* Driver Request History Section */}
              <motion.div className="p-6 bg-gray-50 rounded-lg border border-gray-200" variants={itemVariants}>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Driver Request History</h3>
                <div className="flex flex-col md:flex-row md:items-end gap-4 mb-4">
                  <button
                    type="button"
                    onClick={handleFetchHistory}
                    disabled={historyLoading}
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
                  >
                    {historyLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Fetching...
                      </>
                    ) : (
                      <>
                        <CalendarDaysIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                        Get Request History
                      </>
                    )}
                  </button>
                  <div className="flex items-center gap-2">
                    <label htmlFor="historyStatusFilter" className="text-sm font-medium text-gray-700">Status:</label>
                    <select
                      id="historyStatusFilter"
                      value={historyStatusFilter}
                      onChange={e => setHistoryStatusFilter(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                    >
                      <option value="">All</option>
                      <option value="PENDING">Pending</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <label htmlFor="historySort" className="text-sm font-medium text-gray-700">Sort:</label>
                    <button
                      id="historySort"
                      type="button"
                      onClick={() => setHistorySortDesc(v => !v)}
                      className="px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                    >
                      {historySortDesc ? 'Newest First' : 'Oldest First'}
                    </button>
                  </div>
                </div>
                {historyError && (
                  <motion.div className="mt-4 p-3 rounded-md bg-red-50 text-red-700 text-sm border border-red-200" role="alert" variants={itemVariants}>{historyError}</motion.div>
                )}
                {filteredHistory.length > 0 && (
                  <motion.div className="mt-4" variants={itemVariants}>
                    <div className="mb-4 font-semibold text-gray-700">Total Requests: {filteredHistory.length}</div>
                    {completeMessage && (
                      <motion.div
                        className={`mb-4 p-3 rounded-md text-sm border ${completeMessage.includes('completed') ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}
                        role="alert"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        {completeMessage}
                      </motion.div>
                    )}
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 border border-gray-300 rounded-lg">
                        <motion.thead className="bg-gray-100" variants={itemVariants}>
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">User ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Requester Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Requested At</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Location</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Action</th>
                          </tr>
                        </motion.thead>
                        <motion.tbody className="bg-white divide-y divide-gray-200">
                          {filteredHistory.map((item) => (
                            <motion.tr key={item.id} className="hover:bg-gray-50" variants={itemVariants}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{item.id}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{item.userId}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{item.emailOfRequester}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{new Date(item.requestedAt).toLocaleString()}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{item.latitude?.toFixed(6)}, {item.longitude?.toFixed(6)}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${item.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : item.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>{item.status}</span>
                              </td>
                             <td className="px-6 py-4 whitespace-nowrap">
                               {item.status === 'PENDING' && (
                                 <button
                                   type="button"
                                   onClick={() => handleCompleteBooking(item.id)}
                                   disabled={completeLoadingId === item.id}
                                   className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 transition-colors"
                                 >
                                   {completeLoadingId === item.id ? (
                                    <>
                                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                      </svg>
                                      Completing...
                                    </>
                                   ) : (
                                     'Complete'
                                   )}
                                 </button>
                               )}
                             </td>
                            </motion.tr>
                          ))}
                        </motion.tbody>
                      </table>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}

        {activeTab === 'emergencies' && (
          <motion.div className="bg-white rounded-lg shadow-md p-8 border border-gray-200" variants={containerVariants} initial="hidden" animate="visible">
            <SectionHeader icon={<ExclamationCircleIcon />} title="Recent Emergencies" />
            {emergenciesLoading ? (
              <motion.div className="text-center py-8 text-blue-600 font-semibold" variants={itemVariants}>Loading emergencies...</motion.div>
            ) : emergenciesError ? (
              <motion.div className="text-center py-8 text-red-600 font-semibold" variants={itemVariants}>{emergenciesError}</motion.div>
            ) : recentEmergencies.length === 0 ? (
              <motion.div className="text-center py-8 text-gray-500" variants={itemVariants}>No recent emergencies found.</motion.div>
            ) : (
              <div className="overflow-x-auto">
                <motion.table className="min-w-full divide-y divide-gray-200 border border-gray-300 rounded-lg" initial="hidden" animate="visible" variants={containerVariants}>
                  <motion.thead className="bg-gray-50" variants={itemVariants}>
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">ID</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Issue</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Created At</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Victim Phone</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Pickup Lat</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Pickup Lng</th>
                    </tr>
                  </motion.thead>
                  <motion.tbody className="bg-white divide-y divide-gray-200">
                    {recentEmergencies.map((em) => (
                      <motion.tr key={em.booking_id} className="hover:bg-gray-50" variants={itemVariants}>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-800">{em.booking_id}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-800">{em.issue_type}</td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${em.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{em.status}</span>
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-800">{new Date(em.created_at).toLocaleString()}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-800">{em.victim_phone_number}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-800">{em.pickup_latitude}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-800">{em.pickup_longitude}</td>
                      </motion.tr>
                    ))}
                  </motion.tbody>
                </motion.table>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'rankings' && (
          <motion.div className="bg-white rounded-lg shadow-md p-8 border border-gray-200" variants={containerVariants} initial="hidden" animate="visible">
            <SectionHeader icon={<TrophyIcon />} title="Ambulance Rankings" />
            {ambulancesLoading ? (
              <motion.div className="text-center py-8 text-blue-600 font-semibold" variants={itemVariants}>Loading rankings...</motion.div>
            ) : ambulancesError ? (
              <motion.div className="text-center py-8 text-red-600 font-semibold" variants={itemVariants}>{ambulancesError}</motion.div>
            ) : (
              <div className="overflow-x-auto">
                <motion.table className="min-w-full divide-y divide-gray-200 border border-gray-300 rounded-lg" initial="hidden" animate="visible" variants={containerVariants}>
                  <motion.thead className="bg-gray-50" variants={itemVariants}>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">#</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Reg Number</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Driver Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Driver Phone</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Latitude</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Longitude</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Last Updated</th>
                    </tr>
                  </motion.thead>
                  <motion.tbody className="bg-white divide-y divide-gray-200">
                    {ambulances.length === 0 ? (
                      <motion.tr variants={itemVariants}>
                        <td colSpan={8} className="text-center py-8 text-gray-500">No ambulances found.</td>
                      </motion.tr>
                    ) : ambulances.map((amb, idx) => (
                      <motion.tr key={amb.id} className="hover:bg-gray-50 transition" variants={itemVariants}>
                        <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200 text-sm text-gray-800">{idx + 1}</td>
                        <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200 text-sm text-gray-900">{amb.regNumber}</td>
                        <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200 text-sm text-gray-900">{amb.driverName}</td>
                        <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200 text-sm text-gray-900">{amb.driverPhone}</td>
                        <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full
                            ${amb.status === 'AVAILABLE' ? 'bg-green-100 text-green-800' :
                              amb.status === 'ON_CALL' ? 'bg-yellow-100 text-yellow-800' :
                              amb.status === 'MAINTENANCE' ? 'bg-purple-100 text-purple-800' :
                              'bg-gray-100 text-gray-800'}
                          `}>{amb.status}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200 text-sm text-gray-700">{Number(amb.latitude).toFixed(4)}</td>
                        <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200 text-sm text-gray-700">{Number(amb.longitude).toFixed(4)}</td>
                        <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200 text-sm text-gray-700">{new Date(amb.lastUpdated).toLocaleString()}</td>
                      </motion.tr>
                    ))}
                  </motion.tbody>
                </motion.table>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'profile' && (
          <motion.div className="max-w-4xl mx-auto" variants={containerVariants} initial="hidden" animate="visible">
            <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <SectionHeader icon={<UserCircleIcon />} title="Ambulance Service Profile" />
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors p-2 rounded-md hover:bg-gray-100">Edit Profile</button>
              </div>

              {profileLoading && (
                <motion.div className="text-center py-8 text-blue-600 font-semibold" variants={itemVariants}>
                  Loading profile data...
                </motion.div>
              )}

              {profileError && (
                <motion.div className="text-center py-8 text-red-600 font-semibold" variants={itemVariants}>
                  {profileError}
                </motion.div>
              )}

              {!profileLoading && !profileError && (

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Service Information */}
                <motion.div variants={itemVariants}>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-md">
                        <TruckIcon className="h-8 w-8" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{profileData.name}</h4>
                        <p className="text-sm text-gray-600">Badge: {profileData.badge}</p>
                      </div>
                    </div>
                    <div className="space-y-3 border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">User ID:</span>
                        <span className="font-medium text-gray-800">{userInfo.userId || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">Email:</span>
                        <span className="font-medium text-gray-800">{profileData.email || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-gray-600">Role:</span>
                        <span className="font-medium text-gray-800">{userInfo.role || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between py-2 border-t border-gray-100 mt-4">
                        <span className="text-gray-600">Rank:</span>
                        <span className="font-medium text-gray-800">{profileData.rank || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-gray-600">Department:</span>
                        <span className="font-medium text-gray-800">{profileData.department || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-gray-600">Experience:</span>
                        <span className="font-medium text-gray-800">{profileData.experience || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-gray-600">Phone:</span>
                        <span className="font-medium text-gray-800">{profileData.phone || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Performance Metrics */}
                <motion.div variants={itemVariants}>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Statistics</h3>
                  <div className="space-y-4">
                    <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-blue-700 font-medium">Emergencies Responded</span>
                        <span className="text-2xl font-bold text-blue-700">156</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">This month</p>
                    </div>
                    <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-green-700 font-medium">Response Time</span>
                        <span className="text-2xl font-bold text-green-700">4.2 min</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Average</p>
                    </div>
                    <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-yellow-700 font-medium">Patient Satisfaction</span>
                        <span className="text-2xl font-bold text-yellow-700">4.8/5</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Average rating</p>
                    </div>
                    <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-purple-700 font-medium">Service Hours</span>
                        <span className="text-2xl font-bold text-purple-700">1,890</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">This year</p>
                    </div>
                  </div>
                </motion.div>
              </div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'register' && (
          <motion.div className="max-w-2xl mx-auto" variants={containerVariants} initial="hidden" animate="visible">
            <div className="bg-white p-8 rounded-lg shadow-xl border border-gray-200">
              <div className="text-center mb-8">
                <SectionHeader icon={<PlusCircleIcon />} title="Register Admin" />
                <p className="text-gray-600">Add a new admin user to the emergency response system</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <motion.div variants={itemVariants}>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <div className="relative">
                      <input
                        id="fullName"
                        name="fullName"
                        value={form.fullName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                        className={`w-full px-4 py-3 pl-10 border ${formErrors.fullName ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-sm`}
                        placeholder="Enter full name"
                        maxLength="100"
                      />
                      <UserCircleIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                    {formErrors.fullName && <p className="mt-1 text-sm text-red-600">{formErrors.fullName}</p>}
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <div className="relative">
                      <input
                        id="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        type="email"
                        required
                        className={`w-full px-4 py-3 pl-10 border ${formErrors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-sm`}
                        placeholder="Enter email address"
                        maxLength="100"
                      />
                      <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                    {formErrors.email && <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>}
                  </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <motion.div variants={itemVariants}>
                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <div className="relative">
                      <input
                        id="phoneNumber"
                        name="phoneNumber"
                        value={form.phoneNumber}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                        className={`w-full px-4 py-3 pl-10 border ${formErrors.phoneNumber ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-sm`}
                        placeholder="e.g., 9876543210"
                        maxLength="10"
                      />
                      <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                    {formErrors.phoneNumber && <p className="mt-1 text-sm text-red-600">{formErrors.phoneNumber}</p>}
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <label htmlFor="governmentId" className="block text-sm font-medium text-gray-700 mb-2">Government ID (PAN)</label>
                    <div className="relative">
                      <input
                        id="governmentId"
                        name="governmentId"
                        value={form.governmentId}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                        className={`w-full px-4 py-3 pl-10 border ${formErrors.governmentId ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-sm`}
                        placeholder="e.g., ABCDE1234F"
                        maxLength="10"
                      />
                      <IdentificationIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                    {formErrors.governmentId && <p className="mt-1 text-sm text-red-600">{formErrors.governmentId}</p>}
                  </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <motion.div variants={itemVariants}>
                    <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700 mb-2">License Number</label>
                    <div className="relative">
                      <input
                        id="licenseNumber"
                        name="licenseNumber"
                        value={form.licenseNumber}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                        className={`w-full px-4 py-3 pl-10 border ${formErrors.licenseNumber ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-sm`}
                        placeholder="e.g., MH-FIRE-0234"
                        maxLength="20"
                      />
                      <IdentificationIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                    {formErrors.licenseNumber && <p className="mt-1 text-sm text-red-600">{formErrors.licenseNumber}</p>}
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <label htmlFor="vehicleRegNumber" className="block text-sm font-medium text-gray-700 mb-2">Vehicle Registration</label>
                    <div className="relative">
                      <input
                        id="vehicleRegNumber"
                        name="vehicleRegNumber"
                        value={form.vehicleRegNumber}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                        className={`w-full px-4 py-3 pl-10 border ${formErrors.vehicleRegNumber ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-sm`}
                        placeholder="e.g., MH15BA3254"
                        maxLength="10"
                      />
                      <TruckIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                    {formErrors.vehicleRegNumber && <p className="mt-1 text-sm text-red-600">{formErrors.vehicleRegNumber}</p>}
                  </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <motion.div variants={itemVariants}>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                    <div className="relative">
                      <input
                        id="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        type="password"
                        required
                        className={`w-full px-4 py-3 pl-10 border ${formErrors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-sm`}
                        placeholder="Enter password"
                        minLength="6"
                      />
                      <KeyIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                    {formErrors.password && <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>}
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <label htmlFor="fireStationId" className="block text-sm font-medium text-gray-700 mb-2">Fire Station ID</label>
                    <div className="relative">
                      <input
                        id="fireStationId"
                        name="fireStationId"
                        value={form.fireStationId}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        type="number"
                        required
                        className={`w-full px-4 py-3 pl-10 border ${formErrors.fireStationId ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-sm`}
                        placeholder="Enter fire station ID"
                        min="1"
                      />
                      <BuildingOfficeIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                    {formErrors.fireStationId && <p className="mt-1 text-sm text-red-600">{formErrors.fireStationId}</p>}
                  </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <motion.div variants={itemVariants}>
                    <label htmlFor="securityQuestion" className="block text-sm font-medium text-gray-700 mb-2">Security Question</label>
                    <div className="relative">
                      <select
                        id="securityQuestion"
                        name="securityQuestion"
                        value={form.securityQuestion}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 pl-10 border ${formErrors.securityQuestion ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-sm`}
                      >
                        <option value="PET_NAME">What is your pet's name?</option>
                        <option value="BIRTH_CITY">In which city were you born?</option>
                        <option value="FAVORITE_TEACHER">Who was your favorite teacher?</option>
                        <option value="MOTHER_MAIDEN_NAME">What is your mother's maiden name?</option>
                      </select>
                      <KeyIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <label htmlFor="securityAnswer" className="block text-sm font-medium text-gray-700 mb-2">Security Answer</label>
                    <div className="relative">
                      <input
                        id="securityAnswer"
                        name="securityAnswer"
                        value={form.securityAnswer}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                        className={`w-full px-4 py-3 pl-10 border ${formErrors.securityAnswer ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-sm`}
                        placeholder="Enter security answer"
                      />
                      <KeyIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                    {formErrors.securityAnswer && <p className="mt-1 text-sm text-red-600">{formErrors.securityAnswer}</p>}
                  </motion.div>
                </div>

                <motion.button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
                  variants={itemVariants}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Registering...
                    </>
                  ) : (
                    <>
                      <PlusCircleIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                      Register Admin
                    </>
                  )}
                </motion.button>

                {message && (
                  <motion.div
                    className={`mt-4 p-3 rounded-md text-sm border ${
                      message.includes('success')
                        ? 'bg-green-50 text-green-700 border-green-200'
                        : 'bg-red-50 text-red-700 border-red-200'
                    }`}
                    role="alert"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {message}
                  </motion.div>
                )}
              </form>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}