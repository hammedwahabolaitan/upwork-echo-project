
export const API_URL = "http://localhost:5000/api";

export const getToken = () => localStorage.getItem("token");

export const setToken = (token: string) => localStorage.setItem("token", token);

export const removeToken = () => localStorage.removeItem("token");

export const handleResponse = async (response: Response) => {
  if (response.status === 401) {
    // Handle unauthorized - clear token and reload
    removeToken();
    localStorage.removeItem("user");
    window.location.href = '/login';
    throw new Error("Session expired. Please login again.");
  }
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "An error occurred" }));
    throw new Error(error.message || `Error ${response.status}: ${response.statusText}`);
  }
  
  return response.json();
};

// Add headers with authentication token for API requests
export const getAuthHeaders = () => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

// Utility function for making authenticated API requests
export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = getToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };
  
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers
  });
  
  return handleResponse(response);
};
