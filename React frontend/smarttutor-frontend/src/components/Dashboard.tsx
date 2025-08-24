import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ActionButtons from "../components/ActionButtons.tsx";
import ProgressCard from "../components/ProgressCard.tsx";
import ActivityList from "../components/ActivityList.tsx";
import "./Dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem("access");
    if (!accessToken) {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    navigate("/login");
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1 className="welcome-title">SmartTutor 🎓</h1>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-container">
          <ActionButtons navigate={navigate} />
          
          <div className="dashboard-grid">
            <ProgressCard />
            <ActivityList />
          </div>
        </div>
      </main>
    </div>
  );
}