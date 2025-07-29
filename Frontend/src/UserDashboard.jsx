import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function UserDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [emergencyForm, setEmergencyForm] = useState({
    latitude: '',
    longitude: '',
    issueType: '',
    needAmbulance: false,
    requestedAmbulanceCount: 1,
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

  // Mock user data
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

  // Mock emergency history
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEmergencyForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);
    
    try {
      const body = {
        ...emergencyForm,
        latitude: parseFloat(emergencyForm.latitude),
        longitude: parseFloat(emergencyForm.longitude),
        requestedAmbulanceCount: Number(emergencyForm.requestedAmbulanceCount),
        requestedPoliceCount: Number(emergencyForm.requestedPoliceCount),
        requestedFireTruckCount: Number(emergencyForm.requestedFireTruckCount),
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
          requestedAmbulanceCount: 1,
          needPolice: false,
          requestedPoliceCount: 0,
          needFireBrigade: false,
          requestedFireTruckCount: 0,
          isForSelf: false,
          victimPhoneNumber: '',
          notes: ''
        });
      } else {
        const data = await res.json();
        setMessage(data.message || 'Failed to submit emergency request.');
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">User Dashboard</h1>
              <p className="text-gray-600">Emergency Services Portal</p>
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
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {userData.name.split(' ').map(n => n[0]).join('')}
                </div>
              </div>
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
              { id: 'emergency', name: 'Emergency', icon: '🚨' },
              { id: 'tracking', name: 'Tracking', icon: '📍' },
              { id: 'history', name: 'History', icon: '📋' },
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
            {/* Quick Actions */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <QuickActionCard
                  title="Request Emergency"
                  description="Call for immediate assistance"
                  icon="🚨"
                  onClick={() => setActiveTab('emergency')}
                  color="hover:border-red-500"
                />
                <QuickActionCard
                  title="Track Response"
                  description="Monitor emergency vehicle location"
                  icon="📍"
                  onClick={() => setActiveTab('tracking')}
                  color="hover:border-blue-500"
                />
                <QuickActionCard
                  title="Emergency History"
                  description="View past emergency requests"
                  icon="📋"
                  onClick={() => setActiveTab('history')}
                  color="hover:border-green-500"
                />
                <QuickActionCard
                  title="Update Profile"
                  description="Manage personal information"
                  icon="👤"
                  onClick={() => setActiveTab('profile')}
                  color="hover:border-purple-500"
                />
                <QuickActionCard
                  title="Emergency Contacts"
                  description="Manage emergency contacts"
                  icon="📞"
                  onClick={() => alert('Emergency contacts feature coming soon!')}
                  color="hover:border-orange-500"
                />
                <QuickActionCard
                  title="Safety Tips"
                  description="Emergency preparedness guide"
                  icon="🛡️"
                  onClick={() => alert('Safety tips feature coming soon!')}
                  color="hover:border-yellow-500"
                />
              </div>
            </div>

            {/* Emergency Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center">
                  <div className="text-3xl mr-4">🚨</div>
                  <div>
                    <p className="text-sm text-gray-600">Total Emergencies</p>
                    <p className="text-2xl font-bold text-gray-900">{emergencyHistory.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center">
                  <div className="text-3xl mr-4">✅</div>
                  <div>
                    <p className="text-sm text-gray-600">Resolved</p>
                    <p className="text-2xl font-bold text-green-600">{emergencyHistory.filter(e => e.status === 'Resolved').length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center">
                  <div className="text-3xl mr-4">⏱️</div>
                  <div>
                    <p className="text-sm text-gray-600">Avg Response</p>
                    <p className="text-2xl font-bold text-blue-600">4.2 min</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {emergencyHistory.slice(0, 3).map((emergency, index) => (
                  <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{emergency.type}</p>
                      <p className="text-xs text-gray-500">{emergency.location} • {emergency.date}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      emergency.status === 'Resolved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {emergency.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'emergency' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Emergency Request</h2>
                <p className="text-gray-600">Request immediate assistance for emergency situations</p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Latitude</label>
                    <input
                      name="latitude"
                      value={emergencyForm.latitude}
                      onChange={handleChange}
                      type="number"
                      step="any"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., 18.5204"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Longitude</label>
                    <input
                      name="longitude"
                      value={emergencyForm.longitude}
                      onChange={handleChange}
                      type="number"
                      step="any"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., 73.8567"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Description</label>
                  <input
                    name="issueType"
                    value={emergencyForm.issueType}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Describe the emergency (e.g., Medical emergency, Traffic accident)"
                  />
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Required Services</h3>
                  
                  <div className="flex items-center space-x-4">
                    <input
                      type="checkbox"
                      name="needAmbulance"
                      checked={emergencyForm.needAmbulance}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="text-sm font-medium text-gray-700">Ambulance</label>
                    <input
                      name="requestedAmbulanceCount"
                      type="number"
                      min="0"
                      value={emergencyForm.requestedAmbulanceCount}
                      onChange={handleChange}
                      className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                  </div>

                  <div className="flex items-center space-x-4">
                    <input
                      type="checkbox"
                      name="needPolice"
                      checked={emergencyForm.needPolice}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="text-sm font-medium text-gray-700">Police</label>
                    <input
                      name="requestedPoliceCount"
                      type="number"
                      min="0"
                      value={emergencyForm.requestedPoliceCount}
                      onChange={handleChange}
                      className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                  </div>

                  <div className="flex items-center space-x-4">
                    <input
                      type="checkbox"
                      name="needFireBrigade"
                      checked={emergencyForm.needFireBrigade}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="text-sm font-medium text-gray-700">Fire Brigade</label>
                    <input
                      name="requestedFireTruckCount"
                      type="number"
                      min="0"
                      value={emergencyForm.requestedFireTruckCount}
                      onChange={handleChange}
                      className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="isForSelf"
                    checked={emergencyForm.isForSelf}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="text-sm font-medium text-gray-700">Is this emergency for yourself?</label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Victim Phone Number</label>
                  <input
                    name="victimPhoneNumber"
                    value={emergencyForm.victimPhoneNumber}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
                  <textarea
                    name="notes"
                    value={emergencyForm.notes}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Any additional information (e.g., people trapped, specific injuries)"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 transition duration-200 shadow-lg"
                >
                  {loading ? 'Submitting Emergency Request...' : 'Submit Emergency Request'}
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

        {activeTab === 'tracking' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Track Emergency Response</h2>
                <p className="text-gray-600">Monitor real-time location and estimated arrival time of emergency vehicles</p>
              </div>
              
              <div className="bg-gradient-to-r from-blue-50 to-red-50 rounded-2xl p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Emergency Request ID
                    </label>
                    <input
                      type="text"
                      placeholder="Enter request ID"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vehicle Type
                    </label>
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option value="ambulance">Ambulance</option>
                      <option value="fire_truck">Fire Truck</option>
                      <option value="police">Police</option>
                    </select>
                  </div>
                </div>
                <button className="w-full bg-gradient-to-r from-blue-600 to-red-600 text-white py-4 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-red-700 transition duration-300 shadow-lg">
                  Track Emergency Vehicle
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Emergency History</h2>
            <div className="space-y-4">
              {emergencyHistory.map((emergency, index) => (
                <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition">
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
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">User Profile</h2>
                <button className="text-blue-600 hover:text-blue-700 text-sm">Edit Profile</button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                        {userData.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{userData.name}</h4>
                        <p className="text-sm text-gray-600">Registered User</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Email:</span>
                        <span className="font-medium">{userData.email}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Phone:</span>
                        <span className="font-medium">{userData.phone}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Address:</span>
                        <span className="font-medium">{userData.address}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Emergency Contacts */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contacts</h3>
                  <div className="space-y-4">
                    {userData.emergencyContacts.map((contact, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900">{contact.name}</h4>
                        <p className="text-sm text-gray-600">{contact.relationship}</p>
                        <p className="text-sm text-gray-600">{contact.phone}</p>
                      </div>
                    ))}
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