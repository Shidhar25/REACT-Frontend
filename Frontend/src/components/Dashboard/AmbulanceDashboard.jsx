import { useState, useEffect, useRef } from 'react';

import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { CheckCircleIcon } from '@heroicons/react/24/outline';
import { AnimatePresence} from "framer-motion";

import {
  HomeIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/solid';

import {
  UserIcon,
  GlobeAltIcon,
  UserGroupIcon,
  TruckIcon,
  TrophyIcon,
  ExclamationCircleIcon,
  UserCircleIcon,
  Bars3BottomLeftIcon,
  PlusCircleIcon,
  MapPinIcon,
  ClockIcon,
  IdentificationIcon,
  BuildingOfficeIcon,
  EnvelopeIcon,
  PhoneIcon,
  KeyIcon,
  CalendarDaysIcon,
  CurrencyDollarIcon,
  MagnifyingGlassIcon,
  ClipboardDocumentCheckIcon
} from '@heroicons/react/24/outline';

import { User, Phone, Mail, Fingerprint, IdCard } from 'lucide-react';
import { motion } from 'framer-motion';
import reactLogo from './../../assets/react-logo.png';
import AmbulanceAdmin from './../../assets/AmbulanceAdmin.avif';
import { toast } from 'react-toastify';

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
const InfoLine = ({ label, value }) => (
  <div>
    <span className="font-medium">{label}:</span>{' '}
    <span className="text-gray-700">{value}</span>
  </div>
);

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
    hospitalID: '',
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
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [selectedDriverLoading, setSelectedDriverLoading] = useState(false);
  const [selectedDriverError, setSelectedDriverError] = useState('');
  const [emergencyAddresses, setEmergencyAddresses] = useState({});
  const [hoveredCoords, setHoveredCoords] = useState(null);
  const [hoveredEmergencyId, setHoveredEmergencyId] = useState(null);
const hoverTimeout = useRef(null);
  const [profileData, setProfileData] = useState({
  id: '',
  fullName: '',
  email: '',
  phoneNumber: '',
  governmentId: ''
});
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState(null);
  const [resolvedAddress, setResolvedAddress] = useState('');


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
  hospitalID: '',
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
  const licenseRegex = /^[A-Z]{2}-[A-Z]+-\d{4}$/i; // Format: STATE-TYPE-NUMBER (e.g., MH-AMBU-0234)
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
  if (activeTab === 'drivers') {
    handleFetchAllDrivers();
  }
}, [activeTab]);

