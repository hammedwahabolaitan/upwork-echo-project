
import { LoginCredentials, RegistrationData, User } from './types';
import { API_URL, handleResponse } from './config';
import { toast } from "@/components/ui/sonner";

export const login = async (credentials: LoginCredentials) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });
    
    const data = await handleResponse(response);
    
    // Map snake_case to camelCase for consistent frontend use
    const user = {
      ...data.user,
      firstName: data.user.first_name,
      lastName: data.user.last_name,
      accountType: data.user.account_type,
      hourlyRate: data.user.hourly_rate
    };
    
    // Save token and user data
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(user));
    
    return { ...data, user };
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const register = async (userData: RegistrationData) => {
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    
    return await handleResponse(response);
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem("user");
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch (error) {
    console.error("Error parsing user data:", error);
    return null;
  }
};
