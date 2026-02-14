import { Link } from "react-router-dom";

function BookingPage() {
  return (
    <div>
      <h1>Book an Appointment</h1>

      <p>Select barber, service and date.</p>

      <Link to="/admin">Go to Admin</Link>
    </div>
  );
}

export default BookingPage;
