import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import reactLogo from './../../assets/react-logo.png';
import FireAdmin from './../../assets/FireAdmin.png';
import { toast } from 'react-toastify';
import {
  MapIcon,
  FireIcon,
  BuildingOfficeIcon,
  TruckIcon,
  ClockIcon,
  DocumentTextIcon,
  ChartBarIcon,
  UserIcon,
  MapPinIcon,
  PhoneIcon,
  CheckCircleIcon,
  XCircleIcon,
  InformationCircleIcon,
  PlusIcon,
  ArrowLeftIcon,
  TrophyIcon,
  ClipboardDocumentListIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  ShieldCheckIcon,
  HomeIcon,
  ArrowRightOnRectangleIcon,
  GlobeAltIcon,
  UserGroupIcon,
  ExclamationCircleIcon,
  UserCircleIcon,
  Bars3BottomLeftIcon,
  PlusCircleIcon,
  IdentificationIcon,
  EnvelopeIcon,
  KeyIcon,
  CalendarDaysIcon,
  CurrencyDollarIcon,
  ClipboardDocumentCheckIcon
} from '@heroicons/react/24/outline';

import { User, Phone, Mail, Fingerprint, IdCard } from 'lucide-react';
function decodeJWT(token) {
  if (!token) return {};
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
  } catch {
    return {};
  }
}

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
  hidden: { opacity: 0, scale: 0.98 }, // Slightly less scale for minimalism
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  hover: { scale: 1.01, boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.06)" }, // Even softer shadow
};

const headerVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

function SectionHeader({ icon, title }) {
  return (
    <motion.h2
      className="flex items-center gap-3 text-2xl md:text-3xl font-bold mb-6 text-gray-800 border-b-2 border-gray-200 pb-2"
      variants={headerVariants}
      initial="hidden"
      animate="visible"
    >
      <span className="text-blue-500 text-3xl">{icon}</span> {/* Still a very subtle cool blue for icons */}
      {title}
    </motion.h2>
  );
}

const ProfileItem = ({ icon, label, value }) => (
  <div className="flex items-center justify-between pt-2">
    <div className="flex items-center gap-2 text-gray-500">
      {icon}
      <dt className="font-medium">{label}</dt>
    </div>
    <dd className="text-gray-900 font-semibold">{value || 'N/A'}</dd>
  </div>
);

