import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Register from "./components/Register";
import Login from "./components/Login";
import About from "./components/About";
import Dashboard from "./components/Dashboard";
import AskDoubt from "./components/AskDoubt"; // assuming you have it
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />

        {/* Protected routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />

        <Route path="/ask" element={
          <ProtectedRoute>
            <AskDoubt />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}
