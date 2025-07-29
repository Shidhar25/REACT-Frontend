import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Animated Section Header
function SectionHeader({ icon, title }) {
  return (
    <h2 className="flex items-center gap-2 text-2xl md:text-3xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent animate-fade-in">
      <span className="text-3xl">{icon}</span>
      {title}
    </h2>
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
    hospitalID: '',
  });
  const [locationForm, setLocationForm] = useState({
    ambulanceId: '',
    latitude: '',
    longitude: '',
    status: 'AVAILABLE'
  });
  const [queryForm, setQueryForm] = useState({
    queryType: 'all',
    dateRange: 'today'
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [ambulances, setAmbulances] = useState([]);
  const [ambulancesLoading, setAmbulancesLoading] = useState(false);
  const [ambulancesError, setAmbulancesError] = useState('');
  const [recentEmergencies, setRecentEmergencies] = useState([]);
  const [emergenciesLoading, setEmergenciesLoading] = useState(false);
  const [emergenciesError, setEmergenciesError] = useState('');

  // Fetch ambulance data from API when drivers or rankings tab is active
  useEffect(() => {
    if (activeTab === 'drivers' || activeTab === 'rankings') {
      setAmbulancesLoading(true);
      setAmbulancesError('');
      fetch('http://localhost:8080/ambulance/all')
        .then((res) => {
          if (!res.ok) throw new Error('Failed to fetch ambulances');
          return res.json();
        })
        .then((data) => {
          // Sort by lastUpdated descending for rankings
          const sorted = [...data].sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));
          setAmbulances(sorted);
        })
        .catch(() => {
          setAmbulancesError('Could not load ambulances.');
        })
        .finally(() => setAmbulancesLoading(false));
    }
  }, [activeTab]);

  // Fetch recent emergencies from API when overview tab is active
  useEffect(() => {
    if (activeTab === 'overview') {
      setEmergenciesLoading(true);
      setEmergenciesError('');
      const jwt = localStorage.getItem('jwt');
      fetch('http://localhost:8080/booking/ambulance', {
        headers: {
          'Authorization': `Bearer ${jwt}`
        }
      })
        .then((res) => {
          if (!res.ok) throw new Error('Failed to fetch emergencies');
          return res.json();
        })
        .then((data) => {
          setRecentEmergencies(data);
        })
        .catch(() => {
          setEmergenciesError('Could not load recent emergencies.');
        })
        .finally(() => setEmergenciesLoading(false));
    }
  }, [activeTab]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    setLocationForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleQueryChange = (e) => {
    const { name, value } = e.target;
    setQueryForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);
    try {
      const body = { ...form, hospitalID: Number(form.hospitalID) };
      const res = await fetch('http://localhost:8080/auth/register/ambulance-driver', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        setMessage('Ambulance driver registered successfully!');
        setForm({ fullName: '', email: '', phoneNumber: '', governmentId: '', password: '', licenseNumber: '', vehicleRegNumber: '', hospitalID: '' });
      } else {
        const data = await res.json();
        setMessage(data.message || 'Registration failed.');
      }
    } catch (err) {
      setMessage('Network error.');
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
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
      } else {
        const data = await res.json();
        setMessage(data.message || 'Location update failed.');
      }
    } catch (err) {
      setMessage('Network error.');
    } finally {
      setLoading(false);
    }
  };

  const QuickActionCard = ({ title, description, icon, onClick, color }) => (
    <div 
      onClick={onClick}
      className={`bg-white p-6 rounded-lg shadow-md cursor-pointer transition-all hover:shadow-lg hover:scale-105 ${color} hover:shadow-emergency`}
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-accent to-secondary/80">
      {/* Header */}
      <div className="bg-white/80 shadow-sm border-b backdrop-blur-md animate-fade-in">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 drop-shadow">Ambulance Dashboard</h1>
              <p className="text-gray-600">Emergency Medical Services Management</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Emergency Medical Services</p>
                <p className="text-xs text-gray-500">Last updated: {new Date().toLocaleTimeString()}</p>
              </div>
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => navigate('/')} 
                  className="text-gray-600 hover:text-primary text-sm font-medium transition-colors"
                >Home</button>
                <button 
                  onClick={() => { localStorage.removeItem('jwt'); navigate('/login'); }}
                  className="text-primary hover:text-red-700 text-sm font-medium transition-colors"
                >Logout</button>
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-semibold shadow-emergency animate-bounce">
                  🚑
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white/80 border-b backdrop-blur-md animate-fade-in">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex space-x-8">
            {[{ id: 'overview', name: 'Overview', icon: '📊' }, { id: 'drivers', name: 'Drivers', icon: '👨‍⚕️' }, { id: 'vehicles', name: 'Vehicles', icon: '🚑' }, { id: 'emergencies', name: 'Emergencies', icon: '🚨' }, { id: 'reports', name: 'Reports', icon: '📋' }, { id: 'rankings', name: 'Rankings', icon: '🏆' }, { id: 'profile', name: 'Profile', icon: '👤' }, { id: 'register', name: 'Register', icon: '➕' }].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${activeTab === tab.id ? 'border-primary text-primary scale-110' : 'border-transparent text-gray-500 hover:text-secondary hover:border-accent'}`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Quick Actions */}
            <div>
              <SectionHeader icon="🚑" title="Quick Actions" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <QuickActionCard
                  title="Register Driver"
                  description="Add new ambulance driver"
                  icon="👨‍⚕️"
                  onClick={() => setActiveTab('register')}
                  color="hover:border-blue-500"
                />
                <QuickActionCard
                  title="Update Location"
                  description="Update ambulance location"
                  icon="📍"
                  onClick={() => setActiveTab('vehicles')}
                  color="hover:border-green-500"
                />
                <QuickActionCard
                  title="View Emergencies"
                  description="Check active emergencies"
                  icon="🚨"
                  onClick={() => setActiveTab('emergencies')}
                  color="hover:border-red-500"
                />
                <QuickActionCard
                  title="Driver Rankings"
                  description="View performance rankings"
                  icon="🏆"
                  onClick={() => setActiveTab('rankings')}
                  color="hover:border-yellow-500"
                />
                <QuickActionCard
                  title="Generate Reports"
                  description="Create performance reports"
                  icon="📊"
                  onClick={() => setActiveTab('reports')}
                  color="hover:border-purple-500"
                />
                <QuickActionCard
                  title="Profile Management"
                  description="Manage driver profiles"
                  icon="👤"
                  onClick={() => setActiveTab('profile')}
                  color="hover:border-indigo-500"
                />
              </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md bg-gradient-to-br from-primary/10 to-accent/10">
                <div className="flex items-center">
                  <div className="text-3xl mr-4 text-primary">🚑</div>
                  <div>
                    <p className="text-sm text-gray-600">Total Ambulances</p>
                    <p className="text-2xl font-bold text-gray-900">{ambulances.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md bg-gradient-to-br from-secondary/10 to-primary/10">
                <div className="flex items-center">
                  <div className="text-3xl mr-4 text-secondary">👨‍⚕️</div>
                  <div>
                    <p className="text-sm text-gray-600">Active Drivers</p>
                    <p className="text-2xl font-bold text-green-600">N/A</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md bg-gradient-to-br from-accent/10 to-secondary/10">
                <div className="flex items-center">
                  <div className="text-3xl mr-4 text-accent">🚨</div>
                  <div>
                    <p className="text-sm text-gray-600">Emergencies</p>
                    <p className="text-2xl font-bold text-blue-600">N/A</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md bg-gradient-to-br from-primary/10 to-accent/10">
                <div className="flex items-center">
                  <div className="text-3xl mr-4 text-primary">⏱️</div>
                  <div>
                    <p className="text-sm text-gray-600">Avg Response</p>
                    <p className="text-2xl font-bold text-purple-600">N/A</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Emergencies */}
            <div className="bg-white/90 rounded-lg shadow-emergency p-6 animate-fade-in">
              <SectionHeader icon="🚨" title="Recent Emergencies" />
              {emergenciesLoading ? (
                <div className="text-center py-8 text-blue-600 font-semibold">Loading emergencies...</div>
              ) : emergenciesError ? (
                <div className="text-center py-8 text-red-600 font-semibold">{emergenciesError}</div>
              ) : recentEmergencies.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No recent emergencies found.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issue</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Victim Phone</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pickup Lat</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pickup Lng</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {recentEmergencies.map((em) => (
                        <tr key={em.booking_id}>
                          <td className="px-4 py-2 whitespace-nowrap">{em.booking_id}</td>
                          <td className="px-4 py-2 whitespace-nowrap">{em.issue_type}</td>
                          <td className="px-4 py-2 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${em.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{em.status}</span>
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap">{new Date(em.created_at).toLocaleString()}</td>
                          <td className="px-4 py-2 whitespace-nowrap">{em.victim_phone_number}</td>
                          <td className="px-4 py-2 whitespace-nowrap">{em.pickup_latitude}</td>
                          <td className="px-4 py-2 whitespace-nowrap">{em.pickup_longitude}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'drivers' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Ambulance Drivers</h2>
            {ambulancesLoading ? (
              <div className="text-center py-8 text-blue-600 font-semibold">Loading ambulances...</div>
            ) : ambulancesError ? (
              <div className="text-center py-8 text-red-600 font-semibold">{ambulancesError}</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reg Number</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver Phone</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Latitude</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Longitude</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {ambulances.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-8 text-gray-500">No ambulances found.</td>
                      </tr>
                    ) : ambulances.map((amb) => (
                      <tr key={amb.id} className="hover:bg-blue-50 transition">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{amb.regNumber}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{amb.driverName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{amb.driverPhone}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full 
                            ${amb.status === 'AVAILABLE' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
                          `}>{amb.status}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{Number(amb.latitude).toFixed(4)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{Number(amb.longitude).toFixed(4)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(amb.lastUpdated).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'vehicles' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Update Ambulance Location</h2>
              <form onSubmit={handleLocationSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ambulance ID</label>
                    <input
                      name="ambulanceId"
                      value={locationForm.ambulanceId}
                      onChange={handleLocationChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter ambulance ID"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      name="status"
                      value={locationForm.status}
                      onChange={handleLocationChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="AVAILABLE">Available</option>
                      <option value="ON_CALL">On Call</option>
                      <option value="MAINTENANCE">Maintenance</option>
                      <option value="OFFLINE">Offline</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Latitude</label>
                    <input
                      name="latitude"
                      value={locationForm.latitude}
                      onChange={handleLocationChange}
                      type="number"
                      step="any"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter latitude"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Longitude</label>
                    <input
                      name="longitude"
                      value={locationForm.longitude}
                      onChange={handleLocationChange}
                      type="number"
                      step="any"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter longitude"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition duration-200"
                >
                  {loading ? 'Updating...' : 'Update Location'}
                </button>
                {message && (
                  <div className={`mt-4 p-3 rounded-lg text-sm ${
                    message.includes('success') 
                      ? 'bg-green-100 text-green-700 border border-green-200' 
                      : 'bg-red-100 text-red-700 border border-red-200'
                  }`}>
                    {message}
                  </div>
                )}
              </form>
            </div>
          </div>
        )}

        {activeTab === 'emergencies' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Emergencies</h2>
            <div className="space-y-4">
              {/* recentEmergencies is no longer used, so this section will be empty or show a placeholder */}
              <div className="text-center py-8 text-gray-500">No recent emergencies found.</div>
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Generate Reports</h2>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
                    <select
                      name="queryType"
                      value={queryForm.queryType}
                      onChange={handleQueryChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="all">All Emergencies</option>
                      <option value="medical">Medical Emergencies</option>
                      <option value="traffic">Traffic Accidents</option>
                      <option value="cardiac">Cardiac Emergencies</option>
                      <option value="response">Response Times</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                    <select
                      name="dateRange"
                      value={queryForm.dateRange}
                      onChange={handleQueryChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="today">Today</option>
                      <option value="week">This Week</option>
                      <option value="month">This Month</option>
                      <option value="quarter">This Quarter</option>
                      <option value="year">This Year</option>
                    </select>
                  </div>
                </div>
                <button
                  type="button"
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition duration-200"
                >
                  Generate Report
                </button>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'rankings' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Ambulance Rankings</h2>
            {ambulancesLoading ? (
              <div className="text-center py-8 text-blue-600 font-semibold">Loading rankings...</div>
            ) : ambulancesError ? (
              <div className="text-center py-8 text-red-600 font-semibold">{ambulancesError}</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b border-gray-300">#</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b border-gray-300">Reg Number</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b border-gray-300">Driver Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b border-gray-300">Driver Phone</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b border-gray-300">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b border-gray-300">Latitude</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b border-gray-300">Longitude</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b border-gray-300">Last Updated</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {ambulances.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="text-center py-8 text-gray-500">No ambulances found.</td>
                      </tr>
                    ) : ambulances.map((amb, idx) => (
                      <tr key={amb.id} className="hover:bg-blue-50 transition">
                        <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">{idx + 1}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-b border-gray-200">{amb.regNumber}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-b border-gray-200">{amb.driverName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-b border-gray-200">{amb.driverPhone}</td>
                        <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full 
                            ${amb.status === 'AVAILABLE' ? 'bg-green-200 text-green-900 border border-green-400' : 
                              amb.status === 'ON_CALL' ? 'bg-yellow-200 text-yellow-900 border border-yellow-400' : 
                              amb.status === 'MAINTENANCE' ? 'bg-purple-200 text-purple-900 border border-purple-400' : 
                              'bg-gray-200 text-gray-900 border border-gray-400'}
                          `}>{amb.status}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-b border-gray-200">{Number(amb.latitude).toFixed(4)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-b border-gray-200">{Number(amb.longitude).toFixed(4)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-b border-gray-200">{new Date(amb.lastUpdated).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Ambulance Service Profile</h2>
                <button className="text-blue-600 hover:text-blue-700 text-sm">Edit Profile</button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Service Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                        🚑
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Emergency Medical Services</h4>
                        <p className="text-sm text-gray-600">Professional Ambulance Service</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Total Ambulances:</span>
                        <span className="font-medium">{ambulances.length}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Active Drivers:</span>
                        <span className="font-medium">N/A</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Average Response Time:</span>
                        <span className="font-medium">N/A</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Service Coverage:</span>
                        <span className="font-medium">24/7 Emergency Response</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
                  <div className="space-y-4">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-900">Response Efficiency</h4>
                      <p className="text-sm text-blue-700">98% of emergencies responded within 5 minutes</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4">
                      <h4 className="font-semibold text-green-900">Patient Satisfaction</h4>
                      <p className="text-sm text-green-700">4.8/5 average rating from patients</p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4">
                      <h4 className="font-semibold text-purple-900">Safety Record</h4>
                      <p className="text-sm text-purple-700">Zero major incidents in the last 12 months</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'register' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Register Ambulance Driver</h2>
                <p className="text-gray-600">Add a new ambulance driver to the emergency response team</p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      name="fullName"
                      value={form.fullName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      type="email"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter email address"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input
                      name="phoneNumber"
                      value={form.phoneNumber}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Government ID</label>
                    <input
                      name="governmentId"
                      value={form.governmentId}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter government ID"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">License Number</label>
                    <input
                      name="licenseNumber"
                      value={form.licenseNumber}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter license number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Registration</label>
                    <input
                      name="vehicleRegNumber"
                      value={form.vehicleRegNumber}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter vehicle registration"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                    <input
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      type="password"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter password"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Hospital ID</label>
                    <input
                      name="hospitalID"
                      value={form.hospitalID}
                      onChange={handleChange}
                      type="number"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter hospital ID"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition duration-200"
                >
                  {loading ? 'Registering...' : 'Register Ambulance Driver'}
                </button>

                {message && (
                  <div className={`mt-4 p-3 rounded-lg text-sm ${
                    message.includes('success') 
                      ? 'bg-green-100 text-green-700 border border-green-200' 
                      : 'bg-red-100 text-red-700 border border-red-200'
                  }`}>
                    {message}
                  </div>
                )}
              </form>
            </div>
          </div>
        )}
      </div>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: none; }
        }
        .animate-fade-in {
          animation: fadeIn 0.8s cubic-bezier(0.4,0,0.2,1);
        }
      `}</style>
    </div>
  );
} 