export default function FireDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [stationForm, setStationForm] = useState({
    name: '',
    latitude: '',
    longitude: ''
  });
  const [locationForm, setLocationForm] = useState({
    truckId: '',
    latitude: '',
    longitude: ''
  });
  const [queryForm, setQueryForm] = useState({
    stationId: '',
    truckId: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  const [hoveredCoords, setHoveredCoords] = useState(null);
const [hoveredEmergencyId, setHoveredEmergencyId] = useState(null);

  
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [profileData, setProfileData] = useState({
    id: '',
  fullName: '',
  email: '',
  phoneNumber: '',
  governmentId: ''
  });
  const [form, setForm] = useState({
  fullName: '',
  email: '',
  phoneNumber: '',
  governmentId: '',
  password: '',
  licenseNumber: '',
  vehicleRegNumber: '',
  fireStationId: '',  
  securityQuestion: 'PET_NAME',  // default selection
  securityAnswer: '',
});
 // New state for individual input errors
  const [formErrors, setFormErrors] = useState({
     fullName: '',
        email: '',
        phoneNumber: '',
        governmentId: '',
        password: '',
        licenseNumber: '',
        vehicleRegNumber: '',
        fireStationId: '',
        securityQuestion: '',
        securityAnswer: ''
  });
const [requestingUsers, setRequestingUsers] = useState({});
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState(null);
  const [reportTruckHistory, setReportTruckHistory] = useState([]);
  const [reportLoading, setReportLoading] = useState(false);
  const [reportError, setReportError] = useState('');
  const [reportTruckId, setReportTruckId] = useState('');
  const [fireBookings, setFireBookings] = useState([]);
  const [fireBookingsLoading, setFireBookingsLoading] = useState(false);
  const [fireBookingsError, setFireBookingsError] = useState('');
  const [dashboardStats, setDashboardStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [statsError, setStatsError] = useState('');

  // New state for fire station and truck management
  const [fireStations, setFireStations] = useState([]);
  const [fireStationsLoading, setFireStationsLoading] = useState(false);
  const [fireStationsError, setFireStationsError] = useState('');
  const [selectedDriverId, setSelectedDriverId] = useState('');
  const [selectedDriverProfile, setSelectedDriverProfile] = useState(null);
  const [selectedDriverLoading, setSelectedDriverLoading] = useState(false);
  const [selectedDriverError, setSelectedDriverError] = useState('');
  const [selectedTruckId, setSelectedTruckId] = useState('');
  const [selectedTruckDetails, setSelectedTruckDetails] = useState(null);
  const [selectedTruckLoading, setSelectedTruckLoading] = useState(false);
  const [selectedTruckError, setSelectedTruckError] = useState('');
  const [allTrucks, setAllTrucks] = useState([]);
  const [allTrucksLoading, setAllTrucksLoading] = useState(false);
  const [allTrucksError, setAllTrucksError] = useState('');
  const [selectedStationId, setSelectedStationId] = useState('');
  const [selectedStationDetails, setSelectedStationDetails] = useState(null);
  const [selectedStationLoading, setSelectedStationLoading] = useState(false);
  const [selectedStationError, setSelectedStationError] = useState('');
  const [locationUpdateForm, setLocationUpdateForm] = useState({
    truckId: '',
    latitude: '',
    longitude: ''
  });
  const [locationUpdateLoading, setLocationUpdateLoading] = useState(false);
  const [locationUpdateMessage, setLocationUpdateMessage] = useState('');

  const [stationFormErrors, setStationFormErrors] = useState({
    name: '',
    latitude: '',
    longitude: ''
  });
  const [locationFormErrors, setLocationFormErrors] = useState({
    truckId: '',
    latitude: '',
    longitude: ''
  });
  const [queryFormErrors, setQueryFormErrors] = useState({
    stationId: '',
    truckId: ''
  });

  const latRegex = /^-?([1-8]?\d(\.\d+)?|90(\.0+)?)$/;
  const lonRegex = /^-?((1?[0-7]?\d(\.\d+)?)|180(\.0+)?)$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[6-9]\d{9}$/;
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]$/; // PAN format
  const licenseRegex = /^[A-Z]{2}-[A-Z]+-\d{4}$/i; // Format: STATE-TYPE-NUMBER (e.g., MH-AMBU-0234)
  const vehicleRegRegex = /^[A-Z]{2}\d{2}[A-Z]{2}\d{4}$/i; // Format: STATE + 2 digits + 2 letters + 4 digits (e.g., MH15BA3254)

  // Fetch profile data when profile tab is active
  useEffect(() => {
      fetchAdminProfile();
    
  }, []);

  useEffect(() => {
  const fetchFireBookings = async () => {
    setFireBookingsLoading(true);
    setFireBookingsError('');
    const token = localStorage.getItem('jwt') || localStorage.getItem('token');
    
    if (!token) {
      setFireBookingsError('Authentication required to view recent activity.');
      setFireBookingsLoading(false);
      return;
    }

    try {
      const res = await fetch('http://localhost:8080/booking/fire', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: 'Failed to parse error response.' }));
        throw new Error(errorData.message || 'Failed to fetch fire bookings');
      }

      const data = await res.json();
      const pendingBookings = data.filter(booking => booking.status === 'PENDING');
      const completedBookings = data.filter(booking => booking.status === 'COMPLETED');
      setFireBookings([...pendingBookings, ...completedBookings]);
    } catch (err) {
      setFireBookingsError(err.message || 'Could not load recent activity.');
    } finally {
      setFireBookingsLoading(false);
    }
  };

  fetchFireBookings();
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
  useEffect(() => {
    setStatsLoading(true);
    setStatsError('');
    fetch('http://localhost:8080/api/dashboard/stats', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('jwt') || ''}`
      }
    })
      .then(async res => {
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({ message: 'Failed to parse error response.' }));
          throw new Error(errorData.message || 'Failed to fetch dashboard stats');
        }
        return res.json();
      })
      .then(data => setDashboardStats(data))
      .catch(err => setStatsError(err.message || 'Could not load dashboard stats.'))
      .finally(() => setStatsLoading(false));
  }, []);

  useEffect(() => {
  if (activeTab === 'emergencies') {
    setFireBookingsLoading(true);
    setFireBookingsError('');
    const token = localStorage.getItem('jwt') || localStorage.getItem('token');

    if (!token) {
      setFireBookingsError('Authentication required to view emergencies.');
      setFireBookingsLoading(false);
      return;
    }

    fetch('http://localhost:8080/booking/fire', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(async res => {
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({ message: 'Failed to parse error response.' }));
          throw new Error(errorData.message || 'Failed to fetch fire bookings');
        }
        return res.json();
      })
      .then(async data => {
        const pendingBookings = data.filter(booking => booking.status === 'PENDING');
        const completedBookings = data.filter(booking => booking.status === 'COMPLETED');
        const allBookings = [...pendingBookings, ...completedBookings];

        setFireBookings(allBookings);

        // 🔥 ADDED: Fetch user metadata
        const uniqueUserIds = [...new Set(allBookings.map(b => b.requested_by_user_id))];
        const userMap = {};

        await Promise.all(
          uniqueUserIds.map(async userId => {
            try {
              const res = await fetch(`http://localhost:8080/api/user/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
              });
              if (res.ok) {
                const userData = await res.json();
                userMap[userId] = {
                  name: userData.fullName,
                  email: userData.email
                };
              } else {
                userMap[userId] = { name: 'Unknown', email: '-' };
              }
            } catch (err) {
              userMap[userId] = { name: 'Error', email: '-' };
            }
          })
        );

        setRequestingUsers(userMap); // ✅ Update the state you declared
      })
      .catch(err => setFireBookingsError(err.message || 'Could not load fire bookings.'))
      .finally(() => setFireBookingsLoading(false));
  }
}, [activeTab]);


  // Fetch profile data when profile tab is active
  useEffect(() => {
    if (activeTab === 'profile') {
      fetchAdminProfile();
    }
  }, [activeTab]);

  const validateStationField = (name, value) => {
    let error = '';
    switch (name) {
      case 'name':
        if (!value.trim()) error = 'Station Name is required.';
        else if (value.length > 100) error = 'Station Name cannot exceed 100 characters.';
        break;
      case 'latitude':
        if (!value.toString().trim()) error = 'Latitude is required.';
        else if (!latRegex.test(value)) error = 'Invalid latitude (-90 to 90).';
        break;
      case 'longitude':
        if (!value.toString().trim()) error = 'Longitude is required.';
        else if (!lonRegex.test(value)) error = 'Invalid longitude (-180 to 180).';
        break;
      default:
        break;
    }
    setStationFormErrors(prev => ({ ...prev, [name]: error }));
    return error === '';
  };

  const handleStationChange = (e) => {
    const { name, value } = e.target;
    setStationForm((prev) => ({ ...prev, [name]: value }));
    validateStationField(name, value);
  };

  const handleStationBlur = (e) => {
    const { name, value } = e.target;
    validateStationField(name, value);
  };

  const validateAllStationFields = () => {
    let isValid = true;
    for (const key in stationForm) {
      if (!validateStationField(key, stationForm[key])) {
        isValid = false;
      }
    }
    return isValid;
  };

  const validateLocationField = (name, value) => {
    let error = '';
    switch (name) {
      case 'truckId':
        if (!value.toString().trim()) error = 'Truck ID is required.';
        else if (isNaN(Number(value)) || Number(value) <= 0) error = 'Truck ID must be a positive number.';
        break;
      case 'latitude':
        if (!value.toString().trim()) error = 'Latitude is required.';
        else if (!latRegex.test(value)) error = 'Invalid latitude (-90 to 90).';
        break;
      case 'longitude':
        if (!value.toString().trim()) error = 'Longitude is required.';
        else if (!lonRegex.test(value)) error = 'Invalid longitude (-180 to 180).';
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

  const validateAllLocationFields = () => {
    let isValid = true;
    for (const key in locationForm) {
      if (!validateLocationField(key, locationForm[key])) {
        isValid = false;
      }
    }
    return isValid;
  };

  const validateQueryField = (name, value) => {
    let error = '';
    switch (name) {
      case 'stationId':
        if (value.toString().trim() && (isNaN(Number(value)) || Number(value) <= 0)) error = 'Station ID must be a positive number.';
        break;
      case 'truckId':
        if (value.toString().trim() && (isNaN(Number(value)) || Number(value) <= 0)) error = 'Truck ID must be a positive number.';
        break;
      default:
        break;
    }
    setQueryFormErrors(prev => ({ ...prev, [name]: error }));
    return error === '';
  };

  const handleQueryChange = (e) => {
    const { name, value } = e.target;
    setQueryForm((prev) => ({ ...prev, [name]: value }));
    validateQueryField(name, value);
  };

  const handleQueryBlur = (e) => {
    const { name, value } = e.target;
    validateQueryField(name, value);
  };

 

  const handleStationSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!validateAllStationFields()) {
      setMessage('Please correct the errors in the form.');
      return;
    }
    setLoading(true);

    const token = localStorage.getItem('jwt') || localStorage.getItem('token');
    if (!token) {
      setMessage('Authentication token not found. Please login again.');
      setLoading(false);
      return;
    }

    try {
      const requestBody = {
        name: stationForm.name,
        latitude: parseFloat(stationForm.latitude),
        longitude: parseFloat(stationForm.longitude)
      };

      const res = await fetch('http://localhost:8080/fire/station/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestBody),
      });

      if (res.ok) {
        setMessage('Fire station created successfully!');
        setStationForm({ name: '', latitude: '', longitude: '' });
        setStationFormErrors({ name: '', latitude: '', longitude: '' });
      } else {
        const data = await res.json().catch(() => ({}));
        setMessage(data.message || 'Failed to create fire station.');
      }
    } catch (err) {
      setMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!validateAllLocationFields()) {
      setMessage('Please correct the errors in the form.');
      return;
    }
    setLoading(true);

    const token = localStorage.getItem('jwt') || localStorage.getItem('token');
    if (!token) {
      setMessage('Authentication token not found. Please login again.');
      setLoading(false);
      return;
    }

    try {
      const requestBody = {
        truckId: parseInt(locationForm.truckId),
        latitude: parseFloat(locationForm.latitude),
        longitude: parseFloat(locationForm.longitude)
      };

      const res = await fetch('http://localhost:8080/fire/truck-driver/v1/update-location', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestBody),
      });

      if (res.ok) {
        setMessage('Fire truck location updated successfully!');
        setLocationForm({ truckId: '', latitude: '', longitude: '' });
        setLocationFormErrors({ truckId: '', latitude: '', longitude: '' });
      } else {
        const data = await res.json().catch(() => ({}));
        setMessage(data.message || 'Failed to update fire truck location.');
      }
    } catch (err) {
      setMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };


   const handleFireDriverSubmit = async (e) => {
  e.preventDefault();
  setMessage('');

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

  setLoading(true);
  try {
    const body = {
      ...form,
      fireStationId: Number(form.fireStationId),
      securityQuestion: form.securityQuestion,
      securityAnswer: form.securityAnswer
    };

    const res = await fetch('http://localhost:8080/auth/register/fire-driver', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      setMessage('Fire driver registered successfully!');
      setForm({
        fullName: '',
        email: '',
        phoneNumber: '',
        governmentId: '',
        password: '',
        licenseNumber: '',
        vehicleRegNumber: '',
        fireStationId: '',
        securityQuestion: '',
        securityAnswer: ''
      });
      setFormErrors({
        fullName: '',
        email: '',
        phoneNumber: '',
        governmentId: '',
        password: '',
        licenseNumber: '',
        vehicleRegNumber: '',
        fireStationId: '',
        securityQuestion: '',
        securityAnswer: ''
      });
    } else {
      const data = await res.json().catch(() => ({}));
      setMessage(data.message || 'Registration failed.');
    }
  } catch (err) {
    console.error('Error during fire driver registration:', err);
    setMessage('Network error. Please check your connection.');
  } finally {
    setLoading(false);
  }
};


  const handleGetTrucks = async () => {
    if (!queryForm.stationId.toString().trim() || !validateQueryField('stationId', queryForm.stationId)) {
      setMessage('Please enter a valid positive Station ID to get trucks.');
      return;
    }

    setMessage('');
    setLoading(true);
    setData(null);

    const token = localStorage.getItem('jwt') || localStorage.getItem('token');
    if (!token) {
      setMessage('Authentication token not found. Please login again.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`http://localhost:8080/fire/admin/station/${queryForm.stationId}/trucks`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        const result = await res.json();
        setData(result);
        if (result.length === 0) {
          setMessage('No trucks found for this station ID.');
        } else {
          setMessage('Trucks data retrieved successfully!');
        }
      } else {
        const data = await res.json().catch(() => ({}));
        setMessage(data.message || 'Failed to get trucks data.');
      }
    } catch (err) {
      setMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGetStationHistory = async () => {
  if (!queryForm.stationId.toString().trim() || !validateQueryField('stationId', queryForm.stationId)) {
    setMessage('Please enter a valid positive Station ID to get history.');
    return;
  }

  setMessage('');
  setLoading(true);
  setData(null);

  const token = localStorage.getItem('jwt') || localStorage.getItem('token');
  if (!token) {
    setMessage('Authentication token not found. Please login again.');
    setLoading(false);
    return;
  }

  try {
    const res = await fetch(`http://localhost:8080/fire/admin/station/${queryForm.stationId}/history`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (res.ok) {
      const result = await res.json();

      // 👇 Transform snake_case to camelCase
      const camelCasedResult = result.map(r => ({
        bookingId: r.booking_id,
        pickupLatitude: r.pickup_latitude,
        pickupLongitude: r.pickup_longitude,
        issueType: r.issue_type,
        status: r.status,
        createdAt: r.created_at,
        victimPhoneNumber: r.victim_phone_number,
        requestedByUserId: r.requested_by_user_id,
        isForSelf: r.is_for_self,
        needsAmbulance: r.needs_ambulance,
        needsPolice: r.needs_police,
        needsFireBrigade: r.needs_fire_brigade,
        requestedAmbulanceCount: r.requested_ambulance_count,
        requestedPoliceCount: r.requested_police_count,
        requestedFireTruckCount: r.requested_fire_truck_count
      }));

      setData(camelCasedResult);

      if (camelCasedResult.length === 0) {
        setMessage('No history found for this station ID.');
      } else {
        setMessage('Station history retrieved successfully!');
      }
    } else {
      const data = await res.json().catch(() => ({}));
      setMessage(data.message || 'Failed to get station history.');
    }
  } catch (err) {
    setMessage('Network error. Please try again.');
  } finally {
    setLoading(false);
  }
};


  const handleGetTruckHistory = async () => {
    if (!queryForm.truckId.toString().trim() || !validateQueryField('truckId', queryForm.truckId)) {
      setMessage('Please enter a valid positive Truck ID to get history.');
      return;
    }

    setMessage('');
    setLoading(true);
    setData(null);

    const token = localStorage.getItem('jwt') || localStorage.getItem('token');
    if (!token) {
      setMessage('Authentication token not found. Please login again.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`http://localhost:8080/fire/admin/truck/${queryForm.truckId}/history`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        const result = await res.json();
        const camelCasedResult = result.map(r => ({
  bookingId: r.booking_id,
  pickupLatitude: r.pickup_latitude,
  pickupLongitude: r.pickup_longitude,
  issueType: r.issue_type,
  status: r.status,
  createdAt: r.created_at,
  victimPhoneNumber: r.victim_phone_number,
  requestedByUserId: r.requested_by_user_id,
  isForSelf: r.is_for_self,
  needsAmbulance: r.needs_ambulance,
  needsPolice: r.needs_police,
  needsFireBrigade: r.needs_fire_brigade,
  requestedAmbulanceCount: r.requested_ambulance_count,
  requestedPoliceCount: r.requested_police_count,
  requestedFireTruckCount: r.requested_fire_truck_count
}));
setData(camelCasedResult);

        setData(camelCasedResult);
        if (result.length === 0) {
          setMessage('No history found for this truck ID.');
        } else {
          setMessage('Truck history retrieved successfully!');
        }
      } else {
        const data = await res.json().catch(() => ({}));
        setMessage(data.message || 'Failed to get truck history.');
      }
    } catch (err) {
      setMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchReportTruckHistory = async () => {
    if (!reportTruckId.toString().trim()) {
      setReportError('Please enter a truck ID.');
      return;
    }
    if (isNaN(Number(reportTruckId)) || Number(reportTruckId) <= 0) {
      setReportError('Truck ID must be a positive number.');
      return;
    }

    setReportLoading(true);
    setReportError('');
    setReportTruckHistory([]);

    const token = localStorage.getItem('jwt') || localStorage.getItem('token');
    if (!token) {
      setReportError('Authentication token not found. Please login again.');
      setReportLoading(false);
      return;
    }
    try {
      const res = await fetch(`http://localhost:8080/fire/admin/truck/${reportTruckId}/history`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const result = await res.json();
        const camelCasedResult = result.map(r => ({
        bookingId: r.booking_id,
        pickupLatitude: r.pickup_latitude,
        pickupLongitude: r.pickup_longitude,
        issueType: r.issue_type,
        status: r.status,
        createdAt: r.created_at,
        victimPhoneNumber: r.victim_phone_number,
        requestedByUserId: r.requested_by_user_id,
        isForSelf: r.is_for_self,
        needsAmbulance: r.needs_ambulance,
        needsPolice: r.needs_police,
        needsFireBrigade: r.needs_fire_brigade,
        requestedAmbulanceCount: r.requested_ambulance_count,
        requestedPoliceCount: r.requested_police_count,
        requestedFireTruckCount: r.requested_fire_truck_count
      }));
      setReportTruckHistory(camelCasedResult);

        if (result.length === 0) {
          setReportError('No history found for this truck ID.');
        }
      } else {
        const data = await res.json().catch(() => ({}));
        setReportError(data.message || 'Failed to fetch truck history.');
      }
    } catch (err) {
      setReportError('Network error. Please try again.');
    } finally {
      setReportLoading(false);
    }
  };

  // Function to fetch all fire stations
  const fetchAllFireStations = async () => {
    setFireStationsLoading(true);
    setFireStationsError('');
    const token = localStorage.getItem('jwt') || localStorage.getItem('token');
    if (!token) {
      setFireStationsError('Authentication token not found. Please login again.');
      setFireStationsLoading(false);
      return;
    }
    try {
      const res = await fetch('http://localhost:8080/fire/admin/getAll/fireStation', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const result = await res.json();
        setFireStations(result);
        if (result.length === 0) {
          setFireStationsError('No fire stations found.');
        }
      } else {
        const data = await res.json().catch(() => ({}));
        setFireStationsError(data.message || 'Failed to fetch fire stations.');
      }
    } catch (err) {
      setFireStationsError('Network error. Please try again.');
    } finally {
      setFireStationsLoading(false);
    }
  };

  // Function to fetch driver profile by ID
  const fetchDriverProfile = async () => {
    if (!selectedDriverId.toString().trim()) {
      alert('Please enter a driver ID.');
      return;
    }
    if (isNaN(Number(selectedDriverId)) || Number(selectedDriverId) <= 0) {
      alert('Driver ID must be a positive number.');
      return;
    }

    setSelectedDriverLoading(true);
    setSelectedDriverError('');
    const token = localStorage.getItem('jwt') || localStorage.getItem('token');
    if (!token) {
      setSelectedDriverError('Authentication token not found. Please login again.');
      setSelectedDriverLoading(false);
      return;
    }
    try {
      const res = await fetch(`http://localhost:8080/fire/admin/profile/${selectedDriverId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const result = await res.json();
        setSelectedDriverProfile(result);
      } else {
        const data = await res.json().catch(() => ({}));
        setSelectedDriverError(data.message || 'Failed to fetch driver profile.');
        setSelectedDriverProfile(null);
      }
    } catch (err) {
      setSelectedDriverError('Network error. Please try again.');
      setSelectedDriverProfile(null);
    } finally {
      setSelectedDriverLoading(false);
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
  // Function to fetch truck details by ID
  const fetchTruckDetails = async () => {
    if (!selectedTruckId.toString().trim()) {
      alert('Please enter a truck ID.');
      return;
    }
    if (isNaN(Number(selectedTruckId)) || Number(selectedTruckId) <= 0) {
      alert('Truck ID must be a positive number.');
      return;
    }

    setSelectedTruckLoading(true);
    setSelectedTruckError('');
    const token = localStorage.getItem('jwt') || localStorage.getItem('token');
    if (!token) {
      setSelectedTruckError('Authentication token not found. Please login again.');
      setSelectedTruckLoading(false);
      return;
    }
    try {
      const res = await fetch(`http://localhost:8080/fire/admin/get/truck/${selectedTruckId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const result = await res.json();
        setSelectedTruckDetails(result);
      } else {
        const data = await res.json().catch(() => ({}));
        setSelectedTruckError(data.message || 'Failed to fetch truck details.');
        setSelectedTruckDetails(null);
      }
    } catch (err) {
      setSelectedTruckError('Network error. Please try again.');
      setSelectedTruckDetails(null);
    } finally {
      setSelectedTruckLoading(false);
    }
  };

  // Function to fetch all trucks
  const fetchAllTrucks = async () => {
    setAllTrucksLoading(true);
    setAllTrucksError('');
    const token = localStorage.getItem('jwt') || localStorage.getItem('token');
    if (!token) {
      setAllTrucksError('Authentication token not found. Please login again.');
      setAllTrucksLoading(false);
      return;
    }
    try {
      const res = await fetch('http://localhost:8080/fire/admin/get/all-trucks', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const result = await res.json();
        setAllTrucks(result);
        if (result.length === 0) {
          setAllTrucksError('No trucks found.');
        }
      } else {
        const data = await res.json().catch(() => ({}));
        setAllTrucksError(data.message || 'Failed to fetch trucks.');
      }
    } catch (err) {
      setAllTrucksError('Network error. Please try again.');
    } finally {
      setAllTrucksLoading(false);
    }
  };

  // Function to fetch fire station by ID
  const fetchFireStationById = async () => {
    if (!selectedStationId.toString().trim()) {
      alert('Please enter a station ID.');
      return;
    }
    if (isNaN(Number(selectedStationId)) || Number(selectedStationId) <= 0) {
      alert('Station ID must be a positive number.');
      return;
    }

    setSelectedStationLoading(true);
    setSelectedStationError('');
    const token = localStorage.getItem('jwt') || localStorage.getItem('token');
    if (!token) {
      setSelectedStationError('Authentication token not found. Please login again.');
      setSelectedStationLoading(false);
      return;
    }
    try {
      const res = await fetch(`http://localhost:8080/fire/admin/get/fire-station/${selectedStationId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const result = await res.json();
        setSelectedStationDetails(result);
      } else {
        const data = await res.json().catch(() => ({}));
        setSelectedStationError(data.message || 'Failed to fetch fire station details.');
        setSelectedStationDetails(null);
      }
    } catch (err) {
      setSelectedStationError('Network error. Please try again.');
      setSelectedStationDetails(null);
    } finally {
      setSelectedStationLoading(false);
    }
  };

  // Function to update truck location (admin)
  const handleLocationUpdate = async (e) => {
    e.preventDefault();
    if (!locationUpdateForm.truckId || !locationUpdateForm.latitude || !locationUpdateForm.longitude) {
      setLocationUpdateMessage('Please fill all fields.');
      return;
    }

    setLocationUpdateLoading(true);
    setLocationUpdateMessage('');
    const token = localStorage.getItem('jwt') || localStorage.getItem('token');
    if (!token) {
      setLocationUpdateMessage('Authentication token not found. Please login again.');
      setLocationUpdateLoading(false);
      return;
    }
    try {
      const requestBody = {
        ambulanceId: parseInt(locationUpdateForm.truckId),
        latitude: parseFloat(locationUpdateForm.latitude),
        longitude: parseFloat(locationUpdateForm.longitude)
      };

      const res = await fetch('http://localhost:8080/fire/admin/update-location', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestBody),
      });

      if (res.ok) {
        setLocationUpdateMessage('Location updated successfully!');
        setLocationUpdateForm({ truckId: '', latitude: '', longitude: '' });
      } else {
        const data = await res.json().catch(() => ({}));
        setLocationUpdateMessage(data.message || 'Failed to update location.');
      }
    } catch (err) {
      setLocationUpdateMessage('Network error. Please try again.');
    } finally {
      setLocationUpdateLoading(false);
    }
  };

  const QuickActionCard = ({ title, description, icon, onClick, bgColorClass }) => (
    <motion.div
      onClick={onClick}
      className={`${bgColorClass} p-6 rounded-lg cursor-pointer flex items-center space-x-4 text-gray-800 relative overflow-hidden transition-all duration-200`} // Text will be dark
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      whileTap={{ scale: 0.98 }}
    >
      <div className="text-3xl relative z-10 text-gray-600"> {/* Icons are slightly muted */}
        {icon}
      </div>
      <div className="relative z-10">
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm opacity-90">{description}</p>
      </div>
      <motion.div
        className="absolute inset-0 bg-gray-100 opacity-0 group-hover:opacity-70 transition-opacity duration-300 rounded-lg pointer-events-none" // Hover overlay
        initial={{ opacity: 0 }}
        animate={{ opacity: 0 }}
        whileHover={{ opacity: 0.7 }}
      ></motion.div>
    </motion.div>
  );

  const StatCard = ({ title, value, subtitle, bgColorClass, icon }) => (
    <motion.div
      className={`${bgColorClass} p-6 rounded-lg shadow-md text-gray-800 relative overflow-hidden flex items-center justify-between`} // Text will be dark
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
    >
      <div className="relative z-10">
        <motion.div
          className="text-4xl text-blue-600 opacity-75" // Cool blue for icons
          initial={{ rotate: 0 }}
          whileHover={{ rotate: 8 }} // Less dramatic rotation
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
        className="absolute inset-0 bg-gray-100 opacity-0 group-hover:opacity-70 transition-opacity duration-300 rounded-lg pointer-events-none" // Hover overlay
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

     <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
          .font-inter {
            font-family: 'Inter', sans-serif;
          }
        `}
      </style>
      {/* Header */}
      <div className="border-b border-gray-200">
  {/* Header Top Bar */}
  <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
    
    {/* Left - Logo + Title */}
    <div className="flex items-center gap-4">
      <img
        src={reactLogo} // Use your fire dashboard logo here
        alt="Logo"
        className="h-14 w-14 object-contain rounded-xl bg-white p-2 shadow-sm"
      />
      <div>
        <h1 className="text-xl font-semibold text-gray-800">Fire Admin Dashboard</h1>
        <p className="text-sm text-gray-500">Emergency Response Management System</p>
      </div>
    </div>

    {/* Right - User Info & Actions */}
    <div className="flex items-center gap-6">
      
      {/* User Info */}
     <div className="text-right">
              <p className="text-sm text-gray-600">Wecome {profileData.fullName}</p>
              <p className="text-xs text-gray-400">Updated: {new Date().toLocaleTimeString()}</p>
       </div>

      {/* Admin Avatar */}
      <div
  onClick={() => setActiveTab('profile')}
  title="Go to Profile"
  className="cursor-pointer"
>
  <img
    src={FireAdmin}
    alt="Admin"
    className="h-10 w-10 rounded-full object-cover border-2 border-white shadow"
  />
</div>

      {/* Icon Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate('/')}
          title="Home"
          className="text-gray-600 hover:text-orange-600 transition"
        >
          <HomeIcon className="h-6 w-6" />
        </button>
        <button
          onClick={() => {
            localStorage.removeItem('jwt');
            localStorage.removeItem('token');
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


      {/* Navigation Tabs */}
      <div className="w-full flex justify-center my-6">
        <nav className="bg-orange-50 border border-orange-200 rounded-full shadow-md px-4 py-2 flex space-x-4 overflow-x-auto max-w-6xl">
          {[
            { id: 'overview', name: 'Overview', icon: <ChartBarIcon className="h-5 w-5" /> },
            { id: 'stations', name: 'Stations', icon: <BuildingOfficeIcon className="h-5 w-5" /> },
            { id: 'management', name: 'Management', icon: <MagnifyingGlassIcon className="h-5 w-5" /> },
            { id: 'emergencies', name: 'Emergencies', icon: <FireIcon className="h-5 w-5 text-red-600" /> },
            { id: 'profile', name: 'Profile', icon: <UserIcon className="h-5 w-5" /> },
            { id: 'register', name: 'Register', icon: <PlusCircleIcon className="h-5 w-5" /> },

          ].map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all
                ${activeTab === tab.id
                  ? 'bg-orange-100 text-orange-700 border-orange-300'
                  : 'text-gray-600 border-transparent hover:bg-orange-100 hover:text-orange-600'}`}
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
              <SectionHeader icon={<ClipboardDocumentListIcon />} title="Quick Actions" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                 <QuickActionCard
                  title="Register Driver"
                  description="Add a new fire truck driver"
                  icon={<UserGroupIcon className="h-6 w-6" />}
                  onClick={() => setActiveTab('register')}
                  bgColorClass="bg-white"
                />
                
                <QuickActionCard
                  title="Add Station"
                  description="Create a new fire station"
                  icon={<PlusIcon className="h-6 w-6" />}
                  onClick={() => setActiveTab('add-station')}
                  bgColorClass="bg-white"
                />
                <QuickActionCard
                  title="View Emergencies"
                  description="Monitor active emergencies"
                  icon={<FireIcon className="h-6 w-6" />}
                  onClick={() => setActiveTab('emergencies')}
                  bgColorClass="bg-white"
                />
              
    
               
              </div>
            </div>

            {/* 🔥 Fire Dashboard Statistics */}
            <div className="mt-10">
              <SectionHeader icon={<FireIcon className="text-primary" />} title="Fire Dashboard Statistics" />

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
                  {/* 📊 Fire Stats Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                      title="Total Stations"
                      value={dashboardStats.total_fire_stations}
                      subtitle="Active fire stations"
                      icon={<BuildingOfficeIcon className="h-6 w-6 text-orange-700" />}
                      bgColorClass="bg-gradient-to-tr from-orange-50 to-white"
                    />
                    <StatCard
                      title="Total Fire Trucks"
                      value={dashboardStats.total_fire_trucks}
                      subtitle="Available fleet"
                      icon={<TruckIcon className="h-6 w-6 text-red-600" />}
                      bgColorClass="bg-gradient-to-tr from-red-50 to-white"
                    />
                    <StatCard
                      title="Service Bookings"
                      value={dashboardStats.fire_service_bookings}
                      subtitle="Today's calls"
                      icon={<FireIcon className="h-6 w-6 text-red-500" />}
                      bgColorClass="bg-gradient-to-tr from-rose-50 to-white"
                    />
                    <StatCard
                      title="Avg Completion"
                      value={`${dashboardStats.average_completion_time_minutes.toFixed(2)} min`}
                      subtitle="Response time"
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
                title="Recent Fire Emergencies"
              />

              {fireBookingsLoading ? (
                <motion.div className="text-center py-6 text-primary font-medium" variants={itemVariants}>
                  Loading fire emergencies...
                </motion.div>
              ) : fireBookingsError ? (
                <motion.div className="text-center py-6 text-red-600 font-medium" variants={itemVariants}>
                  {fireBookingsError}
                </motion.div>
              ) : fireBookings.length === 0 ? (
                <motion.div className="text-center py-6 text-gray-400" variants={itemVariants}>
                  No recent fire emergencies found.
                </motion.div>
              ) : (
                <>
                  {/* 🔥 Pending Fires */}
                  <div>
                    <h3 className="text-lg font-semibold text-yellow-700 mb-3 flex items-center gap-2">
                      <ExclamationCircleIcon className="h-5 w-5" />
                      Pending Emergencies
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {fireBookings
                        .filter((b) => b.status !== 'COMPLETED')
                        .map((b) => (
                          <motion.div
                            key={b.booking_id}
                            className="bg-white border border-yellow-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition"
                            variants={itemVariants}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-semibold text-gray-700">ID: {b.booking_id}</span>
                              <span className="text-xs font-medium px-2 py-1 rounded-full bg-yellow-100 text-yellow-800">
                                {b.status}
                              </span>
                            </div>
                            <div className="text-sm text-gray-600 mb-1">
                              <span className="font-medium text-gray-800">Issue:</span> {b.issue_type}
                            </div>
                            <div className="text-sm text-gray-600 mb-1">
                              <span className="font-medium text-gray-800">Fire Location:</span> {b.pickup_latitude}, {b.pickup_longitude}
                            </div>
                            <div className="text-sm text-gray-500 mt-2">
                              <ClockIcon className="inline h-4 w-4 mr-1 text-gray-400" />
                              Time :{new Date(b.created_at).toLocaleString()}
                            </div>
                           <div className="flex items-center text-sm text-gray-600 mb-1">
                              <div className="mr-3 flex items-center justify-center h-full">
                                <UserIcon className="h-6 w-6 text-gray-400" />
                              </div>
                              <div className="text-left">
                                <div className="font-medium">Requested by {requestingUsers[b.requested_by_user_id]?.name || 'Loading...'}</div>
                                <div className="text-xs text-gray-500">{requestingUsers[b.requested_by_user_id]?.email}</div>
                              </div>
                            </div>


                          </motion.div>
                        ))}
                    </div>
                  </div>

                  {/* ✅ Completed Fires */}
                  <div>
                    <h3 className="text-lg font-semibold text-green-700 mb-3 flex items-center gap-2">
                      <CheckCircleIcon className="h-5 w-5" />
                      Completed Emergencies
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {fireBookings
                        .filter((b) => b.status === 'COMPLETED')
                        .map((b) => (
                          <motion.div
                            key={b.booking_id}
                            className="bg-white border border-green-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition"
                            variants={itemVariants}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-semibold text-gray-700">ID: {b.booking_id}</span>
                              <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-700">
                                {b.status}
                              </span>
                            </div>
                            <div className="text-sm text-gray-600 mb-1">
                              <span className="font-medium text-gray-800">Issue:</span> {b.issue_type}
                            </div>
                            <div className="text-sm text-gray-600 mb-1">
                              <span className="font-medium text-gray-800">Fire Location:</span> {b.pickup_latitude}, {b.pickup_longitude}
                            </div>
                            <div className="text-sm text-gray-500 mt-2">
                              <ClockIcon className="inline h-4 w-4 mr-1 text-gray-400" />
                              Time :{new Date(b.created_at).toLocaleString()}
                            </div>
                           <div className="flex items-center text-sm text-gray-600 mb-1">
                              <div className="mr-3 flex items-center justify-center h-full">
                                <UserIcon className="h-6 w-6 text-gray-400" />
                              </div>
                              <div className="text-left">
                                <div className="font-medium">Requested by {requestingUsers[b.requested_by_user_id]?.name || 'Loading...'}</div>
                                <div className="text-xs text-gray-500">{requestingUsers[b.requested_by_user_id]?.email}</div>
                              </div>
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


     {activeTab === 'stations' && (
  <motion.div className="space-y-8" variants={containerVariants} initial="hidden" animate="visible">
    
    {/* 🔘 Section Header and Add Button */}
    <div className="flex items-center justify-between">
      <SectionHeader icon={<BuildingOfficeIcon />} title="Fire Stations" />
      <motion.button
        onClick={() => setActiveTab('add-station')}
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200 flex items-center space-x-2"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <PlusIcon className="h-5 w-5" /> <span>Add Station</span>
      </motion.button>
    </div>

    {/* 🚒 All Fire Stations Section */}
    <motion.div className="mb-8 p-6 bg-white rounded-2xl border border-gray-200 shadow-sm space-y-6" variants={itemVariants}>
      <h3 className="text-xl font-semibold text-red-700 flex items-center gap-2">
        <BuildingOfficeIcon className="h-6 w-6 text-red-500" />
        All Fire Stations
      </h3>

      {/* 🔴 Error Display */}
      {fireStationsError && (
        <motion.div
          className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md"
          role="alert"
          variants={itemVariants}
        >
          {fireStationsError}
        </motion.div>
      )}

      {/* 📋 Table */}
      <motion.div className="overflow-x-auto" variants={itemVariants}>
        {fireStations && Array.isArray(fireStations) && fireStations.length > 0 ? (
          <table className="min-w-full bg-white border border-gray-200 rounded-xl overflow-hidden text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-3 text-center font-medium">ID</th>
                <th className="px-4 py-3 text-center font-medium">Station Name</th>
                <th className="px-4 py-3 text-left font-medium">Latitude</th>
                <th className="px-4 py-3 text-left font-medium">Longitude</th>
                <th className="px-4 py-3 text-left font-medium">Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {fireStations.map((station, idx) => (
                <tr key={idx} className="hover:bg-red-50 transition">
                  <td className="px-4 text-center py-3 text-gray-800 font-semibold">{station.id}</td>
                  <td className="px-4 text-center py-3 text-gray-800">{station.fireStationName || 'N/A'}</td>
                  <td className="px-4 py-3 text-center text-gray-800">
                    <span className='flex items-center gap-1'>
                      <MapPinIcon className="h-4 w-4 text-red-400" />
                      {station.latitude?.toFixed(4)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-800">
                    <span className='flex items-center gap-1'>
                      <MapPinIcon className="h-4 w-4 text-red-400" />
                      {station.longitude?.toFixed(4)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-800 font-semibold">Loading...</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          !fireStationsLoading && (
            <motion.div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300" variants={itemVariants}>
              <BuildingOfficeIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 font-medium">No fire stations data available</p>
              <p className="text-gray-500 text-sm mt-1">Click the button above to fetch fire station information</p>
            </motion.div>
          )
        )}
      </motion.div>

      {/* 🔁 Refresh Button */}
      <div className="flex justify-end">
        <motion.button
          onClick={fetchAllFireStations}
          disabled={fireStationsLoading}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-lg shadow-md transition disabled:opacity-50 flex items-center gap-2 font-medium"
          whileHover={{ scale: 1.05, y: -1 }}
          whileTap={{ scale: 0.95 }}
        >
          {fireStationsLoading ? (
            <>
              <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24"></svg>
              Loading...
            </>
          ) : (
            <>
              <FireIcon className="h-5 w-5 text-white" />
              Refresh Fire Stations
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  </motion.div>
)}



        {activeTab === 'add-station' && (
          <motion.div className="max-w-2xl mx-auto" variants={containerVariants} initial="hidden" animate="visible">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="flex items-center justify-between mb-6">
                <SectionHeader icon={<BuildingOfficeIcon />} title="Create Fire Station" />
                <button
                  onClick={() => setActiveTab('stations')}
                  className="text-gray-500 hover:text-gray-700 flex items-center space-x-1"
                >
                  <ArrowLeftIcon className="h-4 w-4" /> <span>Back to Stations</span>
                </button>
              </div>

              <form onSubmit={handleStationSubmit} className="space-y-6">
                <motion.div variants={itemVariants}>
                  <label htmlFor="stationName" className="block text-sm font-medium text-gray-700 mb-1">Station Name</label>
                  <input
                    id="stationName"
                    name="name"
                    value={stationForm.name}
                    onChange={handleStationChange}
                    onBlur={handleStationBlur}
                    placeholder="Enter station name"
                    required
                    maxLength="100"
                    className={`w-full px-4 py-2 border ${stationFormErrors.name ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out`}
                  />
                  {stationFormErrors.name && <p className="mt-1 text-sm text-red-600">{stationFormErrors.name}</p>}
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <motion.div variants={itemVariants}>
                    <label htmlFor="stationLatitude" className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                    <input
                      id="stationLatitude"
                      name="latitude"
                      value={stationForm.latitude}
                      onChange={handleStationChange}
                      onBlur={handleStationBlur}
                      placeholder="e.g., 18.5204"
                      type="number"
                      step="any"
                      required
                      min="-90"
                      max="90"
                      className={`w-full px-4 py-2 border ${stationFormErrors.latitude ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out`}
                    />
                    {stationFormErrors.latitude && <p className="mt-1 text-sm text-red-600">{stationFormErrors.latitude}</p>}
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <label htmlFor="stationLongitude" className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                    <input
                      id="stationLongitude"
                      name="longitude"
                      value={stationForm.longitude}
                      onChange={handleStationChange}
                      onBlur={handleStationBlur}
                      placeholder="e.g., 73.8567"
                      type="number"
                      step="any"
                      required
                      min="-180"
                      max="180"
                      className={`w-full px-4 py-2 border ${stationFormErrors.longitude ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out`}
                    />
                    {stationFormErrors.longitude && <p className="mt-1 text-sm text-red-600">{stationFormErrors.longitude}</p>}
                  </motion.div>
                </div>

                <motion.button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 disabled:opacity-50 font-semibold transition-colors duration-200"
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 mr-3 inline" viewBox="0 0 24 24"> {/* Spinner */} </svg>
                      Creating Station...
                    </>
                  ) : 'Create Fire Station'}
                </motion.button>
              </form>

              {message && (
                <motion.div
                  className={`mt-6 p-4 rounded-md flex items-center space-x-2 ${
                    message.includes('success')
                      ? 'bg-green-100 text-green-700 border border-green-200'
                      : 'bg-red-100 text-red-700 border border-red-200'
                  }`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {message.includes('success') ? <CheckCircleIcon className="h-5 w-5" /> : <XCircleIcon className="h-5 w-5" />}
                  <span>{message}</span>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'management' && (
          <motion.div className="space-y-8" variants={containerVariants} initial="hidden" animate="visible">
            <SectionHeader icon={<MagnifyingGlassIcon />} title="Fire Station & Truck Management" />
            
        
            {/* All Fire Trucks Section */}
              
                {/* Truck Management */}
                <motion.div className="bg-white rounded-lg shadow-md p-6" variants={itemVariants}>
                    <motion.div className="bg-white w-full rounded-lg shadow-md p-6" variants={itemVariants}>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Query Truck Data</h3>
                  <div className="flex w-full px-20 flex-col  gap-6">
                    <motion.div variants={itemVariants}>
                      <label htmlFor="queryStationId" className="block  text-sm font-medium text-gray-700 mb-1">Station ID</label>
                      <input
                        id="queryStationId"
                        name="stationId"
                        value={queryForm.stationId}
                        onChange={handleQueryChange}
                        onBlur={handleQueryBlur}
                        placeholder="Enter Station ID"
                        type="number"
                        min="1"
                        className={`w-full px-4 py-2 border ${queryFormErrors.stationId ? 'border-red-500' : 'border-gray-300'} rounded-md mb-2 focus:ring-blue-500 focus:border-blue-500`}
                      />
                      {queryFormErrors.stationId && <p className="mt-1 text-sm text-red-600">{queryFormErrors.stationId}</p>}
                      <div className="flex  justify-center items-center gap-4">
                        <motion.button
                          onClick={handleGetTrucks}
                          disabled={loading}
                  className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg hover:from-green-600 hover:to-green-700 disabled:opacity-50 shadow-lg transition-all duration-200 flex items-center gap-2 font-medium"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <TruckIcon className="h-5 w-5 inline-block mr-1" /> Get Trucks
                        </motion.button>
                        <motion.button
                          onClick={handleGetStationHistory}
                          disabled={loading}
                  className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg hover:from-green-600 hover:to-green-700 disabled:opacity-50 shadow-lg transition-all duration-200 flex items-center gap-2 font-medium"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <ClockIcon className="h-5 w-5 inline-block mr-1" /> Get Station History
                        </motion.button>
                      </div>
                    </motion.div>
                    <motion.div className="pt-4 border-t border-gray-200" variants={itemVariants}>
                      <label htmlFor="queryTruckId" className="block text-sm font-medium text-gray-700 mb-1">Truck ID</label>
                      <input
                        id="queryTruckId"
                        name="truckId"
                        value={queryForm.truckId}
                        onChange={handleQueryChange}
                        onBlur={handleQueryBlur}
                        placeholder="Enter Truck ID"
                        type="number"
                        min="1"
                        className={`w-full px-4 py-2 border ${queryFormErrors.truckId ? 'border-red-500' : 'border-gray-300'} rounded-md mb-2 focus:ring-blue-500 focus:border-blue-500`}
                      />
                      {queryFormErrors.truckId && <p className="mt-1 text-sm text-red-600">{queryFormErrors.truckId}</p>}
                      <div className="flex justify-center">
                        <motion.button
                          onClick={handleGetTruckHistory}
                          disabled={loading}
                          className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg hover:from-green-600 hover:to-green-700 disabled:opacity-50 shadow-lg transition-all duration-200 items-center gap-2 font-medium"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <ClockIcon className="h-5 w-5 inline-block mr-1" /> Get Truck History
                        </motion.button>
                      </div>
                    </motion.div>
                    </div>
                    </motion.div>
                

                {message && <motion.div className={`mt-4 p-3 rounded-md flex items-center space-x-2 ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>{message.includes('success') ? <CheckCircleIcon className="h-5 w-5" /> : <XCircleIcon className="h-5 w-5" />}<span>{message}</span></motion.div>}
                {data && (
                  <motion.div className="bg-white rounded-lg shadow-md p-6" variants={itemVariants}>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Response Data</h3>
                    {Array.isArray(data) && data.length > 0 ? (
                      <div className="overflow-x-auto">
                        {data[0].registrationNumber ? (
                          <motion.table className="w-full text-sm bg-white border border-gray-200 rounded-lg overflow-hidden" initial="hidden" animate="visible" variants={containerVariants}>
                            <motion.thead className="bg-gray-50" variants={itemVariants}> {/* Minimal table header */}
                              <tr>
                                <th className="px-4 py-2 border-b text-left text-gray-600">ID</th>
                                <th className="px-4 py-2 border-b text-left text-gray-600">Registration</th>
                                <th className="px-4 py-2 border-b text-left text-gray-600">Driver Name</th>
                                <th className="px-4 py-2 border-b text-left text-gray-600">Phone</th>
                                <th className="px-4 py-2 border-b text-left text-gray-600">Status</th>
                                <th className="px-4 py-2 border-b text-left text-gray-600">Last Updated</th>
                                <th className="px-4 py-2 border-b text-left text-gray-600">Location</th>
                              </tr>
                            </motion.thead>
                            <motion.tbody className="bg-white">
                              {data.map((truck, index) => (
                                <motion.tr key={index} className="hover:bg-gray-50 border-b border-gray-100 last:border-b-0" variants={itemVariants}>
                                  <td className="px-4 py-3">{truck.id}</td>
                                  <td className="px-4 py-3 font-mono">{truck.registrationNumber}</td>
                                  <td className="px-4 py-3">{truck.driverName}</td>
                                  <td className="px-4 py-3">{truck.driverPhoneNumber}</td>
                                  <td className="px-4 py-3">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                      truck.status === 'AVAILABLE' ? 'bg-green-100 text-green-800' :
                                        truck.status === 'EN_ROUTE' ? 'bg-blue-100 text-blue-800' :
                                          'bg-gray-100 text-gray-800'
                                    }`}>
                                      {truck.status}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3 text-xs text-gray-500">
                                    {new Date(truck.lastUpdated).toLocaleString()}
                                  </td>
                                  <td className="px-4 py-3 text-xs text-gray-500">
                                    {truck.latitude?.toFixed(4)}, {truck.longitude?.toFixed(4)}
                                  </td>
                                </motion.tr>
                              ))}
                            </motion.tbody>
                          </motion.table>
                        ) : data[0].bookingId ? (
                          <motion.table className="w-full text-sm bg-white border border-gray-200 rounded-lg overflow-hidden" initial="hidden" animate="visible" variants={containerVariants}>
                            <motion.thead className="bg-gray-50" variants={itemVariants}> {/* Minimal table header */}
                              <tr>
                                <th className="px-4 py-2 border-b text-left text-gray-600">Booking ID</th>
                                <th className="px-4 py-2 border-b text-left text-gray-600">Pickup Location</th>
                                <th className="px-4 py-2 border-b text-left text-gray-600">Issue Type</th>
                                <th className="px-4 py-2 border-b text-left text-gray-600">Status</th>
                                <th className="px-4 py-2 border-b text-left text-gray-600">Created At</th>
                              </tr>
                            </motion.thead>
                            <motion.tbody className="bg-white">
                              {data.map((booking, index) => (
                                <motion.tr key={index} className="hover:bg-gray-50 border-b border-gray-100 last:border-b-0" variants={itemVariants}>
                                  <td className="px-4 py-3">{booking.bookingId}</td>
                                  <td className="px-4 py-3 text-xs text-gray-500">
                                    {booking.pickupLatitude?.toFixed(6)}, {booking.pickupLongitude?.toFixed(6)}
                                  </td>
                                  <td className="px-4 py-3">
                                    <span className="px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                                      {booking.issueType}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                      booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                        booking.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                                          'bg-gray-100 text-gray-800'
                                    }`}>
                                      {booking.status}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3 text-xs text-gray-500">{new Date(booking.createdAt).toLocaleString()}</td>
                                </motion.tr>
                              ))}
                            </motion.tbody>
                          </motion.table>
                        ) : (
                          <pre className="text-xs text-gray-700 bg-gray-50 p-4 rounded-md border border-gray-200 overflow-auto max-h-60">
                            {JSON.stringify(data, null, 2)}
                          </pre>
                        )}
                      </div>
                    ) : (
                      <motion.p className="text-gray-600 mt-4" variants={itemVariants}>No data available for the given query. Try a different ID.</motion.p>
                    )}
                  </motion.div>
                )}
                </motion.div>
          

            {/* All Trucks Section */}
            <motion.div className="bg-white rounded-lg shadow-md p-6" variants={itemVariants}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">All Fire Trucks</h3>
                <motion.button
                  onClick={fetchAllTrucks}
                  disabled={allTrucksLoading}
                  className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg hover:from-green-600 hover:to-green-700 disabled:opacity-50 shadow-lg transition-all duration-200 flex items-center gap-2 font-medium"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {allTrucksLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24"></svg>
                      Loading...
                    </>
                  ) : (
                    <>
                      <TruckIcon className="h-5 w-5" /> Fetch All Trucks
                    </>
                  )}
                </motion.button>
              </div>
              
              {allTrucksError && (
                <motion.div
                  className="mb-4 p-3 rounded-md bg-red-100 text-red-700 border border-red-200 flex items-center gap-2"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <InformationCircleIcon className="h-5 w-5" /> {allTrucksError}
                </motion.div>
              )}
              
              {allTrucks && Array.isArray(allTrucks) && allTrucks.length > 0 ? (
                <motion.div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm" variants={itemVariants}>
                  <motion.table className="w-full text-sm bg-white" initial="hidden" animate="visible" variants={containerVariants}>
                    <motion.thead className="bg-gradient-to-r from-green-500 to-green-600" variants={itemVariants}>
                      <tr>
                        <th className="px-4 py-3 border-b text-left text-white font-semibold">Truck ID</th>
                        <th className="px-4 py-3 border-b text-left text-white font-semibold">Registration</th>
                        <th className="px-4 py-3 border-b text-left text-white font-semibold">Driver Name</th>
                        <th className="px-4 py-3 border-b text-left text-white font-semibold">Phone Number</th>
                        <th className="px-4 py-3 border-b text-left text-white font-semibold">Status</th>
                        <th className="px-4 py-3 border-b text-left text-white font-semibold">Last Updated</th>
                        <th className="px-4 py-3 border-b text-left text-white font-semibold">Location</th>
                      </tr>
                    </motion.thead>
                    <motion.tbody className="bg-white">
                      {allTrucks.map((truck, idx) => (
                        <motion.tr 
                          key={idx} 
                          className="hover:bg-green-50 border-b border-gray-100 last:border-b-0 transition-colors duration-200" 
                          variants={itemVariants}
                          whileHover={{ scale: 1.01 }}
                        >
                          <td className="px-4 py-3 font-bold text-green-600">{truck.id}</td>
                          <td className="px-4 py-3 font-mono text-sm bg-gray-100 px-2 py-1 rounded text-gray-700">{truck.registrationNumber || 'N/A'}</td>
                          <td className="px-4 py-3 font-medium text-gray-800">{truck.driverName}</td>
                          <td className="px-4 py-3 text-gray-700">
                            <a href={`tel:${truck.driverPhoneNumber}`} className="hover:text-green-600 transition-colors">{truck.driverPhoneNumber}</a>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              truck.status === 'AVAILABLE' ? 'bg-green-100 text-green-800 border border-green-200' :
                              truck.status === 'EN_ROUTE' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                              'bg-gray-100 text-gray-800 border border-gray-200'
                            }`}>
                              {truck.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-xs text-gray-500">{new Date(truck.lastUpdated).toLocaleString()}</td>
                          <td className="px-4 py-3 text-xs text-gray-500">{truck.latitude?.toFixed(4)}, {truck.longitude?.toFixed(4)}</td>
                        </motion.tr>
                      ))}
                    </motion.tbody>
                  </motion.table>
                </motion.div>
              ) : (
                !allTrucksLoading && (
                  <motion.div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300" variants={itemVariants}>
                    <TruckIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 font-medium">No trucks data available</p>
                    <p className="text-gray-500 text-sm mt-1">Click the button above to fetch truck information</p>
                  </motion.div>
                )
              )}
            </motion.div>

            {/* Driver Profile Section */}
            <motion.div className="bg-white rounded-lg shadow-md p-6" variants={itemVariants}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Driver Profile</h3>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    placeholder="Enter Driver ID"
                    value={selectedDriverId}
                    onChange={e => setSelectedDriverId(e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 w-48 transition-all duration-200 shadow-sm hover:shadow-md"
                  />
                  <motion.button
                    onClick={fetchDriverProfile}
                    disabled={selectedDriverLoading}
                    className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-purple-600 hover:to-purple-700 disabled:opacity-50 shadow-lg transition-all duration-200 flex items-center gap-2 font-medium"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {selectedDriverLoading ? (
                      <>
                        <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24"></svg>
                        Loading...
                      </>
                    ) : (
                      <>
                        <UserIcon className="h-5 w-5" /> Fetch Driver Profile
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
              
              {selectedDriverError && (
                <motion.div
                  className="mb-4 p-3 rounded-md bg-red-100 text-red-700 border border-red-200 flex items-center gap-2"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <InformationCircleIcon className="h-5 w-5" /> {selectedDriverError}
                </motion.div>
              )}
              
              {selectedDriverProfile ? (
                <motion.div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-8 rounded-xl border border-purple-200 shadow-lg" variants={itemVariants}>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                      <UserIcon className="h-8 w-8" />
                    </div>
                    <div>
                      <h4 className="text-2xl font-bold text-gray-800">{selectedDriverProfile.name}</h4>
                      <p className="text-purple-600 font-medium">Role: {selectedDriverProfile.role}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="grid gap-4">
                      <div className="bg-white p-4 rounded-lg shadow-sm border border-purple-100">
                        <div className="flex items-center gap-3 mb-2">
                          <svg className="h-5 w-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <span className="text-gray-600 font-medium">Email Address</span>
                        </div>
                        <a href={`mailto:${selectedDriverProfile.email}`} className="text-purple-600 hover:text-purple-800 font-semibold hover:underline transition-colors">
                          {selectedDriverProfile.email}
                        </a>
                      </div>
                      
                      <div className="bg-white p-4 rounded-lg shadow-sm border border-purple-100">
                        <div className="flex items-center gap-3 mb-2">
                          <PhoneIcon className="h-5 w-5 text-purple-500" />
                          <span className="text-gray-600 font-medium">Phone Number</span>
                        </div>
                        <a href={`tel:${selectedDriverProfile.mobile}`} className="text-purple-600 hover:text-purple-800 font-semibold hover:underline transition-colors">
                          {selectedDriverProfile.mobile}
                        </a>
                      </div>
                    </div>
                    
                    <div className="grid gap-4">
                      <div className="bg-white p-4 rounded-lg shadow-sm border border-purple-100">
                        <div className="flex items-center gap-3 mb-2">
                          <ShieldCheckIcon className="h-5 w-5 text-purple-500" />
                          <span className="text-gray-600 font-medium">License Number</span>
                        </div>
                        <p className="font-mono text-sm bg-gray-100 px-3 py-2 rounded text-gray-700 font-semibold">
                          {selectedDriverProfile.licenseNumber}
                        </p>
                      </div>
                      
  
                      <div className="bg-white p-4 rounded-lg shadow-sm border border-purple-100">
                        <div className="flex items-center gap-3 mb-2">
                          <ShieldCheckIcon className="h-5 w-5 text-purple-500" />
                          <span className="text-gray-600 font-medium">Government ID</span>
                        </div>
                        <p className="font-mono text-sm bg-gray-100 px-3 py-2 rounded text-gray-700 font-semibold">
                          {selectedDriverProfile.govId}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-purple-200">
                    <div className="flex items-center justify-center gap-2 text-purple-600">
                      <ShieldCheckIcon className="h-5 w-5" />
                      <span className="font-medium">Verified Fire Driver</span>
                    </div>
                  </div>
                </motion.div>
              ) : (
                !selectedDriverLoading && (
                  <motion.div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300" variants={itemVariants}>
                    <UserIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 font-medium">No driver profile available</p>
                    <p className="text-gray-500 text-sm mt-1">Enter a driver ID and click the button above to fetch</p>
                  </motion.div>
                )
              )}
            </motion.div>

            {/* Truck Details Section */}
            <motion.div className="bg-white rounded-lg shadow-md p-6" variants={itemVariants}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Truck Details</h3>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    placeholder="Enter Truck ID"
                    value={selectedTruckId}
                    onChange={e => setSelectedTruckId(e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 w-48 transition-all duration-200 shadow-sm hover:shadow-md"
                  />
                  <motion.button
                    onClick={fetchTruckDetails}
                    disabled={selectedTruckLoading}
                    className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-lg hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 shadow-lg transition-all duration-200 flex items-center gap-2 font-medium"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {selectedTruckLoading ? (
                      <>
                        <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24"></svg>
                        Loading...
                      </>
                    ) : (
                      <>
                        <TruckIcon className="h-5 w-5" /> Fetch Truck Details
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
              
              {selectedTruckError && (
                <motion.div
                  className="mb-4 p-3 rounded-md bg-red-100 text-red-700 border border-red-200 flex items-center gap-2"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <InformationCircleIcon className="h-5 w-5" /> {selectedTruckError}
                </motion.div>
              )}
              
              {selectedTruckDetails ? (
                <motion.div className="bg-gradient-to-br from-orange-50 to-red-50 p-8 rounded-xl border border-orange-200 shadow-lg" variants={itemVariants}>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                      <TruckIcon className="h-8 w-8" />
                    </div>
                    <div>
                      <h4 className="text-2xl font-bold text-gray-800">Truck #{selectedTruckDetails.id}</h4>
                      <p className="text-orange-600 font-medium">Registration: {selectedTruckDetails.registrationNumber || 'N/A'}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="bg-white p-4 rounded-lg shadow-sm border border-orange-100">
                        <div className="flex items-center gap-3 mb-2">
                          <UserIcon className="h-5 w-5 text-orange-500" />
                          <span className="text-gray-600 font-medium">Driver Name</span>
                        </div>
                        <p className="text-gray-800 font-semibold">{selectedTruckDetails.driverName}</p>
                      </div>
                      
                      <div className="bg-white p-4 rounded-lg shadow-sm border border-orange-100">
                        <div className="flex items-center gap-3 mb-2">
                          <PhoneIcon className="h-5 w-5 text-orange-500" />
                          <span className="text-gray-600 font-medium">Driver Phone</span>
                        </div>
                        <a href={`tel:${selectedTruckDetails.driverPhoneNumber}`} className="text-orange-600 hover:text-orange-800 font-semibold hover:underline transition-colors">
                          {selectedTruckDetails.driverPhoneNumber}
                        </a>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow-sm border border-orange-100">
  <div className="flex items-center gap-3 mb-2">
    <TruckIcon className="h-5 w-5 text-orange-500" />
    <span className="text-gray-600 font-medium">Registration Number</span>
  </div>
  <p className="text-orange-600 font-semibold text-lg">
    {selectedTruckDetails.registrationNumber || 'N/A'}
  </p>
</div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="bg-white p-4 rounded-lg shadow-sm border border-orange-100">
                        <div className="flex items-center gap-3 mb-2">
                          <ShieldCheckIcon className="h-5 w-5 text-orange-500" />
                          <span className="text-gray-600 font-medium">Status</span>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          selectedTruckDetails.status === 'AVAILABLE' ? 'bg-green-100 text-green-800 border border-green-200' :
                          selectedTruckDetails.status === 'EN_ROUTE' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                          'bg-gray-100 text-gray-800 border border-gray-200'
                        }`}>
                          {selectedTruckDetails.status}
                        </span>
                      </div>
                      
                      <div className="bg-white p-4 rounded-lg shadow-sm border border-orange-100">
                        <div className="flex items-center gap-3 mb-2">
                          <MapPinIcon className="h-5 w-5 text-orange-500" />
                          <span className="text-gray-600 font-medium">Current Location</span>
                        </div>
                        <p className="text-gray-700 font-semibold">
                          {selectedTruckDetails.latitude?.toFixed(4)}, {selectedTruckDetails.longitude?.toFixed(4)}
                        </p>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow-sm border border-orange-100">
                        <div className="flex items-center gap-3 mb-2">
                          <ClockIcon className="h-5 w-5 text-orange-500" />
                          <span className="text-gray-600 font-medium">Last Updated</span>
                        </div>
                        <p className="text-gray-700 font-semibold">
                          {new Date(selectedTruckDetails.lastUpdated).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                !selectedTruckLoading && (
                  <motion.div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300" variants={itemVariants}>
                    <TruckIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 font-medium">No truck details available</p>
                    <p className="text-gray-500 text-sm mt-1">Enter a truck ID and click the button above to fetch</p>
                  </motion.div>
                )
              )}
            </motion.div>

            {/* Fire Station by ID Section */}
            <motion.div className="bg-white rounded-lg shadow-md p-6" variants={itemVariants}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Fire Station Details</h3>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    placeholder="Enter Station ID"
                    value={selectedStationId}
                    onChange={e => setSelectedStationId(e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-48 transition-all duration-200 shadow-sm hover:shadow-md"
                  />
                  <motion.button
                    onClick={fetchFireStationById}
                    disabled={selectedStationLoading}
                    className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-indigo-600 hover:to-indigo-700 disabled:opacity-50 shadow-lg transition-all duration-200 flex items-center gap-2 font-medium"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {selectedStationLoading ? (
                      <>
                        <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24"></svg>
                        Loading...
                      </>
                    ) : (
                      <>
                        <BuildingOfficeIcon className="h-5 w-5" /> Fetch Station Details
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
              
              {selectedStationError && (
                <motion.div
                  className="mb-4 p-3 rounded-md bg-red-100 text-red-700 border border-red-200 flex items-center gap-2"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <InformationCircleIcon className="h-5 w-5" /> {selectedStationError}
                </motion.div>
              )}
              
              {selectedStationDetails ? (
                <motion.div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-8 rounded-xl border border-indigo-200 shadow-lg" variants={itemVariants}>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                      <BuildingOfficeIcon className="h-8 w-8" />
                    </div>
                    <div>
                      <h4 className="text-2xl font-bold text-gray-800">{selectedStationDetails.fireStationName}</h4>
                      <p className="text-indigo-600 font-medium">Station ID: {selectedStationDetails.id}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-indigo-100 self-center">
                      <div className="flex items-center gap-3 mb-4">
                        <MapPinIcon className="h-6 w-6 text-indigo-500" />
                        <span className="text-gray-700 font-medium text-lg">Location Coordinates</span>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Latitude:</span>
                          <span className="font-semibold text-gray-800">{selectedStationDetails.latitude}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Longitude:</span>
                          <span className="font-semibold text-gray-800">{selectedStationDetails.longitude}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-indigo-100">
                      <div className="flex items-center gap-3 mb-4">
                        <ShieldCheckIcon className="h-6 w-6 text-indigo-500" />
                        <span className="text-gray-700 font-medium text-lg">Station Information</span>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Station ID:</span>
                          <span className="font-semibold text-indigo-600">{selectedStationDetails.id}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Status:</span>
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">Active</span>
                        </div>
                      </div>
                    </div>

                    {selectedStationDetails.latitude && selectedStationDetails.longitude && (
    <div className="md:col-span-2">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-indigo-100">
        <div className="flex items-center gap-3 mb-4">
          <MapIcon className="h-6 w-6 text-indigo-500" />
          <span className="text-gray-700 font-medium text-lg">Map Preview</span>
        </div>
        <div className="w-full h-72 overflow-hidden rounded-lg shadow-md border">
          <iframe
            className="w-full h-full"
            src={`https://maps.google.com/maps?q=${selectedStationDetails.latitude},${selectedStationDetails.longitude}&z=16&output=embed`}
            allowFullScreen
            loading="lazy"
            title="Station Location Map"
          />
        </div>
      </div>
    </div>
  )}
                  </div>
                </motion.div>
              ) : (
                !selectedStationLoading && (
                  <motion.div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300" variants={itemVariants}>
                    <BuildingOfficeIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 font-medium">No station details available</p>
                    <p className="text-gray-500 text-sm mt-1">Enter a station ID and click the button above to fetch</p>
                  </motion.div>
                )
              )}
            </motion.div>

            {/* Location Update Section */}
            <motion.div className="bg-white rounded-lg shadow-md p-6" variants={itemVariants}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Update Truck Location (Admin)</h3>
              </div>
              
              <form onSubmit={handleLocationUpdate} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Truck ID</label>
                    <input
                      type="number"
                      min="1"
                      value={locationUpdateForm.truckId}
                      onChange={e => setLocationUpdateForm(prev => ({ ...prev, truckId: e.target.value }))}
                      placeholder="Enter truck ID"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 shadow-sm hover:shadow-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                    <input
                      type="number"
                      step="any"
                      value={locationUpdateForm.latitude}
                      onChange={e => setLocationUpdateForm(prev => ({ ...prev, latitude: e.target.value }))}
                      placeholder="e.g., 18.5204"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 shadow-sm hover:shadow-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                    <input
                      type="number"
                      step="any"
                      value={locationUpdateForm.longitude}
                      onChange={e => setLocationUpdateForm(prev => ({ ...prev, longitude: e.target.value }))}
                      placeholder="e.g., 73.8567"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 shadow-sm hover:shadow-md"
                    />
                  </div>
                </div>
                
                <motion.button
                  type="submit"
                  disabled={locationUpdateLoading}
                  className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-lg hover:from-red-600 hover:to-red-700 disabled:opacity-50 shadow-lg transition-all duration-200 font-medium"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {locationUpdateLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24"></svg>
                      Updating Location...
                    </>
                  ) : (
                    <>
                      <MapPinIcon className="h-5 w-5 inline mr-2" />
                      Update Truck Location
                    </>
                  )}
                </motion.button>
              </form>
              
              {locationUpdateMessage && (
                <motion.div
                  className={`mt-4 p-3 rounded-md flex items-center gap-2 ${
                    locationUpdateMessage.includes('success')
                      ? 'bg-green-100 text-green-700 border border-green-200'
                      : 'bg-red-100 text-red-700 border border-red-200'
                  }`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {locationUpdateMessage.includes('success') ? <CheckCircleIcon className="h-5 w-5" /> : <XCircleIcon className="h-5 w-5" />}
                  {locationUpdateMessage}
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}

       {activeTab === 'emergencies' && (
          <motion.div
              className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-gray-200"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <SectionHeader icon={<FireIcon className="text-red-500" />} title="Fire Emergency Requests" />

              {fireBookingsLoading ? (
                <motion.div className="text-primary-600 font-medium text-center py-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  🔄 Loading fire emergency data...
                </motion.div>
              ) : fireBookingsError ? (
                <motion.div className="text-red-600 text-center font-semibold py-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  ❌ {fireBookingsError}
                </motion.div>
              ) : fireBookings.length === 0 ? (
                <motion.div className="text-gray-500 text-center py-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  No fire emergency requests at the moment.
                </motion.div>
              ) : (
                <>
                  <div className="overflow-x-auto backdrop-blur-lg shadow-lg  rounded-xl ">
                    <motion.table
                      className="min-w-full bg-white rounded-lg border border-gray-200 shadow-md"
                      initial="hidden"
                      animate="visible"
                      variants={containerVariants}
                    >
                      <motion.thead className="bg-orange-50 " variants={itemVariants}>
                        <tr className="text-left text-gray-800 text-sm uppercase tracking-wide">
                          <th className="px-4 py-3 border-b">Booking ID</th>
                          <th className="px-4 py-3 border-b">Issue</th>
                          <th className="px-4 py-3 border-b">Status</th>
                          <th className="px-4 py-3 border-b">Created</th>
                          <th className="px-4 py-3 border-b">Victim Phone</th>
                          <th className="px-4 py-3 border-b">Requested By</th>
                          <th className="px-4 py-3 border-b">Pickup Location</th>
                        </tr>
                      </motion.thead>
                      <motion.tbody>
                        {fireBookings.map((b) => (
                          <motion.tr
                            key={b.booking_id}
                            className="hover:bg-orange-50/40 transition border-b border-gray-100 last:border-b-0"
                            variants={itemVariants}
                          >
                            <td className="px-4 py-3 text-sm font-medium">{b.booking_id}</td>
                            <td className="px-4 py-3 text-sm">{b.issue_type}</td>
                            <td className="px-4 py-3 text-sm">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                  b.status === 'COMPLETED'
                                    ? 'bg-green-100 text-green-800'
                                    : b.status === 'PENDING'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-red-100 text-red-800'
                                }`}
                              >
                                {b.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-xs text-gray-500">{new Date(b.created_at).toLocaleString()}</td>
                            <td className="px-4 py-3 text-sm">{b.victim_phone_number || '-'}</td>
                            <td className="px-4 py-3 text-sm text-gray-700">
                              {requestingUsers[b.requested_by_user_id]?.name || 'Loading...'}
                              <div className="text-xs text-gray-400">
                                {requestingUsers[b.requested_by_user_id]?.email}
                              </div>
                            </td>
                            <td
                              className="px-4 py-3 text-xs text-blue-600 hover:text-blue-800 cursor-pointer underline"
                              onMouseEnter={() => {
                                setHoveredCoords({
                                  lat: b.pickup_latitude,
                                  lng: b.pickup_longitude,
                                });
                                setHoveredEmergencyId(b.booking_id);
                              }}
                              onMouseLeave={() => {
                                setHoveredCoords(null);
                                setHoveredEmergencyId(null);
                              }}
                            >
                              {b.pickup_latitude}, {b.pickup_longitude}
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
          className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 " 
          variants={containerVariants}
           initial="hidden"
           animate="visible">
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="flex items-center justify-between mb-6">
                <SectionHeader icon={<UserIcon />} title="Profile" />
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1">
                </button>
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
                <motion.div
                  variants={itemVariants}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="flex items-center space-x-8 border border-gray-200 rounded-xl p-6 bg-gradient-to-br from-white via-red-50 to-white shadow-sm hover:shadow-md transition-shadow">
                    
                    {/* Profile Image */}
                    <div className="relative w-32 h-32">
                      <img
                        src={FireAdmin} // Replace with actual image or placeholder
                        alt="Profile"
                        className="w-full h-full rounded-full object-cover border-4 border-white shadow-md"
                      />
                      <div className="absolute -inset-1 rounded-full bg-red-400 opacity-10 blur-lg"></div>
                    </div>

                    {/* Profile Details */}
                    <div className="flex-1">
                      <dl className="divide-y divide-gray-200 text-sm text-gray-800 space-y-3">
                        <ProfileItem icon={<Fingerprint className="text-red-600 w-4 h-4" />} label="User ID" value={profileData.id} />
                        <ProfileItem icon={<User className="text-red-600 w-4 h-4" />} label="Full Name" value={profileData.fullName} />
                        <ProfileItem icon={<Mail className="text-red-600 w-4 h-4" />} label="Email" value={profileData.email} />
                        <ProfileItem icon={<Phone className="text-red-600 w-4 h-4" />} label="Phone" value={profileData.phoneNumber} />
                        <ProfileItem icon={<IdCard className="text-red-600 w-4 h-4" />} label="Govt ID" value={profileData.governmentId} />
                      </dl>
                    </div>
                  </div>

                  {/* Edit Button */}
                  <div className="flex justify-center mt-6">
                    <button className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-all shadow-sm">
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
        
                      <form onSubmit={handleFireDriverSubmit} className="space-y-6">
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
                                className={`w-full px-4 py-3 pl-10 border ${form.ErrorsfireStationId ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-sm`}
                                placeholder="Enter Fire Station ID"
                                min="1"
                              />
                              <BuildingOfficeIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            </div>
                            {form.ErrorsfireStationId && <p className="mt-1 text-sm text-red-600">{form.ErrorsfireStationId}</p>}
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