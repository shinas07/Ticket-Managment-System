import { createContext, useContext, useState, useEffect } from 'react';
import api from '../service/api';
import { toast } from 'sonner';
import { encryptToken, decryptToken } from '../utils/tokenUtils';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Initialize user from localStorage if available
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(true);

  // Update localStorage whenever user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = async (email, password, userType) => {
    try {
      
      const response = await api.post('/auth/login/', {
        email,
        password,
        user_type: userType.toLowerCase()
      });

      const { user: userData, tokens } = response.data;

      // Encrypt and store tokens and user data
      localStorage.setItem('access_token', encryptToken(tokens.access));
      localStorage.setItem('refresh_token', encryptToken(tokens.refresh));
      localStorage.setItem('user_type', userData.role.toLowerCase());
      // Set authorization header
      api.defaults.headers.common['Authorization'] = `Bearer ${tokens.access}`;
      
      // Set user data in state and localStorage
      const userToStore = {
        ...userData,
        role: userData.role
      };
      
      setUser(userToStore);
      localStorage.setItem('user', JSON.stringify(userToStore));

      return { 
        success: true,
        user: userToStore
      };

    } catch (error) {
      let errorMessage = 'Login failed';

      if (error.response) {
        if (error.response.status === 403) {
          errorMessage = error.response.data.error || 'Invalid user type or blocked user';
        } else if (error.response.status === 400) {
          errorMessage = error.response.data.errors?.non_field_errors?.[0] 
            || 'Invalid credentials';
        } else {
          errorMessage = error.response.data.error || 'Login failed';
        }
      } else if (error.request) {
        errorMessage = 'No response from server';
      } else {
        errorMessage = error.message;
      }

      return {
        success: false,
        error: errorMessage
      };
    }
  };

  const logout = async () => {
    try {
      const encryptedRefreshToken = localStorage.getItem('refresh_token');
      if (encryptedRefreshToken) {
        const refreshToken = decryptToken(encryptedRefreshToken);
        await api.post('/api/auth/logout/', {
          refresh_token: refreshToken
        });
      }
    } catch (error) {
    } finally {
      // Clear all auth data
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user_type');
      localStorage.removeItem('user');
      api.defaults.headers.common['Authorization'] = '';
      setUser(null);
      window.location.href = '/login';
    }
  };

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const savedUser = localStorage.getItem('user');
      
      if (token && savedUser) {
        const response = await api.get('/api/auth/me/');
        const userData = response.data;
        
        // Update user data if needed
        if (JSON.stringify(userData) !== savedUser) {
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
        }
      }
    } catch (error) {
      logout();
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      logout,
      checkAuth
    }}>
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

export default AuthContext;