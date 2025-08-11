import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); // Clear previous messages
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/register/", {
        username,
        password,
      });
      setMessage("✅ " + response.data.message + " Redirecting to login...");
      
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      setMessage("❌ Registration failed. Try another username.");
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>SmartTutor</h1>
      <div style={styles.card}>
        <h2 style={styles.heading}>Create an Account</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
            required
          />
          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />
          <button type="submit" style={styles.button}>Register</button>
        </form>
        {message && <p style={styles.message}>{message}</p>}
        <p style={{ marginTop: "10px" }}>
          Already have an account?{" "}
          <Link to="/login" style={styles.link}>Login here</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f8f9fa",
    padding: "20px",
  },
  title: {
    fontSize: "32px",
    color: "#007bff",
    marginBottom: "20px",
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "#fff",
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "400px",
    textAlign: "center",
  },
  heading: {
    marginBottom: "20px",
    fontSize: "20px",
    color: "#333",
  },
  input: {
    width: "100%",
    padding: "10px",
    margin: "10px 0",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "16px",
  },
  button: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    fontSize: "16px",
    cursor: "pointer",
  },
  message: {
    marginTop: "10px",
    fontSize: "14px",
    color: "#555",
  },
  link: {
    color: "#007bff",
    textDecoration: "none",
  },
};
