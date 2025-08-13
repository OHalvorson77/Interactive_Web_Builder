import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/pages/signupPage.css"; 

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const signup = async () => {
    await fetch("http://localhost:5000/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    navigate("/login");
  };

  return (
    <div className="auth-container">
      <h1 className="welcome-title">Welcome to Interactive Dashboard</h1>
      <div className="auth-box">
        <h2>Sign Up</h2>
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
        <button onClick={signup}>Sign Up</button>
        <p onClick={() => navigate("/login")} className="link">
          Already have an account? Log in
        </p>
      </div>
    </div>
  );
}
