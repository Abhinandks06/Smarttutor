import React from "react";
import "./ProgressCard.css";

export default function ProgressCard() {
  // Mock data - replace with real data from your backend
  const progressData = [
    { label: "Quizzes Completed", value: 75, total: 100, color: "#4CAF50" },
    { label: "Doubts Resolved", value: 23, total: 30, color: "#2196F3" },
    { label: "Study Streak", value: 7, total: 30, color: "#FF9800" }
  ];

  return (
    <div className="progress-card">
      <h2 className="card-title">Your Progress</h2>
      <div className="progress-stats">
        {progressData.map((item, index) => (
          <div key={index} className="progress-item">
            <div className="progress-header">
              <span className="progress-label">{item.label}</span>
              <span className="progress-value">
                {item.value}/{item.total}
              </span>
            </div>
            <div className="progress-bar-container">
              <div 
                className="progress-bar"
                style={{
                  width: `${(item.value / item.total) * 100}%`,
                  backgroundColor: item.color
                }}
              ></div>
            </div>
            <div className="progress-percentage">
              {Math.round((item.value / item.total) * 100)}% Complete
            </div>
          </div>
        ))}
      </div>
      
      <div className="achievement-badge">
        <div className="badge-icon">🏆</div>
        <div className="badge-content">
          <h4>Great Progress!</h4>
          <p>You're on track to reach your learning goals</p>
        </div>
      </div>
    </div>
  );
}