useEffect(() => {
  const controller = new AbortController();
  const fetchAddresses = async () => {
    const addressMap = {};
    await Promise.all(
      recentEmergencies.map(async (em) => {
        const key = em.booking_id;
        try {
          const address = await getAddressFromCoords(em.pickup_latitude, em.pickup_longitude);
          addressMap[key] = address;
        } catch (err) {
          addressMap[key] = 'Unable to resolve';
        }
      })
    );
    setEmergencyAddresses(addressMap);
  };

  if (recentEmergencies.length > 0) {
    const timeout = setTimeout(fetchAddresses, 500); // debounce by 500ms
    return () => clearTimeout(timeout);
  }
}, [recentEmergencies]);


  useEffect(() => {
    if (activeTab === 'drivers' ) {
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

  const [profileName, setProfileName] = useState(''); // Add this state

  useEffect(() => {
    // Fetch profile name from new endpoint
    const jwt = localStorage.getItem('jwt');
    if (!jwt) return;
    fetch('http://localhost:8080/api/user/me', {
      headers: { 'Authorization': `Bearer ${jwt}` }
    })
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => setProfileName(data.fullName))
      .catch(() => setProfileName('A'));
  }, []);


  const ProfileItem = ({ icon, label, value }) => (
  <div className="flex items-center justify-between pt-2">
    <div className="flex items-center gap-2 text-gray-500">
      {icon}
      <dt className="font-medium">{label}</dt>
    </div>
    <dd className="text-gray-900 font-semibold">{value || 'N/A'}</dd>
  </div>
);


  // Fetch profile data when profile tab is active
  useEffect(() => {
      fetchAdminProfile();
    
  }, []);

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
        else if (!licenseRegex.test(value)) error = 'Enter valid License (e.g., MH-AMBU-0234).';
        break;
      case 'vehicleRegNumber':
        if (!value.trim()) error = 'Vehicle Registration is required.';
        else if (!vehicleRegRegex.test(value)) error = 'Enter valid Vehicle Reg (e.g., MH15BA3254).';
        break;
      case 'hospitalID':
        if (!value) error = 'hospital Station ID is required.'; // Allow 0 for empty field, validate onBlur/submit
        else if (isNaN(Number(value)) || Number(value) <= 0) error = 'hospital Station ID must be a positive number.';
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

  // Function to fetch driver details
  const handleDriverCardClick = async (driverId) => {
    setSelectedDriverLoading(true);
    setSelectedDriverError('');
    setSelectedDriver(null);
    try {
      const jwt = localStorage.getItem('jwt');
      const res = await fetch(`http://localhost:8080/ambulance/location/${driverId}`, {
        headers: { 'Authorization': `Bearer ${jwt}` },
      });
      if (res.ok) {
        const data = await res.json();
        setSelectedDriver(data);
      } else {
        const data = await res.json().catch(() => ({}));
        setSelectedDriverError(data.message || 'Failed to fetch driver details.');
      }
    } catch (err) {
      setSelectedDriverError('Network error. Please check your connection.');
    } finally {
      setSelectedDriverLoading(false);
    }
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
      if (key !== 'hospitalID' && key !== 'securityQuestion' && !form[key].trim()) { // Check for empty strings for text fields
          setFormErrors(prev => ({ ...prev, [key]: `${key.replace(/([A-Z])/g, ' $1').trim()} is required.` }));
          isValid = false;
      } else if (key === 'hospitalID' && (isNaN(Number(form[key])) || Number(form[key]) <= 0)) {
          setFormErrors(prev => ({ ...prev, [key]: 'Hospital ID must be a positive number.' }));
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
      const body = { ...form, hospitalID :Number(form.hospitalID) };
      const res = await fetch('http://localhost:8080/auth/register/ambulance-driver', {
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

  const fetchAdminProfile = async () => {
    setProfileLoading(true);
    setProfileError(null);
    try {
      const token = localStorage.getItem('jwt');
      const response = await fetch('http://localhost:8080/api/user/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setProfileData({
        id: data.id || 'N/A',
        fullName: data.fullName || 'N/A',
        email: data.email || 'N/A',
        phoneNumber: data.phoneNumber || 'N/A',
        governmentId: data.governmentId || 'N/A',
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
    <div className="min-h-screen bg-[#E8E6E0] font-inter text-gray-800">
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

      <div className=" border-b border-gray-200">
        {/* Header Top Bar */}
        <div className=" max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          {/* Left - Logo */}
          <div className=" flex items-center gap-4">
            <img
              src={reactLogo}
              alt="Logo"
              className="h-14 w-14 object-contain rounded-xl bg-white p-2 shadow-sm"
            />
            <div>
              <h1 className="text-xl font-semibold text-gray-800">Ambulance Admin Dashboard</h1>
            </div>
          </div>

          {/* Right - User Info & Actions */}
          <div className="flex items-center gap-6">
            {/* User Info */}
            <div className="text-right">
              <p className="text-sm text-gray-600">Wecome {profileData.fullName}</p>
              <p className="text-xs text-gray-400">Updated: {new Date().toLocaleTimeString()}</p>
            </div>

            {/* Profile Image */}
            <img
              src={AmbulanceAdmin}
              alt="Admin"
              className="h-10 w-10 rounded-full object-cover border-2 border-white shadow"
            />

            {/* Icon Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/')}
                title="Home"
                className="text-gray-600 hover:text-green-600 transition"
              >
                <HomeIcon className="h-6 w-6" />
              </button>
              <button
                onClick={() => {
                  localStorage.removeItem('jwt');
                  navigate('/login');
                }}
                title="Logout"
                className="text-red-600 hover:text-red-800 transition"
              >
                <ArrowRightOnRectangleIcon className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navbar - Detached capsule strip */}
      <div className="w-full flex justify-center my-6">
        <nav className="bg-[#f9f9f7] border border-gray-200 rounded-full shadow-md px-4 py-2 flex space-x-4 overflow-x-auto max-w-5xl">
          {[
            { id: 'overview', name: 'Overview', icon: <Bars3BottomLeftIcon className="h-5 w-5" /> },
            { id: 'drivers', name: 'Drivers', icon: <UserGroupIcon className="h-5 w-5" /> },
            { id: 'vehicles', name: 'Vehicles', icon: <TruckIcon className="h-5 w-5" /> },
            { id: 'emergencies', name: 'Emergencies', icon: <ExclamationCircleIcon className="h-5 w-5" /> },
            { id: 'profile', name: 'Profile', icon: <UserCircleIcon className="h-5 w-5" /> },
            { id: 'register', name: 'Register', icon: <PlusCircleIcon className="h-5 w-5" /> },
          ].map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all
                ${activeTab === tab.id
                  ? 'bg-green-100 text-green-700 border-green-200'
                  : 'text-gray-600 border-transparent hover:bg-gray-100 hover:text-green-600'}`}
            >
              {tab.icon}
              {tab.name}
            </motion.button>
          ))}
        </nav>
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

          
          {/* 🚑 Dashboard Statistics */}
            <div className="mt-10">
              <SectionHeader icon={<CurrencyDollarIcon className="text-primary" />} title="Dashboard Statistics" />

              {statsLoading ? (
                <motion.div
                  className="text-center py-6 text-blue-600 font-medium"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  Loading statistics...
                </motion.div>
              ) : statsError ? (
                <motion.div
                  className="text-center py-6 text-red-600 font-medium"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {statsError}
                </motion.div>
              ) : dashboardStats ? (
                <>
                  {/* 📦 Stats Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                      title="Total Ambulances"
                      value={dashboardStats.total_ambulances}
                      subtitle="Active fleet"
                      icon={<TruckIcon className="h-6 w-6 text-primary" />}
                      bgColorClass="bg-gradient-to-tr from-green-50 to-white"
                    />
                    <StatCard
                      title="Available"
                      value={dashboardStats.available_ambulances}
                      subtitle="Ready now"
                      icon={<UserGroupIcon className="h-6 w-6 text-green-600" />}
                      bgColorClass="bg-gradient-to-tr from-emerald-50 to-white"
                    />
                    <StatCard
                      title="Total Bookings"
                      value={dashboardStats.ambulance_bookings}
                      subtitle="Today"
                      icon={<ExclamationCircleIcon className="h-6 w-6 text-red-500" />}
                      bgColorClass="bg-gradient-to-tr from-red-50 to-white"
                    />
                    <StatCard
                      title="Avg Time"
                      value={`${dashboardStats.average_completion_time_minutes} min`}
                      subtitle="Completion"
                      icon={<ClockIcon className="h-6 w-6 text-gray-700" />}
                      bgColorClass="bg-gradient-to-tr from-gray-100 to-white"
                    />
                  </div>
                </>
              ) : null}
            </div>


            {/* Recent Emergencies */}
              <div className="mt-12 space-y-10">
                <SectionHeader
                  icon={<ExclamationCircleIcon className="h-6 w-6 text-primary" />}
                  title="Recent Emergencies"
                />

                {emergenciesLoading ? (
                  <motion.div className="text-center py-6 text-primary font-medium" variants={itemVariants}>
                    Loading emergencies...
                  </motion.div>
                ) : emergenciesError ? (
                  <motion.div className="text-center py-6 text-red-600 font-medium" variants={itemVariants}>
                    {emergenciesError}
                  </motion.div>
                ) : recentEmergencies.length === 0 ? (
                  <motion.div className="text-center py-6 text-gray-400" variants={itemVariants}>
                    No recent emergencies found.
                  </motion.div>
                ) : (
                  <>
                    {/* 🟡 Pending Emergencies */}
                    <div>
                      <h3 className="text-lg font-semibold text-yellow-700 mb-3 flex items-center gap-2">
                        <ExclamationCircleIcon className="h-5 w-5" />
                        Pending Emergencies
                      </h3>
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {recentEmergencies
                          .filter((em) => em.status !== 'COMPLETED')
                          .map((em) => (
                            <motion.div
                              key={em.booking_id}
                              className="bg-white border border-yellow-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition"
                              variants={itemVariants}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-semibold text-gray-700">ID: {em.booking_id}</span>
                                <span className="text-xs font-medium px-2 py-1 rounded-full bg-yellow-100 text-yellow-800">
                                  {em.status}
                                </span>
                              </div>
                              <div className="text-sm text-gray-600 mb-1">
                                <span className="font-medium text-gray-800">Issue:</span> {em.issue_type}
                              </div>
                              <div className="text-sm text-gray-600 mb-1">
                                <span className="font-medium text-gray-800">Victim Phone:</span>{' '}
                                {em.victim_phone_number}
                              </div>
                              <div className="text-sm text-gray-600 mb-1">
                                <span className="font-medium text-gray-800">Pickup Location:</span>{' '}
                                {em.pickup_latitude}, {em.pickup_longitude}
                              </div>
                              <div className="text-sm text-gray-500 mt-2">
                                <ClockIcon className="inline h-4 w-4 mr-1 text-gray-400" />
                                {new Date(em.created_at).toLocaleString()}
                              </div>
                            </motion.div>
                          ))}
                      </div>
                    </div>

                    {/* ✅ Completed Emergencies */}
                    <div>
                      <h3 className="text-lg font-semibold text-green-700 mb-3 flex items-center gap-2">
                        <CheckCircleIcon className="h-5 w-5" />
                        Completed Emergencies
                      </h3>
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {recentEmergencies
                          .filter((em) => em.status === 'COMPLETED')
                          .map((em) => (
                            <motion.div
                              key={em.booking_id}
                              className="bg-white border border-green-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition"
                              variants={itemVariants}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-semibold text-gray-700">ID: {em.booking_id}</span>
                                <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-700">
                                  {em.status}
                                </span>
                              </div>
                              <div className="text-sm text-gray-600 mb-1">
                                <span className="font-medium text-gray-800">Issue:</span> {em.issue_type}
                              </div>
                              <div className="text-sm text-gray-600 mb-1">
                                <span className="font-medium text-gray-800">Victim Phone:</span>{' '}
                                {em.victim_phone_number}
                              </div>
                              <div className="text-sm text-gray-600 mb-1">
                                <span className="font-medium text-gray-800">Pickup Location:</span>{' '}
                                {em.pickup_latitude}, {em.pickup_longitude}
                              </div>
                              <div className="text-sm text-gray-500 mt-2">
                                <ClockIcon className="inline h-4 w-4 mr-1 text-gray-400" />
                                {new Date(em.created_at).toLocaleString()}
                              </div>
                            </motion.div>
                          ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
          </motion.div>
        )}

        {/* Ambulance Drivers Section */}
        {activeTab === 'drivers' && (
          <motion.div
            className="bg-white rounded-xl shadow-md p-6 border border-gray-200"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <SectionHeader icon={<UserGroupIcon />} title="Ambulance Drivers" />

            {allDriversError && (
              <motion.div className="mb-4 p-3 rounded-md bg-red-50 text-red-700 text-sm border border-red-200" variants={itemVariants}>
                {allDriversError}
              </motion.div>
            )}

            {allDriversLoading ? (
              <motion.div className="text-center py-4 text-blue-600 font-medium" variants={itemVariants}>
                Loading drivers...
              </motion.div>
            ) : allDrivers.length === 0 ? (
              <motion.div className="text-center py-4 text-gray-500" variants={itemVariants}>
                No drivers found.
              </motion.div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-6">
                {allDrivers.map((driver) => (
                  <motion.div
                    key={driver.id}
                    className="bg-gray-50 border border-gray-200 rounded-xl shadow hover:shadow-md transition-all duration-200 p-5 flex flex-col gap-3 cursor-pointer"
                    variants={itemVariants}
                    onClick={() => handleDriverCardClick(driver.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-lg uppercase">
                          {driver.driverName ? driver.driverName[0] : 'D'}
                        </div>
                        <div>
                          <div className="text-md font-semibold text-gray-800">{driver.driverName || 'Unnamed'}</div>
                          <div className="text-sm text-gray-500">{driver.regNumber || 'No Vehicle Info'}</div>
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full font-semibold ${driver.status === 'AVAILABLE' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-800'}`}>
                        {driver.status}
                      </span>
                    </div>

                    <div className="text-sm text-gray-700 space-y-1">
                      <div className="flex items-center gap-2">
                        <IdCard className="w-4 h-4 text-gray-400" />
                        <span>{driver.license || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span>{driver.driverPhone || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPinIcon className="w-4 h-4 text-gray-400" />
                        <span>{driver.latitude?.toFixed(4) || '—'}, {driver.longitude?.toFixed(4) || '—'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ClockIcon className="w-4 h-4 text-gray-400" />
                        <span>{driver.lastUpdated ? new Date(driver.lastUpdated).toLocaleString() : 'Unknown'}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {selectedDriver && (
              <motion.div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/30">
                <motion.div
                  className="bg-white rounded-xl p-8 max-w-xl w-full border border-blue-200 shadow-lg"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-xl text-blue-800">Driver Profile</h3>
                    <button
                      onClick={closeDriverModal}
                      className="text-gray-500 hover:text-gray-800 text-xl font-bold"
                    >
                      &times;
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-800">
                    <div><span className="font-medium">ID:</span> {selectedDriver.id}</div>
                    <div><span className="font-medium">Reg Number:</span> {selectedDriver.regNumber || 'N/A'}</div>
                    <div><span className="font-medium">Driver Name:</span> {selectedDriver.driverName || 'N/A'}</div>
                    <div><span className="font-medium">Driver Phone:</span> {selectedDriver.driverPhone || 'N/A'}</div>
                    <div><span className="font-medium">Status:</span> {selectedDriver.status}</div>
                    <div><span className="font-medium">Latitude:</span> {selectedDriver.latitude?.toFixed(6) || 'N/A'}</div>
                    <div><span className="font-medium">Longitude:</span> {selectedDriver.longitude?.toFixed(6) || 'N/A'}</div>
                    <div><span className="font-medium">Last Updated:</span> {selectedDriver.lastUpdated ? new Date(selectedDriver.lastUpdated).toLocaleString() : 'N/A'}</div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </motion.div>
        )}


        {activeTab === 'vehicles' && (
          <motion.div className="space-y-8" variants={containerVariants} initial="hidden" animate="visible">
            
            
            {/* 🧭 Global Title: No box here */}
            <SectionHeader icon={<TruckIcon />} title="Ambulance & Location Management" />

            {/* 🚑 Fetch Ambulance Location */}
                <motion.div
              className="mb-10 p-6 bg-white rounded-2xl border border-gray-200 shadow-sm space-y-6"
              variants={itemVariants}
            >
              <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <MapPinIcon className="h-6 w-6 text-green-600" />
                Ambulance Location
              </h3>

              {/* Search */}
              <div className="flex flex-col md:flex-row gap-4 md:items-end">
                <div className="flex-1">
                  <label htmlFor="ambulanceIdFetch" className="block text-sm font-medium text-gray-700 mb-1">
                    Ambulance ID
                  </label>
                  <input
                    id="ambulanceIdFetch"
                    name="ambulanceId"
                    value={locationForm.ambulanceId}
                    onChange={handleLocationChange}
                    onBlur={handleLocationBlur}
                    className={`w-full px-4 py-2.5 text-sm border ${
                      locationFormErrors.ambulanceId ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition`}
                    placeholder="Enter ambulance ID"
                  />
                  {locationFormErrors.ambulanceId && (
                    <p className="mt-1 text-sm text-red-600">{locationFormErrors.ambulanceId}</p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleFetchLocation}
                  disabled={fetchLoading}
                  className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition disabled:opacity-50"
                >
                  {fetchLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.3 0 0 5.3 0 12h4z" />
                      </svg>
                      Fetching...
                    </>
                  ) : (
                    <>
                      <MagnifyingGlassIcon className="h-5 w-5 mr-2" />
                      Get Location
                    </>
                  )}
                </button>
              </div>

              {/* Error Message */}
              {fetchError && (
                <motion.div
                  className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md"
                  role="alert"
                  variants={itemVariants}
                >
                  {fetchError}
                </motion.div>
              )}

              {/* Map + Location Details */}
              {fetchedLocation && (
                <motion.div
                  className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start"
                  variants={itemVariants}
                >
                  {/* Left Side: Info */}
                  <div className="space-y-4 bg-blue-50 border border-blue-200 p-5 rounded-lg text-sm text-blue-900 h-full">
                    <h4 className="text-base font-semibold flex items-center gap-2">
                      <MapPinIcon className="h-5 w-5 text-blue-600" />
                      Location Details
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <InfoLine label="ID" value={fetchedLocation.id} />
                      <InfoLine label="Reg Number" value={fetchedLocation.regNumber || 'N/A'} />
                      <InfoLine label="Driver Name" value={fetchedLocation.driverName || 'N/A'} />
                      <InfoLine label="Driver Phone" value={fetchedLocation.driverPhone || 'N/A'} />
                      <InfoLine
                        label="Status"
                        value={
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            fetchedLocation.status === 'AVAILABLE'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {fetchedLocation.status}
                          </span>
                        }
                      />
                      <InfoLine label="Latitude" value={fetchedLocation.latitude?.toFixed(6) || 'N/A'} />
                      <InfoLine label="Longitude" value={fetchedLocation.longitude?.toFixed(6) || 'N/A'} />
                      <InfoLine label="Last Updated" value={fetchedLocation.lastUpdated ? new Date(fetchedLocation.lastUpdated).toLocaleString() : 'N/A'} />
                    </div>
                    <InfoLine label="Full Address" value={resolvedAddress || 'Loading...'} />
                  </div>

                  {/* Right Side: Map */}
                  <div className="rounded-lg overflow-hidden border border-gray-300 shadow-sm h-full w-full min-h-[300px]">
                    <iframe
                      title="Ambulance Location Map"
                      className="w-full h-full"
                      src={`https://www.google.com/maps?q=${fetchedLocation.latitude},${fetchedLocation.longitude}&z=16&output=embed`}
                      loading="eager"
                    ></iframe>
                  </div>
                </motion.div>
              )}
            </motion.div>


            {/* 🏥 Fetch by Hospital */}
              <motion.div className="mb-8 p-6 bg-white rounded-2xl border border-gray-200 shadow-sm space-y-6" variants={itemVariants}>
                {/* Header */}
                <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <BuildingOfficeIcon className="h-6 w-6 text-blue-600" />
                  Ambulances by Hospital
                </h3>

                {/* Input & Button */}
                <div className="flex flex-col md:flex-row md:items-end gap-4">
                  <div className="flex-1">
                    <label htmlFor="hospitalId" className="block text-sm font-medium text-gray-700 mb-1">
                      Hospital ID
                    </label>
                    <div className="relative rounded-lg shadow-sm">
                      <input
                        id="hospitalId"
                        name="hospitalId"
                        value={hospitalId}
                        onChange={(e) => setHospitalId(e.target.value)}
                        type="number"
                        min="1"
                        className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        placeholder="e.g., 1"
                      />
                      <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-400">
                        <BuildingOfficeIcon className="h-5 w-5" />
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleFetchByHospital}
                    disabled={hospitalFetchLoading}
                    className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition disabled:opacity-50"
                  >
                    {hospitalFetchLoading ? (
                      <>
                        <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.3 0 0 5.3 0 12h4z" />
                        </svg>
                        Fetching...
                      </>
                    ) : (
                      <>
                        <MagnifyingGlassIcon className="h-5 w-5 mr-2" />
                        Get by Hospital
                      </>
                    )}
                  </button>
                </div>

                {/* Error Alert */}
                {hospitalFetchError && (
                  <motion.div
                    className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md"
                    role="alert"
                    variants={itemVariants}
                  >
                    {hospitalFetchError}
                  </motion.div>
                )}

                {/* Result Table */}
                <motion.div className="overflow-x-auto" variants={itemVariants}>
                <table className="min-w-full bg-white border border-gray-200 rounded-xl overflow-hidden text-sm">
                  <thead className="bg-gray-100 text-gray-700">
                    <tr className="rounded-t-xl">
                      <th className="px-4 py-3  text-left font-medium">ID</th>
                      <th className="px-4 py-3 text-left font-medium">Driver</th>
                      <th className="px-4 py-3 text-left font-medium">Status</th>
                      <th className="px-4 py-3 text-left font-medium">Latitude</th>
                      <th className="px-4 py-3 text-left font-medium">Longitude</th>
                      <th className="px-4 py-3 text-left font-medium">Location</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {hospitalAmbulances.map((amb, i) => (
                      <tr key={amb.id} className="hover:bg-gray-50 transition">
                        <td className="px-4 py-3 text-gray-800">{i + 1}</td>
                        <td className="px-4 py-3 text-gray-800 flex items-center gap-2">
                          <TruckIcon className="h-4 w-4 text-slate-400" />
                          {amb.regNumber}
                        </td>
                        <td className="px-4 py-3 text-gray-800 flex items-center gap-2">
                          <UserIcon className="h-4 w-4 text-slate-400" />
                          {amb.driverName}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
                            amb.status === 'AVAILABLE'
                              ? 'bg-green-50 text-green-700'
                              : amb.status === 'EN_ROUTE'
                              ? 'bg-yellow-50 text-yellow-700'
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {amb.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-800">
                          <MapPinIcon className="h-4 w-4 inline mr-1 text-slate-400" />
                          {amb.latitude?.toFixed(6)}
                        </td>
                        <td className="px-4 py-3 text-gray-800">
                          <MapPinIcon className="h-4 w-4 inline mr-1 text-slate-400" />
                          {amb.longitude?.toFixed(6)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>

              </motion.div>


            {/* 📍 Update Ambulance Location Form */}
                <motion.div
                  className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm"
                  variants={itemVariants}
                >
                  <h3 className="text-xl font-semibold text-gray-800 mb-6">Update Ambulance Live Location</h3>
                  <form onSubmit={handleLocationSubmit} className="space-y-5">
                    
                    {/* Ambulance ID */}
                    <motion.div variants={itemVariants}>
                      <label htmlFor="ambulanceIdUpdate" className="block text-sm font-medium text-gray-700 mb-1">
                        Ambulance ID
                      </label>
                      <input
                        id="ambulanceIdUpdate"
                        name="ambulanceId"
                        value={locationForm.ambulanceId}
                        onChange={handleLocationChange}
                        onBlur={handleLocationBlur}
                        required
                        className={`w-full px-4 py-2.5 border ${
                          locationFormErrors.ambulanceId ? 'border-red-500' : 'border-gray-300'
                        } rounded-xl focus:ring-blue-500 focus:border-blue-500 text-gray-800`}
                        placeholder="Enter ambulance ID"
                      />
                      {locationFormErrors.ambulanceId && (
                        <p className="mt-1 text-sm text-red-600">{locationFormErrors.ambulanceId}</p>
                      )}
                    </motion.div>

                    {/* Latitude */}
                    <motion.div variants={itemVariants}>
                      <label htmlFor="latitude" className="block text-sm font-medium text-gray-700 mb-1">
                        Latitude
                      </label>
                      <input
                        id="latitude"
                        name="latitude"
                        value={locationForm.latitude}
                        onChange={handleLocationChange}
                        onBlur={handleLocationBlur}
                        type="number"
                        step="any"
                        required
                        className={`w-full px-4 py-2.5 border ${
                          locationFormErrors.latitude ? 'border-red-500' : 'border-gray-300'
                        } rounded-xl focus:ring-blue-500 focus:border-blue-500 text-gray-800`}
                        placeholder="e.g., 18.5204"
                      />
                      {locationFormErrors.latitude && (
                        <p className="mt-1 text-sm text-red-600">{locationFormErrors.latitude}</p>
                      )}
                    </motion.div>

                    {/* Longitude */}
                    <motion.div variants={itemVariants}>
                      <label htmlFor="longitude" className="block text-sm font-medium text-gray-700 mb-1">
                        Longitude
                      </label>
                      <input
                        id="longitude"
                        name="longitude"
                        value={locationForm.longitude}
                        onChange={handleLocationChange}
                        onBlur={handleLocationBlur}
                        type="number"
                        step="any"
                        required
                        className={`w-full px-4 py-2.5 border ${
                          locationFormErrors.longitude ? 'border-red-500' : 'border-gray-300'
                        } rounded-xl focus:ring-blue-500 focus:border-blue-500 text-gray-800`}
                        placeholder="e.g., 73.8567"
                      />
                      {locationFormErrors.longitude && (
                        <p className="mt-1 text-sm text-red-600">{locationFormErrors.longitude}</p>
                      )}
                    </motion.div>

                    {/* Submit Button */}
                    <motion.button
                      type="submit"
                      disabled={loading}
                      className="w-full inline-flex items-center justify-center px-4 py-3 rounded-xl text-white bg-blue-600 hover:bg-blue-700 transition disabled:opacity-50"
                      variants={itemVariants}
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Updating...
                        </>
                      ) : (
                        <>
                          <MapPinIcon className="mr-2 h-5 w-5" aria-hidden="true" />
                          Update Location
                        </>
                      )}
                    </motion.button>

                    {/* Success/Error Message */}
                    {message && (
                      <motion.div
                        className={`mt-3 p-3 rounded-md text-sm border ${
                          message.includes('success')
                            ? 'bg-green-50 text-green-700 border-green-300'
                            : 'bg-red-50 text-red-700 border-red-300'
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
            
          </motion.div>
        )}

        {activeTab === 'emergencies' && (
          <motion.div
            className="bg-gray-50 rounded-2xl shadow-sm p-6 border border-gray-200 relative"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <SectionHeader icon={<ExclamationCircleIcon />} title="Recent Emergencies" />

            {emergenciesLoading ? (
              <motion.div className="text-center py-10 text-blue-600 font-medium" variants={itemVariants}>
                Loading emergencies...
              </motion.div>
            ) : emergenciesError ? (
              <motion.div className="text-center py-10 text-red-600 font-medium" variants={itemVariants}>
                {emergenciesError}
              </motion.div>
            ) : recentEmergencies.length === 0 ? (
              <motion.div className="text-center py-10 text-gray-500" variants={itemVariants}>
                No recent emergencies found.
              </motion.div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <motion.table
                    className="min-w-full text-sm text-gray-800 bg-white border border-gray-300 rounded-xl overflow-hidden"
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                  >
                    <motion.thead className="bg-gray-100" variants={itemVariants}>
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700">ID</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700">Issue</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700">Status</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700">Created At</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700">Phone</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700">Location</th>
                      </tr>
                    </motion.thead>
                    <motion.tbody className="divide-y divide-gray-200">
                      {recentEmergencies.map((em) => (
                        <motion.tr
                          key={em.booking_id}
                          className="hover:bg-gray-50 transition-colors duration-150"
                          variants={itemVariants}
                          onMouseEnter={() => {
                            setHoveredCoords({ lat: em.pickup_latitude, lng: em.pickup_longitude });
                            setHoveredEmergencyId(em.booking_id);
                          }}
                          onMouseLeave={() => {
                            setHoveredCoords(null);
                            setHoveredEmergencyId(null);
                          }}
                        >
                          <td className="px-4 py-3">{em.booking_id}</td>
                          <td className="px-4 py-3">{em.issue_type}</td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                                em.status === 'COMPLETED'
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-yellow-100 text-yellow-700'
                              }`}
                            >
                              {em.status === 'COMPLETED' ? (
                                <CheckCircleIcon className="h-4 w-4" />
                              ) : (
                                <ClockIcon className="h-4 w-4" />
                              )}
                              {em.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">{new Date(em.created_at).toLocaleString()}</td>
                          <td className="px-4 py-3">{em.victim_phone_number}</td>
                          <td className="px-4 py-3 text-blue-600 hover:underline cursor-pointer">
                            <MapPinIcon className="inline-block h-4 w-4 text-gray-500 mr-1" />
                            {emergencyAddresses[em.booking_id] || 'Loading...'}
                          </td>
                        </motion.tr>
                      ))}
                    </motion.tbody>
                  </motion.table>
                </div>

                {/* 🗺 Floating map at center (global position) */}
                {hoveredCoords && hoveredEmergencyId && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
                    <div className="relative w-[60%] h-[50%] border-2 border-white shadow-xl rounded-xl overflow-hidden pointer-events-auto bg-white"
                      onMouseLeave={() => {
                        setHoveredCoords(null);
                        setHoveredEmergencyId(null);
                      }}
                    >
                      <iframe
                        className="w-full h-full"
                        src={`https://maps.google.com/maps?q=${hoveredCoords.lat},${hoveredCoords.lng}&z=16&output=embed`}
                        loading="lazy"
                        allowFullScreen
                      ></iframe>
                    </div>
                  </div>
                )}
              </>
            )}
          </motion.div>
        )}

        {activeTab === 'profile' && (
            <motion.div
              className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-gray-100">

                {/* Section Header */}
                <div className="flex items-center gap-2 mb-8">
                  <UserCircleIcon className="text-brand w-6 h-6" />
                  <h2 className="text-xl font-bold text-gray-800">Profile</h2>
                </div>

                {/* Loading */}
                {profileLoading && (
                  <motion.div className="text-center py-10 text-brand font-semibold" variants={itemVariants}>
                    Loading profile data...
                  </motion.div>
                )}

                {/* Error */}
                {profileError && (
                  <motion.div className="text-center py-10 text-red-600 font-semibold" variants={itemVariants}>
                    {profileError}
                  </motion.div>
                )}

                {/* Profile Info */}
                {!profileLoading && !profileError && (
                  <motion.div
                    variants={itemVariants}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="flex items-center space-x-8 border border-gray-200 rounded-xl p-6 bg-gradient-to-br from-white via-green-50 to-white shadow-sm hover:shadow-md transition-shadow">
                      
                      {/* Profile Image - Larger */}
                      <div className="relative w-32 h-32">
                        <img
                          src={AmbulanceAdmin}
                          alt="Profile"
                          className="w-full h-full rounded-full object-cover border-4 border-white shadow-md"
                        />
                        <div className="absolute -inset-1 rounded-full bg-highlight-green opacity-10 blur-lg"></div>
                      </div>

                      {/* Profile Fields with Icons */}
                      <div className="flex-1">
                        <dl className="divide-y divide-gray-200 text-sm text-gray-700 space-y-3">
                          <ProfileItem icon={<Fingerprint className="text-brand w-4 h-4" />} label="User ID" value={profileData.id} />
                          <ProfileItem icon={<User className="text-brand w-4 h-4" />} label="Full Name" value={profileData.fullName} />
                          <ProfileItem icon={<Mail className="text-brand w-4 h-4" />} label="Email" value={profileData.email} />
                          <ProfileItem icon={<Phone className="text-brand w-4 h-4" />} label="Phone" value={profileData.phoneNumber} />
                          <ProfileItem icon={<IdCard className="text-brand w-4 h-4" />} label="Govt ID" value={profileData.governmentId} />
                        </dl>
                      </div>
                    </div>

                    {/* Button - moved to bottom */}
                     <div className="flex justify-center mt-6">
                    <button className="bg-green-600 hover:bg-red-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-all shadow-sm">
                      Edit Profile
                    </button>
                  </div>
                  </motion.div>
                )}
              </div>
            </motion.div>

        )}


        {activeTab === 'register' && (
          <motion.div className="max-w-2xl mx-auto" variants={containerVariants} initial="hidden" animate="visible">
            <div className="bg-white p-8 rounded-lg shadow-xl border border-gray-200">
              <div className="text-center mb-8">
                <SectionHeader icon={<PlusCircleIcon />} title="Register Driver" />
                <p className="text-gray-600">Add a new driver to the emergency response system</p>
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
                        placeholder="e.g., MH-AMBU-0234"
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
                    <label htmlFor="hospitalID" className="block text-sm font-medium text-gray-700 mb-2">Hospital ID</label>
                    <div className="relative">
                      <input
                        id="hospitalID"
                        name="hospitalID"
                        value={form.hospitalID}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        type="number"
                        required
                        className={`w-full px-4 py-3 pl-10 border ${form.ErrorshospitalID ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-sm`}
                        placeholder="Enter Hospital ID"
                        min="1"
                      />
                      <BuildingOfficeIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                    {form.ErrorshospitalID && <p className="mt-1 text-sm text-red-600">{form.ErrorshospitalID}</p>}
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
                      Register Driver
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