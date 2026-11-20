'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '@/lib/api';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';

export interface User {
  _id: string;
  name: string;
  email: string;
  photoURL: string;
  role: 'Customer' | 'Owner' | 'Admin';
  phone?: string;
  address?: string;
  createdAt?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, photoURL?: string, role?: string, phone?: string, address?: string) => Promise<boolean>;
  googleLogin: (email?: string, name?: string, photoURL?: string) => Promise<boolean>;
  githubLogin: () => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isLoading: true,
  login: async () => false,
  register: async () => false,
  googleLogin: async () => false,
  githubLogin: async () => false,
  logout: () => {},
  updateProfile: async () => false,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Restore session on initial mount / reload
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem('equipment_token');
        const storedUser = localStorage.getItem('equipment_user');

        if (storedToken) {
          setToken(storedToken);
          if (storedUser) {
            try {
              setUser(JSON.parse(storedUser));
            } catch (e) {
              // Ignore json parse error
            }
          }

          try {
            const res = await api.get('/auth/me');
            if (res.data.success && res.data.user) {
              setUser(res.data.user);
              localStorage.setItem('equipment_user', JSON.stringify(res.data.user));
            }
          } catch (apiError) {
            if ((apiError as any)?.response?.status === 401 || (apiError as any)?.response?.status === 403) {
              localStorage.removeItem('equipment_token');
              localStorage.removeItem('equipment_user');
              setUser(null);
              setToken(null);
            }
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Email/Password Login
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const res = await api.post('/auth/login', { email, password });

      if (res.data.success) {
        const { token: receivedToken, user: receivedUser } = res.data;
        setToken(receivedToken);
        setUser(receivedUser);
        localStorage.setItem('equipment_token', receivedToken);
        localStorage.setItem('equipment_user', JSON.stringify(receivedUser));

        Swal.fire({
          icon: 'success',
          title: 'Welcome to RentMach!',
          text: `Signed in successfully as ${receivedUser.name}`,
          timer: 2000,
          showConfirmButton: false,
          customClass: {
            popup: 'rounded-3xl',
          }
        });

        return true;
      }
      return false;
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Login failed. Please check your credentials.';
      Swal.fire({
        icon: 'error',
        title: 'Authentication Error',
        text: msg,
        confirmButtonColor: '#FF7A1A',
        customClass: {
          popup: 'rounded-3xl',
        }
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // User Registration
  const register = async (
    name: string,
    email: string,
    password: string,
    photoURL?: string,
    role?: string,
    phone?: string,
    address?: string
  ): Promise<boolean> => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasMinLength = password.length >= 6;

    if (!hasUpperCase || !hasLowerCase || !hasMinLength) {
      toast.error('Password must contain at least 1 uppercase letter, 1 lowercase letter, and be at least 6 characters long.', {
        duration: 4000,
        position: 'top-center'
      });
      return false;
    }

    try {
      setIsLoading(true);
      const res = await api.post('/auth/register', {
        name,
        email,
        password,
        photoURL,
        role: role || 'Customer',
        phone,
        address
      });

      if (res.data.success) {
        const { token: receivedToken, user: receivedUser } = res.data;
        setToken(receivedToken);
        setUser(receivedUser);
        localStorage.setItem('equipment_token', receivedToken);
        localStorage.setItem('equipment_user', JSON.stringify(receivedUser));

        Swal.fire({
          icon: 'success',
          title: 'Welcome to RentMach!',
          text: 'Your account has been registered successfully.',
          timer: 2500,
          showConfirmButton: false,
          customClass: {
            popup: 'rounded-3xl',
          }
        });

        return true;
      }
      return false;
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Registration failed. Please try again.';
      Swal.fire({
        icon: 'error',
        title: 'Registration Error',
        text: msg,
        confirmButtonColor: '#FF7A1A',
        customClass: {
          popup: 'rounded-3xl',
        }
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Google Social Login
  const googleLogin = async (
    mockEmail?: string,
    mockName?: string,
    mockPhoto?: string
  ): Promise<boolean> => {
    try {
      setIsLoading(true);
      const email = mockEmail || `google_user_${Math.floor(Math.random() * 10000)}@gmail.com`;
      const name = mockName || 'Google User';
      const photoURL = mockPhoto || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80';

      const res = await api.post('/auth/google', { email, name, photoURL });

      if (res.data.success) {
        const { token: receivedToken, user: receivedUser } = res.data;
        setToken(receivedToken);
        setUser(receivedUser);
        localStorage.setItem('equipment_token', receivedToken);
        localStorage.setItem('equipment_user', JSON.stringify(receivedUser));

        Swal.fire({
          icon: 'success',
          title: 'Google Login Successful!',
          text: `Signed in as ${receivedUser.name}`,
          timer: 2000,
          showConfirmButton: false,
          customClass: {
            popup: 'rounded-3xl',
          }
        });

        return true;
      }
      return false;
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Google login failed.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // GitHub Social Login
  const githubLogin = async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      const email = `github_contractor_${Math.floor(Math.random() * 10000)}@github.com`;
      const name = 'GitHub Contractor';
      const photoURL = 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80';

      const res = await api.post('/auth/google', { email, name, photoURL });

      if (res.data.success) {
        const { token: receivedToken, user: receivedUser } = res.data;
        setToken(receivedToken);
        setUser(receivedUser);
        localStorage.setItem('equipment_token', receivedToken);
        localStorage.setItem('equipment_user', JSON.stringify(receivedUser));

        Swal.fire({
          icon: 'success',
          title: 'GitHub Login Successful!',
          text: `Signed in as ${receivedUser.name}`,
          timer: 2000,
          showConfirmButton: false,
          customClass: {
            popup: 'rounded-3xl',
          }
        });

        return true;
      }
      return false;
    } catch (error: any) {
      toast.error('GitHub authentication failed.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('equipment_token');
    localStorage.removeItem('equipment_user');
    setUser(null);
    setToken(null);
    toast.success('Logged out successfully.');
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  // Update Profile
  const updateProfile = async (data: Partial<User>): Promise<boolean> => {
    try {
      const res = await api.put('/auth/profile', data);
      if (res.data.success && res.data.user) {
        setUser(res.data.user);
        localStorage.setItem('equipment_user', JSON.stringify(res.data.user));
        toast.success('Profile updated successfully!');
        return true;
      }
      return false;
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile.');
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        googleLogin,
        githubLogin,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
