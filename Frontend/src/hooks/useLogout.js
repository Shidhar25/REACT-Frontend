import { useNavigate } from 'react-router-dom';
import { tokenUtils, authAPI } from '../services/api';

export const useLogout = () => {
  const navigate = useNavigate();

  const logout = async () => {
    try {
      // Call logout API to invalidate token on server (optional)
      try {
        await authAPI.logout();
      } catch (error) {
        // Even if server logout fails, we should still logout locally
        console.warn('Server logout failed:', error.message);
      }

      // Clear local token
      tokenUtils.removeToken();
      
      // Redirect to login page
      navigate('/login', { replace: true });
      
    } catch (error) {
      console.error('Logout error:', error);
      
      // Force local logout even if API call fails
      tokenUtils.removeToken();
      navigate('/login', { replace: true });
    }
  };

  return { logout };
};
