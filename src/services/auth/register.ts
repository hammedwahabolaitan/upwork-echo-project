
import { RegistrationData } from '../types';
import { API_URL, handleResponse } from '../config';
import { toast } from "sonner";

export const register = async (userData: RegistrationData) => {
  try {
    console.log("Attempting registration with:", userData);
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
    
    console.log("Registration successful, response:", data);
    return data;
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};
