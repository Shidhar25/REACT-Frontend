// API Configuration
const API_BASE_URL = (typeof process !== 'undefined' && process.env.REACT_APP_API_URL) || 'http://localhost:8080';

// Get authentication token
const getAuthToken = () => {
  return localStorage.getItem('jwt') || localStorage.getItem('token');
};

// Generic API call function with authentication
const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAuthToken();
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

// API call without authentication
const publicApiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

// Auth API calls (use publicApiCall for login/register as they don't need auth)
export const authAPI = {
  login: (credentials) => publicApiCall('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  
  register: (userData) => publicApiCall('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  
  logout: () => apiCall('/auth/logout', { method: 'POST' }),
};

// Token management utilities
export const tokenUtils = {
  // Store JWT token after successful login
  setToken: (token) => {
    localStorage.setItem('jwt', token);
  },
  
  // Get stored JWT token
  getToken: () => {
    return localStorage.getItem('jwt') || localStorage.getItem('token');
  },
  
  // Remove JWT token (logout)
  removeToken: () => {
    localStorage.removeItem('jwt');
    localStorage.removeItem('token');
  },
  
  // Check if user is authenticated
  isAuthenticated: () => {
    const token = tokenUtils.getToken();
    if (!token) return false;
    
    try {
      // Check if token is expired (basic check)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp > currentTime;
    } catch {
      return false;
    }
  },
  
  // Get user info from token
  getUserFromToken: () => {
    const token = tokenUtils.getToken();
    if (!token) return null;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        id: payload.sub || payload.userId,
        email: payload.email,
        role: payload.role,
        name: payload.name || payload.fullName,
        exp: payload.exp
      };
    } catch {
      return null;
    }
  }
};

// Dashboard API calls
export const dashboardAPI = {
  getUserData: () => apiCall('/dashboard/user'),
  getPoliceData: () => apiCall('/dashboard/police'),
  getFireData: () => apiCall('/dashboard/fire'),
  getAmbulanceData: () => apiCall('/dashboard/ambulance'),
};

// Navigation API calls
export const navigationAPI = {
  getRoute: (origin, destination) => apiCall('/navigation/route', {
    method: 'POST',
    body: JSON.stringify({ origin, destination }),
  }),
};

// Emergency booking API
export const bookingAPI = {
  submitRequest: (requestData) => apiCall('/booking/request', {
    method: 'POST',
    body: JSON.stringify(requestData),
  }),
};

// Police API calls
export const policeAPI = {
  addStation: (stationData) => apiCall('/police/station/add', {
    method: 'POST',
    body: JSON.stringify(stationData),
  }),
};

// Fire API calls
export const fireAPI = {
  addStation: (stationData) => apiCall('/fire/station/add', {
    method: 'POST',
    body: JSON.stringify(stationData),
  }),
  updateLocation: (locationData) => apiCall('/fire/location/update', {
    method: 'POST',
    body: JSON.stringify(locationData),
  }),
  getTrucksByStation: (stationId) => apiCall(`/fire/admin/station/${stationId}/trucks`),
};

// Ambulance API calls
export const ambulanceAPI = {
  registerDriver: (driverData) => apiCall('/auth/register/ambulance-driver', {
    method: 'POST',
    body: JSON.stringify(driverData),
  }),
  updateLocation: (locationData) => apiCall('/ambulance/location-update', {
    method: 'POST',
    body: JSON.stringify(locationData),
  }),
};
