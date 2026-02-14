import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../../api/authService";

// Register page component
const RegisterPage = () => {
  const navigate = useNavigate();

  // Local state for form
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      // Call register API
      await registerUser({ name, email, password });

      // Redirect to login after success
      navigate("/login");
    } catch (error) {
      console.error("Registration failed", error);
      alert("Registration failed");
    }
  };

  return (
    <div>
      <h1>Register</h1>

      <input
        type="text"
        placeholder="Name"
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleRegister}>
        Register
      </button>

      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default RegisterPage;
