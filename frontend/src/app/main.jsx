import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "../context/AuthContext";

// Create React root and render app
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* Router enables navigation */}
    <BrowserRouter>
      {/* AuthProvider makes auth state available globally */}
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
