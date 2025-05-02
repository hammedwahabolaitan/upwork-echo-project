
import { LoginCredentials, User } from '../types';
import { API_URL, handleResponse } from '../config';
import { toast } from "sonner";
import { getLocationInfo, logLoginAttempt } from './utils';

export const login = async (credentials: LoginCredentials) => {
  try {
    // Add location information to login request
    const locationInfo = getLocationInfo();
    const payload = { ...credentials, location: locationInfo };
    
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    
    const data = await handleResponse(response);
    
    // Check if email verification is required
    if (data.needsVerification) {
      throw new Error("Please verify your email before logging in");
    }
    
    // Map snake_case to camelCase for consistent frontend use
    const user = {
      ...data.user,
      firstName: data.user.first_name,
      lastName: data.user.last_name,
      accountType: data.user.account_type,
      hourlyRate: data.user.hourly_rate,
      isVerified: data.user.is_verified === 1
    };
    
    // Save token and user data
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(user));
    
    // Log login attempt for security
    logLoginAttempt(user.id, true, locationInfo);
    
    // Show success toast with location info
    toast.success(`Welcome back, ${user.firstName}!`, {
      description: `Logged in successfully from ${locationInfo}`
    });
    
    return { ...data, user };
  } catch (error) {
    console.error("Login error:", error);
    
    // Log failed login attempt
    logLoginAttempt(null, false, getLocationInfo());
    throw error;
  }
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

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  
  // Show logout success toast
  toast.info("You have been logged out", {
    description: "Come back soon!"
  });
};
