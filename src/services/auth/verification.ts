
import { API_URL, handleResponse } from '../config';
import { toast } from "sonner";

export const verifyEmail = async (token: string) => {
  try {
    console.log("Attempting to verify email with token:", token);
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
    console.log("Resending verification email to:", email);
    const response = await fetch(`${API_URL}/resend-verification`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });
    
    const data = await handleResponse(response);
    toast.success("Verification email sent", {
      description: "Note: For testing, check server console for the email preview URL"
    });
    
    return data;
  } catch (error) {
    console.error("Resend verification error:", error);
    throw error;
  }
};
