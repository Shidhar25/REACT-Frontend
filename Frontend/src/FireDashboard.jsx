import { useState } from 'react';

export default function FireDashboard() {
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
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'Firefighter Sarah Johnson',
    badge: 'F-2024-001',
    rank: 'Senior Firefighter',
    department: 'Fire Rescue Division',
    experience: '12 years',
    email: 'sarah.johnson@fire.gov',
    phone: '+1 (555) 987-6543'
  });

  const handleStationChange = (e) => {
    const { name, value } = e.target;
    setStationForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    setLocationForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleQueryChange = (e) => {
    const { name, value } = e.target;
    setQueryForm((prev) => ({ ...prev, [name]: value }));
  };

  // Mock statistics data
  const stats = {
    totalStations: 18,
    activeTrucks: 42,
    emergencyCalls: 67,
    responseTime: '3.8 min'
  };

  // Mock station ranking data
  const stationRankings = [
    { name: 'Central Fire Station', score: 98, trucks: 8, calls: 234, responseTime: '2.8 min' },
    { name: 'North Fire Station', score: 95, trucks: 6, calls: 189, responseTime: '3.1 min' },
    { name: 'South Fire Station', score: 92, trucks: 7, calls: 201, responseTime: '3.3 min' },
    { name: 'East Fire Station', score: 89, trucks: 5, calls: 156, responseTime: '3.6 min' },
    { name: 'West Fire Station', score: 86, trucks: 6, calls: 178, responseTime: '3.9 min' },
    { name: 'Downtown Fire Station', score: 83, trucks: 10, calls: 267, responseTime: '4.2 min' }
  ];

  // Mock recent emergencies
  const recentEmergencies = [
    { id: 'E-2024-001', type: 'Fire Emergency', status: 'Resolved', time: '1 hour ago', location: 'Industrial Area' },
    { id: 'E-2024-002', type: 'Medical Emergency', status: 'In Progress', time: '3 hours ago', location: 'Residential Zone' },
    { id: 'E-2024-003', type: 'Vehicle Accident', status: 'Under Investigation', time: '5 hours ago', location: 'Highway 101' },
    { id: 'E-2024-004', type: 'Building Fire', status: 'Resolved', time: '7 hours ago', location: 'Commercial District' },
    { id: 'E-2024-005', type: 'Chemical Spill', status: 'In Progress', time: '9 hours ago', location: 'Industrial Park' }
  ];

  const handleStationSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);
    
    // Get JWT token
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
      } else {
        const data = await res.json();
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
    setLoading(true);
    
    // Get JWT token
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

      const res = await fetch('http://localhost:8080/fire/location/update', {
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
      } else {
        const data = await res.json();
        setMessage(data.message || 'Failed to update fire truck location.');
      }
    } catch (err) {
      setMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGetTrucks = async () => {
    if (!queryForm.stationId) {
      setMessage('Please enter a station ID.');
      return;
    }
    
    setMessage('');
    setLoading(true);
    
    // Get JWT token
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
        setMessage('Trucks data retrieved successfully!');
      } else {
        const data = await res.json();
        setMessage(data.message || 'Failed to get trucks data.');
      }
    } catch (err) {
      setMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGetStationHistory = async () => {
    if (!queryForm.stationId) {
      setMessage('Please enter a station ID.');
      return;
    }
    
    setMessage('');
    setLoading(true);
    
    // Get JWT token
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
        setData(result);
        setMessage('Station history retrieved successfully!');
      } else {
        const data = await res.json();
        setMessage(data.message || 'Failed to get station history.');
      }
    } catch (err) {
      setMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGetTruckHistory = async () => {
    if (!queryForm.truckId) {
      setMessage('Please enter a truck ID.');
      return;
    }
    
    setMessage('');
    setLoading(true);
    
    // Get JWT token
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
        setData(result);
        setMessage('Truck history retrieved successfully!');
      } else {
        const data = await res.json();
        setMessage(data.message || 'Failed to get truck history.');
      }
    } catch (err) {
      setMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const QuickActionCard = ({ title, description, icon, onClick, color }) => (
    <div 
      onClick={onClick}
      className={`bg-white p-6 rounded-lg shadow-md cursor-pointer transition-all hover:shadow-lg hover:scale-105 ${color}`}
    >
      <div className="flex items-center space-x-4">
        <div className="text-3xl">{icon}</div>
        <div>
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
    </div>
  );

  const StatCard = ({ title, value, subtitle, color }) => (
    <div className={`bg-white p-6 rounded-lg shadow-md ${color}`}>
      <div className="text-right">
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        <p className="text-sm text-gray-600">{title}</p>
        {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Fire Dashboard</h1>
              <p className="text-gray-600">Emergency Response Management System</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Welcome, {profileData.name.split(' ')[1]}</p>
                <p className="text-xs text-gray-500">Last updated: {new Date().toLocaleTimeString()}</p>
              </div>
              <button 
                onClick={() => setShowProfile(!showProfile)}
                className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center text-white font-semibold hover:bg-orange-700 transition"
              >
                F
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', name: 'Overview', icon: '📊' },
              { id: 'stations', name: 'Stations', icon: '🏢' },
              { id: 'trucks', name: 'Trucks', icon: '🚒' },
              { id: 'emergencies', name: 'Emergencies', icon: '🚨' },
              { id: 'reports', name: 'Reports', icon: '📋' },
              { id: 'ranking', name: 'Rankings', icon: '🏆' },
              { id: 'profile', name: 'Profile', icon: '👤' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
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
      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard 
                title="Total Stations" 
                value={stats.totalStations} 
                subtitle="Active fire stations"
                color="border-l-4 border-l-orange-500"
              />
              <StatCard 
                title="Active Trucks" 
                value={stats.activeTrucks} 
                subtitle="Available fire trucks"
                color="border-l-4 border-l-red-500"
              />
              <StatCard 
                title="Emergency Calls" 
                value={stats.emergencyCalls} 
                subtitle="Today's calls"
                color="border-l-4 border-l-yellow-500"
              />
              <StatCard 
                title="Avg Response Time" 
                value={stats.responseTime} 
                subtitle="Emergency response"
                color="border-l-4 border-l-green-500"
              />
            </div>

            {/* Quick Actions */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <QuickActionCard
                  title="Add Station"
                  description="Create a new fire station"
                  icon="🏢"
                  onClick={() => setActiveTab('stations')}
                  color="hover:border-orange-500"
                />
                <QuickActionCard
                  title="Update Location"
                  description="Update truck locations"
                  icon="📍"
                  onClick={() => setActiveTab('trucks')}
                  color="hover:border-red-500"
                />
                <QuickActionCard
                  title="View Emergencies"
                  description="Monitor active emergencies"
                  icon="🚨"
                  onClick={() => setActiveTab('emergencies')}
                  color="hover:border-yellow-500"
                />
                <QuickActionCard
                  title="Generate Reports"
                  description="Create incident reports"
                  icon="📋"
                  onClick={() => setActiveTab('reports')}
                  color="hover:border-purple-500"
                />
                <QuickActionCard
                  title="Live Map"
                  description="View real-time locations"
                  icon="🗺️"
                  onClick={() => window.open('/navigation/fire_truck/1', '_blank')}
                  color="hover:border-indigo-500"
                />
                <QuickActionCard
                  title="Station Rankings"
                  description="View performance metrics"
                  icon="🏆"
                  onClick={() => setActiveTab('ranking')}
                  color="hover:border-green-500"
                />
                <QuickActionCard
                  title="My Profile"
                  description="Update personal information"
                  icon="👤"
                  onClick={() => setActiveTab('profile')}
                  color="hover:border-blue-500"
                />
                <QuickActionCard
                  title="Emergency Contacts"
                  description="Quick contact list"
                  icon="📞"
                  onClick={() => alert('Emergency contacts feature coming soon!')}
                  color="hover:border-pink-500"
                />
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {[
                  { time: '2 min ago', action: 'New fire emergency reported', location: 'Industrial Area' },
                  { time: '5 min ago', action: 'Fire truck dispatched', location: 'Central Station' },
                  { time: '12 min ago', action: 'Station status updated', location: 'North District' },
                  { time: '18 min ago', action: 'Emergency resolved', location: 'South Station' }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                      <p className="text-xs text-gray-500">{activity.location}</p>
                    </div>
                    <span className="text-xs text-gray-400">{activity.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Emergencies */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Emergencies</h3>
              <div className="space-y-3">
                {recentEmergencies.map((emergency, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        emergency.status === 'Resolved' ? 'bg-green-500' :
                        emergency.status === 'In Progress' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{emergency.id}</p>
                        <p className="text-xs text-gray-500">{emergency.type} • {emergency.location}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs px-2 py-1 rounded ${
                        emergency.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                        emergency.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {emergency.status}
                      </span>
                      <p className="text-xs text-gray-400 mt-1">{emergency.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'stations' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Fire Stations</h2>
              <button 
                onClick={() => setActiveTab('add-station')}
                className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
              >
                + Add Station
              </button>
            </div>

            {/* Station List */}
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Stations</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { name: 'Central Fire Station', trucks: 8, status: 'Active' },
                    { name: 'North Fire Station', trucks: 6, status: 'Active' },
                    { name: 'South Fire Station', trucks: 7, status: 'Active' },
                    { name: 'East Fire Station', trucks: 5, status: 'Active' },
                    { name: 'West Fire Station', trucks: 6, status: 'Active' },
                    { name: 'Downtown Fire Station', trucks: 10, status: 'Active' }
                  ].map((station, index) => (
                    <div key={index} className="border rounded-lg p-4 hover:shadow-md transition">
                      <h4 className="font-semibold text-gray-900">{station.name}</h4>
                      <p className="text-sm text-gray-600">Trucks: {station.trucks}</p>
                      <span className="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                        {station.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'add-station' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Create Fire Station</h2>
                <button 
                  onClick={() => setActiveTab('stations')}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ← Back to Stations
                </button>
              </div>
              
              <form onSubmit={handleStationSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Station Name</label>
                  <input 
                    name="name" 
                    value={stationForm.name} 
                    onChange={handleStationChange} 
                    placeholder="Enter station name" 
                    required 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500" 
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                    <input 
                      name="latitude" 
                      value={stationForm.latitude} 
                      onChange={handleStationChange} 
                      placeholder="e.g., 18.5204" 
                      type="number" 
                      step="any"
                      required 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                    <input 
                      name="longitude" 
                      value={stationForm.longitude} 
                      onChange={handleStationChange} 
                      placeholder="e.g., 73.8567" 
                      type="number" 
                      step="any"
                      required 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500" 
                    />
                  </div>
                </div>
                
                <button 
                  type="submit" 
                  disabled={loading} 
                  className="w-full bg-orange-600 text-white py-3 rounded-md hover:bg-orange-700 disabled:opacity-50 font-medium"
                >
                  {loading ? 'Creating Station...' : 'Create Fire Station'}
                </button>
              </form>
              
              {message && (
                <div className={`mt-4 p-3 rounded-md ${
                  message.includes('success') 
                    ? 'bg-green-100 text-green-700 border border-green-200' 
                    : 'bg-red-100 text-red-700 border border-red-200'
                }`}>
                  {message}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'trucks' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Fire Trucks</h2>
              <button 
                onClick={() => setActiveTab('update-location')}
                className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
              >
                Update Location
              </button>
            </div>

            {/* Truck Management */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Query Truck Data</h3>
              <div className="space-y-4 max-w-md">
                <div>
                  <input 
                    name="stationId" 
                    value={queryForm.stationId} 
                    onChange={handleQueryChange} 
                    placeholder="Station ID" 
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2" 
                  />
                  <div className="flex gap-2">
                    <button 
                      onClick={handleGetTrucks} 
                      disabled={loading}
                      className="flex-1 bg-orange-600 text-white py-2 rounded hover:bg-orange-700 disabled:opacity-50"
                    >
                      Get Trucks
                    </button>
                    <button 
                      onClick={handleGetStationHistory} 
                      disabled={loading}
                      className="flex-1 bg-orange-600 text-white py-2 rounded hover:bg-orange-700 disabled:opacity-50"
                    >
                      Get History
                    </button>
                  </div>
                </div>
                <div>
                  <input 
                    name="truckId" 
                    value={queryForm.truckId} 
                    onChange={handleQueryChange} 
                    placeholder="Truck ID" 
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2" 
                  />
                  <button 
                    onClick={handleGetTruckHistory} 
                    disabled={loading}
                    className="w-full bg-orange-600 text-white py-2 rounded hover:bg-orange-700 disabled:opacity-50"
                  >
                    Get Truck History
                  </button>
                </div>
              </div>
            </div>

            {message && <div className={`mt-4 p-3 rounded-md ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{message}</div>}
            
            {data && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Response Data</h3>
                {Array.isArray(data) && data.length > 0 && (
                  <div className="overflow-x-auto">
                    {data[0].registrationNumber ? (
                      <table className="w-full text-sm bg-white border border-gray-300">
                        <thead className="bg-orange-100">
                          <tr>
                            <th className="px-3 py-2 border-b text-left">ID</th>
                            <th className="px-3 py-2 border-b text-left">Registration</th>
                            <th className="px-3 py-2 border-b text-left">Driver Name</th>
                            <th className="px-3 py-2 border-b text-left">Phone</th>
                            <th className="px-3 py-2 border-b text-left">Status</th>
                            <th className="px-3 py-2 border-b text-left">Last Updated</th>
                            <th className="px-3 py-2 border-b text-left">Location</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.map((truck, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="px-3 py-2 border-b">{truck.id}</td>
                              <td className="px-3 py-2 border-b font-mono">{truck.registrationNumber}</td>
                              <td className="px-3 py-2 border-b">{truck.driverName}</td>
                              <td className="px-3 py-2 border-b">{truck.driverPhoneNumber}</td>
                              <td className="px-3 py-2 border-b">
                                <span className={`px-2 py-1 rounded text-xs ${
                                  truck.status === 'AVAILABLE' ? 'bg-green-100 text-green-800' :
                                  truck.status === 'EN_ROUTE' ? 'bg-blue-100 text-blue-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {truck.status}
                                </span>
                              </td>
                              <td className="px-3 py-2 border-b text-xs">
                                {new Date(truck.lastUpdated).toLocaleString()}
                              </td>
                              <td className="px-3 py-2 border-b text-xs">
                                {truck.latitude?.toFixed(4)}, {truck.longitude?.toFixed(4)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : data[0].bookingId ? (
                      <table className="w-full text-sm bg-white border border-gray-300">
                        <thead className="bg-orange-100">
                          <tr>
                            <th className="px-3 py-2 border-b text-left">Booking ID</th>
                            <th className="px-3 py-2 border-b text-left">Pickup Location</th>
                            <th className="px-3 py-2 border-b text-left">Issue Type</th>
                            <th className="px-3 py-2 border-b text-left">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.map((booking, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="px-3 py-2 border-b">{booking.bookingId}</td>
                              <td className="px-3 py-2 border-b text-xs">
                                {booking.pickupLatitude?.toFixed(6)}, {booking.pickupLongitude?.toFixed(6)}
                              </td>
                              <td className="px-3 py-2 border-b">
                                <span className="px-2 py-1 rounded text-xs bg-red-100 text-red-800">
                                  {booking.issueType}
                                </span>
                              </td>
                              <td className="px-3 py-2 border-b">
                                <span className={`px-2 py-1 rounded text-xs ${
                                  booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                  booking.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {booking.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div className="text-xs text-gray-600 font-mono bg-gray-50 p-3 rounded border overflow-auto max-h-40">
                        {JSON.stringify(data, null, 2)}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'update-location' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Update Fire Truck Location</h2>
                <button 
                  onClick={() => setActiveTab('trucks')}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ← Back to Trucks
                </button>
              </div>
              
              <form onSubmit={handleLocationSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Truck ID</label>
                  <input 
                    name="truckId" 
                    value={locationForm.truckId} 
                    onChange={handleLocationChange} 
                    placeholder="Enter truck ID" 
                    type="number"
                    required 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500" 
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                    <input 
                      name="latitude" 
                      value={locationForm.latitude} 
                      onChange={handleLocationChange} 
                      placeholder="e.g., 19.12345" 
                      type="number" 
                      step="any"
                      required 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                    <input 
                      name="longitude" 
                      value={locationForm.longitude} 
                      onChange={handleLocationChange} 
                      placeholder="e.g., 72.54321" 
                      type="number" 
                      step="any"
                      required 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500" 
                    />
                  </div>
                </div>
                
                <button 
                  type="submit" 
                  disabled={loading} 
                  className="w-full bg-orange-600 text-white py-3 rounded-md hover:bg-orange-700 disabled:opacity-50 font-medium"
                >
                  {loading ? 'Updating Location...' : 'Update Location'}
                </button>
              </form>
              
              {message && (
                <div className={`mt-4 p-3 rounded-md ${
                  message.includes('success') 
                    ? 'bg-green-100 text-green-700 border border-green-200' 
                    : 'bg-red-100 text-red-700 border border-red-200'
                }`}>
                  {message}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'emergencies' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Emergency Monitoring</h2>
            <p className="text-gray-600">Emergency monitoring features coming soon...</p>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Reports</h2>
            <p className="text-gray-600">Report generation features coming soon...</p>
          </div>
        )}

        {activeTab === 'ranking' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Station Rankings</h2>
              <div className="text-sm text-gray-600">Performance Metrics</div>
            </div>

            {/* Top Performers */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Top Performing Stations</h3>
              <div className="space-y-4">
                {stationRankings.slice(0, 3).map((station, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                        index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-500'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{station.name}</h4>
                        <p className="text-sm text-gray-600">Score: {station.score}/100</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">{station.responseTime}</div>
                      <div className="text-xs text-gray-500">Response Time</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Detailed Rankings */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Complete Rankings</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Rank</th>
                      <th className="text-left py-3 px-4">Station</th>
                      <th className="text-left py-3 px-4">Score</th>
                      <th className="text-left py-3 px-4">Trucks</th>
                      <th className="text-left py-3 px-4">Calls</th>
                      <th className="text-left py-3 px-4">Response Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stationRankings.map((station, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-semibold">{index + 1}</td>
                        <td className="py-3 px-4">{station.name}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-orange-500 h-2 rounded-full" 
                                style={{ width: `${station.score}%` }}
                              ></div>
                            </div>
                            <span className="text-sm">{station.score}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">{station.trucks}</td>
                        <td className="py-3 px-4">{station.calls}</td>
                        <td className="py-3 px-4 text-green-600 font-semibold">{station.responseTime}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Firefighter Profile</h2>
                <button className="text-orange-600 hover:text-orange-700 text-sm">Edit Profile</button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Profile Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                        {profileData.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{profileData.name}</h4>
                        <p className="text-sm text-gray-600">Badge: {profileData.badge}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Rank:</span>
                        <span className="font-medium">{profileData.rank}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Department:</span>
                        <span className="font-medium">{profileData.department}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Experience:</span>
                        <span className="font-medium">{profileData.experience}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Email:</span>
                        <span className="font-medium">{profileData.email}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Phone:</span>
                        <span className="font-medium">{profileData.phone}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Performance Stats */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Statistics</h3>
                  <div className="space-y-4">
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-orange-600 font-medium">Emergencies Responded</span>
                        <span className="text-2xl font-bold text-orange-600">312</span>
                      </div>
                      <p className="text-sm text-orange-600 mt-1">This year</p>
                    </div>
                    
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-green-600 font-medium">Success Rate</span>
                        <span className="text-2xl font-bold text-green-600">96%</span>
                      </div>
                      <p className="text-sm text-green-600 mt-1">Resolved emergencies</p>
                    </div>
                    
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-yellow-600 font-medium">Response Time</span>
                        <span className="text-2xl font-bold text-yellow-600">3.2 min</span>
                      </div>
                      <p className="text-sm text-yellow-600 mt-1">Average</p>
                    </div>
                    
                    <div className="bg-red-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-red-600 font-medium">Service Hours</span>
                        <span className="text-2xl font-bold text-red-600">2,156</span>
                      </div>
                      <p className="text-sm text-red-600 mt-1">This year</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Achievements */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Achievements</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-lg">
                    <div className="text-2xl mb-2">🏆</div>
                    <h4 className="font-semibold">Firefighter of the Year</h4>
                    <p className="text-sm opacity-90">2024</p>
                  </div>
                  <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-4 rounded-lg">
                    <div className="text-2xl mb-2">⭐</div>
                    <h4 className="font-semibold">Bravery Award</h4>
                    <p className="text-sm opacity-90">Rescue Operations</p>
                  </div>
                  <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-4 rounded-lg">
                    <div className="text-2xl mb-2">🎯</div>
                    <h4 className="font-semibold">Perfect Attendance</h4>
                    <p className="text-sm opacity-90">12 months</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 