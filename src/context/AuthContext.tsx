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
  bio?: string;
  company?: string;
  createdAt?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, photoURL?: string, role?: string, phone?: string, address?: string) => Promise<boolean>;
  googleLogin: (email?: string, name?: string, photoURL?: string) => Promise<boolean>;
  githubLogin: (email?: string, name?: string, photoURL?: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<boolean>;
  changePassword: (currentPassword: string, newPassword: string, confirmPassword: string) => Promise<{ success: boolean; message: string }>;
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
  changePassword: async () => ({ success: false, message: '' }),
});

// Google & GitHub OAuth Authorization Endpoints
export const getGoogleOAuthUrl = (): string => {
  if (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_GOOGLE_AUTH_URL) {
    return process.env.NEXT_PUBLIC_GOOGLE_AUTH_URL;
  }
  return 'https://accounts.google.com/v3/signin/accountchooser?client_id=317561215059-j7e3825l0j107cltgge502gd1r2saogt.apps.googleusercontent.com&code_challenge=9tU8H-aNp38zY4pXdDdtcAik3FCqoLvfchUzqb25xcQ&code_challenge_method=S256&include_granted_scopes=true&redirect_uri=https%3A%2F%2Frental-hub-eight-flame.vercel.app%2Fapi%2Fauth%2Fcallback%2Fgoogle&response_type=code&scope=email+profile+openid&state=2k6vlADcsIlfL-SfS3jsjkj7208HcdJc';
};

export const getGithubOAuthUrl = (): string => {
  if (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_GITHUB_AUTH_URL) {
    return process.env.NEXT_PUBLIC_GITHUB_AUTH_URL;
  }
  const clientId = (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID) || 'Iv1.b507a08c87ecfe98';
  return `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=user:email`;
};

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
    // If called without credentials, redirect directly to Google Accounts OAuth
    if (!mockEmail && typeof window !== 'undefined') {
      window.location.href = getGoogleOAuthUrl();
      return true;
    }

    try {
      setIsLoading(true);
      const email = mockEmail;
      const name = mockName || 'Google User';
      const photoURL = mockPhoto || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`;

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
  const githubLogin = async (
    mockEmail?: string,
    mockName?: string,
    mockPhoto?: string
  ): Promise<boolean> => {
    // If called without credentials, redirect directly to GitHub OAuth
    if (!mockEmail && typeof window !== 'undefined') {
      window.location.href = getGithubOAuthUrl();
      return true;
    }

    try {
      setIsLoading(true);
      const email = mockEmail;
      const name = mockName || 'GitHub User';
      const photoURL = mockPhoto || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`;

      const res = await api.post('/auth/github', { email, name, photoURL });

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
      toast.error(error.response?.data?.message || 'GitHub login failed.');
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

  // Change Password
  const changePassword = async (
    currentPassword: string,
    newPassword: string,
    confirmPassword: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await api.put('/auth/change-password', {
        currentPassword,
        newPassword,
        confirmPassword,
      });
      if (res.data?.success) {
        toast.success(res.data.message || 'Password changed successfully!');
        return { success: true, message: res.data.message };
      }
      return { success: false, message: res.data?.message || 'Failed to change password.' };
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Failed to update password.';
      toast.error(msg);
      return { success: false, message: msg };
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
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
