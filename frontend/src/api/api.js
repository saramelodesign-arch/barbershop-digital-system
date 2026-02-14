// Import axios library
import axios from "axios";

// Create a custom axios instance
// This allows us to centralize configuration
const api = axios.create({
  // Base URL comes from .env file
  baseURL: import.meta.env.VITE_API_URL,
});

// Add a request interceptor
// This runs before every request
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem("token");

    // If token exists, attach it to request headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Return modified config
    return config;
  },
  (error) => {
    // If request fails before being sent
    return Promise.reject(error);
  }
);

// Export configured axios instance
export default api;
