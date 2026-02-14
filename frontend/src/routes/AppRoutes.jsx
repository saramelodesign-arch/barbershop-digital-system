import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../features/auth/LoginPage";
import BookingPage from "../features/booking/BookingPage";
import AdminPage from "../features/admin/AdminPage";
import ProtectedRoute from "./ProtectedRoute";
import FallbackPage from "../components/FallbackPage";
import RegisterPage from "../features/auth/RegisterPage";


const AppRoutes = () => {
  return (
    <Routes>
      {/* Redirect root to login */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />


      <Route
        path="/booking"
        element={
          <ProtectedRoute>
            <BookingPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminPage />
          </ProtectedRoute>
        }
      />

      {/* 404 fallback */}
      <Route path="*" element={<FallbackPage />} />
    </Routes>
  );
};

export default AppRoutes;
