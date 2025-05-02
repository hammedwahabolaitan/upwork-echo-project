
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { User, AuthContextType } from "./types";
import { getUserFromStorage, verifyAuth } from "./authUtils";
import { useAuthService } from "./useAuthService";
import { removeToken } from "@/services/config";

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  signup: async () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const authService = useAuthService();

  // Check auth on initial load
  useEffect(() => {
    const checkAuth = async () => {
      const storedUser = getUserFromStorage();
      
      if (storedUser) {
        // If we have user data already stored, use it immediately to avoid delay
        setUser(storedUser);
      }
      
      try {
        // Try to validate the token and get fresh user data
        const verifiedUser = await verifyAuth();
        
        if (verifiedUser) {
          setUser(verifiedUser);
        } else {
          // Token is invalid or expired
          removeToken();
          localStorage.removeItem("user");
          setUser(null);
        }
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
      const loggedInUser = await authService.login(email, password);
      setUser(loggedInUser);
      
      // Redirect to dashboard or intended location
      const intendedPath = (location.state as any)?.from?.pathname || "/dashboard";
      navigate(intendedPath, { replace: true });
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const signup = async (userData: any) => {
    try {
      const newUser = await authService.signup(userData);
      setUser(newUser);
      
      // Redirect to dashboard after successful registration
      navigate('/dashboard');
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    authService.logout();
    navigate('/');
  };

  const contextValue: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
