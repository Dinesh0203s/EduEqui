import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';

interface DisabilityType {
  vision: boolean;
  hearing: boolean;
  motor: boolean;
  cognitive: boolean;
  other?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  disability_types: DisabilityType;
  age?: number;
  language_preference: string;
  grade_level?: string;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  signup: (userData: SignupData) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
  disability_types: DisabilityType;
  age?: number;
  language_preference: string;
  grade_level?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const backendUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

  // Load token and user from localStorage on mount
  useEffect(() => {
    const loadAuth = async () => {
      const storedToken = localStorage.getItem('auth_token');
      const storedUser = localStorage.getItem('auth_user');

      if (storedToken && storedUser) {
        try {
          // Set user immediately from localStorage for instant UI update
          const parsedUser = JSON.parse(storedUser);
          setToken(storedToken);
          setUser(parsedUser);
          
          // Mark as loaded immediately so UI doesn't wait
          setIsLoading(false);
          
          // Verify token in background (don't block UI)
          try {
            const response = await fetch(`${backendUrl}/api/auth/me`, {
              headers: {
                'Authorization': `Bearer ${storedToken}`,
              },
            });

            if (response.ok) {
              const userData = await response.json();
              setUser(userData);
              localStorage.setItem('auth_user', JSON.stringify(userData));
            } else if (response.status === 401 || response.status === 403) {
              // Only clear auth if token is explicitly invalid (401/403)
              console.warn('Token is invalid, clearing auth');
              localStorage.removeItem('auth_token');
              localStorage.removeItem('auth_user');
              setToken(null);
              setUser(null);
            } else {
              // Network error or server error - keep user logged in
              console.warn('Could not verify token, but keeping user logged in');
            }
          } catch (error) {
            // Network error - keep user logged in with stored data
            console.warn('Failed to verify token (network error), keeping user logged in:', error);
          }
        } catch (error) {
          console.error('Failed to parse stored user data:', error);
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_user');
          setToken(null);
          setUser(null);
          setIsLoading(false);
        }
      } else {
        // No stored auth, user is not logged in
        setIsLoading(false);
      }
    };

    loadAuth();
  }, [backendUrl]);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${backendUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Login failed');
      }

      const data = await response.json();
      setToken(data.token);
      setUser(data.user);
      
      // Store in localStorage for persistence
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('auth_user', JSON.stringify(data.user));
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    try {
      // Sign in with Firebase Google popup
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;
      
      // Get Firebase ID token
      const idToken = await firebaseUser.getIdToken();
      
      // Send to backend for verification and user creation/login
      const response = await fetch(`${backendUrl}/api/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          idToken,
          email: firebaseUser.email,
          name: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Google login failed');
      }

      const data = await response.json();
      setToken(data.token);
      setUser(data.user);
      
      // Store in localStorage for persistence
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('auth_user', JSON.stringify(data.user));
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    }
  };

  const signup = async (userData: SignupData) => {
    try {
      const response = await fetch(`${backendUrl}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Signup failed');
      }

      const data = await response.json();
      setToken(data.token);
      setUser(data.user);
      
      // Store in localStorage for persistence
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('auth_user', JSON.stringify(data.user));
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('auth_user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    isLoading,
    login,
    loginWithGoogle,
    signup,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
