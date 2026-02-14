import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/api";

const LoginPage = () => {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      // Send login request
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      const { user, token } = response.data;

      // Save token separately
      localStorage.setItem("token", token);

      // Update context
      login(user);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <div>
      <h1>Login</h1>

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

      <button onClick={handleLogin}>
        Login
      </button>
    </div>
  );
};

export default LoginPage;
