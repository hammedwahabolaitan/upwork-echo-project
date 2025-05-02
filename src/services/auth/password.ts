
import { API_URL, handleResponse, apiRequest } from '../config';
import { toast } from "sonner";

export const requestPasswordReset = async (email: string) => {
  try {
    console.log("Requesting password reset for:", email);
    // Use the apiRequest utility function to ensure consistent error handling
    const response = await apiRequest('/forgot-password', {
      method: "POST",
      body: JSON.stringify({ email })
    });
    
    toast.success("Password reset email sent", {
      description: "Note: For testing, check server console for the email preview URL"
    });
    
    return response;
  } catch (error) {
    console.error("Password reset request error:", error);
    if (error instanceof Error && error.message.includes("404")) {
      toast.error("Server error", {
        description: "Password reset service is not available. Please contact support."
      });
    } else {
      throw error;
    }
  }
};

export const resetPassword = async (token: string, newPassword: string) => {
  try {
    console.log("Resetting password with token:", token);
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
