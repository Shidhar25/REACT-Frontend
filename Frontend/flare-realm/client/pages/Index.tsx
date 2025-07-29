import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { FaAmbulance, FaMapMarkerAlt, FaShieldAlt, FaPhone, FaFileAlt } from 'react-icons/fa';

const emergencyHistory = [
  { type: "Medical Emergency", location: "Home", date: "2024-01-15", status: "Resolved" },
  { type: "Traffic Accident", location: "Highway", date: "2024-01-10", status: "Resolved" },
];

const firstAidTips = [
  "Stay calm and call for help immediately.",
  "Check for responsiveness and breathing.",
  "Apply pressure to bleeding wounds.",
  "Do not move injured persons unless necessary.",
  "Follow dispatcher instructions until help arrives.",
];

const emergencyContacts = [
  { name: "Sarah Smith", relation: "Spouse", phone: "+1 (555) 987-6543" },
  { name: "Dr. Michael Johnson", relation: "Family Doctor", phone: "+1 (555) 456-7890" },
];

const LocationIcon = ({ className = "w-5 h-6" }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 20 26"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2.92756 18.3319C-0.975854 14.1405 -0.975854 7.33483 2.92756 3.14353C6.83098 -1.04784 13.1691 -1.04784 17.0724 3.14353C20.9759 7.3349 20.9759 14.1406 17.0724 18.3319L10 26L2.92756 18.3319ZM10 6.21538C12.3241 6.21538 14.2114 8.24195 14.2114 10.7375C14.2114 13.233 12.3241 15.2596 10 15.2596C7.67591 15.2596 5.78857 13.233 5.78857 10.7375C5.78857 8.24195 7.67591 6.21538 10 6.21538Z"
      fill="currentColor"
    />
  </svg>
);

const UserIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 34 34"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8.57916 24.9396C8.27885 25.1606 7.89924 25.2571 7.53092 25.2003C7.15694 25.1494 6.8226 24.9452 6.59598 24.6449C6.37496 24.3446 6.27851 23.965 6.33531 23.591C6.39183 23.2226 6.59036 22.8883 6.89066 22.6616C9.81448 20.4912 13.362 19.3239 17.0002 19.3239C20.638 19.3239 24.1855 20.4912 27.1091 22.6616C27.4097 22.8883 27.6079 23.2226 27.6644 23.591C27.7212 23.965 27.6248 24.3446 27.4038 24.6449C27.1771 24.9452 26.8428 25.1494 26.4688 25.2003C26.1005 25.2571 25.7208 25.1606 25.4206 24.9396C22.984 23.1318 20.0316 22.1572 16.9998 22.1572C13.968 22.1572 11.0157 23.1318 8.57898 24.9396H8.57916Z"
      fill="currentColor"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0 17.0004C0 12.4951 1.79091 8.16563 4.981 4.98101C8.16576 1.79092 12.4948 0 17.0003 0C21.5053 0 25.8343 1.79092 29.0189 4.98101C32.2093 8.16577 33.9999 12.4948 33.9999 17.0004C33.9999 21.5053 32.2093 25.8344 29.0189 29.019C25.8342 32.2094 21.5052 34 17.0003 34C12.4951 34 8.16562 32.2094 4.981 29.019C1.79091 25.8342 0 21.5052 0 17.0004ZM2.83355 17.0004C2.83355 13.2434 4.32947 9.63916 6.98139 6.98147C9.63922 4.32954 13.2432 2.83362 17.0003 2.83362C20.7573 2.83362 24.3614 4.32954 27.0191 6.98147C29.6711 9.63931 31.1673 13.2433 31.1673 17.0004C31.1673 20.7574 29.6711 24.3616 27.0191 27.0192C24.3616 29.6712 20.7576 31.1674 17.0003 31.1674C13.2429 31.1674 9.63908 29.6712 6.98139 27.0192C4.32947 24.3617 2.83355 20.7577 2.83355 17.0004Z"
      fill="currentColor"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11.4161 12.2119C11.4161 10.7216 12.0055 9.2878 13.0597 8.23387C14.1136 7.17993 15.5474 6.59059 17.0377 6.58498C18.528 6.58498 19.9615 7.17998 21.0157 8.23387C22.0697 9.2878 22.6646 10.7216 22.6646 12.2119C22.6646 13.7022 22.0696 15.1357 21.0157 16.1899C19.9615 17.2439 18.528 17.8388 17.0377 17.8388C15.5474 17.8388 14.1136 17.2438 13.0597 16.1899C12.0054 15.1357 11.4161 13.7022 11.4105 12.2119M14.2497 12.2119C14.2497 11.4696 14.5384 10.7613 15.0657 10.2399C15.587 9.71292 16.2953 9.42385 17.0377 9.41824C17.78 9.41824 18.4883 9.71293 19.0097 10.2399C19.5367 10.7612 19.8258 11.4695 19.8258 12.2119C19.8258 12.9543 19.5367 13.6626 19.0097 14.1839C18.4884 14.7109 17.7801 15.0056 17.0377 15.0056C16.2953 15.0056 15.5871 14.7109 15.0657 14.1839C14.5384 13.6626 14.2497 12.9543 14.244 12.2119"
      fill="currentColor"
    />
  </svg>
);

