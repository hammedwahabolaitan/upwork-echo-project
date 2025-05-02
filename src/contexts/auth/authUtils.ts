
import { User } from "./types";
import { API_URL, getToken } from "@/services/config";

// Helper functions for user data management
export const saveUserToStorage = (user: User) => {
  localStorage.setItem("user", JSON.stringify(user));
};

export const getUserFromStorage = () => {
  const userStr = localStorage.getItem("user");
  return userStr ? JSON.parse(userStr) : null;
};

// Helper to map API response to our User type
export const mapUserData = (userData: any): User => {
  return {
    id: userData.id,
    firstName: userData.first_name,
    lastName: userData.last_name,
    email: userData.email,
    accountType: userData.account_type,
    bio: userData.bio || "",
    skills: userData.skills || "",
    hourlyRate: userData.hourly_rate,
    avatarUrl: userData.avatar_url
  };
};

export const verifyAuth = async (): Promise<User | null> => {
  const token = getToken();
  
  if (!token) {
    return null;
  }
  
  try {
    const response = await fetch(`${API_URL}/login/verify`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.ok) {
      const userData = await response.json();
      const mappedUser = mapUserData(userData);
      
      saveUserToStorage(mappedUser);
      return mappedUser;
    } else {
      // Token is invalid or expired
      return null;
    }
  } catch (error) {
    console.error("Auth verification error:", error);
    // Don't return null on network errors to prevent unnecessary logouts
    return getUserFromStorage();
  }
};
