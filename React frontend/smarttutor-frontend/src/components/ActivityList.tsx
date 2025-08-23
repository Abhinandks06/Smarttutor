import React from "react";
import "./ActivityList.css";

export default function ActivityList() {
  // Mock data - replace with real data from your backend
  const activities = [
    {
      id: 1,
      type: "doubt",
      title: "JavaScript Array Methods",
      description: "Asked about filter() and map() functions",
      timestamp: "2 hours ago",
      status: "resolved",
      icon: "❓"
    },
    {
      id: 2,
      type: "quiz",
      title: "React Fundamentals Quiz",
      description: "Scored 85% on component lifecycle quiz",
      timestamp: "1 day ago",
      status: "completed",
      icon: "📝"
    },
    {
      id: 3,
      type: "doubt",
      title: "CSS Flexbox Layout",
      description: "Need help with centering elements",
      timestamp: "2 days ago",
      status: "pending",
      icon: "❓"
    },
    {
      id: 4,
      type: "quiz",
      title: "HTML5 Semantics",
      description: "Completed semantic elements assessment",
      timestamp: "3 days ago",
      status: "completed",
      icon: "📝"
    },
    {
      id: 5,
      type: "doubt",
      title: "Node.js Express Routes",
      description: "Understanding middleware functions",
      timestamp: "1 week ago",
      status: "resolved",
      icon: "❓"
    }
  ];

  const getStatusClass = (status: string) => {
    switch (status) {
      case "resolved":
      case "completed":
        return "status-success";
      case "pending":
        return "status-pending";
      default:
        return "status-default";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "resolved":
        return "Resolved";
      case "completed":
        return "Completed";
      case "pending":
        return "Pending";
      default:
        return status;
    }
  };

  return (
    <div className="activity-list">
      <h2 className="card-title">Recent Activity</h2>
      <div className="activities">
        {activities.map((activity) => (
          <div key={activity.id} className="activity-item">
            <div className="activity-icon">{activity.icon}</div>
            <div className="activity-content">
              <div className="activity-header">
                <h4 className="activity-title">{activity.title}</h4>
                <span className={`activity-status ${getStatusClass(activity.status)}`}>
                  {getStatusText(activity.status)}
                </span>
              </div>
              <p className="activity-description">{activity.description}</p>
              <span className="activity-timestamp">{activity.timestamp}</span>
            </div>
          </div>
        ))}
      </div>
      
      <button className="view-all-btn">
        View All Activity
      </button>
    </div>
  );
}