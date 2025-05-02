
import { useState } from "react";
import { User, LoginCredentials, SignupData } from "./types";
import { API_URL, getToken, setToken, removeToken } from "@/services/config";
import { mapUserData, saveUserToStorage } from "./authUtils";
import { toast } from "sonner";

export const useAuthService = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  const login = async (email: string, password: string): Promise<User> => {
    setIsLoading(true);
    
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
      
      // Map user data to our User type
      const mappedUser = mapUserData(data.user);
      
      // Store user data in localStorage for persistence
      saveUserToStorage(mappedUser);
      
      toast.success("Welcome back!", {
        description: `You are now logged in as ${mappedUser.firstName}`
      });
      
      return mappedUser;
      
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (userData: SignupData): Promise<User> => {
    setIsLoading(true);
    
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
      
      // Map user data to our User type
      const mappedUser = mapUserData(data.user);
      
      saveUserToStorage(mappedUser);
      
      toast.success("Account created successfully!", {
        description: "Welcome to our platform"
      });
      
      return mappedUser;
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    removeToken();
    localStorage.removeItem("user");
    toast.info("You have been logged out", {
      description: "Come back soon!"
    });
  };

  return {
    isLoading,
    login,
    signup,
    logout
  };
};
