
import { ProfileUpdateData } from './types';
import { API_URL, getToken, handleResponse } from './config';

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
    // Convert camelCase to snake_case for API
    const apiData = {
      first_name: profileData.firstName,
      last_name: profileData.lastName,
      bio: profileData.bio,
      skills: profileData.skills,
      hourly_rate: profileData.hourlyRate
    };
    
    const response = await fetch(`${API_URL}/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(apiData),
    });
    
    const data = await handleResponse(response);
    
    // Update stored user data
    const currentUser = localStorage.getItem("user");
    if (currentUser) {
      const updatedUser = {
        ...JSON.parse(currentUser),
        ...profileData
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
    
    return data;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};