interface UserBooking {
  id: number;
  issueType: string;
  emergencyRequestStatus: string;
  createdAt: string;
  latitude: number;
  longitude: number;
  needAmbulance: boolean;
  needPolice: boolean;
  needFireBrigade: boolean;
}

interface UserStats {
  totalEmergencies: number;
  resolvedEmergencies: number;
  avgResponseTime: number;
}

export default function Index() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [city, setCity] = useState("...");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [userBookings, setUserBookings] = useState<UserBooking[]>([]);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await res.json();
          setCity(
            data.address.city ||
            data.address.town ||
            data.address.village ||
            data.address.state ||
            "Unknown"
          );
        } catch {
          setCity("Unknown");
        }
      });
    }

    // Update time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Fetch user-specific booking data
  useEffect(() => {
    const fetchUserBookings = async () => {
      setStatsLoading(true);
      setStatsError(null);
      try {
        const token = localStorage.getItem('token') || localStorage.getItem('jwt');
        if (!token) {
          throw new Error("No authentication token found");
        }

        // Extract userId from JWT token
        const payload = JSON.parse(atob(token.split('.')[1]));
        const userId = payload.userId;
        
        if (!userId) {
          throw new Error("User ID not found in token");
        }

        const headers: HeadersInit = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        };

        const res = await fetch(`http://localhost:8080/user/bookings/${userId}`, {
          headers
        });
        
        if (!res.ok) {
          throw new Error("Failed to fetch user bookings");
        }
        
        const bookings: UserBooking[] = await res.json();
        setUserBookings(bookings);

        // Calculate user statistics
        const totalEmergencies = bookings.length;
        const resolvedEmergencies = bookings.filter(booking => 
          booking.emergencyRequestStatus === 'COMPLETED'
        ).length;
        
        // Calculate average response time (mock calculation for now)
        const avgResponseTime = totalEmergencies > 0 ? 4.2 : 0;

        setUserStats({
          totalEmergencies,
          resolvedEmergencies,
          avgResponseTime
        });

      } catch (err: any) {
        setStatsError(err.message || "Failed to load user data");
        console.error("Error fetching user bookings:", err);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchUserBookings();
  }, []);

  const handleSOSClick = () => {
    navigate("/booking");
  };

  const handleLogout = () => {
    logout();
  };

  const quickActions = [
    {
      title: "Track Response",
      description: "Monitor emergency vehicle location",
      icon: <FaMapMarkerAlt className="w-6 h-6" />,
      onClick: () => navigate("/tracking"),
      color: "bg-blue-500 hover:bg-blue-600"
    },
    {
      title: "First Aid Tips",
      description: "Emergency preparedness guide",
      icon: <FaShieldAlt className="w-6 h-6" />,
      onClick: () => navigate("/first-aid"),
      color: "bg-green-500 hover:bg-green-600"
    },
    {
      title: "Call Emergency Contacts",
      description: "Contact your emergency contacts",
      icon: <FaPhone className="w-6 h-6" />,
      onClick: () => navigate("/emergency-contacts"),
      color: "bg-orange-500 hover:bg-orange-600"
    }
  ];

  // Get user name from auth context or localStorage
  const getUserName = () => {
    if (user?.email) return user.email.split('@')[0];
    if (user?.userType && user.userType !== 'CITIZEN') {
      return user.userType.charAt(0).toUpperCase() + user.userType.slice(1).toLowerCase();
    }
    return "User";
  };

  // Calculate statistics with fallbacks
  const getTotalEmergencies = () => {
    if (statsLoading) return "...";
    if (statsError) return emergencyHistory.length;
    return userStats?.totalEmergencies || emergencyHistory.length;
  };

  const getResolvedEmergencies = () => {
    if (statsLoading) return "...";
    if (statsError) return emergencyHistory.filter(e => e.status === "Resolved").length;
    return userStats?.resolvedEmergencies || emergencyHistory.filter(e => e.status === "Resolved").length;
  };

  const getAvgResponseTime = () => {
    if (statsLoading) return "...";
    if (statsError) return "4.2";
    if (userStats?.avgResponseTime) {
      return userStats.avgResponseTime.toFixed(1);
    }
    return "4.2";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex items-center space-x-4">
                  <FaAmbulance className="text-red-500 text-3xl" />
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">REACT User Dashboard</h1>
                    <p className="text-sm text-gray-500">Emergency Services Portal</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-sm text-gray-600">
                <div>Welcome, {getUserName()}</div>
                <div>Last updated: {currentTime.toLocaleTimeString()}</div>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleLogout}
                  className="text-red-600 hover:text-red-700 px-4 py-2 rounded-md text-sm font-medium border border-red-200 hover:bg-red-50 transition-colors"
                >
                  Logout
                </button>
                <button 
                  onClick={() => navigate('/profile')}
                  className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium hover:bg-blue-600 transition-colors"
                >
                  {getUserName().charAt(0).toUpperCase()}
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* SOS Button - Centered */}
        <div className="flex flex-col items-center mb-20">
          <button
            onClick={handleSOSClick}
            className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center shadow-[0_8px_32px_0_rgba(255,0,0,0.25)] hover:scale-105 transition-transform duration-500 border-8 border-white z-20 mb-6"
            style={{ boxShadow: "0 0 40px 0 rgba(255,0,0,0.15), 0 8px 32px 0 rgba(0,0,0,0.10)" }}
          >
            <span className="text-white text-6xl sm:text-7xl md:text-8xl font-extrabold tracking-wider drop-shadow-lg font-serif">SOS</span>
            <span className="absolute inset-0 rounded-full border-4 border-red-300 opacity-50 animate-ping"></span>
          </button>
          <div className="text-red-700 text-2xl sm:text-3xl font-bold mb-4 font-serif text-center">Are you in Emergency?</div>
          <div className="text-blue-700 text-lg sm:text-xl font-medium text-center max-w-3xl">
            Tap SOS to reach every help you need—ambulance, police, and fire brigade—all at once.
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.onClick}
                className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-left hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <div className={`w-16 h-16 ${action.color} rounded-xl flex items-center justify-center text-white mb-6`}>
                  {action.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{action.title}</h3>
                <p className="text-gray-600 text-lg leading-relaxed">{action.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base font-medium text-gray-600 mb-2">Total Emergencies</p>
                <p className="text-4xl font-bold text-gray-900">
                  {statsLoading ? (
                    <span className="text-gray-400">...</span>
                  ) : (
                    getTotalEmergencies()
                  )}
                </p>
                {statsError && (
                  <p className="text-xs text-red-500 mt-1">Using fallback data</p>
                )}
              </div>
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center">
                <FaFileAlt className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base font-medium text-gray-600 mb-2">Resolved</p>
                <p className="text-4xl font-bold text-gray-900">
                  {statsLoading ? (
                    <span className="text-gray-400">...</span>
                  ) : (
                    getResolvedEmergencies()
                  )}
                </p>
                {statsError && (
                  <p className="text-xs text-red-500 mt-1">Using fallback data</p>
                )}
              </div>
              <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base font-medium text-gray-600 mb-2">Avg Response</p>
                <p className="text-4xl font-bold text-gray-900">
                  {statsLoading ? (
                    <span className="text-gray-400">...</span>
                  ) : (
                    <>
                      {getAvgResponseTime()}
                      <span className="text-2xl font-bold ml-1">min</span>
                    </>
                  )}
                </p>
                {statsError && (
                  <p className="text-xs text-red-500 mt-1">Using fallback data</p>
                )}
              </div>
              <div className="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
