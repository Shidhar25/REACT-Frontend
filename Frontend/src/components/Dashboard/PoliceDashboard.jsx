import { useState, useEffect, use } from 'react';
import { useNavigate } from 'react-router-dom';
import reactLogo from '../../assets/react-logo.png';
import PoliceAdmin from '../../assets/PoliceAdmin.jpg';
import { motion } from 'framer-motion'; // Import motion
import StationMap from '../Helper/StationMap';
import AllStationsMap from '../Helper/AllStationMap';
import { getAddressFromCoords } from '../../utils/getAddressFromCoords';
import { ShieldCheck, User, Phone, Mail, Fingerprint, IdCard } from 'lucide-react';
import {
  BuildingOffice2Icon,
  PencilIcon,
  ArrowRightOnRectangleIcon,
  ClipboardDocumentCheckIcon,
  UserGroupIcon,
  HomeIcon,
  ChartBarSquareIcon,
  BellAlertIcon,
  ClockIcon,
  MapPinIcon,
  DocumentTextIcon,
  PhoneIcon,
  MapIcon,
  StarIcon,
  UserIcon,
  PlusIcon,
  BuildingOfficeIcon,
  ShieldCheckIcon,
  ArrowLeftIcon,
  TrophyIcon,
  ClipboardDocumentListIcon,
  InformationCircleIcon, // For info message icon
  CheckCircleIcon, // For success message icon
  XCircleIcon // For error message icon
} from '@heroicons/react/24/outline';

