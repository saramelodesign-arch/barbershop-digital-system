import { Routes, Route } from "react-router-dom";
import BookingPage from "./pages/BookingPage";
import AdminPage from "./pages/AdminPage";
import ProtectedRoute from "./components/ProtectedRoute";

import Navbar from "./components/Navbar";


function App() {
  return (
    <>
      <Navbar />
    <Routes>
      <Route path="/" element={<BookingPage />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminPage />
          </ProtectedRoute>
        }
      />
    </Routes>
    </>
  );
}

export default App;

