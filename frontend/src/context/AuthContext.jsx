import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import * as authService from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('crm-token'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('crm-token');

      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const data = await authService.getProfile();
        setUser(data.user || data);
        setToken(storedToken);
      } catch (error) {
        localStorage.removeItem('crm-token');
        setToken(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const handleLogin = async (email, password) => {
    setIsLoading(true);

    try {
      const data = await authService.login(email, password);
      localStorage.setItem('crm-token', data.token);
      setToken(data.token);
      setUser(data.user);
      toast.success('Logged in successfully');
      navigate('/');
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (name, email, password) => {
    setIsLoading(true);

    try {
      const data = await authService.register(name, email, password);
      localStorage.setItem('crm-token', data.token);
      setToken(data.token);
      setUser(data.user);
      toast.success('Account created successfully');
      navigate('/');
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async (profileData) => {
    setIsLoading(true);

    try {
      const data = await authService.updateProfile(profileData);
      setUser(data.user);
      toast.success('Profile updated successfully');
      return data.user;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update profile';
      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
        updateProfile: handleUpdateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
