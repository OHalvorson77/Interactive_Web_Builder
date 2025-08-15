import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/pages/loginPage.css"; 

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const login = async () => {
    const res = await fetch("http://localhost:5000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (data.token) {
      localStorage.setItem("token", data.token);
      navigate("/dashboard", { state: { userId: data.userId } });
    } else {
      alert("Login failed");
    }
  };

  return (
    <div className="auth-container">
      <h1 className="welcome-title">Welcome to Interactive Dashboard</h1>
      <div className="auth-box">
        <h2>Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={login}>Login</button>
        <p onClick={() => navigate("/signup")} className="link">
          No account? Sign up
        </p>
      </div>
    </div>
  );
}
