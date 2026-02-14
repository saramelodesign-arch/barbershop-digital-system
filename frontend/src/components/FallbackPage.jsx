import { Link } from "react-router-dom";

// This component is displayed when no route matches
const FallbackPage = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      {/* Page title */}
      <h1>404</h1>

      {/* Description */}
      <p>Page not found</p>

      {/* Link to go back to login */}
      <Link to="/login">
        Go back to Login
      </Link>
    </div>
  );
};

export default FallbackPage;
