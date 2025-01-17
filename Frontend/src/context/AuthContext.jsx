import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../service/api';
import { toast } from 'sonner';
import { encryptToken } from '../utils/tokenUtils';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          const response = await api.get('auth/profile/');
          setUser(response.data);
        } catch (error) {
          localStorage.removeItem('encryptedAccessToken');
          localStorage.removeItem('encryptedRefreshToken');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('auth/login/', { email, password });
      console.log(response.data);
      
      if (response.data.tokens) {
        const encryptedAccessToken = encryptToken(response.data.tokens.access);
        const encryptedRefreshToken = encryptToken(response.data.tokens.refresh);
        
        localStorage.setItem('access_token', encryptedAccessToken);
        localStorage.setItem('refresh_token', encryptedRefreshToken);
        setUser(response.data.user);
        return { success: true, user: response.data.user };
      }
    } catch (error) {
      console.log('error', error);
      const message = error.response?.data?.detail || 'Login failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const logout = async () => {
    try {
      await api.post('auth/logout/');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setUser(null);
      window.location.href = '/auth/login';
    }
  };

  const value = {
    user,
    loading,
    login,
    logout
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};