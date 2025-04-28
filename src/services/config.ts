
export const API_URL = "http://localhost:5000/api";

export const getToken = () => localStorage.getItem("token");

export const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "An error occurred");
  }
  return response.json();
};
