import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Home.css";
import heroImg from "../assets/ai-tutor-hero.svg";

export default function Home() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("unauthorized") === "true") {
      setTimeout(() => alert("🚫 Please log in to access this page."), 100);
      navigate("/", { replace: true });
    }
  }, [location, navigate]);

  return (
    <div className="home-container">
      {/* LEFT SIDE MAIN IMAGE + FLOATING ICONS */}
      <div className="left-visual">
        <div className="floating-icons">
          {/* Star SVG */}
          <svg
            className="icon star"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="#FFD700"
          >
            <path d="M12 .587l3.668 7.431L24 9.748l-6 5.849 
              1.417 8.268L12 19.771l-7.417 3.994L6 15.597 
              0 9.748l8.332-1.73z" />
          </svg>

          {/* Heart SVG */}
          <svg
            className="icon heart"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="#FF4D6D"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 
              2 12.28 2 8.5 2 5.42 4.42 3 
              7.5 3c1.74 0 3.41 0.81 4.5 
              2.09C13.09 3.81 14.76 3 
              16.5 3 19.58 3 22 5.42 22 
              8.5c0 3.78-3.4 6.86-8.55 
              11.54L12 21.35z" />
          </svg>
        </div>
        <img src={heroImg} alt="SmartTutor" className="main-hero-img" />
      </div>

      {/* RIGHT SIDE LOGIN STYLE CARD */}
      <div className="right-card">
        <h1 className="brand-title">SmartTutor</h1>
        <p className="tagline">Your AI Learning Partner</p>
        <button className="btn primary" onClick={() => navigate("/register")}>
          🚀 Get Started
        </button>
        <button className="btn secondary" onClick={() => navigate("/login")}>
          Login
        </button>
        <p className="small-text">
          Already have an account?{" "}
          <span className="link" onClick={() => navigate("/login")}>
            Sign in
          </span>
        </p>
      </div>
    </div>
  );
}
