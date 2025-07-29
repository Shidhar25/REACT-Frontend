import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  role: string;
  userType: string;
  email?: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');
    const userType = localStorage.getItem('userType');

    if (token && role) {
      setUser({
        role,
        userType: userType || 'CITIZEN',
      });
    }
    setLoading(false);
  }, []);

  const login = (token: string, role: string, userType: string, redirectPath?: string) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userRole', role);
    localStorage.setItem('userType', userType);
    
    setUser({ role, userType });
    
    if (redirectPath) {
      navigate(redirectPath);
      return;
    }
    // Navigate based on role
    if (role === 'DRIVER') {
      navigate('/driver');
    } else if (role === 'USER') {
      navigate('/index');
    } else if (role === 'ADMIN') {
      navigate('/admin');
    } else {
      navigate('/index');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userType');
    setUser(null);
    navigate('/login');
  };

  const isAuthenticated = () => {
    return !!localStorage.getItem('token');
  };

  const getUserRole = () => {
    return localStorage.getItem('userRole');
  };

  return {
    user,
    loading,
    login,
    logout,
    isAuthenticated,
    getUserRole,
  };
}; 