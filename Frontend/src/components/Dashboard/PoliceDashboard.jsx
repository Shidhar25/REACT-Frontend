import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion'; // Import motion
import {
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
    name: 'Officer John Smith',
    badge: 'P-2024-001',
    rank: 'Senior Officer',
    department: 'Patrol Division',
    experience: '8 years',
    email: 'john.smith@police.gov',
    phone: '+1 (555) 123-4567'
  });
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

  // New state for form validation errors
  const [formErrors, setFormErrors] = useState({
    stationName: '',
    latitude: '',
    longitude: '',
    availableOfficers: ''
  });
  const [reportIdError, setReportIdError] = useState(''); // Specific error for report input

  // Regex for validation
  const latRegex = /^-?([1-8]?\d(\.\d+)?|90(\.0+)?)$/;
  const lonRegex = /^-?((1?[0-7]?\d(\.\d+)?)|180(\.0+)?)$/;


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

  // Fetch profile data when profile tab is active
  useEffect(() => {
    if (activeTab === 'profile') {
      fetchPoliceOfficerProfile();
    }
  }, [activeTab]);

  // Fetch emergency history when emergencies tab is active
  useEffect(() => {
    if (activeTab === 'emergencies') {
      fetchEmergencyHistory();
    }
  }, [activeTab]);

  // Mock station ranking data - (Retained for display purposes, but consider fetching from API)
  const stationRankings = [
    { name: 'Central Police Station', score: 95, officers: 25, cases: 156, responseTime: '3.2 min' },
    { name: 'North District Station', score: 92, officers: 18, cases: 134, responseTime: '3.8 min' },
    { name: 'South Station', score: 88, officers: 22, cases: 142, responseTime: '4.1 min' },
    { name: 'East Police Station', score: 85, officers: 15, cases: 98, responseTime: '4.5 min' },
    { name: 'West District', score: 82, officers: 20, cases: 127, responseTime: '4.8 min' },
    { name: 'Downtown Station', score: 78, officers: 30, cases: 189, responseTime: '5.2 min' }
  ];

  // Mock recent cases - (Retained for display purposes, but consider fetching from API)
  const recentCases = [
    { id: 'C-2024-001', type: 'Traffic Violation', status: 'Resolved', time: '2 hours ago', location: 'Main Street' },
    { id: 'C-2024-002', type: 'Domestic Dispute', status: 'In Progress', time: '4 hours ago', location: 'Oak Avenue' },
    { id: 'C-2024-003', type: 'Burglary', status: 'Under Investigation', time: '6 hours ago', location: 'Park Lane' },
    { id: 'C-2024-004', type: 'Assault', status: 'Resolved', time: '8 hours ago', location: 'Downtown Area' },
    { id: 'C-2024-005', type: 'Traffic Accident', status: 'In Progress', time: '10 hours ago', location: 'Highway 101' }
  ];

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
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/police-officer/v1/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProfileData({
          name: data.name || 'Officer Name',
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

  const StatCard = ({ title, value, subtitle, Icon }) => (
    <motion.div
      className={`bg-white p-6 rounded-lg shadow-md text-gray-800 relative overflow-hidden flex items-center justify-between`}
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
          <Icon className="h-10 w-10" />
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
    <div className="min-h-screen bg-gray-50">
      <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />

      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Police Dashboard</h1>
              <p className="text-gray-500 mt-1">Law Enforcement Management System</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Welcome, {profileData.name.split(' ')[1]}</p>
                <p className="text-xs text-gray-500">Last updated: {new Date().toLocaleTimeString()}</p>
              </div>
              <button
                  onClick={() => {
                    localStorage.removeItem('jwt');
                    navigate('/login');
                  }}
                  className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                >
                  Logout
                </button>
              <button
                onClick={() => setActiveTab('profile')}
                className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold hover:bg-blue-600 transition-all duration-200 shadow-md"
              >
                <UserIcon className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', name: 'Overview', Icon: ChartBarSquareIcon },
              { id: 'stations', name: 'Stations', Icon: BuildingOfficeIcon },
              { id: 'officers', name: 'Officers', Icon: ShieldCheckIcon },
              { id: 'emergencies', name: 'Emergencies', Icon: BellAlertIcon },
              { id: 'reports', name: 'Reports', Icon: ClipboardDocumentListIcon },
              { id: 'profile', name: 'Profile', Icon: UserIcon }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300'
                }`}
              >
                <tab.Icon className="inline h-5 w-5 mr-2 align-middle" />
                {tab.name}
              </button>
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
          <motion.div className="space-y-8" variants={itemVariants}>
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {statsLoading ? (
                <motion.div className="col-span-4 text-center py-8 text-blue-600 font-semibold" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>Loading statistics...</motion.div>
              ) : statsError ? (
                <motion.div className="col-span-4 text-center py-8 text-red-600 font-semibold" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{statsError}</motion.div>
              ) : dashboardStats ? (
                <>
                  <StatCard
                    title="Total Stations"
                    value={dashboardStats.total_police_stations}
                    subtitle="Active police stations"
                    Icon={BuildingOfficeIcon}
                  />
                  <StatCard
                    title="Total Officers"
                    value={dashboardStats.total_police_officers}
                    subtitle="On duty officers"
                    Icon={ShieldCheckIcon}
                  />
                  <StatCard
                    title="Police Service Bookings"
                    value={dashboardStats.police_service_bookings}
                    subtitle="Today's calls"
                    Icon={BellAlertIcon}
                  />
                  <StatCard
                    title="Avg Completion Time"
                    value={dashboardStats.average_completion_time_minutes + ' min'}
                    subtitle="Emergency response"
                    Icon={ClockIcon}
                  />
                </>
              ) : null}
            </div>

            {/* Quick Actions */}
            <div>
              <SectionHeader icon={<ClipboardDocumentListIcon />} title="Quick Actions" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <QuickActionCard
                  title="Create Station"
                  description="Add a new police station"
                  Icon={PlusIcon}
                  onClick={() => setActiveTab('create-station')}
                />
                <QuickActionCard
                  title="View Emergencies"
                  description="Monitor active emergencies"
                  Icon={BellAlertIcon}
                  onClick={() => setActiveTab('emergencies')}
                />
                <QuickActionCard
                  title="Manage Officers"
                  description="View and manage police officers"
                  Icon={ShieldCheckIcon}
                  onClick={() => setActiveTab('officers')}
                />
                <QuickActionCard
                  title="Generate Reports"
                  description="Create incident reports"
                  Icon={ClipboardDocumentListIcon}
                  onClick={() => setActiveTab('reports')}
                />
                <QuickActionCard
                  title="Live Map"
                  description="View real-time locations"
                  Icon={MapIcon}
                  onClick={() => toast.info('Map feature coming soon!')} // Placeholder action
                />
                <QuickActionCard
                   title="Emergency Contacts"
                   description="Quick contact list"
                   Icon={PhoneIcon}
                   onClick={() => toast.info('Emergency contacts feature coming soon!')}
                 />
                 <QuickActionCard
                   title="My Profile"
                   description="Update personal information"
                   Icon={UserIcon}
                   onClick={() => setActiveTab('profile')}
                 />
              </div>
            </div>

            {/* Recent Activity */}
             <motion.div className="bg-white rounded-lg shadow-md p-6" variants={itemVariants}>
               <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h3>
               <div className="space-y-4">
                 {[
                   { time: '2 min ago', action: 'New emergency call received', location: 'Downtown Area' },
                   { time: '5 min ago', action: 'Officer dispatched', location: 'Central Station' },
                   { time: '12 min ago', action: 'Station status updated', location: 'North District' },
                   { time: '18 min ago', action: 'Report generated', location: 'South Station' }
                 ].map((activity, index) => (
                   <motion.div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors" variants={itemVariants}>
                     <div>
                       <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                       <p className="text-xs text-gray-500">{activity.location}</p>
                     </div>
                     <span className="text-xs text-gray-400">{activity.time}</span>
                   </motion.div>
                 ))}
               </div>
             </motion.div>

             {/* Recent Cases */}
             <motion.div className="bg-white rounded-lg shadow-md p-6" variants={itemVariants}>
               <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Cases</h3>
               <div className="space-y-3">
                 {recentCases.map((case_, index) => (
                   <motion.div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors" variants={itemVariants}>
                     <div className="flex items-center space-x-3">
                       <div className={`w-3 h-3 rounded-full ${
                         case_.status === 'Resolved' ? 'bg-green-500' :
                         case_.status === 'In Progress' ? 'bg-amber-500' : 'bg-red-500'
                       }`}></div>
                       <div>
                         <p className="text-sm font-medium text-gray-900">{case_.id}</p>
                         <p className="text-xs text-gray-500">{case_.type} • {case_.location}</p>
                       </div>
                     </div>
                     <div className="text-right">
                       <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                         case_.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                         case_.status === 'In Progress' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                       }`}>
                         {case_.status}
                       </span>
                       <p className="text-xs text-gray-400 mt-1">{case_.time}</p>
                     </div>
                   </motion.div>
                 ))}
               </div>
             </motion.div>
          </motion.div>
        )}

        {activeTab === 'stations' && (
          <motion.div className="space-y-8" variants={containerVariants} initial="hidden" animate="visible">
            <div className="flex items-center justify-between">
              <SectionHeader icon={<BuildingOfficeIcon />} title="Police Stations" />
              <motion.button
                onClick={() => setActiveTab('create-station')}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200 shadow-sm flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <PlusIcon className="h-5 w-5" /> Add Station
              </motion.button>
            </div>

            {/* Station List */}
            <motion.div className="bg-white rounded-lg shadow-md" variants={itemVariants}>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Active Stations</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {stationRankings.map((station, index) => (
                    <motion.div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow duration-200" variants={itemVariants}>
                      <h4 className="font-semibold text-gray-900">{station.name}</h4>
                      <p className="text-sm text-gray-600">Officers: {station.officers}</p>
                      <span className="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full mt-2">
                        Active
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
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

        {activeTab === 'create-station' && (
          <motion.div className="max-w-2xl mx-auto" variants={containerVariants} initial="hidden" animate="visible">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="flex items-center justify-between mb-6">
                <SectionHeader icon={<BuildingOfficeIcon />} title="Create Police Station" />
                <button
                  onClick={() => setActiveTab('stations')}
                  className="text-gray-500 hover:text-gray-700 flex items-center gap-1"
                >
                  <ArrowLeftIcon className="h-4 w-4" /> Back to Stations
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <motion.div variants={itemVariants}>
                  <label htmlFor="stationId" className="block text-sm font-medium text-gray-700 mb-1">Station ID (Optional)</label>
                  <input
                    id="stationId"
                    name="id"
                    value={form.id}
                    onChange={handleChange}
                    type="number"
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Auto-generated if empty"
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <label htmlFor="stationName" className="block text-sm font-medium text-gray-700 mb-1">Station Name</label>
                  <input
                    id="stationName"
                    name="stationName"
                    value={form.stationName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter station name"
                    required
                    maxLength="100"
                    className={`w-full px-3 py-2 border ${formErrors.stationName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500`}
                  />
                  {formErrors.stationName && <p className="mt-1 text-sm text-red-600">{formErrors.stationName}</p>}
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <motion.div variants={itemVariants}>
                    <label htmlFor="latitude" className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                    <input
                      id="latitude"
                      name="latitude"
                      value={form.latitude}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="e.g., 10.5204"
                      type="number"
                      step="any"
                      required
                      min="-90"
                      max="90"
                      className={`w-full px-3 py-2 border ${formErrors.latitude ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500`}
                    />
                    {formErrors.latitude && <p className="mt-1 text-sm text-red-600">{formErrors.latitude}</p>}
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <label htmlFor="longitude" className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                    <input
                      id="longitude"
                      name="longitude"
                      value={form.longitude}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="e.g., 73.8567"
                      type="number"
                      step="any"
                      required
                      min="-180"
                      max="180"
                      className={`w-full px-3 py-2 border ${formErrors.longitude ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500`}
                    />
                    {formErrors.longitude && <p className="mt-1 text-sm text-red-600">{formErrors.longitude}</p>}
                  </motion.div>
                </div>

                <motion.div variants={itemVariants}>
                  <label htmlFor="availableOfficers" className="block text-sm font-medium text-gray-700 mb-1">Available Officers</label>
                  <input
                    id="availableOfficers"
                    name="availableOfficers"
                    value={form.availableOfficers}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Number of officers"
                    type="number"
                    min="0"
                    required
                    className={`w-full px-3 py-2 border ${formErrors.availableOfficers ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500`}
                  />
                  {formErrors.availableOfficers && <p className="mt-1 text-sm text-red-600">{formErrors.availableOfficers}</p>}
                </motion.div>

                <motion.button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 disabled:opacity-50 font-medium shadow-md transition-colors"
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 mr-3 inline" viewBox="0 0 24 24"></svg>
                      Creating Station...
                    </>
                  ) : 'Create Police Station'}
                </motion.button>
              </form>

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
            </div>
          </motion.div>
        )}

        {activeTab === 'emergencies' && (
          <motion.div className="bg-white rounded-lg shadow-md p-6" variants={containerVariants} initial="hidden" animate="visible">
            <SectionHeader icon={<BellAlertIcon />} title="Emergency Monitoring" />
            {emergencyError && (
              <motion.div
                className="mb-4 p-3 rounded-md bg-red-100 text-red-700 border border-red-200 flex items-center gap-2"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <InformationCircleIcon className="h-5 w-5" /> {emergencyError}
              </motion.div>
            )}
            {emergencyHistory && Array.isArray(emergencyHistory) && emergencyHistory.length > 0 ? (
              <motion.div className="overflow-x-auto border border-gray-200 rounded-lg" variants={itemVariants}>
                <motion.table className="w-full text-sm bg-white" initial="hidden" animate="visible" variants={containerVariants}>
                  <motion.thead className="bg-gray-50" variants={itemVariants}>
                    <tr>
                      <th className="px-3 py-2 border-b text-left text-gray-600">Assignment ID</th>
                      <th className="px-3 py-2 border-b text-left text-gray-600">Case Type</th>
                      <th className="px-3 py-2 border-b text-left text-gray-600">Status</th>
                      <th className="px-3 py-2 border-b text-left text-gray-600">Assigned At</th>
                      <th className="px-3 py-2 border-b text-left text-gray-600">Location</th>
                    </tr>
                  </motion.thead>
                  <motion.tbody className="bg-white">
                    {emergencyHistory.map((item, idx) => (
                      <motion.tr key={idx} className="hover:bg-gray-50 border-b border-gray-100 last:border-b-0" variants={itemVariants}>
                        <td className="px-3 py-2">{item.assignment_id || item.id}</td>
                        <td className="px-3 py-2">{item.case_type || item.issue_type}</td>
                        <td className="px-3 py-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            item.status === 'PENDING' ? 'bg-amber-100 text-amber-800' :
                            item.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-xs text-gray-500">{item.assigned_at ? new Date(item.assigned_at).toLocaleString() : ''}</td>
                        <td className="px-3 py-2 text-xs text-gray-500">{item.location || `${item.latitude?.toFixed(4)}, ${item.longitude?.toFixed(4)}`}</td>
                      </motion.tr>
                    ))}
                  </motion.tbody>
                </motion.table>
              </motion.div>
            ) : (
              !emergencyLoading && <motion.p className="text-gray-600 mt-4" variants={itemVariants}>No assignment history data available. Click the button above to fetch.</motion.p>
            )}
          </motion.div>
        )}

        {activeTab === 'reports' && (
           <motion.div className="bg-white rounded-lg shadow-md p-6" variants={containerVariants} initial="hidden" animate="visible">
             <SectionHeader icon={<ClipboardDocumentListIcon />} title="Reports" />
             <motion.div className="flex items-center mb-4 gap-2" variants={itemVariants}>
               <input
                 type="number"
                 min="1"
                 placeholder="Enter Station ID"
                 value={reportStationId}
                 onChange={e => { setReportStationId(e.target.value); setReportIdError(''); }} // Clear error on change
                 onBlur={() => { // Validate on blur
                   if (!reportStationId.toString().trim()) setReportIdError('Station ID is required.');
                   else if (isNaN(Number(reportStationId)) || Number(reportStationId) <= 0) setReportIdError('Station ID must be a positive number.');
                 }}
                 className={`px-4 py-3 border ${reportIdError ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-48 transition-all duration-200 shadow-sm hover:shadow-md`}
               />
               <motion.button
                 onClick={fetchReportStationHistory}
                 disabled={reportLoading}
                 className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 shadow-lg transition-all duration-200 flex items-center gap-2 font-medium"
                 whileHover={{ scale: 1.05, y: -2 }}
                 whileTap={{ scale: 0.95 }}
               >
                 {reportLoading ? (
                   <>
                     <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24"></svg>
                     Loading...
                   </>
                 ) : (
                   <>
                     <DocumentTextIcon className="h-5 w-5" /> Get Station History by ID
                   </>
                 )}
               </motion.button>
             </motion.div>
             {reportIdError && <motion.p className="mb-4 text-sm text-red-600" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>{reportIdError}</motion.p>}
             {reportError && (
               <motion.div
                 className="mb-4 p-3 rounded-md bg-red-100 text-red-700 border border-red-200 flex items-center gap-2"
                 initial={{ opacity: 0, y: -10 }}
                 animate={{ opacity: 1, y: 0 }}
               >
                 <InformationCircleIcon className="h-5 w-5" /> {reportError}
               </motion.div>
             )}
             {reportStationHistory && Array.isArray(reportStationHistory) && reportStationHistory.length > 0 ? (
               <motion.div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm" variants={itemVariants}>
                 <motion.table className="w-full text-sm bg-white" initial="hidden" animate="visible" variants={containerVariants}>
                   <motion.thead className="bg-gradient-to-r from-blue-500 to-blue-600" variants={itemVariants}>
                     <tr>
                       <th className="px-4 py-3 border-b text-left text-white font-semibold">Booking ID</th>
                       <th className="px-4 py-3 border-b text-left text-white font-semibold">Pickup Location</th>
                       <th className="px-4 py-3 border-b text-left text-white font-semibold">Issue Type</th>
                       <th className="px-4 py-3 border-b text-left text-white font-semibold">Status</th>
                       <th className="px-4 py-3 border-b text-left text-white font-semibold">Created At</th>
                       <th className="px-4 py-3 border-b text-left text-white font-semibold">Victim Phone</th>
                       <th className="px-4 py-3 border-b text-left text-white font-semibold">Requested By</th>
                       <th className="px-4 py-3 border-b text-left text-white font-semibold">For Self</th>
                       <th className="px-4 py-3 border-b text-left text-white font-semibold">Ambulance</th>
                       <th className="px-4 py-3 border-b text-left text-white font-semibold">Police</th>
                       <th className="px-4 py-3 border-b text-left text-white font-semibold">Fire Brigade</th>
                       <th className="px-4 py-3 border-b text-left text-white font-semibold">Ambulance Count</th>
                       <th className="px-4 py-3 border-b text-left text-white font-semibold">Police Count</th>
                       <th className="px-4 py-3 border-b text-left text-white font-semibold">Fire Truck Count</th>
                     </tr>
                   </motion.thead>
                   <motion.tbody className="bg-white">
                     {reportStationHistory
                       .sort((a, b) => {
                         // Sort by status: PENDING first, then COMPLETED, then others
                         const statusOrder = { 'PENDING': 1, 'COMPLETED': 2 };
                         const aOrder = statusOrder[a.status] || 3;
                         const bOrder = statusOrder[b.status] || 3;
                         
                         if (aOrder !== bOrder) {
                           return aOrder - bOrder;
                         }
                         
                         // If same status, sort by creation date (newest first)
                         return new Date(b.created_at) - new Date(a.created_at);
                       })
                       .map((item, idx) => (
                         <motion.tr 
                           key={idx} 
                           className={`hover:bg-blue-50 border-b border-gray-100 last:border-b-0 transition-colors duration-200 ${
                             item.status === 'PENDING' ? 'bg-amber-50 hover:bg-amber-100' : 
                             item.status === 'COMPLETED' ? 'bg-green-50 hover:bg-green-100' : 
                             'hover:bg-gray-50'
                           }`}
                           variants={itemVariants}
                           whileHover={{ scale: 1.01 }}
                         >
                           <td className="px-4 py-3 font-bold text-blue-600">{item.booking_id}</td>
                           <td className="px-4 py-3 text-xs text-gray-500">{item.pickup_latitude?.toFixed(4)}, {item.pickup_longitude?.toFixed(4)}</td>
                           <td className="px-4 py-3 font-medium text-gray-800">{item.issue_type}</td>
                           <td className="px-4 py-3">
                             <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                               item.status === 'PENDING' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                               item.status === 'COMPLETED' ? 'bg-green-100 text-green-800 border border-green-200' :
                               'bg-gray-100 text-gray-800 border border-gray-200'
                             }`}>
                               {item.status}
                             </span>
                           </td>
                           <td className="px-4 py-3 text-xs text-gray-500">{new Date(item.created_at).toLocaleString()}</td>
                           <td className="px-4 py-3">
                             <a href={`tel:${item.victim_phone_number}`} className="text-blue-600 hover:text-blue-800 transition-colors">
                               {item.victim_phone_number}
                             </a>
                           </td>
                           <td className="px-4 py-3">{item.requested_by_user_id}</td>
                           <td className="px-4 py-3">
                             <span className={`px-2 py-1 rounded text-xs font-medium ${
                               item.is_for_self ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'
                             }`}>
                               {item.is_for_self ? 'Yes' : 'No'}
                             </span>
                           </td>
                           <td className="px-4 py-3">
                             <span className={`px-2 py-1 rounded text-xs font-medium ${
                               item.needs_ambulance ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-600'
                             }`}>
                               {item.needs_ambulance ? 'Yes' : 'No'}
                             </span>
                           </td>
                           <td className="px-4 py-3">
                             <span className={`px-2 py-1 rounded text-xs font-medium ${
                               item.needs_police ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'
                             }`}>
                               {item.needs_police ? 'Yes' : 'No'}
                             </span>
                           </td>
                           <td className="px-4 py-3">
                             <span className={`px-2 py-1 rounded text-xs font-medium ${
                               item.needs_fire_brigade ? 'bg-orange-100 text-orange-800' : 'bg-gray-100 text-gray-600'
                             }`}>
                               {item.needs_fire_brigade ? 'Yes' : 'No'}
                             </span>
                           </td>
                           <td className="px-4 py-3 text-center font-semibold">{item.requested_ambulance_count}</td>
                           <td className="px-4 py-3 text-center font-semibold">{item.requested_police_count}</td>
                           <td className="px-4 py-3 text-center font-semibold">{item.requested_fire_truck_count}</td>
                         </motion.tr>
                       ))}
                   </motion.tbody>
                 </motion.table>
               </motion.div>
             ) : (
               !reportLoading && (
                 <motion.div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300" variants={itemVariants}>
                   <ClipboardDocumentListIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                   <p className="text-gray-600 font-medium">No station history data available</p>
                   <p className="text-gray-500 text-sm mt-1">Enter a station ID and click the button above to fetch</p>
                 </motion.div>
               )
             )}
           </motion.div>
         )}

         {activeTab === 'profile' && (
           <motion.div className="max-w-4xl mx-auto" variants={containerVariants} initial="hidden" animate="visible">
             <div className="bg-white rounded-lg shadow-md p-8">
               <div className="flex items-center justify-between mb-6">
                 <SectionHeader icon={<UserIcon />} title="Officer Profile" />
                 <button className="text-blue-600 hover:text-blue-700 text-sm flex items-center space-x-1">
                   <PencilIcon className="h-4 w-4" /> <span>Edit Profile</span>
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
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 {/* Profile Information */}
                 <motion.div variants={itemVariants}>
                   <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h3>
                   <div className="space-y-4">
                     <div className="flex items-center space-x-4">
                       <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-md">
                         <UserIcon className="h-10 w-10" />
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
                         <span className="font-medium text-gray-800">{userInfo.sub || 'N/A'}</span>
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

                 {/* Performance Stats */}
                 <motion.div variants={itemVariants}>
                   <h3 className="text-lg font-semibold text-gray-800 mb-4">Performance Statistics</h3>
                   <div className="space-y-4">
                     <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
                       <div className="flex items-center justify-between">
                         <span className="text-blue-700 font-medium">Cases Handled</span>
                         <span className="text-2xl font-bold text-blue-700">247</span>
                       </div>
                       <p className="text-sm text-gray-600 mt-1">This month</p>
                     </div>

                     <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
                       <div className="flex items-center justify-between">
                         <span className="text-green-700 font-medium">Success Rate</span>
                         <span className="text-2xl font-bold text-green-700">94%</span>
                       </div>
                       <p className="text-sm text-gray-600 mt-1">Resolved cases</p>
                     </div>

                     <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
                       <div className="flex items-center justify-between">
                         <span className="text-amber-700 font-medium">Response Time</span>
                         <span className="text-2xl font-bold text-amber-700">3.8 min</span>
                       </div>
                       <p className="text-sm text-gray-600 mt-1">Average</p>
                     </div>

                     <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
                       <div className="flex items-center justify-between">
                         <span className="text-purple-700 font-medium">Service Hours</span>
                         <span className="text-2xl font-bold text-purple-700">1,240</span>
                       </div>
                       <p className="text-sm text-gray-600 mt-1">This year</p>
                     </div>
                   </div>
                 </motion.div>
               </div>
               )}

               {/* Recent Achievements */}
               <motion.div className="mt-8" variants={itemVariants}>
                 <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Achievements</h3>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                   <motion.div
                     className="bg-white p-4 rounded-lg shadow-md border border-gray-200"
                     whileHover={{ scale: 1.05 }}
                     whileTap={{ scale: 0.98 }}
                     variants={itemVariants}
                   >
                     <div className="text-2xl mb-2 text-blue-500"><TrophyIcon className="h-6 w-6" /></div>
                     <h4 className="font-semibold text-gray-800">Officer of the Month</h4>
                     <p className="text-sm text-gray-600 opacity-90">January 2024</p>
                   </motion.div>
                   <motion.div
                     className="bg-white p-4 rounded-lg shadow-md border border-gray-200"
                     whileHover={{ scale: 1.05 }}
                     whileTap={{ scale: 0.98 }}
                     variants={itemVariants}
                   >
                     <div className="text-2xl mb-2 text-green-500"><StarIcon className="h-6 w-6" /></div>
                     <h4 className="font-semibold text-gray-800">Excellence Award</h4>
                     <p className="text-sm text-gray-600 opacity-90">Community Service</p>
                   </motion.div>
                   <motion.div
                     className="bg-white p-4 rounded-lg shadow-md border border-gray-200"
                     whileHover={{ scale: 1.05 }}
                     whileTap={{ scale: 0.98 }}
                     variants={itemVariants}
                   >
                     <div className="text-2xl mb-2 text-gray-600"><ChartBarSquareIcon className="h-6 w-6" /></div>
                     <h4 className="font-semibold text-gray-800">Perfect Attendance</h4>
                     <p className="text-sm text-gray-600 opacity-90">6 months</p>
                   </motion.div>
                 </div>
               </motion.div>
             </div>
           </motion.div>
         )}
      </motion.div>
    </div>
  );
}