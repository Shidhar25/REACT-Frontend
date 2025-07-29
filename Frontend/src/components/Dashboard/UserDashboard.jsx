import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import mapboxgl from 'mapbox-gl';
import { motion } from 'framer-motion'; // Import motion from framer-motion
import {
  ChartBarIcon,
  BellAlertIcon,
  ClockIcon, // Add ClockIcon here
  MapPinIcon,
  ClipboardDocumentListIcon,
  UserIcon,
  PhoneIcon,
  ShieldCheckIcon, // For safety tips
  ArrowLeftIcon, // For back button in forms
  CheckCircleIcon, // For success messages
  XCircleIcon, // For error messages
  InformationCircleIcon // For info messages
} from '@heroicons/react/24/outline'; // Importing specific Heroicons

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

export default function UserDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [emergencyForm, setEmergencyForm] = useState({
    latitude: '',
    longitude: '',
    issueType: '',
    needAmbulance: false,
    requestedAmbulanceCount: 0, // Changed default to 0
    needPolice: false,
    requestedPoliceCount: 0,
    needFireBrigade: false,
    requestedFireTruckCount: 0,
    isForSelf: false,
    victimPhoneNumber: '',
    notes: ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [simType, setSimType] = useState('ambulance');
  const [simActive, setSimActive] = useState(false);
  const [simProgress, setSimProgress] = useState(0);
  const [simCoords, setSimCoords] = useState({ lat: 18.5204, lng: 73.8567 });
  const simInterval = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // New state for form validation errors
  const [emergencyFormErrors, setEmergencyFormErrors] = useState({
    latitude: '',
    longitude: '',
    issueType: '',
    victimPhoneNumber: ''
  });

  // Regex for validation
  const latRegex = /^-?([1-8]?\d(\.\d+)?|90(\.0+)?)$/;
  const lonRegex = /^-?((1?[0-7]?\d(\.\d+)?)|180(\.0+)?)$/;
  const phoneRegex = /^[6-9]\d{9}$/; // Indian 10-digit phone number

  // Mock user data (can be replaced by API fetch)
  const userData = {
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main Street, City, State 12345',
    emergencyContacts: [
      { name: 'Sarah Smith', phone: '+1 (555) 987-6543', relationship: 'Spouse' },
      { name: 'Dr. Michael Johnson', phone: '+1 (555) 456-7890', relationship: 'Family Doctor' }
    ]
  };

  // Mock emergency history (can be replaced by API fetch)
  const emergencyHistory = [
    {
      id: 'E-2024-001',
      date: '2024-01-15',
      type: 'Medical Emergency',
      status: 'Resolved',
      response: 'Ambulance dispatched',
      location: 'Home'
    },
    {
      id: 'E-2024-002',
      date: '2024-01-10',
      type: 'Traffic Accident',
      status: 'Resolved',
      response: 'Police and ambulance',
      location: 'Highway 101'
    }
  ];

  // --- Validation Logic for Emergency Form ---
  const validateEmergencyField = (name, value) => {
    let error = '';
    switch (name) {
      case 'latitude':
        if (!value.toString().trim()) error = 'Latitude is required.';
        else if (!latRegex.test(value)) error = 'Invalid latitude (-90 to 90).';
        break;
      case 'longitude':
        if (!value.toString().trim()) error = 'Longitude is required.';
        else if (!lonRegex.test(value)) error = 'Invalid longitude (-180 to 180).';
        break;
      case 'issueType':
        if (!value.trim()) error = 'Emergency description is required.';
        else if (value.length < 5) error = 'Description too short.';
        break;
      case 'victimPhoneNumber':
        if (!emergencyForm.isForSelf && !value.trim()) error = 'Victim phone number is required if not for self.';
        else if (value.trim() && !phoneRegex.test(value)) error = 'Invalid 10-digit Indian phone number.';
        break;
      case 'requestedAmbulanceCount':
      case 'requestedPoliceCount':
      case 'requestedFireTruckCount':
        if (isNaN(Number(value)) || Number(value) < 0) error = 'Count must be a non-negative number.';
        break;
      default:
        break;
    }
    setEmergencyFormErrors(prev => ({ ...prev, [name]: error }));
    return error === '';
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    setEmergencyForm((prev) => ({
      ...prev,
      [name]: newValue,
    }));
    validateEmergencyField(name, newValue); // Real-time validation
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    validateEmergencyField(name, value);
  };

  const validateAllEmergencyFields = () => {
    let isValid = true;
    const fieldsToValidate = [
      'latitude', 'longitude', 'issueType', 'victimPhoneNumber',
      'requestedAmbulanceCount', 'requestedPoliceCount', 'requestedFireTruckCount'
    ];

    for (const field of fieldsToValidate) {
      if (!validateEmergencyField(field, emergencyForm[field])) {
        isValid = false;
      }
    }

    // Special validation for at least one service
    if (!emergencyForm.needAmbulance && !emergencyForm.needPolice && !emergencyForm.needFireBrigade) {
      setMessage('At least one emergency service (Ambulance, Police, or Fire Brigade) must be requested.');
      isValid = false;
    } else {
        // If service is requested, count must be > 0
        if (emergencyForm.needAmbulance && emergencyForm.requestedAmbulanceCount <= 0) {
            setEmergencyFormErrors(prev => ({ ...prev, requestedAmbulanceCount: 'Count must be greater than 0 if ambulance is needed.' }));
            isValid = false;
        }
        if (emergencyForm.needPolice && emergencyForm.requestedPoliceCount <= 0) {
            setEmergencyFormErrors(prev => ({ ...prev, requestedPoliceCount: 'Count must be greater than 0 if police is needed.' }));
            isValid = false;
        }
        if (emergencyForm.needFireBrigade && emergencyForm.requestedFireTruckCount <= 0) {
            setEmergencyFormErrors(prev => ({ ...prev, requestedFireTruckCount: 'Count must be greater than 0 if fire brigade is needed.' }));
            isValid = false;
        }
    }


    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!validateAllEmergencyFields()) {
      setMessage('Please correct the errors in the form before submitting.');
      return;
    }

    setLoading(true);

    try {
      const body = {
        pickup_latitude: parseFloat(emergencyForm.latitude),
        pickup_longitude: parseFloat(emergencyForm.longitude),
        issue_type: emergencyForm.issueType,
        needs_ambulance: emergencyForm.needAmbulance,
        requested_ambulance_count: emergencyForm.needAmbulance ? Number(emergencyForm.requestedAmbulanceCount) : 0,
        needs_police: emergencyForm.needPolice,
        requested_police_count: emergencyForm.needPolice ? Number(emergencyForm.requestedPoliceCount) : 0,
        needs_fire_brigade: emergencyForm.needFireBrigade,
        requested_fire_truck_count: emergencyForm.needFireBrigade ? Number(emergencyForm.requestedFireTruckCount) : 0,
        is_for_self: emergencyForm.isForSelf,
        victim_phone_number: emergencyForm.victimPhoneNumber,
        notes: emergencyForm.notes
      };

      const res = await fetch('http://localhost:8080/booking/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('jwt') || ''}`,
        },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setMessage('Emergency request submitted successfully!');
        setEmergencyForm({
          latitude: '',
          longitude: '',
          issueType: '',
          needAmbulance: false,
          requestedAmbulanceCount: 0,
          needPolice: false,
          requestedPoliceCount: 0,
          needFireBrigade: false,
          requestedFireTruckCount: 0,
          isForSelf: false,
          victimPhoneNumber: '',
          notes: ''
        });
        setEmergencyFormErrors({ latitude: '', longitude: '', issueType: '', victimPhoneNumber: '' }); // Clear errors
      } else {
        const data = await res.json().catch(() => ({}));
        setMessage(data.message || 'Failed to submit emergency request.');
      }
    } catch (err) {
      setMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSimTypeChange = (e) => setSimType(e.target.value);

  const handleStartSim = () => {
    setSimActive(true);
    setSimProgress(0);
    setSimCoords({ lat: 18.5204, lng: 73.8567 }); // Reset initial coordinates
    if (markerRef.current && mapRef.current) {
      markerRef.current.setLngLat([73.8567, 18.5204]); // Reset marker
      mapRef.current.flyTo({ center: [73.8567, 18.5204], zoom: 13 }); // Reset map view
      // Update marker color immediately based on simType
      markerRef.current.setPopup(null); // Clear previous popup if any
      markerRef.current.setOffset([0, -20]); // Adjust offset to not block the icon
      markerRef.current.setElement(createMarkerElement(simType)); // Update icon
    }
  };

  // Helper to create custom marker element (for better visual)
  const createMarkerElement = (type) => {
    const el = document.createElement('div');
    el.className = 'marker';
    el.style.width = '30px';
    el.style.height = '30px';
    el.style.borderRadius = '50%';
    el.style.display = 'flex';
    el.style.alignItems = 'center';
    el.style.justifyContent = 'center';
    el.style.color = 'white';
    el.style.fontSize = '18px';
    el.style.fontWeight = 'bold';

    if (type === 'ambulance') {
      el.style.backgroundColor = '#2563eb'; // Blue
      el.innerHTML = '🚑'; // Ambulance emoji
    } else {
      el.style.backgroundColor = '#dc2626'; // Red
      el.innerHTML = '🚒'; // Fire Truck emoji
    }
    return el;
  };


  // Mapbox simulation effect
  useEffect(() => {
    if (!simActive) return;

    mapboxgl.accessToken = 'pk.eyJ1IjoibWFpdHJleWVlMjkiLCJhIjoiY20wdjhtbXhvMWRkYTJxb3UwYmo2NXRlZCJ9.BIf7Ebj0qCJtAV9HE-utBQ';

    if (!mapRef.current) {
      mapRef.current = new mapboxgl.Map({
        container: 'sim-mapbox',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [73.8567, 18.5204],
        zoom: 13
      });

      mapRef.current.on('load', () => {
        setMapLoaded(true);
        markerRef.current = new mapboxgl.Marker({
          element: createMarkerElement(simType) // Initial marker element
        })
          .setLngLat([73.8567, 18.5204])
          .addTo(mapRef.current);
      });
    } else if (mapLoaded && markerRef.current) {
      // If map is already loaded, just update marker icon
      markerRef.current.setElement(createMarkerElement(simType));
    }


    if (mapLoaded) { // Only start interval if map is loaded
      simInterval.current = setInterval(() => {
        setSimProgress((p) => {
          if (p >= 100) {
            clearInterval(simInterval.current);
            setSimActive(false);
            // Optionally remove marker or show "Arrived" state clearly
            if (markerRef.current) {
              markerRef.current.setPopup(new mapboxgl.Popup({ offset: 25 })
                .setHTML(`<h3>Vehicle Arrived!</h3><p>At: ${simCoords.lat.toFixed(5)}, ${simCoords.lng.toFixed(5)}</p>`)
              ).addTo(mapRef.current);
            }
            return 100;
          }
          const newLat = 18.5204 + 0.0005 * p; // Smaller increments for smoother animation
          const newLng = 73.8567 + 0.0005 * p;
          setSimCoords({ lat: newLat, lng: newLng });
          if (markerRef.current) markerRef.current.setLngLat([newLng, newLat]);
          if (mapRef.current) mapRef.current.flyTo({ center: [newLng, newLat], zoom: 13 });
          return p + 1; // Increment by 1 for smoother progress
        });
      }, 100); // Faster interval for smoother animation
    }


    return () => {
        clearInterval(simInterval.current);
        if (markerRef.current) {
            markerRef.current.remove(); // Remove marker when simulation ends or component unmounts
            markerRef.current = null;
        }
        if (mapRef.current) {
            mapRef.current.remove(); // Clean up map instance
            mapRef.current = null;
        }
    };
  }, [simActive, mapLoaded, simType]);


  const QuickActionCard = ({ title, description, icon, onClick }) => (
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

  const StatCard = ({ title, value, subtitle, icon }) => (
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">User Dashboard</h1>
              <p className="text-gray-500">Emergency Services Portal</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Welcome, {userData.name}</p>
                <p className="text-xs text-gray-500">Last updated: {new Date().toLocaleTimeString()}</p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => navigate('/')}
                  className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                >
                  Home
                </button>
                <button
                  onClick={() => {
                    localStorage.removeItem('jwt');
                    navigate('/login');
                  }}
                  className="text-red-600 hover:text-red-700 text-sm font-medium"
                >
                  Logout
                </button>
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {userData.name.split(' ').map(n => n[0]).join('')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', name: 'Overview', icon: <ChartBarIcon className="h-5 w-5" /> },
              { id: 'emergency', name: 'Emergency', icon: <BellAlertIcon className="h-5 w-5" /> },
              { id: 'tracking', name: 'Tracking', icon: <MapPinIcon className="h-5 w-5" /> },
              { id: 'history', name: 'History', icon: <ClipboardDocumentListIcon className="h-5 w-5" /> },
              { id: 'profile', name: 'Profile', icon: <UserIcon className="h-5 w-5" /> }
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
                <span className="mr-2">{tab.icon}</span>
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
            {/* Quick Actions */}
            <div>
              <SectionHeader icon={<ClipboardDocumentListIcon />} title="Quick Actions" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <QuickActionCard
                  title="Request Emergency"
                  description="Call for immediate assistance"
                  icon={<BellAlertIcon className="h-6 w-6" />}
                  onClick={() => setActiveTab('emergency')}
                />
                <QuickActionCard
                  title="Track Response"
                  description="Monitor emergency vehicle location"
                  icon={<MapPinIcon className="h-6 w-6" />}
                  onClick={() => setActiveTab('tracking')}
                />
                <QuickActionCard
                  title="Emergency History"
                  description="View past emergency requests"
                  icon={<ClipboardDocumentListIcon className="h-6 w-6" />}
                  onClick={() => setActiveTab('history')}
                />
                <QuickActionCard
                  title="Update Profile"
                  description="Manage personal information"
                  icon={<UserIcon className="h-6 w-6" />}
                  onClick={() => setActiveTab('profile')}
                />
                <QuickActionCard
                  title="Emergency Contacts"
                  description="Manage emergency contacts"
                  icon={<PhoneIcon className="h-6 w-6" />}
                  onClick={() => alert('Emergency contacts feature coming soon!')}
                />
                <QuickActionCard
                  title="Safety Tips"
                  description="Emergency preparedness guide"
                  icon={<ShieldCheckIcon className="h-6 w-6" />}
                  onClick={() => alert('Safety tips feature coming soon!')}
                />
              </div>
            </div>

            {/* Emergency Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard
                title="Total Emergencies"
                value={emergencyHistory.length}
                icon={<BellAlertIcon />}
              />
              <StatCard
                title="Resolved"
                value={emergencyHistory.filter(e => e.status === 'Resolved').length}
                icon={<CheckCircleIcon />}
              />
              <StatCard
                title="Avg Response"
                value="4.2 min"
                icon={<ClockIcon />}
              />
            </div>

            {/* Recent Activity */}
            <motion.div className="bg-white rounded-lg shadow-md p-6" variants={itemVariants}>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {emergencyHistory.slice(0, 3).map((emergency, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors duration-150"
                    variants={itemVariants}
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">{emergency.type}</p>
                      <p className="text-xs text-gray-500">{emergency.location} • {emergency.date}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      emergency.status === 'Resolved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {emergency.status}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}

        {activeTab === 'emergency' && (
          <motion.div className="max-w-2xl mx-auto" variants={containerVariants} initial="hidden" animate="visible">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="flex items-center justify-between mb-6">
                <SectionHeader icon={<BellAlertIcon />} title="Emergency Request" />
                <button
                  onClick={() => setActiveTab('overview')}
                  className="text-gray-500 hover:text-gray-700 flex items-center space-x-1"
                >
                  <ArrowLeftIcon className="h-4 w-4" /> <span>Back to Overview</span>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <motion.div variants={itemVariants}>
                    <label htmlFor="latitude" className="block text-sm font-medium text-gray-700 mb-2">Latitude</label>
                    <input
                      id="latitude"
                      name="latitude"
                      value={emergencyForm.latitude}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      type="number"
                      step="any"
                      required
                      min="-90"
                      max="90"
                      className={`w-full px-4 py-3 border ${emergencyFormErrors.latitude ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-blue-500 focus:border-blue-500`}
                      placeholder="e.g., 18.5204"
                    />
                    {emergencyFormErrors.latitude && <p className="mt-1 text-sm text-red-600">{emergencyFormErrors.latitude}</p>}
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <label htmlFor="longitude" className="block text-sm font-medium text-gray-700 mb-2">Longitude</label>
                    <input
                      id="longitude"
                      name="longitude"
                      value={emergencyForm.longitude}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      type="number"
                      step="any"
                      required
                      min="-180"
                      max="180"
                      className={`w-full px-4 py-3 border ${emergencyFormErrors.longitude ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-blue-500 focus:border-blue-500`}
                      placeholder="e.g., 73.8567"
                    />
                    {emergencyFormErrors.longitude && <p className="mt-1 text-sm text-red-600">{emergencyFormErrors.longitude}</p>}
                  </motion.div>
                </div>

                <motion.div variants={itemVariants}>
                  <label htmlFor="issueType" className="block text-sm font-medium text-gray-700 mb-2">Emergency Description</label>
                  <input
                    id="issueType"
                    name="issueType"
                    value={emergencyForm.issueType}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    maxLength="200"
                    className={`w-full px-4 py-3 border ${emergencyFormErrors.issueType ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-blue-500 focus:border-blue-500`}
                    placeholder="Describe the emergency (e.g., Medical emergency, Traffic accident)"
                  />
                  {emergencyFormErrors.issueType && <p className="mt-1 text-sm text-red-600">{emergencyFormErrors.issueType}</p>}
                </motion.div>

                <motion.div className="space-y-4" variants={itemVariants}>
                  <h3 className="text-lg font-semibold text-gray-800">Required Services</h3>

                  <div className="flex items-center space-x-4">
                    <input
                      type="checkbox"
                      id="needAmbulance"
                      name="needAmbulance"
                      checked={emergencyForm.needAmbulance}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="needAmbulance" className="text-sm font-medium text-gray-700">Ambulance</label>
                    <input
                      name="requestedAmbulanceCount"
                      type="number"
                      min="0"
                      value={emergencyForm.requestedAmbulanceCount}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={!emergencyForm.needAmbulance}
                      className={`w-16 px-2 py-1 border ${emergencyFormErrors.requestedAmbulanceCount && emergencyForm.needAmbulance ? 'border-red-500' : 'border-gray-300'} rounded text-sm`}
                    />
                     {emergencyFormErrors.requestedAmbulanceCount && emergencyForm.needAmbulance && <p className="ml-2 text-sm text-red-600">{emergencyFormErrors.requestedAmbulanceCount}</p>}
                  </div>

                  <div className="flex items-center space-x-4">
                    <input
                      type="checkbox"
                      id="needPolice"
                      name="needPolice"
                      checked={emergencyForm.needPolice}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="needPolice" className="text-sm font-medium text-gray-700">Police</label>
                    <input
                      name="requestedPoliceCount"
                      type="number"
                      min="0"
                      value={emergencyForm.requestedPoliceCount}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={!emergencyForm.needPolice}
                      className={`w-16 px-2 py-1 border ${emergencyFormErrors.requestedPoliceCount && emergencyForm.needPolice ? 'border-red-500' : 'border-gray-300'} rounded text-sm`}
                    />
                    {emergencyFormErrors.requestedPoliceCount && emergencyForm.needPolice && <p className="ml-2 text-sm text-red-600">{emergencyFormErrors.requestedPoliceCount}</p>}
                  </div>

                  <div className="flex items-center space-x-4">
                    <input
                      type="checkbox"
                      id="needFireBrigade"
                      name="needFireBrigade"
                      checked={emergencyForm.needFireBrigade}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="needFireBrigade" className="text-sm font-medium text-gray-700">Fire Brigade</label>
                    <input
                      name="requestedFireTruckCount"
                      type="number"
                      min="0"
                      value={emergencyForm.requestedFireTruckCount}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={!emergencyForm.needFireBrigade}
                      className={`w-16 px-2 py-1 border ${emergencyFormErrors.requestedFireTruckCount && emergencyForm.needFireBrigade ? 'border-red-500' : 'border-gray-300'} rounded text-sm`}
                    />
                    {emergencyFormErrors.requestedFireTruckCount && emergencyForm.needFireBrigade && <p className="ml-2 text-sm text-red-600">{emergencyFormErrors.requestedFireTruckCount}</p>}
                  </div>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isForSelf"
                      name="isForSelf"
                      checked={emergencyForm.isForSelf}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isForSelf" className="text-sm font-medium text-gray-700">Is this emergency for yourself?</label>
                  </div>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <label htmlFor="victimPhoneNumber" className="block text-sm font-medium text-gray-700 mb-2">Victim Phone Number</label>
                  <input
                    id="victimPhoneNumber"
                    name="victimPhoneNumber"
                    value={emergencyForm.victimPhoneNumber}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required={!emergencyForm.isForSelf}
                    maxLength="10"
                    className={`w-full px-4 py-3 border ${emergencyFormErrors.victimPhoneNumber ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-blue-500 focus:border-blue-500`}
                    placeholder="Enter phone number"
                    disabled={emergencyForm.isForSelf}
                  />
                  {emergencyFormErrors.victimPhoneNumber && <p className="mt-1 text-sm text-red-600">{emergencyFormErrors.victimPhoneNumber}</p>}
                </motion.div>

                <motion.div variants={itemVariants}>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={emergencyForm.notes}
                    onChange={handleChange}
                    rows={3}
                    maxLength="500"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Any additional information (e.g., people trapped, specific injuries)"
                  />
                </motion.div>

                <motion.button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 transition duration-200 shadow-lg"
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 mr-3 inline" viewBox="0 0 24 24"></svg>
                      Submitting Emergency Request...
                    </>
                  ) : 'Submit Emergency Request'}
                </motion.button>

                {message && (
                  <motion.div
                    className={`mt-4 p-3 rounded-lg text-sm flex items-center space-x-2 ${
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
              </form>
            </div>
          </motion.div>
        )}

        {activeTab === 'tracking' && (
          <motion.div className="max-w-4xl mx-auto" variants={containerVariants} initial="hidden" animate="visible">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="text-center mb-8">
                <SectionHeader icon={<MapPinIcon />} title="Track Emergency Response" />
                <p className="text-gray-600">Monitor real-time location and estimated arrival time of emergency vehicles</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-8 border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <motion.div variants={itemVariants}>
                    <label htmlFor="requestId" className="block text-sm font-medium text-gray-700 mb-2">
                      Emergency Request ID
                    </label>
                    <input
                      id="requestId"
                      type="text"
                      placeholder="Enter request ID"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      disabled={simActive}
                    />
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <label htmlFor="vehicleType" className="block text-sm font-medium text-gray-700 mb-2">
                      Vehicle Type
                    </label>
                    <select
                      id="vehicleType"
                      value={simType}
                      onChange={handleSimTypeChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                      disabled={simActive}
                    >
                      <option value="ambulance">Ambulance</option>
                      <option value="fire_truck">Fire Truck</option>
                    </select>
                  </motion.div>
                </div>
                <motion.button
                  className="w-full bg-blue-500 text-white py-4 rounded-lg font-semibold text-lg hover:bg-blue-600 transition duration-300 shadow-lg"
                  onClick={handleStartSim}
                  disabled={simActive}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {simActive ? (
                    <>
                      <svg className="animate-spin h-5 w-5 mr-3 inline" viewBox="0 0 24 24"></svg>
                      Simulating...
                    </>
                  ) : 'Track Emergency Vehicle'}
                </motion.button>
                <div className="mt-8 flex flex-col items-center">
                  <motion.div className="mb-4 w-full h-64 rounded-lg border shadow" id="sim-mapbox" variants={itemVariants} style={{ minHeight: '300px' }} />
                  <motion.div className="mb-2 text-gray-700" variants={itemVariants}>Current Coordinates: <span className="font-mono">{simCoords.lat.toFixed(5)}, {simCoords.lng.toFixed(5)}</span></motion.div>
                  <motion.div className="w-full bg-gray-200 rounded-full h-3" variants={itemVariants}>
                    <div
                      className={`h-3 rounded-full ${simType === 'ambulance' ? 'bg-blue-500' : 'bg-red-500'}`}
                      style={{ width: `${simProgress}%` }}
                    ></div>
                  </motion.div>
                  <motion.div className="mt-2 text-sm text-gray-500" variants={itemVariants}>{simProgress < 100 ? 'Vehicle en route...' : 'Arrived!'}</motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'history' && (
          <motion.div className="bg-white rounded-lg shadow-md p-6" variants={containerVariants} initial="hidden" animate="visible">
            <SectionHeader icon={<ClipboardDocumentListIcon />} title="Emergency History" />
            <div className="space-y-4">
              {emergencyHistory.length === 0 ? (
                <motion.p className="text-gray-600" variants={itemVariants}>No emergency history found.</motion.p>
              ) : (
                emergencyHistory.map((emergency, index) => (
                  <motion.div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition" variants={itemVariants}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">{emergency.type}</h3>
                        <p className="text-sm text-gray-600">ID: {emergency.id}</p>
                        <p className="text-sm text-gray-600">{emergency.location} • {emergency.date}</p>
                        <p className="text-sm text-gray-600">{emergency.response}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        emergency.status === 'Resolved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {emergency.status}
                      </span>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'profile' && (
          <motion.div className="max-w-4xl mx-auto" variants={containerVariants} initial="hidden" animate="visible">
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="flex items-center justify-between mb-6">
                <SectionHeader icon={<UserIcon />} title="User Profile" />
                <button className="text-blue-600 hover:text-blue-700 text-sm flex items-center space-x-1">
                  <PencilIcon className="h-4 w-4" /> <span>Edit Profile</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Personal Information */}
                <motion.div variants={itemVariants}>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                        {userData.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{userData.name}</h4>
                        <p className="text-sm text-gray-600">Registered User</p>
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
                    </div>
                  </div>
                </motion.div>

                {/* Emergency Contacts */}
                <motion.div variants={itemVariants}>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Emergency Contacts</h3>
                  <div className="space-y-4">
                    {userData.emergencyContacts.length === 0 ? (
                        <p className="text-gray-600 border border-gray-200 rounded-lg p-4">No emergency contacts configured.</p>
                    ) : (
                        userData.emergencyContacts.map((contact, index) => (
                        <motion.div key={index} className="border rounded-lg p-4 bg-white shadow-sm" variants={itemVariants}>
                            <h4 className="font-semibold text-gray-900">{contact.name}</h4>
                            <p className="text-sm text-gray-600">{contact.relationship}</p>
                            <p className="text-sm text-gray-600">{contact.phone}</p>
                        </motion.div>
                        ))
                    )}
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}