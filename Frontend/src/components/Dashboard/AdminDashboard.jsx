import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { tokenUtils } from '../../services/api';
import { MdOutlineLeaderboard, MdEmergency, MdAccessTime, MdLocationOn, MdOutlineReport, MdPhone, MdMap, MdStar, MdPerson, MdAdd } from 'react-icons/md';
import { FaUser, FaTrophy, FaBuilding, FaClipboardList, FaMapMarkerAlt, FaRegClock, FaUserMd, FaAmbulance, FaUserShield, FaFireExtinguisher } from 'react-icons/fa';
import { HomeIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import reactLogo from '../../assets/react-logo.png'; // Use your actual logo path
import AmbulanceAdmin from './../../assets/AmbulanceAdmin.avif';
import { motion } from 'framer-motion';



function decodeJWT(token) {
  if (!token) return {};
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
  } catch {
    return {};
  }
}

const MAPBOX_TOKEN = 'pk.eyJ1IjoibWFpdHJleWVlMjkiLCJhIjoiY20wdjhtbXhvMWRkYTJxb3UwYmo2NXRlZCJ9.BIf7Ebj0qCJtAV9HE-utBQ';

const UserHistory = () => {
  const [userId, setUserId] = useState(1);
  const [inputId, setInputId] = useState(1);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchHistory = async (id) => {
    setLoading(true);
    setError('');
    try {
      const token = tokenUtils.getToken();
      const res = await fetch(`http://localhost:8080/user/bookings/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!res.ok) throw new Error('Failed to fetch user history');
      const data = await res.json();
      setHistory(data);
    } catch (err) {
      setError(err.message || 'Error fetching user history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory(userId);
  }, [userId]);

  const handleIdChange = (e) => {
    setInputId(e.target.value);
  };

  const handleIdSubmit = (e) => {
    e.preventDefault();
    if (inputId && !isNaN(Number(inputId))) {
      setUserId(Number(inputId));
    }
  };

  return (
    <section className="mb-8">
      <h2 className="text-xl font-semibold mb-4">User Booking History</h2>
      <form onSubmit={handleIdSubmit} className="mb-4 flex items-center gap-2">
        <label htmlFor="userIdInput" className="font-medium">User ID:</label>
        <input
          id="userIdInput"
          type="number"
          min="1"
          value={inputId}
          onChange={handleIdChange}
          className="border px-2 py-1 rounded w-24"
        />
        <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition">Load</button>
      </form>
      {loading ? (
        <div className="text-gray-500">Loading user history...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : history && history.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded shadow">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b">Request ID</th>
                <th className="px-4 py-2 border-b">Issue Type</th>
                <th className="px-4 py-2 border-b">Victim Phone</th>
                <th className="px-4 py-2 border-b">Status</th>
                <th className="px-4 py-2 border-b">Created At</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item) => (
                <tr key={item.requestId}>
                  <td className="px-4 py-2 border-b text-center">{item.requestId}</td>
                  <td className="px-4 py-2 border-b text-center">{item.issueType}</td>
                  <td className="px-4 py-2 border-b text-center">{item.victimPhoneNumber}</td>
                  <td className="px-4 py-2 border-b text-center">{item.status}</td>
                  <td className="px-4 py-2 border-b text-center">{new Date(item.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-gray-500">No booking history found.</div>
      )}
    </section>
  );
};

const AllBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const mapRef = React.useRef(null);

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      setError('');
      try {
        const token = tokenUtils.getToken();
        const res = await fetch('http://localhost:8080/booking/all', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!res.ok) throw new Error('Failed to fetch all bookings');
        const data = await res.json();
        setBookings(data);
      } catch (err) {
        setError(err.message || 'Error fetching all bookings');
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  // Map rendering
  useEffect(() => {
    if (!window.mapboxgl || !bookings.length) return;
    window.mapboxgl.accessToken = MAPBOX_TOKEN;
    if (mapRef.current) {
      mapRef.current.innerHTML = '';
    }
    const map = new window.mapboxgl.Map({
      container: 'all-bookings-map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [bookings[0]?.pickup_longitude || 73.8167, bookings[0]?.pickup_latitude || 18.5304],
      zoom: 11
    });
    bookings.forEach(b => {
      const marker = new window.mapboxgl.Marker({ color: b.status === 'COMPLETED' ? 'green' : b.status === 'PENDING' ? 'orange' : 'blue' })
        .setLngLat([b.pickup_longitude, b.pickup_latitude])
        .setPopup(new window.mapboxgl.Popup().setHTML(`<div><b>Issue:</b> ${b.issue_type}<br/><b>Status:</b> ${b.status}</div>`))
        .addTo(map);
    });
    return () => map.remove();
  }, [bookings]);

  // Load Mapbox GL JS script if not present
  useEffect(() => {
    if (window.mapboxgl) return;
    const script = document.createElement('script');
    script.src = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js';
    script.async = true;
    script.onload = () => {};
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

  return (
    <section className="mb-8">
      <h2 className="text-xl font-semibold mb-4">All Bookings</h2>
      <div className="mb-6">
        <div id="all-bookings-map" ref={mapRef} className="w-full h-96 rounded-lg shadow border" />
      </div>
      {loading ? (
        <div className="text-gray-500">Loading all bookings...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : bookings && bookings.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded shadow">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b">Booking ID</th>
                <th className="px-4 py-2 border-b">Issue Type</th>
                <th className="px-4 py-2 border-b">Status</th>
                <th className="px-4 py-2 border-b">Created At</th>
                <th className="px-4 py-2 border-b">Victim Phone</th>
                <th className="px-4 py-2 border-b">Requested By (User ID)</th>
                <th className="px-4 py-2 border-b">Ambulance?</th>
                <th className="px-4 py-2 border-b">Police?</th>
                <th className="px-4 py-2 border-b">Fire Brigade?</th>
                <th className="px-4 py-2 border-b">Ambulance Count</th>
                <th className="px-4 py-2 border-b">Police Count</th>
                <th className="px-4 py-2 border-b">Fire Truck Count</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.booking_id}>
                  <td className="px-4 py-2 border-b text-center">{b.booking_id}</td>
                  <td className="px-4 py-2 border-b text-center">{b.issue_type}</td>
                  <td className="px-4 py-2 border-b text-center">{b.status}</td>
                  <td className="px-4 py-2 border-b text-center">{new Date(b.created_at).toLocaleString()}</td>
                  <td className="px-4 py-2 border-b text-center">{b.victim_phone_number}</td>
                  <td className="px-4 py-2 border-b text-center">{b.requested_by_user_id}</td>
                  <td className="px-4 py-2 border-b text-center">{b.needs_ambulance ? 'Yes' : 'No'}</td>
                  <td className="px-4 py-2 border-b text-center">{b.needs_police ? 'Yes' : 'No'}</td>
                  <td className="px-4 py-2 border-b text-center">{b.needs_fire_brigade ? 'Yes' : 'No'}</td>
                  <td className="px-4 py-2 border-b text-center">{b.requested_ambulance_count}</td>
                  <td className="px-4 py-2 border-b text-center">{b.requested_police_count}</td>
                  <td className="px-4 py-2 border-b text-center">{b.requested_fire_truck_count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-gray-500">No bookings found.</div>
      )}
    </section>
  );
};

const AmbulanceList = () => {
  const [ambulances, setAmbulances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const mapRef = React.useRef(null);

  useEffect(() => {
    const fetchAmbulances = async () => {
      setLoading(true);
      setError('');
      try {
        const token = tokenUtils.getToken();
        const res = await fetch('http://localhost:8080/ambulance/all', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!res.ok) throw new Error('Failed to fetch ambulances');
        const data = await res.json();
        setAmbulances(data);
      } catch (err) {
        setError(err.message || 'Error fetching ambulances');
      } finally {
        setLoading(false);
      }
    };
    fetchAmbulances();
  }, []);

  // Map rendering
  useEffect(() => {
    if (!window.mapboxgl || !ambulances.length) return;
    window.mapboxgl.accessToken = MAPBOX_TOKEN;
    if (mapRef.current) {
      mapRef.current.innerHTML = '';
    }
    const map = new window.mapboxgl.Map({
      container: 'ambulance-list-map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [ambulances[0]?.longitude || 73.8167, ambulances[0]?.latitude || 18.5304],
      zoom: 11
    });
    ambulances.forEach(a => {
      if (a.longitude && a.latitude) {
        const marker = new window.mapboxgl.Marker({ color: a.status === 'AVAILABLE' ? 'green' : a.status === 'EN_ROUTE' ? 'orange' : 'red' })
          .setLngLat([a.longitude, a.latitude])
          .setPopup(new window.mapboxgl.Popup().setHTML(`<div><b>Reg Number:</b> ${a.regNumber}<br/><b>Status:</b> ${a.status}</div>`))
          .addTo(map);
      }
    });
    return () => map.remove();
  }, [ambulances]);

  // Load Mapbox GL JS script if not present
  useEffect(() => {
    if (window.mapboxgl) return;
    const script = document.createElement('script');
    script.src = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js';
    script.async = true;
    script.onload = () => {};
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

  return (
    <section className="mb-8">
      <h2 className="text-xl font-semibold mb-4">All Ambulances</h2>
      <div className="mb-6">
        <div id="ambulance-list-map" ref={mapRef} className="w-full h-96 rounded-lg shadow border" />
      </div>
      {loading ? (
        <div className="text-gray-500">Loading ambulances...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : ambulances && ambulances.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded shadow">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b">ID</th>
                <th className="px-4 py-2 border-b">Reg Number</th>
                <th className="px-4 py-2 border-b">Driver Name</th>
                <th className="px-4 py-2 border-b">Driver Phone</th>
                <th className="px-4 py-2 border-b">Status</th>
                <th className="px-4 py-2 border-b">Latitude</th>
                <th className="px-4 py-2 border-b">Longitude</th>
                <th className="px-4 py-2 border-b">Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {ambulances.map((a) => (
                <tr key={a.id}>
                  <td className="px-4 py-2 border-b text-center">{a.id}</td>
                  <td className="px-4 py-2 border-b text-center">{a.regNumber}</td>
                  <td className="px-4 py-2 border-b text-center">{a.driverName}</td>
                  <td className="px-4 py-2 border-b text-center">{a.driverPhone}</td>
                  <td className="px-4 py-2 border-b text-center">{a.status}</td>
                  <td className="px-4 py-2 border-b text-center">{a.latitude}</td>
                  <td className="px-4 py-2 border-b text-center">{a.longitude}</td>
                  <td className="px-4 py-2 border-b text-center">{new Date(a.lastUpdated).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-gray-500">No ambulances found.</div>
      )}
    </section>
  );
};

const FireBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const mapRef = React.useRef(null);

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      setError('');
      try {
        const token = tokenUtils.getToken();
        const res = await fetch('http://localhost:8080/booking/fire', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!res.ok) throw new Error('Failed to fetch fire bookings');
        const data = await res.json();
        setBookings(data);
      } catch (err) {
        setError(err.message || 'Error fetching fire bookings');
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  // Map rendering
  useEffect(() => {
    if (!window.mapboxgl || !bookings.length) return;
    window.mapboxgl.accessToken = MAPBOX_TOKEN;
    if (mapRef.current) {
      mapRef.current.innerHTML = '';
    }
    const map = new window.mapboxgl.Map({
      container: 'fire-bookings-map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [bookings[0]?.pickup_longitude || 73.8167, bookings[0]?.pickup_latitude || 18.5304],
      zoom: 11
    });
    bookings.forEach(b => {
      if (b.pickup_longitude && b.pickup_latitude) {
        const marker = new window.mapboxgl.Marker({ color: b.status === 'COMPLETED' ? 'green' : b.status === 'PENDING' ? 'orange' : 'red' })
          .setLngLat([b.pickup_longitude, b.pickup_latitude])
          .setPopup(new window.mapboxgl.Popup().setHTML(`<div><b>Issue:</b> ${b.issue_type}<br/><b>Status:</b> ${b.status}</div>`))
          .addTo(map);
      }
    });
    return () => map.remove();
  }, [bookings]);

  // Load Mapbox GL JS script if not present
  useEffect(() => {
    if (window.mapboxgl) return;
    const script = document.createElement('script');
    script.src = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js';
    script.async = true;
    script.onload = () => {};
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

  return (
    <section className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Fire Bookings</h2>
      <div className="mb-6">
        <div id="fire-bookings-map" ref={mapRef} className="w-full h-96 rounded-lg shadow border" />
      </div>
      {loading ? (
        <div className="text-gray-500">Loading fire bookings...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : bookings && bookings.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded shadow">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b">Booking ID</th>
                <th className="px-4 py-2 border-b">Issue Type</th>
                <th className="px-4 py-2 border-b">Status</th>
                <th className="px-4 py-2 border-b">Created At</th>
                <th className="px-4 py-2 border-b">Victim Phone</th>
                <th className="px-4 py-2 border-b">Requested By (User ID)</th>
                <th className="px-4 py-2 border-b">Ambulance?</th>
                <th className="px-4 py-2 border-b">Police?</th>
                <th className="px-4 py-2 border-b">Fire Brigade?</th>
                <th className="px-4 py-2 border-b">Ambulance Count</th>
                <th className="px-4 py-2 border-b">Police Count</th>
                <th className="px-4 py-2 border-b">Fire Truck Count</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.booking_id}>
                  <td className="px-4 py-2 border-b text-center">{b.booking_id}</td>
                  <td className="px-4 py-2 border-b text-center">{b.issue_type}</td>
                  <td className="px-4 py-2 border-b text-center">{b.status}</td>
                  <td className="px-4 py-2 border-b text-center">{new Date(b.created_at).toLocaleString()}</td>
                  <td className="px-4 py-2 border-b text-center">{b.victim_phone_number}</td>
                  <td className="px-4 py-2 border-b text-center">{b.requested_by_user_id}</td>
                  <td className="px-4 py-2 border-b text-center">{b.needs_ambulance ? 'Yes' : 'No'}</td>
                  <td className="px-4 py-2 border-b text-center">{b.needs_police ? 'Yes' : 'No'}</td>
                  <td className="px-4 py-2 border-b text-center">{b.needs_fire_brigade ? 'Yes' : 'No'}</td>
                  <td className="px-4 py-2 border-b text-center">{b.requested_ambulance_count}</td>
                  <td className="px-4 py-2 border-b text-center">{b.requested_police_count}</td>
                  <td className="px-4 py-2 border-b text-center">{b.requested_fire_truck_count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-gray-500">No fire bookings found.</div>
      )}
    </section>
  );
};

const TABS = [
  { key: 'dashboard', label: <><MdOutlineLeaderboard className="inline text-lg mr-1 align-middle" /> Dashboard</> },
  { key: 'userHistory', label: <><FaUser className="inline text-lg mr-1 align-middle" /> User History</> },
  { key: 'allBookings', label: <><FaClipboardList className="inline text-lg mr-1 align-middle" /> All Bookings</> },
  { key: 'ambulances', label: <><FaAmbulance className="inline text-lg mr-1 align-middle" /> Ambulances</> },
  { key: 'fireBookings', label: <><FaFireExtinguisher className="inline text-lg mr-1 align-middle" /> Fire Bookings</> },
  { key: 'profile', label: <><FaUserShield className="inline text-lg mr-1 align-middle" /> Profile</> },
];

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');

  const [profileData, setProfileData] = useState({ fullName: 'Admin User' }); // Later fetch real data
const navigate = useNavigate();



  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError('');
      try {
        const token = tokenUtils.getToken();
        const res = await fetch('http://localhost:8080/api/dashboard/stats', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!res.ok) throw new Error('Failed to fetch dashboard stats');
        const data = await res.json();
        setStats(data);
      } catch (err) {
        setError(err.message || 'Error fetching stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const handleLogout = () => {
    tokenUtils.removeToken();
    navigate('/login');
  };

  const jwt = localStorage.getItem('jwt');
  const userInfo = decodeJWT(jwt);

  return (
    <div className="min-h-screen bg-purple-50 font-inter text-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between bg-purple-50 ">
  
  {/* Left - Logo + Title */}
  <div className="flex items-center gap-4">
    <img
      src={reactLogo}
      alt="Logo"
      className="h-14 w-14 object-contain rounded-xl bg-white p-2 shadow"
    />
    <div>
      <h1 className="text-xl font-semibold text-purple-900">Admin Dashboard</h1>
      <p className="text-sm text-purple-700">Overall System Administration</p>
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
      onClick={() => navigate('/profile')}
      title="Go to Profile"
      className="cursor-pointer"
    >
      <img
        src={AmbulanceAdmin}
        alt="Admin Avatar"
        className="h-10 w-10 rounded-full object-cover border-2 border-purple-300 shadow"
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
        onClick={handleLogout}
        title="Logout"
        className="text-red-600 hover:text-red-800 transition"
      >
        <ArrowRightOnRectangleIcon className="h-6 w-6" />
      </button>
    </div>

  </div>
</div>

     {/* Capsule Navbar - Purple Themed */}
    <div className="w-full flex justify-center mb-10">
      <nav className="bg-purple-50 border border-purple-100 rounded-full shadow-md px-4 py-2 flex space-x-4 overflow-x-auto max-w-5xl">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all transform
              ${
                activeTab === tab.key
                  ? 'bg-purple-100 text-purple-700 border-purple-300 shadow-md'
                  : 'text-gray-600 border-transparent hover:bg-purple-50 hover:text-purple-600 hover:scale-105'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>

      {/* Tab Content */}
      {activeTab === 'dashboard' && (
        <>
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">System Metrics</h2>
            {loading ? (
              <div className="text-gray-500">Loading stats...</div>
            ) : error ? (
              <div className="text-red-500">{error}</div>
            ) : stats ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded shadow flex items-center">
                  <MdOutlineLeaderboard className="inline text-lg mr-2" /> Total Users: <span className="font-bold ml-2">{stats.total_users}</span>
                </div>
                <div className="bg-white p-4 rounded shadow flex items-center">
                  <FaClipboardList className="inline text-lg mr-2" /> Total Bookings: <span className="font-bold ml-2">{stats.total_bookings}</span>
                </div>
                <div className="bg-white p-4 rounded shadow flex items-center">
                  <MdEmergency className="inline text-lg mr-2" /> Pending Bookings: <span className="font-bold ml-2">{stats.pending_bookings}</span>
                </div>
                <div className="bg-white p-4 rounded shadow flex items-center">
                  <MdAccessTime className="inline text-lg mr-2" /> Completed Bookings: <span className="font-bold ml-2">{stats.completed_bookings}</span>
                </div>
                <div className="bg-white p-4 rounded shadow flex items-center">
                  <FaAmbulance className="inline text-lg mr-2" /> Total Ambulances: <span className="font-bold ml-2">{stats.total_ambulances}</span>
                </div>
                <div className="bg-white p-4 rounded shadow flex items-center">
                  <MdLocationOn className="inline text-lg mr-2" /> Available Ambulances: <span className="font-bold ml-2">{stats.available_ambulances}</span>
                </div>
                <div className="bg-white p-4 rounded shadow flex items-center">
                  <FaFireExtinguisher className="inline text-lg mr-2" /> Total Fire Trucks: <span className="font-bold ml-2">{stats.total_fire_trucks}</span>
                </div>
                <div className="bg-white p-4 rounded shadow flex items-center">
                  <MdLocationOn className="inline text-lg mr-2" /> Available Fire Trucks: <span className="font-bold ml-2">{stats.available_fire_trucks}</span>
                </div>
                <div className="bg-white p-4 rounded shadow flex items-center">
                  <FaUserShield className="inline text-lg mr-2" /> Total Police Officers: <span className="font-bold ml-2">{stats.total_police_officers}</span>
                </div>
                <div className="bg-white p-4 rounded shadow flex items-center">
                  <FaBuilding className="inline text-lg mr-2" /> Total Police Stations: <span className="font-bold ml-2">{stats.total_police_stations}</span>
                </div>
                <div className="bg-white p-4 rounded shadow flex items-center">
                  <FaUserMd className="inline text-lg mr-2" /> Total Hospitals: <span className="font-bold ml-2">{stats.total_hospitals}</span>
                </div>
                <div className="bg-white p-4 rounded shadow flex items-center">
                  <FaFireExtinguisher className="inline text-lg mr-2" /> Total Fire Stations: <span className="font-bold ml-2">{stats.total_fire_stations}</span>
                </div>
                <div className="bg-white p-4 rounded shadow flex items-center">
                  <FaAmbulance className="inline text-lg mr-2" /> Ambulance Bookings: <span className="font-bold ml-2">{stats.ambulance_bookings}</span>
                </div>
                <div className="bg-white p-4 rounded shadow flex items-center">
                  <FaFireExtinguisher className="inline text-lg mr-2" /> Fire Service Bookings: <span className="font-bold ml-2">{stats.fire_service_bookings}</span>
                </div>
                <div className="bg-white p-4 rounded shadow flex items-center">
                  <FaUserShield className="inline text-lg mr-2" /> Police Service Bookings: <span className="font-bold ml-2">{stats.police_service_bookings}</span>
                </div>
                <div className="bg-white p-4 rounded shadow flex items-center">
                  <MdAccessTime className="inline text-lg mr-2" /> Avg. Completion Time (min): <span className="font-bold ml-2">{stats.average_completion_time_minutes}</span>
                </div>
                <div className="bg-white p-4 rounded shadow flex items-center">
                  <MdStar className="inline text-lg mr-2" /> Booking Completion Rate: <span className="font-bold ml-2">{stats.booking_completion_rate?.toFixed(2)}%</span>
                </div>
              </div>
            ) : null}
          </section>
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Live Vehicle Locations</h2>
            <div className="bg-white p-6 rounded shadow flex items-center justify-center min-h-[200px]">
              {/* Map placeholder */}
              <span className="text-gray-400">[Map will be displayed here]</span>
            </div>
          </section>
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Emergency Requests</h2>
            <div className="bg-white p-6 rounded shadow">
              {/* Emergency requests table placeholder */}
              <span className="text-gray-400">[Emergency requests will be listed here]</span>
            </div>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-4">Navigation</h2>
            <div className="flex gap-4">
              <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">View All Users</button>
              <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">Manage Drivers</button>
              <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">System Reports</button>
            </div>
          </section>
        </>
      )}
      {activeTab === 'userHistory' && <UserHistory />}
      {activeTab === 'allBookings' && <AllBookings />}
      {activeTab === 'ambulances' && <AmbulanceList />}
      {activeTab === 'fireBookings' && <FireBookings />}
      {activeTab === 'profile' && (
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Admin Profile</h2>
            <div className="space-y-4">
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">User ID:</span>
                <span className="font-medium">{userInfo.userId || 'N/A'}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium">{userInfo.sub || 'N/A'}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Role:</span>
                <span className="font-medium">{userInfo.role || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard; 