
import { LoginCredentials, RegistrationData, User } from './types';
import { API_URL, handleResponse } from './config';
import { toast } from "sonner";

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

export const register = async (userData: RegistrationData) => {
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    
    const data = await handleResponse(response);
    
    // Show registration success toast with verification info
    toast.success("Registration successful!", {
      description: "Please check your email to verify your account."
    });
    
    return data;
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

export const verifyEmail = async (token: string) => {
  try {
    const response = await fetch(`${API_URL}/verify-email`, {
      method: "POST", 
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });
    
    return await handleResponse(response);
  } catch (error) {
    console.error("Email verification error:", error);
    throw error;
  }
};

export const resendVerificationEmail = async (email: string) => {
  try {
    const response = await fetch(`${API_URL}/resend-verification`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });
    
    const data = await handleResponse(response);
    toast.success("Verification email sent", {
      description: "Please check your inbox for the verification link"
    });
    
    return data;
  } catch (error) {
    console.error("Resend verification error:", error);
    throw error;
  }
};

export const requestPasswordReset = async (email: string) => {
  try {
    const response = await fetch(`${API_URL}/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });
    
    const data = await handleResponse(response);
    
    toast.success("Password reset email sent", {
      description: "If your email is registered, you will receive a reset link"
    });
    
    return data;
  } catch (error) {
    console.error("Password reset request error:", error);
    throw error;
  }
};

export const resetPassword = async (token: string, newPassword: string) => {
  try {
    const response = await fetch(`${API_URL}/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token, password: newPassword }),
    });
    
    const data = await handleResponse(response);
    
    toast.success("Password reset successful", {
      description: "You can now log in with your new password"
    });
    
    return data;
  } catch (error) {
    console.error("Password reset error:", error);
    throw error;
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

// Helper function to get location information
const getLocationInfo = () => {
  // In a real app, you would use a geolocation service or IP-based location
  // For demo purposes, extract basic browser info
  const browser = detectBrowser();
  const language = navigator.language || 'en-US';
  const platform = navigator.platform || 'Unknown';
  
  return `${browser} on ${platform} (${language})`;
};

// Helper function to detect browser
const detectBrowser = () => {
  const userAgent = navigator.userAgent;
  
  if (userAgent.indexOf("Firefox") > -1) {
    return "Firefox";
  } else if (userAgent.indexOf("Chrome") > -1) {
    return "Chrome";
  } else if (userAgent.indexOf("Safari") > -1) {
    return "Safari";
  } else if (userAgent.indexOf("MSIE") > -1 || userAgent.indexOf("Trident") > -1) {
    return "Internet Explorer";
  } else if (userAgent.indexOf("Edge") > -1) {
    return "Edge";
  } else {
    return "Unknown Browser";
  }
};

// Helper function to log login attempts
const logLoginAttempt = (userId: number | null, success: boolean, location: string) => {
  // In a real app, you would send this to your server
  console.log(`Login attempt: user=${userId}, success=${success}, location=${location}`);
};