import {
  Bars3BottomLeftIcon,
  ExclamationCircleIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
  hidden: { opacity: 0, scale: 0.98 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  hover: { scale: 1.01, boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.06)" },
};

const headerVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

<motion.div
  className="border-b border-gray-300 bg-police-tint"
  initial={{ y: -10, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  transition={{ duration: 0.3 }}
></motion.div>

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

export default function PoliceDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [form, setForm] = useState({
    id: '',
    stationName: '',
    latitude: '',
    longitude: '',
    availableOfficers: ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
    const [profileData, setProfileData] = useState({
  id: '',
  fullName: '',
  email: '',
  phoneNumber: '',
  governmentId: ''
});

const [enrichedEmergencies, setEnrichedEmergencies] = useState([]);
  const [stations, setStations] = useState([]);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState(null);
  const [reportStationId, setReportStationId] = useState('');
  const [reportStationHistory, setReportStationHistory] = useState([]);
  const [reportLoading, setReportLoading] = useState(false);
  const [reportError, setReportError] = useState('');
  const [emergencyHistory, setEmergencyHistory] = useState([]);
  const [emergencyLoading, setEmergencyLoading] = useState(false);
  const [emergencyError, setEmergencyError] = useState('');
  const [dashboardStats, setDashboardStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [statsError, setStatsError] = useState('');
  const [recentCases, setRecentCases] = useState([]);
  const [recentEmergencies, setRecentEmergencies] = useState([]);
const [requestingUsers, setRequestingUsers] = useState({});
const [emergenciesLoading, setEmergenciesLoading] = useState(false);
const [emergenciesError, setEmergenciesError] = useState('');
const [hoveredCoords, setHoveredCoords] = useState(null);
const [hoveredEmergencyId, setHoveredEmergencyId] = useState(null);
const [lookupId, setLookupId] = useState('');
const [lookupResult, setLookupResult] = useState(null);
const [lookupError, setLookupError] = useState(null);
const [lookupLoading, setLookupLoading] = useState(false);


  

  // New state for police officer functionality
  const [officers, setOfficers] = useState([]);
  const [officersLoading, setOfficersLoading] = useState(false);
  const [officersError, setOfficersError] = useState('');
  const [selectedStationId, setSelectedStationId] = useState('');
  const [selectedOfficerId, setSelectedOfficerId] = useState('');
  const [selectedOfficer, setSelectedOfficer] = useState(null);
  const [selectedOfficerLoading, setSelectedOfficerLoading] = useState(false);
  const [selectedOfficerError, setSelectedOfficerError] = useState('');
  const [stationOfficers, setStationOfficers] = useState([]);
  const [stationOfficersLoading, setStationOfficersLoading] = useState(false);
  const [stationOfficersError, setStationOfficersError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [reportIdError, setReportIdError] = useState(''); // Specific error for report input
const [selectedStation, setSelectedStation] = useState(null);
const [stationDetailLoading, setStationDetailLoading] = useState(false);
const [stationDetailError, setStationDetailError] = useState(null);
  const [stationId, setStationId] = useState(null); // Set this from somewhere
    const [profileName, setProfileName] = useState(''); // Add this state
    const [emergencies, setEmergencies] = useState([]);
    const [stationsWithAddress, setStationsWithAddress] = useState([]);

useEffect(() => {
  const enrich = async () => {
    const result = await Promise.all(
      stations.map(async (station) => ({
        ...station,
        address: await getAddressFromCoords(station.latitude, station.longitude),
      }))
    );
    setStationsWithAddress(result);
  };

  if (stations.length) enrich();
}, [stations]);

{enrichedEmergencies.map((em) => (
  <div key={em.id}>
    <div className="text-sm text-gray-600 mb-1">
      <span className="font-medium text-gray-800">Pickup Location:</span>{' '}
      {enrichedEmergencies.find(e => e.id === em.id)?.pickup_address || `${em.pickup_latitude}, ${em.pickup_longitude}`}
    </div>
  </div>
))}


useEffect(() => {
  const enrich = async () => {
    const result = await Promise.all(
      emergencies.map(async (em) => {
        const address = await getAddressFromCoords(em.pickup_latitude, em.pickup_longitude);
        return { ...em, pickup_address: address };
      })
    );
    setEnrichedEmergencies(result);
  };

  if (emergencies.length) enrich();
}, [emergencies]);




  // New state for form validation errors
  const [formErrors, setFormErrors] = useState({
    stationName: '',
    latitude: '',
    longitude: '',
    availableOfficers: ''
  });

  // Regex for validation
  const latRegex = /^-?([1-8]?\d(\.\d+)?|90(\.0+)?)$/;
  const lonRegex = /^-?((1?[0-7]?\d(\.\d+)?)|180(\.0+)?)$/;

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

  const handleFetchById = () => {
  const jwt = localStorage.getItem('jwt');
  if (!jwt || !lookupId) return;

  setLookupLoading(true);
  setLookupError(null);
  setLookupResult(null);

  fetch(`http://localhost:8080/police/station/${lookupId}`, {
    headers: { Authorization: `Bearer ${jwt}` }
  })
    .then(res => res.ok ? res.json() : Promise.reject('Not found'))
    .then(data => setLookupResult(data))
    .catch(err => {
      console.error('Lookup failed:', err);
      setLookupError('Station not found or server error.');
    })
    .finally(() => setLookupLoading(false));
};


  useEffect(() => {
    const jwt = localStorage.getItem('jwt');
    if (!jwt) return;

    fetch('http://localhost:8080/police/station/all', {
      headers: { Authorization: `Bearer ${jwt}` }
    })
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => setStations(data))
      .catch(err => {
        console.error('Failed to fetch stations:', err);
        toast.error('Failed to fetch stations.');
      });
  }, []);


useEffect(() => {
  if (!selectedStationId) return;

  const jwt = localStorage.getItem('jwt');
  setStationDetailLoading(true);
  setStationDetailError(null);

  fetch(`http://localhost:8080/police/station/${selectedStationId}`, {
    headers: { Authorization: `Bearer ${jwt}` }
  })
    .then(res => res.ok ? res.json() : Promise.reject('Fetch failed'))
    .then(data => setSelectedStation(data))
    .catch(err => {
      console.error('Error fetching station by ID:', err);
      setStationDetailError('Failed to load station details.');
    })
    .finally(() => setStationDetailLoading(false));
}, [selectedStationId]);




useEffect(() => {
  if (activeTab === 'overview' || activeTab === 'emergency') {
    setEmergenciesLoading(true);
    setEmergenciesError('');
    const jwt = localStorage.getItem('jwt');
    if (!jwt) {
      setEmergenciesError('Authentication required to view emergencies.');
      setEmergenciesLoading(false);
      return;
    }

    fetch('http://localhost:8080/booking/police', {
      headers: { Authorization: `Bearer ${jwt}` }
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({ message: 'Failed to parse error response.' }));
          throw new Error(errorData.message || 'Failed to fetch emergencies');
        }
        return res.json();
      })
      .then(async (data) => {
        const pending = data.filter(e => e.status !== 'COMPLETED');
        const completed = data.filter(e => e.status === 'COMPLETED');
        const all = [...pending, ...completed];
        setRecentEmergencies(all);

        // Get user info for each requester
        const ids = [...new Set(all.map(e => e.requested_by_user_id))];
        const userMap = {};
        await Promise.all(ids.map(async id => {
          try {
            const r = await fetch(`http://localhost:8080/api/user/${id}`, {
              headers: { Authorization: `Bearer ${jwt}` }
            });
            const d = await r.json();
            userMap[id] = { name: d.fullName, email: d.email };
          } catch {
            userMap[id] = { name: 'Unknown', email: '-' };
          }
        }));
        setRequestingUsers(userMap);
      })
      .catch(err => {
        setEmergenciesError(err.message || 'Could not load emergencies.');
      })
      .finally(() => setEmergenciesLoading(false));
  }
}, [activeTab]);

useEffect(() => { 
  console.log("activeTab changed to:", activeTab);
},[activeTab])

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
      .catch(err => {
        setStatsError(err.message || 'Could not load dashboard stats.');
        toast.error(err.message || 'Could not load dashboard stats.');
      })
      .finally(() => setStatsLoading(false));
  }, []);
  const ProfileItem = ({ icon, label, value }) => (
  <div className="flex items-center space-x-3 pt-2">
    <div className="w-5 h-5">{icon}</div>
    <div className="flex justify-between w-full">
      <span className="text-gray-500">{label}:</span>
      <span className="font-medium text-gray-800">{value}</span>
    </div>
  </div>
);





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

  // Fetch profile data when profile tab is active
  useEffect(() => {    
      fetchPoliceOfficerProfile();
  }, []);

  // Fetch emergency history when emergencies tab is active
  // useEffect(() => {
  //   if (activeTab === 'emergency') {
  //     console.log('activeTab', activeTab)
  //     fetchEmergencyHistory();
  //   }
  // }, [activeTab]);

   useEffect(() => {
      fetchEmergencyHistory();
  }, []);

  



 
  // --- Validation Logic for Station Form ---
  const validateFormField = (name, value) => {
    let error = '';
    switch (name) {
      case 'stationName':
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
      case 'availableOfficers':
        if (!value.toString().trim()) error = 'Available Officers is required.';
        else if (isNaN(Number(value)) || Number(value) < 0) error = 'Must be a non-negative number.';
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
    validateFormField(name, value); // Real-time validation
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    validateFormField(name, value);
  };

  const validateAllFormFields = () => {
    let isValid = true;
    const fieldsToValidate = ['stationName', 'latitude', 'longitude', 'availableOfficers'];
    for (const field of fieldsToValidate) {
      if (!validateFormField(field, form[field])) {
        isValid = false;
      }
    }
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!validateAllFormFields()) {
      setMessage('Please correct the errors in the form.');
      toast.error('Please correct the errors in the form.');
      return;
    }
    setLoading(true);

    const token = localStorage.getItem('jwt');
    if (!token) {
      setMessage('Authentication token not found. Please login again.');
      toast.error('Authentication token not found. Please login again.');
      setLoading(false);
      return;
    }

    try {
      const requestBody = {
        id: form.id ? parseInt(form.id) : undefined,
        stationName: form.stationName,
        latitude: parseFloat(form.latitude),
        longitude: parseFloat(form.longitude),
        availableOfficers: parseInt(form.availableOfficers)
      };

      const res = await fetch('http://localhost:8080/police/station/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestBody),
      });

      if (res.ok) {
        setMessage('Police station created successfully!');
        toast.success('Police station created successfully!');
        setForm({ id: '', stationName: '', latitude: '', longitude: '', availableOfficers: '' });
        setFormErrors({ stationName: '', latitude: '', longitude: '', availableOfficers: '' }); // Clear errors
      } else {
        const data = await res.json().catch(() => ({}));
        setMessage(data.message || 'Failed to create police station.');
        toast.error(data.message || 'Failed to create police station.');
      }
    } catch (err) {
      setMessage('Network error. Please try again.');
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchReportStationHistory = async () => {
    setReportError(''); // Clear previous error
    setReportIdError(''); // Clear input specific error
    if (!reportStationId.toString().trim()) {
      setReportIdError('Station ID is required.');
      toast.warn('Station ID is required.');
      return;
    }
    if (isNaN(Number(reportStationId)) || Number(reportStationId) <= 0) {
      setReportIdError('Station ID must be a positive number.');
      toast.warn('Station ID must be a positive number.');
      return;
    }

    setReportLoading(true);
    setReportStationHistory([]); // Clear previous data

    const token = localStorage.getItem('jwt') || localStorage.getItem('token');
    if (!token) {
      setReportError('Authentication token not found. Please login again.');
      toast.error('Authentication token not found. Please login again.');
      setReportLoading(false);
      return;
    }
    try {
      const res = await fetch(`http://localhost:8080/police/admin/station/${reportStationId}/history`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const result = await res.json();
        setReportStationHistory(result);
        if (result.length === 0) {
          setReportError('No history found for this station ID.');
          toast.info('No history found for this station ID.');
        } else {
          toast.success('Station history fetched successfully!');
        }
      } else {
        const data = await res.json().catch(() => ({}));
        setReportError(data.message || 'Failed to fetch station history.');
        toast.error(data.message || 'Failed to fetch station history.');
      }
    } catch (err) {
      setReportError('Network error. Please try again.');
      toast.error('Network error. Please try again.');
    } finally {
      setReportLoading(false);
    }
  };

const fetchEmergencyHistory = async () => {
    setEmergencyLoading(true);
    setEmergencyError('');
    const token = localStorage.getItem('jwt') || localStorage.getItem('token');
    if (!token) {
      setEmergencyError('Authentication token not found. Please login again.');
      toast.error('Authentication token not found. Please login again.');
      setEmergencyLoading(false);
      return;
    }
    try {
      const res = await fetch('http://localhost:8080/booking/police', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const result = await res.json();
         console.log('🚨 Emergency History:', result); 
        setEmergencyHistory(result);
        if (result.length === 0) {
            setEmergencyError('No assignment history found.');
            toast.info('No assignment history found.');
        } else {
            toast.success('Assignment history fetched successfully!');
        }
      } else {
        const data = await res.json().catch(() => ({}));
        setEmergencyError(data.message || 'Failed to fetch assignment history.');
        toast.error(data.message || 'Failed to fetch assignment history.');
      }
    } catch (err) {
      setEmergencyError('Network error. Please try again.');
      toast.error('Network error. Please try again.');
    } finally {
      setEmergencyLoading(false);
    }
  };



  // Function to fetch all police officers
  const fetchAllOfficers = async () => {
    setOfficersLoading(true);
    setOfficersError('');
    const token = localStorage.getItem('jwt') || localStorage.getItem('token');
    if (!token) {
      setOfficersError('Authentication token not found. Please login again.');
      toast.error('Authentication token not found. Please login again.');
      setOfficersLoading(false);
      return;
    }
    try {
      const res = await fetch('http://localhost:8080/police/admin/station/officers', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const result = await res.json();
        setOfficers(result);
        if (result.length === 0) {
          setOfficersError('No officers found.');
          toast.info('No officers found.');
        } else {
          toast.success('Officers fetched successfully!');
        }
      } else {
        const data = await res.json().catch(() => ({}));
        setOfficersError(data.message || 'Failed to fetch officers.');
        toast.error(data.message || 'Failed to fetch officers.');
      }
    } catch (err) {
      setOfficersError('Network error. Please try again.');
      toast.error('Network error. Please try again.');
    } finally {
      setOfficersLoading(false);
    }
  };

  // Function to fetch officers by station ID
  const fetchOfficersByStation = async () => {
    if (!selectedStationId.toString().trim()) {
      toast.warn('Please enter a station ID.');
      return;
    }
    if (isNaN(Number(selectedStationId)) || Number(selectedStationId) <= 0) {
      toast.warn('Station ID must be a positive number.');
      return;
    }

    setStationOfficersLoading(true);
    setStationOfficersError('');
    const token = localStorage.getItem('jwt') || localStorage.getItem('token');
    if (!token) {
      setStationOfficersError('Authentication token not found. Please login again.');
      toast.error('Authentication token not found. Please login again.');
      setStationOfficersLoading(false);
      return;
    }
    try {
      const res = await fetch(`http://localhost:8080/police/admin/station/officers/${selectedStationId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const result = await res.json();
        setStationOfficers(result);
        if (result.length === 0) {
          setStationOfficersError('No officers found for this station.');
          toast.info('No officers found for this station.');
        } else {
          toast.success('Station officers fetched successfully!');
        }
      } else {
        const data = await res.json().catch(() => ({}));
        setStationOfficersError(data.message || 'Failed to fetch station officers.');
        toast.error(data.message || 'Failed to fetch station officers.');
      }
    } catch (err) {
      setStationOfficersError('Network error. Please try again.');
      toast.error('Network error. Please try again.');
    } finally {
      setStationOfficersLoading(false);
    }
  };

  // Function to fetch single officer details
  const fetchOfficerDetails = async () => {
    if (!selectedOfficerId.toString().trim()) {
      toast.warn('Please enter an officer ID.');
      return;
    }
    if (isNaN(Number(selectedOfficerId)) || Number(selectedOfficerId) <= 0) {
      toast.warn('Officer ID must be a positive number.');
      return;
    }

    setSelectedOfficerLoading(true);
    setSelectedOfficerError('');
    const token = localStorage.getItem('jwt') || localStorage.getItem('token');
    if (!token) {
      setSelectedOfficerError('Authentication token not found. Please login again.');
      toast.error('Authentication token not found. Please login again.');
      setSelectedOfficerLoading(false);
      return;
    }
    try {
      const res = await fetch(`http://localhost:8080/police/admin/station/officer/${selectedOfficerId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const result = await res.json();
        setSelectedOfficer(result);
        toast.success('Officer details fetched successfully!');
      } else {
        const data = await res.json().catch(() => ({}));
        setSelectedOfficerError(data.message || 'Failed to fetch officer details.');
        toast.error(data.message || 'Failed to fetch officer details.');
        setSelectedOfficer(null);
      }
    } catch (err) {
      setSelectedOfficerError('Network error. Please try again.');
      toast.error('Network error. Please try again.');
      setSelectedOfficer(null);
    } finally {
      setSelectedOfficerLoading(false);
    }
  };


  const fetchPoliceOfficerProfile = async () => {
    setProfileLoading(true);
    setProfileError(null);
    try {
      const token = localStorage.getItem('jwt') || localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/api/user/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });


      if (response.ok) {
        const data = await response.json();
        console.log(data)
        setProfileData({
        id: data.id,
        fullName: data.fullName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        governmentId: data.governmentId
      });
      } else {
        const errorData = await response.json();
        setProfileError(errorData.message || 'Failed to fetch profile data');
        toast.error('Failed to fetch profile data');
      }
    } catch (error) {
      console.error('Error fetching police officer profile:', error);
      setProfileError('Failed to fetch profile data');
      toast.error('Failed to fetch profile data');
    } finally {
      setProfileLoading(false);
    }
  };

  const QuickActionCard = ({ title, description, Icon, onClick }) => (
    <motion.div
      onClick={onClick}
      className={`bg-white p-6 rounded-lg shadow-md cursor-pointer flex items-center space-x-4 text-gray-800 relative overflow-hidden transition-all duration-200`}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      whileTap={{ scale: 0.98 }}
    >
      <div className="text-3xl relative z-10 text-blue-500">
        <Icon className="h-10 w-10" />
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

 const StatCard = ({ title, value, subtitle, icon, bgColorClass = "bg-white" }) => {
  return (
    <div
      className={`rounded-xl p-5 shadow-sm border border-gray-200 flex items-center justify-between ${bgColorClass}`}
    >
      {/* Icon */}
      <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-white shadow-inner">
        {icon}
      </div>

      {/* Text */}
      <div className="text-right ml-4">
        <p className="text-2xl font-semibold text-gray-800">{value}</p>
        <p className="text-sm text-gray-500">{title}</p>
        {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
      </div>
    </div>
  );
};


  const jwt = localStorage.getItem('jwt');
  const userInfo = decodeJWT(jwt);
 

  return (
<div className="min-h-screen bg-[#EAF3FA] font-inter text-gray-800">
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
      <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />

<div className=" bg-police-tint">
  {/* Header Top Bar */}
  <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
    
    {/* Left - Logo + Title */}
    <div className="flex items-center gap-4">
      <img
        src={reactLogo}
        alt="REACT Logo"
        className="h-14 w-14 object-contain rounded-xl bg-white p-2 shadow-sm"
      />
      <div>
        <h1 className="text-xl font-semibold text-police-dark">Police Admin Dashboard</h1>
        <p className="text-sm text-police-subtle">Law Enforcement Management System</p>
      </div>
    </div>

    {/* Right - User Info & Actions */}
    <div className="flex items-center gap-6">
      
      {/* User Info */}
      <div className="text-right">
        <p className="text-sm text-gray-700">Welcome {profileData.fullName}</p>
        <p className="text-xs text-gray-500">Updated: {new Date().toLocaleTimeString()}</p>
      </div>

      {/* Profile Image */}
      <div
        onClick={() => setActiveTab('profile')}
        title="Go to Profile"
        className="cursor-pointer"
      >
        <img
          src={PoliceAdmin} // 🔁 Replace with actual police admin avatar
          alt="Admin"
          className="h-10 w-10 rounded-full object-cover border-2 border-white shadow"
        />
      </div>

      {/* Icon Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate('/')}
          title="Home"
          className="text-gray-600 hover:text-blue-600 transition"
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




      {/* Navbar - Police Capsule Style */}
<div className="w-full flex justify-center my-6">
  <nav className="bg-[#e4f1fd] border border-blue-100 rounded-full shadow-md px-4 py-2 flex space-x-4 overflow-x-auto max-w-5xl">
    {[
      { id: 'overview', name: 'Overview', icon: <Bars3BottomLeftIcon className="h-5 w-5" /> },
      { id: 'emergency', name: 'Emergency', icon: <ExclamationCircleIcon className="h-5 w-5" /> },
      { id: 'stations', name: 'Station', icon: <BuildingOffice2Icon className="h-5 w-5" /> },
      { id: 'officers', name: 'Officers', icon: <UserGroupIcon className="h-5 w-5" /> },
      { id: 'profile', name: 'Profile', icon: <UserCircleIcon className="h-5 w-5" /> },
    
    ].map((tab) => (
      <motion.button
        key={tab.id}
        onClick={() => setActiveTab(tab.id)}
        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all
          ${
            activeTab === tab.id
              ? 'bg-blue-100 text-blue-700 border-blue-300'
              : 'text-gray-600 border-transparent hover:bg-blue-50 hover:text-blue-600'
          }`}
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
          <motion.div className="space-y-8" variants={itemVariants}>

            {/* Quick Actions */}
            <div>
              <SectionHeader icon={<ClipboardDocumentCheckIcon />} title="Quick Actions" />
              
              <motion.div 
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { staggerChildren: 0.05, delayChildren: 0.2 }
                  },
                }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {[
                  {
                    title: "Create Station",
                    description: "Add a new police station",
                    Icon: PlusIcon,
                    onClick: () => setActiveTab('create-station')
                  },
                  {
                    title: "View Emergencies",
                    description: "Monitor active emergencies",
                    Icon: BellAlertIcon,
                    onClick: () => setActiveTab('emergencies')
                  },
                  {
                    title: "Manage Officers",
                    description: "View and manage police officers",
                    Icon: ShieldCheckIcon,
                    onClick: () => setActiveTab('officers')
                  },
                  {
                    title: "My Profile",
                    description: "Update personal information",
                    Icon: UserIcon,
                    onClick: () => setActiveTab('profile')
                  }
                ].map(({ title, description, Icon, onClick }, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 cursor-pointer transition duration-200"
                    onClick={onClick}
                  >
                    <div className="flex items-center gap-4 mb-3">
                      <Icon className="h-6 w-6 text-gray-700" />
                      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                    </div>
                    <p className="text-sm text-gray-500">{description}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>

           {/* Statistics Cards */}
            {statsLoading ? (
              <p className="text-gray-500 text-center">Loading stats...</p>
            ) : statsError ? (
              <p className="text-red-500 text-center">Error: {statsError}</p>
            ) : dashboardStats ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Stations */}
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                >
                  <StatCard
                    title="Total Stations"
                    value={dashboardStats.total_police_stations}
                    subtitle="Active police stations"
                    icon={<BuildingOfficeIcon className="h-6 w-6 text-indigo-600" />}
                    bgColorClass="bg-gradient-to-tr from-indigo-50 to-white"
                  />
                </motion.div>

                {/* Total Officers */}
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                >
                  <StatCard
                    title="Total Officers"
                    value={dashboardStats.total_police_officers}
                    subtitle="On duty officers"
                    icon={<UserGroupIcon className="h-6 w-6 text-blue-600" />}
                    bgColorClass="bg-gradient-to-tr from-blue-50 to-white"
                  />
                </motion.div>

                {/* Service Bookings */}
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                >
                  <StatCard
                    title="Service Bookings"
                    value={dashboardStats.police_service_bookings}
                    subtitle="Today's calls"
                    icon={<BellAlertIcon className="h-6 w-6 text-rose-500" />}
                    bgColorClass="bg-gradient-to-tr from-rose-50 to-white"
                  />
                </motion.div>

                {/* Avg Response Time */}
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                >
                  <StatCard
                    title="Avg Response Time"
                    value={`${dashboardStats.average_completion_time_minutes} min`}
                    subtitle="Emergency response"
                    icon={<ClockIcon className="h-6 w-6 text-gray-600" />}
                    bgColorClass="bg-gradient-to-tr from-gray-100 to-white"
                  />
                </motion.div>
              </div>
            ) : (
              <p className="text-gray-500 text-center">No stats available.</p>
            )}

            

            
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
                              Time :{new Date(em.created_at).toLocaleString()}
                            </div>
                            <div className="flex items-center text-sm text-gray-600 mb-1">
                              <div className="mr-3 flex items-center justify-center h-full">
                                <UserIcon className="h-6 w-6 text-gray-400" />
                              </div>
                              <div className="text-left">
                                <div className="font-medium">Requested by {requestingUsers[em.requested_by_user_id]?.name || 'Loading...'}</div>
                                <div className="text-xs text-gray-500">{requestingUsers[em.requested_by_user_id]?.email}</div>
                              </div>
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
  {
    enrichedEmergencies.find(e => e.booking_id === em.booking_id)?.pickup_address
    || `${em.pickup_latitude}, ${em.pickup_longitude}`
  }
</div>

                 <div className="text-sm text-gray-500 mt-2">
                              <ClockIcon className="inline h-4 w-4 mr-1 text-gray-400" />
                              Time :{new Date(em.created_at).toLocaleString()}
                            </div>
                            <div className="flex items-center text-sm text-gray-600 mb-1">
                              <div className="mr-3 flex items-center justify-center h-full">
                                <UserIcon className="h-6 w-6 text-gray-400" />
                              </div>
                              <div className="text-left">
                                <div className="font-medium">Requested by {requestingUsers[em.requested_by_user_id]?.name || 'Loading...'}</div>
                                <div className="text-xs text-gray-500">{requestingUsers[em.requested_by_user_id]?.email}</div>
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
  <motion.div
    className="space-y-8"
    variants={containerVariants}
    initial="hidden"
    animate="visible"
  >
    {/* Header */}
    <div className="flex items-center justify-between">
      <SectionHeader icon={<BuildingOfficeIcon />} title="Police Stations" />
      {!showCreateForm && (
        <motion.button
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200 shadow-sm flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <PlusIcon className="h-5 w-5" /> Add Station
        </motion.button>
      )}
    </div>



    {/* Main Panel */}
    <div className="bg-white/60 backdrop-blur-lg p-6 rounded-xl shadow-md border border-gray-200 transition-shadow hover:shadow-lg">
      {!showCreateForm ? (
        // ▶ Station List View
        <>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Registered Stations</h3>
          {stations.length === 0 ? (
            <p className="text-sm text-gray-500">No stations found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {stations.map((station, index) => (
                <motion.div
                  key={index}
                  className="bg-white border border-blue-100 rounded-lg p-4 shadow-sm hover:shadow-md transition duration-200"
                  variants={itemVariants}
                >
                  <div className="flex items-center mb-2 space-x-2">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium inline-block">
                        ID: {station.id}
                      </span>
                      <h4 className="font-semibold text-blue-800 text-sm md:text-base">{station.stationName}</h4>
                  </div>
                  <p className="text-sm text-gray-700 mt-1">Officers: {station.availableOfficers}</p>
                  <p className="text-xs text-gray-500 mt-2">Lat: {station.latitude}, Lng: {station.longitude}</p>

                </motion.div>
              ))}
            </div>
          )}
        </>
      ) : (
        // ▶ Create Station View
        <motion.div variants={itemVariants}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Create Police Station</h3>
            <button
              onClick={() => setShowCreateForm(false)}
              className="text-gray-500 hover:text-gray-700 flex items-center gap-1 text-sm"
            >
              <ArrowLeftIcon className="h-4 w-4" /> Back to Stations
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Station Name */}
            <div>
              <label htmlFor="stationName" className="text-sm font-medium text-gray-700">Station Name</label>
              <input
                type="text"
                id="stationName"
                name="stationName"
                value={form.stationName}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                maxLength={100}
                placeholder="Enter station name"
                className={`mt-1 w-full px-3 py-2 border ${formErrors.stationName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500`}
              />
              {formErrors.stationName && <p className="text-sm text-red-600 mt-1">{formErrors.stationName}</p>}
            </div>

            {/* Latitude & Longitude */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="latitude" className="text-sm font-medium text-gray-700">Latitude</label>
                <input
                  type="number"
                  step="any"
                  name="latitude"
                  value={form.latitude}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="e.g., 19.0760"
                  required
                  className={`mt-1 w-full px-3 py-2 border ${formErrors.latitude ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500`}
                />
                {formErrors.latitude && <p className="text-sm text-red-600 mt-1">{formErrors.latitude}</p>}
              </div>
              <div>
                <label htmlFor="longitude" className="text-sm font-medium text-gray-700">Longitude</label>
                <input
                  type="number"
                  step="any"
                  name="longitude"
                  value={form.longitude}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="e.g., 72.8777"
                  required
                  className={`mt-1 w-full px-3 py-2 border ${formErrors.longitude ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500`}
                />
                {formErrors.longitude && <p className="text-sm text-red-600 mt-1">{formErrors.longitude}</p>}
              </div>
            </div>

            {/* Officers */}
            <div>
              <label htmlFor="availableOfficers" className="text-sm font-medium text-gray-700">Available Officers</label>
              <input
                type="number"
                min="0"
                name="availableOfficers"
                value={form.availableOfficers}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="e.g., 12"
                required
                className={`mt-1 w-full px-3 py-2 border ${formErrors.availableOfficers ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500`}
              />
              {formErrors.availableOfficers && <p className="text-sm text-red-600 mt-1">{formErrors.availableOfficers}</p>}
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 disabled:opacity-60 font-medium shadow-sm transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 mr-2 inline" viewBox="0 0 24 24" />
                  Creating Station...
                </>
              ) : 'Create Station'}
            </motion.button>
          </form>

          {/* Feedback Message */}
          {message && (
            <motion.div
              className={`mt-4 p-3 rounded-md flex items-center gap-2 ${
                message.includes('success')
                  ? 'bg-green-100 text-green-700 border border-green-200'
                  : 'bg-red-100 text-red-700 border border-red-200'
              }`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {message.includes('success') ? <CheckCircleIcon className="h-5 w-5" /> : <XCircleIcon className="h-5 w-5" />}
              {message}
            </motion.div>
          )}
        </motion.div>

      )}
    </div>
    {stations.length > 0 && (
  <div className="mt-8">
    <h3 className="text-lg font-semibold text-gray-800 mb-2">📍 All Stations on Map</h3>
    <AllStationsMap stations={stations} />
  </div>
)}

    

      {/* 🔍 Fetch Station by ID Section */}
      <motion.div
        className="bg-white rounded-lg shadow-md p-6 mt-10 border border-gray-100"
        variants={itemVariants}
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Lookup Station by ID</h3>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleFetchById(); // Call below-defined handler
          }}
          className="space-y-4"
        >
          <div className="flex items-center gap-4">
            <input
              type="number"
              placeholder="Enter Station ID"
              value={lookupId}
              onChange={(e) => setLookupId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600"
            >
              Fetch
            </motion.button>
          </div>
        </form>

        {lookupLoading && (
          <p className="text-sm text-blue-600 mt-4 font-medium">Fetching station details...</p>
        )}

        {lookupError && (
          <p className="text-sm text-red-600 mt-4 font-medium">{lookupError}</p>
        )}

        {lookupResult && (
          <div className="mt-6 bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm text-gray-700 space-y-2">
            <div><strong>Name:</strong> {lookupResult.stationName}</div>
            <div><strong>ID:</strong> {lookupResult.id}</div>
            <div><strong>Latitude:</strong> {lookupResult.latitude}</div>
            <div><strong>Longitude:</strong> {lookupResult.longitude}</div>
            <div><strong>Available Officers:</strong> {lookupResult.availableOfficers}</div>
          </div>
          
        )}
      </motion.div>
          {lookupResult && lookupResult.latitude && lookupResult.longitude && (
            <div className="mt-6">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">📍 Location Preview</h4>
              <div className="w-full h-64 rounded-lg overflow-hidden border border-blue-100 shadow">
                <iframe
                  title="Station Location"
                  className="w-full h-full"
                  loading="lazy"
                  allowFullScreen
                  src={`https://maps.google.com/maps?q=${lookupResult.latitude},${lookupResult.longitude}&z=15&output=embed`}
                ></iframe>
              </div>
            </div>
          )}


  </motion.div>
)}

        {activeTab === 'officers' && (
          <motion.div className="space-y-8" variants={containerVariants} initial="hidden" animate="visible">
            <SectionHeader icon={<ShieldCheckIcon />} title="Police Officers Management" />
            
            {/* All Officers Section */}
            <motion.div className="bg-white rounded-lg shadow-md p-6" variants={itemVariants}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">All Officers</h3>
                <motion.button
                  onClick={fetchAllOfficers}
                  disabled={officersLoading}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 shadow-lg transition-all duration-200 flex items-center gap-2 font-medium"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {officersLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24"></svg>
                      Loading...
                    </>
                  ) : (
                    <>
                      <ShieldCheckIcon className="h-5 w-5" /> Fetch All Officers
                    </>
                  )}
                </motion.button>
              </div>
              
              {officersError && (
                <motion.div
                  className="mb-4 p-3 rounded-md bg-red-100 text-red-700 border border-red-200 flex items-center gap-2"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <InformationCircleIcon className="h-5 w-5" /> {officersError}
                </motion.div>
              )}
              
              {officers && Array.isArray(officers) && officers.length > 0 ? (
                <motion.div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm" variants={itemVariants}>
                  <motion.table className="w-full text-sm bg-white" initial="hidden" animate="visible" variants={containerVariants}>
                    <motion.thead className="bg-gradient-to-r from-blue-500 to-blue-600" variants={itemVariants}>
                      <tr>
                        <th className="px-4 py-3 border-b text-left text-white font-semibold">Officer ID</th>
                        <th className="px-4 py-3 border-b text-left text-white font-semibold">Name</th>
                        <th className="px-4 py-3 border-b text-left text-white font-semibold">Police Station</th>
                        <th className="px-4 py-3 border-b text-left text-white font-semibold">Email</th>
                        <th className="px-4 py-3 border-b text-left text-white font-semibold">Phone Number</th>
                        <th className="px-4 py-3 border-b text-left text-white font-semibold">Government ID</th>
                      </tr>
                    </motion.thead>
                    <motion.tbody className="bg-white">
                      {officers.map((officer, idx) => (
                        <motion.tr 
                          key={idx} 
                          className="hover:bg-blue-50 border-b border-gray-100 last:border-b-0 transition-colors duration-200" 
                          variants={itemVariants}
                          whileHover={{ scale: 1.01 }}
                        >
                          <td className="px-4 py-3 font-bold text-blue-600">{officer.policeId}</td>
                          <td className="px-4 py-3 font-medium text-gray-800">{officer.name}</td>
                          <td className="px-4 py-3 text-gray-700">{officer.policeStationName}</td>
                          <td className="px-4 py-3 text-blue-600 hover:text-blue-800 transition-colors">
                            <a href={`mailto:${officer.email}`} className="hover:underline">{officer.email}</a>
                          </td>
                          <td className="px-4 py-3 text-gray-700">
                            <a href={`tel:${officer.phoneNumber}`} className="hover:text-blue-600 transition-colors">{officer.phoneNumber}</a>
                          </td>
                          <td className="px-4 py-3 font-mono text-sm bg-gray-100 px-2 py-1 rounded text-gray-700">{officer.govId}</td>
                        </motion.tr>
                      ))}
                    </motion.tbody>
                  </motion.table>
                </motion.div>
              ) : (
                !officersLoading && (
                  <motion.div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300" variants={itemVariants}>
                    <ShieldCheckIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 font-medium">No officers data available</p>
                    <p className="text-gray-500 text-sm mt-1">Click the button above to fetch officer information</p>
                  </motion.div>
                )
              )}
            </motion.div>

            {/* Officers by Station Section */}
            <motion.div className="bg-white rounded-lg shadow-md p-6" variants={itemVariants}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Officers by Station</h3>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    placeholder="Enter Station ID"
                    value={selectedStationId}
                    onChange={e => setSelectedStationId(e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 w-48 transition-all duration-200 shadow-sm hover:shadow-md"
                  />
                  <motion.button
                    onClick={fetchOfficersByStation}
                    disabled={stationOfficersLoading}
                    className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg hover:from-green-600 hover:to-green-700 disabled:opacity-50 shadow-lg transition-all duration-200 flex items-center gap-2 font-medium"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {stationOfficersLoading ? (
                      <>
                        <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24"></svg>
                        Loading...
                      </>
                    ) : (
                      <>
                        <BuildingOfficeIcon className="h-5 w-5" /> Fetch Station Officers
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
              
              {stationOfficersError && (
                <motion.div
                  className="mb-4 p-3 rounded-md bg-red-100 text-red-700 border border-red-200 flex items-center gap-2"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <InformationCircleIcon className="h-5 w-5" /> {stationOfficersError}
                </motion.div>
              )}
              
              {stationOfficers && Array.isArray(stationOfficers) && stationOfficers.length > 0 ? (
                <motion.div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm" variants={itemVariants}>
                  <motion.table className="w-full text-sm bg-white" initial="hidden" animate="visible" variants={containerVariants}>
                    <motion.thead className="bg-gradient-to-r from-green-500 to-green-600" variants={itemVariants}>
                      <tr>
                        <th className="px-4 py-3 border-b text-left text-white font-semibold">Officer ID</th>
                        <th className="px-4 py-3 border-b text-left text-white font-semibold">Name</th>
                        <th className="px-4 py-3 border-b text-left text-white font-semibold">Police Station</th>
                        <th className="px-4 py-3 border-b text-left text-white font-semibold">Email</th>
                        <th className="px-4 py-3 border-b text-left text-white font-semibold">Phone Number</th>
                        <th className="px-4 py-3 border-b text-left text-white font-semibold">Government ID</th>
                      </tr>
                    </motion.thead>
                    <motion.tbody className="bg-white">
                      {stationOfficers.map((officer, idx) => (
                        <motion.tr 
                          key={idx} 
                          className="hover:bg-green-50 border-b border-gray-100 last:border-b-0 transition-colors duration-200" 
                          variants={itemVariants}
                          whileHover={{ scale: 1.01 }}
                        >
                          <td className="px-4 py-3 font-bold text-green-600">{officer.policeId}</td>
                          <td className="px-4 py-3 font-medium text-gray-800">{officer.name}</td>
                          <td className="px-4 py-3 text-gray-700">{officer.policeStationName}</td>
                          <td className="px-4 py-3 text-green-600 hover:text-green-800 transition-colors">
                            <a href={`mailto:${officer.email}`} className="hover:underline">{officer.email}</a>
                          </td>
                          <td className="px-4 py-3 text-gray-700">
                            <a href={`tel:${officer.phoneNumber}`} className="hover:text-green-600 transition-colors">{officer.phoneNumber}</a>
                          </td>
                          <td className="px-4 py-3 font-mono text-sm bg-gray-100 px-2 py-1 rounded text-gray-700">{officer.govId}</td>
                        </motion.tr>
                      ))}
                    </motion.tbody>
                  </motion.table>
                </motion.div>
              ) : (
                !stationOfficersLoading && (
                  <motion.div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300" variants={itemVariants}>
                    <BuildingOfficeIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 font-medium">No station officers data available</p>
                    <p className="text-gray-500 text-sm mt-1">Enter a station ID and click the button above to fetch</p>
                  </motion.div>
                )
              )}
            </motion.div>

            {/* Single Officer Details Section */}
            <motion.div className="bg-white rounded-lg shadow-md p-6" variants={itemVariants}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Single Officer Details</h3>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    placeholder="Enter Officer ID"
                    value={selectedOfficerId}
                    onChange={e => setSelectedOfficerId(e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 w-48 transition-all duration-200 shadow-sm hover:shadow-md"
                  />
                  <motion.button
                    onClick={fetchOfficerDetails}
                    disabled={selectedOfficerLoading}
                    className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-purple-600 hover:to-purple-700 disabled:opacity-50 shadow-lg transition-all duration-200 flex items-center gap-2 font-medium"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {selectedOfficerLoading ? (
                      <>
                        <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24"></svg>
                        Loading...
                      </>
                    ) : (
                      <>
                        <UserIcon className="h-5 w-5" /> Fetch Officer Details
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
              
              {selectedOfficerError && (
                <motion.div
                  className="mb-4 p-3 rounded-md bg-red-100 text-red-700 border border-red-200 flex items-center gap-2"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <InformationCircleIcon className="h-5 w-5" /> {selectedOfficerError}
                </motion.div>
              )}
              
              {selectedOfficer ? (
                <motion.div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-8 rounded-xl border border-purple-200 shadow-lg" variants={itemVariants}>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                      <UserIcon className="h-8 w-8" />
                    </div>
                    <div>
                      <h4 className="text-2xl font-bold text-gray-800">{selectedOfficer.name}</h4>
                      <p className="text-purple-600 font-medium">Officer ID: {selectedOfficer.policeId}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="bg-white p-4 rounded-lg shadow-sm border border-purple-100">
                        <div className="flex items-center gap-3 mb-2">
                          <BuildingOfficeIcon className="h-5 w-5 text-purple-500" />
                          <span className="text-gray-600 font-medium">Police Station</span>
                        </div>
                        <p className="text-gray-800 font-semibold">{selectedOfficer.policeStationName}</p>
                      </div>
                      
                      <div className="bg-white p-4 rounded-lg shadow-sm border border-purple-100">
                        <div className="flex items-center gap-3 mb-2">
                          <svg className="h-5 w-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <span className="text-gray-600 font-medium">Email Address</span>
                        </div>
                        <a href={`mailto:${selectedOfficer.email}`} className="text-purple-600 hover:text-purple-800 font-semibold hover:underline transition-colors">
                          {selectedOfficer.email}
                        </a>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="bg-white p-4 rounded-lg shadow-sm border border-purple-100">
                        <div className="flex items-center gap-3 mb-2">
                          <PhoneIcon className="h-5 w-5 text-purple-500" />
                          <span className="text-gray-600 font-medium">Phone Number</span>
                        </div>
                        <a href={`tel:${selectedOfficer.phoneNumber}`} className="text-purple-600 hover:text-purple-800 font-semibold hover:underline transition-colors">
                          {selectedOfficer.phoneNumber}
                        </a>
                      </div>
                      
                      <div className="bg-white p-4 rounded-lg shadow-sm border border-purple-100">
                        <div className="flex items-center gap-3 mb-2">
                          <ShieldCheckIcon className="h-5 w-5 text-purple-500" />
                          <span className="text-gray-600 font-medium">Government ID</span>
                        </div>
                        <p className="font-mono text-sm bg-gray-100 px-3 py-2 rounded text-gray-700 font-semibold">
                          {selectedOfficer.govId}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-purple-200">
                    <div className="flex items-center justify-center gap-2 text-purple-600">
                      <ShieldCheckIcon className="h-5 w-5" />
                      <span className="font-medium">Verified Police Officer</span>
                    </div>
                  </div>
                </motion.div>
              ) : (
                !selectedOfficerLoading && (
                  <motion.div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300" variants={itemVariants}>
                    <UserIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 font-medium">No officer details available</p>
                    <p className="text-gray-500 text-sm mt-1">Enter an officer ID and click the button above to fetch</p>
                  </motion.div>
                )
              )}
            </motion.div>
          </motion.div>
        )}


          {activeTab === 'emergency' && (
            <motion.div
              className="bg-blue-50 rounded-2xl shadow-sm p-6 border border-blue-100 relative"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <SectionHeader icon={<ExclamationCircleIcon />} title="Emergency Monitoring" />

              {emergencyLoading ? (
                <motion.div className="text-center py-10 text-blue-600 font-medium" variants={itemVariants}>
                  Loading emergencies...
                </motion.div>
              ) : emergencyError ? (
                <motion.div className="text-center py-10 text-red-600 font-medium" variants={itemVariants}>
                  {emergencyError}
                </motion.div>
              ) : emergencyHistory.length === 0 ? (
                <motion.div className="text-center py-10 text-gray-500" variants={itemVariants}>
                  No recent emergencies found.
                </motion.div>
              ) : (
                <>
                  {/* Table */}
                  <div className="overflow-x-auto">
                    <motion.table
                      className="min-w-full text-sm text-gray-800 bg-white border border-gray-200 rounded-xl overflow-hidden"
                      initial="hidden"
                      animate="visible"
                      variants={containerVariants}
                    >
                      <motion.thead className="bg-blue-100/70" variants={itemVariants}>
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
                      <motion.tbody className="divide-y divide-gray-100">
                        {emergencyHistory.map((b) => (
                          <motion.tr
                            key={b.booking_id}
                            className="hover:bg-blue-50 transition border-b border-gray-100 last:border-b-0"
                            variants={itemVariants}
                          >
                            <td className="px-4 py-3 font-medium">{b.booking_id}</td>
                            <td className="px-4 py-3">{b.issue_type}</td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                b.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                                b.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {b.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-xs text-gray-500">
                              {new Date(b.created_at).toLocaleString()}
                            </td>
                            <td className="px-4 py-3">{b.victim_phone_number || '-'}</td>
                            <td className="px-4 py-3">
                              {requestingUsers[b.requested_by_user_id]?.name || 'Loading...'}
                              <div className="text-xs text-gray-400">
                                {requestingUsers[b.requested_by_user_id]?.email}
                              </div>
                            </td>
                            <td
                              className="px-4 py-3 text-blue-600 hover:text-blue-800 cursor-pointer underline"
                              onMouseEnter={() => {
                                setHoveredCoords({ lat: b.pickup_latitude, lng: b.pickup_longitude });
                                setHoveredEmergencyId(b.booking_id);
                              }}
                              onMouseLeave={() => {
                                setHoveredCoords(null);
                                setHoveredEmergencyId(null);
                              }}
                            >
                              {b.pickup_latitude.toFixed(4)}, {b.pickup_longitude.toFixed(4)}
                            </td>
                          </motion.tr>
                        ))}
                      </motion.tbody>
                    </motion.table>
                  </div>

                  {/* Floating Map */}
                  {hoveredCoords && hoveredEmergencyId && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
                      <div
                        className="relative w-[60%] h-[50%] border-2 border-white shadow-xl rounded-xl overflow-hidden pointer-events-auto bg-white"
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
                  <UserIcon className="text-blue-600 w-6 h-6" />
                  <h2 className="text-xl font-bold text-gray-800">Officer Profile</h2>
                </div>

                {/* Loading State */}
                {profileLoading && (
                  <motion.div className="text-center py-10 text-blue-600 font-semibold" variants={itemVariants}>
                    Loading profile data...
                  </motion.div>
                )}

                {/* Error State */}
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
                    <div className="flex items-center space-x-8 border border-gray-200 rounded-xl p-6 bg-gradient-to-br from-white via-blue-50 to-white shadow-sm hover:shadow-md transition-shadow">
                      
                      {/* Profile Image */}
                      <div className="relative w-32 h-32">
                        <img
                          src={PoliceAdmin} // ⛳ Replace this with your image import or fallback
                          alt="Profile"
                          className="w-full h-full rounded-full object-cover border-4 border-white shadow-md"
                        />
                        <div className="absolute -inset-1 rounded-full bg-blue-400 opacity-10 blur-lg"></div>
                      </div>

                      {/* Profile Fields */}
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
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

      </motion.div>
    </div>
  );
}