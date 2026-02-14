import { createContext, useContext, useState, useEffect } from "react";

// Create authentication context
const AuthContext = createContext();

// AuthProvider component wraps the entire app
export const AuthProvider = ({ children }) => {
  // Store authenticated user
  const [user, setUser] = useState(null);

  // Load user from localStorage on first render
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Login function
  const login = (userData) => {
    // Save user in state
    setUser(userData);

    // Persist user in localStorage
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // Logout function
  const logout = () => {
    // Clear state
    setUser(null);

    // Remove from localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        role: user?.role || null,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  return useContext(AuthContext);
};
