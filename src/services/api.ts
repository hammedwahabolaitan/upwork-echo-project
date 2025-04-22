
import { toast } from "@/components/ui/sonner";

const API_URL = "http://localhost:5000/api";

// Types
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  accountType: "client" | "freelancer";
  bio?: string;
  skills?: string;
  hourlyRate?: number;
}

export interface Job {
  id: number;
  title: string;
  description: string;
  budget: number;
  skills: string;
  duration: string;
  client_id: number;
  status: "open" | "in_progress" | "completed" | "cancelled";
  created_at: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  accountType: "client" | "freelancer";
}

export interface ProfileUpdateData {
  firstName: string;
  lastName: string;
  bio?: string;
  skills?: string;
  hourlyRate?: number;
}

export interface JobCreateData {
  title: string;
  description: string;
  budget: number;
  skills: string;
  duration: string;
}

// Helper functions
const getToken = () => localStorage.getItem("token");

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "An error occurred");
  }
  return response.json();
};

// Auth APIs
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
    
    // Save token and user data
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    
    return data;
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
  return !!getToken();
};

export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem("user");
  return userStr ? JSON.parse(userStr) : null;
};

// Jobs APIs
export const getJobs = async () => {
  try {
    const response = await fetch(`${API_URL}/jobs`);
    return await handleResponse(response);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    throw error;
  }
};

export const getJobById = async (id: number) => {
  try {
    const response = await fetch(`${API_URL}/jobs/${id}`);
    return await handleResponse(response);
  } catch (error) {
    console.error(`Error fetching job ${id}:`, error);
    throw error;
  }
};

export const createJob = async (jobData: JobCreateData) => {
  try {
    const response = await fetch(`${API_URL}/jobs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(jobData),
    });
    
    return await handleResponse(response);
  } catch (error) {
    console.error("Error creating job:", error);
    throw error;
  }
};

// Profile APIs
export const getProfile = async (id: number) => {
  try {
    const response = await fetch(`${API_URL}/profile/${id}`);
    return await handleResponse(response);
  } catch (error) {
    console.error(`Error fetching profile ${id}:`, error);
    throw error;
  }
};

export const updateProfile = async (profileData: ProfileUpdateData) => {
  try {
    const response = await fetch(`${API_URL}/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(profileData),
    });
    
    return await handleResponse(response);
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};
