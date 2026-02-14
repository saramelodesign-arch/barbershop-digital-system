// Import configured axios instance
import api from "./api";

// Register new user
export const registerUser = async (userData) => {
  // Send POST request to backend
  const response = await api.post("/auth/register", userData);

  // Return response data
  return response.data;
};

// Login existing user
export const loginUser = async (credentials) => {
  const response = await api.post("/auth/login", credentials);

  return response.data;
};
