import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/token/", {
        username,
        password
      });

      // Save tokens to local storage
      localStorage.setItem("access", response.data.access);
      localStorage.setItem("refresh", response.data.refresh);

      setMessage("Login successful!");
      setTimeout(() => navigate("/dashboard"), 800); // Redirect after a short delay
    } catch (error) {
      setMessage("Invalid username or password.");
    }
  };

  return (
    <div
      style={{
        background: "#f9f9f9",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "40px",
          borderRadius: "10px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          width: "350px",
          textAlign: "center",
        }}
      >
        <h1 style={{ marginBottom: "10px", color: "#333" }}>SmartTutor</h1>
        <h2 style={{ marginBottom: "20px", color: "#555" }}>Login</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "15px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              fontSize: "14px",
            }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "20px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              fontSize: "14px",
            }}
          />
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px",
              background: "#4CAF50",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            Login
          </button>
        </form>

        {message && (
          <p style={{ marginTop: "15px", color: message.includes("successful") ? "green" : "red" }}>
            {message}
          </p>
        )}

        <p style={{ marginTop: "20px", fontSize: "14px" }}>
          Don't have an account?{" "}
          <Link to="/register" style={{ color: "#4CAF50", textDecoration: "none" }}>
            Register
          </Link>
        </p>

        <p style={{ marginTop: "10px", fontSize: "14px" }}>
          <Link to="/" style={{ color: "#555", textDecoration: "none" }}>
            ⬅ Back to Home
          </Link>
        </p>
      </div>
    </div>
  );
}
