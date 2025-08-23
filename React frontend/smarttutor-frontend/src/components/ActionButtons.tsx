import React from "react";
import "./ActionButtons.css";

interface ActionButtonsProps {
  navigate: (path: string) => void;
}

export default function ActionButtons({ navigate }: ActionButtonsProps) {
  const actions = [
    {
      title: "Ask a Doubt",
      description: "Get instant help with your questions",
      icon: "❓",
      color: "green",
      path: "/ask"
    },
    {
      title: "Start Quiz",
      description: "Test your knowledge with interactive quizzes",
      icon: "📝",
      color: "blue",
      path: "/quiz"
    },
    {
      title: "View Progress",
      description: "Track your learning journey and achievements",
      icon: "📊",
      color: "purple",
      path: "/progress"
    }
  ];

  return (
    <div className="action-buttons">
      <h2 className="section-title">Quick Actions</h2>
      <div className="actions-grid">
        {actions.map((action, index) => (
          <button
            key={index}
            className={`action-card ${action.color}`}
            onClick={() => navigate(action.path)}
          >
            <div className="action-icon">{action.icon}</div>
            <h3 className="action-title">{action.title}</h3>
            <p className="action-description">{action.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}