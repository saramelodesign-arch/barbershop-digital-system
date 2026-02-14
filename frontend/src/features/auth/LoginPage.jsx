import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { loginUser } from "../../api/authService";
import api from "../../api/api";

const LoginPage = () => {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

const handleLogin = async () => {
  try {
    const { user, token } = await loginUser({ email, password });

    localStorage.setItem("token", token);
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
