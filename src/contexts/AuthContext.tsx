
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { API_URL } from "@/services/config";

// Define User Type
export interface User {
  id: number;
  firstName?: string;
  lastName?: string;
  email: string;
  accountType?: string;
  bio?: string;
  skills?: string;
  hourlyRate?: number;
  avatarUrl?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: any) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  signup: async () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

// Helper functions for token management
const getToken = () => localStorage.getItem("token");
const setToken = (token: string) => localStorage.setItem("token", token);
const removeToken = () => localStorage.removeItem("token");

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const checkAuth = async () => {
    const token = getToken();
    
    if (!token) {
      setIsLoading(false);
      return;
    }
    
    try {
      const response = await fetch(`${API_URL}/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const userData = await response.json();
        
        setUser({
          id: userData.id,
          firstName: userData.first_name,
          lastName: userData.last_name,
          email: userData.email,
          accountType: userData.account_type,
          bio: userData.bio,
          skills: userData.skills,
          hourlyRate: userData.hourly_rate,
          avatarUrl: userData.avatar_url
        });
      } else {
        // Token is invalid or expired
        removeToken();
      }
    } catch (error) {
      console.error("Auth error:", error);
      removeToken();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  // Redirect authenticated users away from login/signup if they're already logged in
  useEffect(() => {
    if (user && !isLoading && (location.pathname === '/login' || location.pathname === '/signup')) {
      navigate('/dashboard');
    }
  }, [user, isLoading, location.pathname, navigate]);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }
      
      const data = await response.json();
      setToken(data.token);
      
      // Fetch user data
      await checkAuth();
      
      // Get the location they were trying to access
      const from = (location.state as any)?.from?.pathname || "/dashboard";
      navigate(from, { replace: true });
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const signup = async (userData: any) => {
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }
      
      const data = await response.json();
      setToken(data.token);
      
      // Fetch user data
      await checkAuth();
      
      navigate('/dashboard');
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    removeToken();
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
