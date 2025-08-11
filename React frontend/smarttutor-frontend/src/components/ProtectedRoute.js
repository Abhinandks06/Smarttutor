import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const accessToken = localStorage.getItem("access");

  if (!accessToken) {
    return <Navigate to="/?unauthorized=true" replace />;
  }

  return children;
}
