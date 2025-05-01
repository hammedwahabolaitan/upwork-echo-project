
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { API_URL } from "@/services/config";
import { toast } from "sonner";

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
const getUserFromStorage = () => {
  const userStr = localStorage.getItem("user");
  return userStr ? JSON.parse(userStr) : null;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Check auth on initial load
  useEffect(() => {
    const checkAuth = async () => {
      const token = getToken();
      const storedUser = getUserFromStorage();
      
      if (!token) {
        setIsLoading(false);
        return;
      }

      if (storedUser) {
        // If we have user data already stored, use it immediately to avoid delay
        setUser(storedUser);
      }
      
      try {
        // Try to validate the token and get fresh user data
        const response = await fetch(`${API_URL}/login/verify`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const userData = await response.json();
          
          // Map snake_case to camelCase for consistent frontend use
          const user = {
            id: userData.id || userData.user_id,
            firstName: userData.first_name,
            lastName: userData.last_name,
            email: userData.email,
            accountType: userData.account_type,
            bio: userData.bio,
            skills: userData.skills,
            hourlyRate: userData.hourly_rate,
            avatarUrl: userData.avatar_url
          };
          
          setUser(user);
          localStorage.setItem("user", JSON.stringify(user));
        } else {
          // Token is invalid or expired
          removeToken();
          localStorage.removeItem("user");
          setUser(null);
        }
      } catch (error) {
        console.error("Auth verification error:", error);
        // Don't remove token on network errors to prevent unnecessary logouts
      } finally {
        setIsLoading(false);
      }
    };

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
      
      // Convert snake_case to camelCase for consistent frontend use
      const userData = {
        id: data.user.id,
        firstName: data.user.first_name,
        lastName: data.user.last_name,
        email: data.user.email,
        accountType: data.user.account_type,
        bio: data.user.bio,
        skills: data.user.skills,
        hourlyRate: data.user.hourly_rate,
        avatarUrl: data.user.avatar_url
      };
      
      // Store user data in localStorage for persistence
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      
      return;
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
      
      // Convert snake_case to camelCase for frontend use
      const user = {
        id: data.user.id,
        firstName: data.user.first_name,
        lastName: data.user.last_name,
        email: data.user.email,
        accountType: data.user.account_type
      };
      
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    removeToken();
    localStorage.removeItem("user");
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
