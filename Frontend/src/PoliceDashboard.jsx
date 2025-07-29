import { useState } from 'react';

export default function PoliceDashboard() {
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
  const [showProfile, setShowProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'Officer John Smith',
    badge: 'P-2024-001',
    rank: 'Senior Officer',
    department: 'Patrol Division',
    experience: '8 years',
    email: 'john.smith@police.gov',
    phone: '+1 (555) 123-4567'
  });

  // Mock statistics data
  const stats = {
    totalStations: 24,
    activeOfficers: 156,
    emergencyCalls: 89,
    responseTime: '4.2 min'
  };

  // Mock station ranking data
  const stationRankings = [
    { name: 'Central Police Station', score: 95, officers: 25, cases: 156, responseTime: '3.2 min' },
    { name: 'North District Station', score: 92, officers: 18, cases: 134, responseTime: '3.8 min' },
    { name: 'South Station', score: 88, officers: 22, cases: 142, responseTime: '4.1 min' },
    { name: 'East Police Station', score: 85, officers: 15, cases: 98, responseTime: '4.5 min' },
    { name: 'West District', score: 82, officers: 20, cases: 127, responseTime: '4.8 min' },
    { name: 'Downtown Station', score: 78, officers: 30, cases: 189, responseTime: '5.2 min' }
  ];

  // Mock recent cases
  const recentCases = [
    { id: 'C-2024-001', type: 'Traffic Violation', status: 'Resolved', time: '2 hours ago', location: 'Main Street' },
    { id: 'C-2024-002', type: 'Domestic Dispute', status: 'In Progress', time: '4 hours ago', location: 'Oak Avenue' },
    { id: 'C-2024-003', type: 'Burglary', status: 'Under Investigation', time: '6 hours ago', location: 'Park Lane' },
    { id: 'C-2024-004', type: 'Assault', status: 'Resolved', time: '8 hours ago', location: 'Downtown Area' },
    { id: 'C-2024-005', type: 'Traffic Accident', status: 'In Progress', time: '10 hours ago', location: 'Highway 101' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);
    
    // Get JWT token
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('Authentication token not found. Please login again.');
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
        setForm({ id: '', stationName: '', latitude: '', longitude: '', availableOfficers: '' });
      } else {
        const data = await res.json();
        setMessage(data.message || 'Failed to create police station.');
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
              <h1 className="text-3xl font-bold text-gray-900">Police Dashboard</h1>
              <p className="text-gray-600">Emergency Response Management System</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Welcome, {profileData.name.split(' ')[1]}</p>
                <p className="text-xs text-gray-500">Last updated: {new Date().toLocaleTimeString()}</p>
              </div>
              <button 
                onClick={() => setShowProfile(!showProfile)}
                className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold hover:bg-blue-700 transition"
              >
                P
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
                          { id: 'officers', name: 'Officers', icon: '👮' },
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
                    ? 'border-blue-500 text-blue-600'
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
                subtitle="Active police stations"
                color="border-l-4 border-l-blue-500"
              />
              <StatCard 
                title="Active Officers" 
                value={stats.activeOfficers} 
                subtitle="On duty officers"
                color="border-l-4 border-l-green-500"
              />
              <StatCard 
                title="Emergency Calls" 
                value={stats.emergencyCalls} 
                subtitle="Today's calls"
                color="border-l-4 border-l-red-500"
              />
              <StatCard 
                title="Avg Response Time" 
                value={stats.responseTime} 
                subtitle="Emergency response"
                color="border-l-4 border-l-yellow-500"
              />
            </div>

            {/* Quick Actions */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <QuickActionCard
                  title="Create Station"
                  description="Add a new police station"
                  icon="🏢"
                  onClick={() => setActiveTab('stations')}
                  color="hover:border-blue-500"
                />
                <QuickActionCard
                  title="View Emergencies"
                  description="Monitor active emergencies"
                  icon="🚨"
                  onClick={() => setActiveTab('emergencies')}
                  color="hover:border-red-500"
                />
                <QuickActionCard
                  title="Officer Management"
                  description="Manage police officers"
                  icon="👮"
                  onClick={() => setActiveTab('officers')}
                  color="hover:border-green-500"
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
                  onClick={() => window.open('/navigation/ambulance/1', '_blank')}
                  color="hover:border-indigo-500"
                />
                                 <QuickActionCard
                   title="Emergency Contacts"
                   description="Quick contact list"
                   icon="📞"
                   onClick={() => alert('Emergency contacts feature coming soon!')}
                   color="hover:border-orange-500"
                 />
                 <QuickActionCard
                   title="Station Rankings"
                   description="View performance metrics"
                   icon="🏆"
                   onClick={() => setActiveTab('ranking')}
                   color="hover:border-yellow-500"
                 />
                 <QuickActionCard
                   title="My Profile"
                   description="Update personal information"
                   icon="👤"
                   onClick={() => setActiveTab('profile')}
                   color="hover:border-purple-500"
                 />
              </div>
            </div>

                         {/* Recent Activity */}
             <div className="bg-white rounded-lg shadow-md p-6">
               <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h3>
               <div className="space-y-4">
                 {[
                   { time: '2 min ago', action: 'New emergency call received', location: 'Downtown Area' },
                   { time: '5 min ago', action: 'Officer dispatched', location: 'Central Station' },
                   { time: '12 min ago', action: 'Station status updated', location: 'North District' },
                   { time: '18 min ago', action: 'Report generated', location: 'South Station' }
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

             {/* Recent Cases */}
             <div className="bg-white rounded-lg shadow-md p-6">
               <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Cases</h3>
               <div className="space-y-3">
                 {recentCases.map((case_, index) => (
                   <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                     <div className="flex items-center space-x-3">
                       <div className={`w-3 h-3 rounded-full ${
                         case_.status === 'Resolved' ? 'bg-green-500' :
                         case_.status === 'In Progress' ? 'bg-yellow-500' : 'bg-red-500'
                       }`}></div>
                       <div>
                         <p className="text-sm font-medium text-gray-900">{case_.id}</p>
                         <p className="text-xs text-gray-500">{case_.type} • {case_.location}</p>
                       </div>
                     </div>
                     <div className="text-right">
                       <span className={`text-xs px-2 py-1 rounded ${
                         case_.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                         case_.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                       }`}>
                         {case_.status}
                       </span>
                       <p className="text-xs text-gray-400 mt-1">{case_.time}</p>
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
              <h2 className="text-2xl font-bold text-gray-900">Police Stations</h2>
              <button 
                onClick={() => setActiveTab('create-station')}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
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
                    { name: 'Central Police Station', officers: 25, status: 'Active' },
                    { name: 'North District Station', officers: 18, status: 'Active' },
                    { name: 'South Station', officers: 22, status: 'Active' },
                    { name: 'East Police Station', officers: 15, status: 'Active' },
                    { name: 'West District', officers: 20, status: 'Active' },
                    { name: 'Downtown Station', officers: 30, status: 'Active' }
                  ].map((station, index) => (
                    <div key={index} className="border rounded-lg p-4 hover:shadow-md transition">
                      <h4 className="font-semibold text-gray-900">{station.name}</h4>
                      <p className="text-sm text-gray-600">Officers: {station.officers}</p>
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

        {activeTab === 'create-station' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Create Police Station</h2>
                <button 
                  onClick={() => setActiveTab('stations')}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ← Back to Stations
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Station ID (Optional)</label>
                  <input 
                    name="id" 
                    value={form.id} 
                    onChange={handleChange} 
                    placeholder="Auto-generated if empty" 
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Station Name</label>
                  <input 
                    name="stationName" 
                    value={form.stationName} 
                    onChange={handleChange} 
                    placeholder="Enter station name" 
                    required 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                    <input 
                      name="latitude" 
                      value={form.latitude} 
                      onChange={handleChange} 
                      placeholder="e.g., 10.5204" 
                      type="number" 
                      step="any"
                      required 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                    <input 
                      name="longitude" 
                      value={form.longitude} 
                      onChange={handleChange} 
                      placeholder="e.g., 73.8567" 
                      type="number" 
                      step="any"
                      required 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Available Officers</label>
                  <input 
                    name="availableOfficers" 
                    value={form.availableOfficers} 
                    onChange={handleChange} 
                    placeholder="Number of officers" 
                    type="number" 
                    min="0"
                    required 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
                  />
                </div>
                
                <button 
                  type="submit" 
                  disabled={loading} 
                  className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 disabled:opacity-50 font-medium"
                >
                  {loading ? 'Creating Station...' : 'Create Police Station'}
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

        {activeTab === 'officers' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Officer Management</h2>
            <p className="text-gray-600">Officer management features coming soon...</p>
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
                       <th className="text-left py-3 px-4">Officers</th>
                       <th className="text-left py-3 px-4">Cases</th>
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
                                 className="bg-green-500 h-2 rounded-full" 
                                 style={{ width: `${station.score}%` }}
                               ></div>
                             </div>
                             <span className="text-sm">{station.score}</span>
                           </div>
                         </td>
                         <td className="py-3 px-4">{station.officers}</td>
                         <td className="py-3 px-4">{station.cases}</td>
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
                 <h2 className="text-2xl font-bold text-gray-900">Officer Profile</h2>
                 <button className="text-blue-600 hover:text-blue-700 text-sm">Edit Profile</button>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 {/* Profile Information */}
                 <div>
                   <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                   <div className="space-y-4">
                     <div className="flex items-center space-x-4">
                       <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
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
                     <div className="bg-blue-50 p-4 rounded-lg">
                       <div className="flex items-center justify-between">
                         <span className="text-blue-600 font-medium">Cases Handled</span>
                         <span className="text-2xl font-bold text-blue-600">247</span>
                       </div>
                       <p className="text-sm text-blue-600 mt-1">This month</p>
                     </div>
                     
                     <div className="bg-green-50 p-4 rounded-lg">
                       <div className="flex items-center justify-between">
                         <span className="text-green-600 font-medium">Success Rate</span>
                         <span className="text-2xl font-bold text-green-600">94%</span>
                       </div>
                       <p className="text-sm text-green-600 mt-1">Resolved cases</p>
                     </div>
                     
                     <div className="bg-yellow-50 p-4 rounded-lg">
                       <div className="flex items-center justify-between">
                         <span className="text-yellow-600 font-medium">Response Time</span>
                         <span className="text-2xl font-bold text-yellow-600">3.8 min</span>
                       </div>
                       <p className="text-sm text-yellow-600 mt-1">Average</p>
                     </div>
                     
                     <div className="bg-purple-50 p-4 rounded-lg">
                       <div className="flex items-center justify-between">
                         <span className="text-purple-600 font-medium">Service Hours</span>
                         <span className="text-2xl font-bold text-purple-600">1,240</span>
                       </div>
                       <p className="text-sm text-purple-600 mt-1">This year</p>
                     </div>
                   </div>
                 </div>
               </div>

               {/* Recent Achievements */}
               <div className="mt-8">
                 <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Achievements</h3>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                   <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg">
                     <div className="text-2xl mb-2">🏆</div>
                     <h4 className="font-semibold">Officer of the Month</h4>
                     <p className="text-sm opacity-90">January 2024</p>
                   </div>
                   <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg">
                     <div className="text-2xl mb-2">⭐</div>
                     <h4 className="font-semibold">Excellence Award</h4>
                     <p className="text-sm opacity-90">Community Service</p>
                   </div>
                   <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-lg">
                     <div className="text-2xl mb-2">🎯</div>
                     <h4 className="font-semibold">Perfect Attendance</h4>
                     <p className="text-sm opacity-90">6 months</p>
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