import { useState } from "react";
import api from "../../api/api";

const BookingPage = () => {
  const [date, setDate] = useState("");

  const handleBooking = async () => {
    try {
      // Send booking request to backend
      await api.post("/bookings", { date });

      // Success feedback
      alert("Booking created successfully");
    } catch (error) {
      // Error handling
      console.error("Booking failed:", error);
      alert("Something went wrong");
    }
  };

  return (
    <div>
      <h1>Book Appointment</h1>

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <button onClick={handleBooking}>
        Book
      </button>
    </div>
  );
};

export default BookingPage;
