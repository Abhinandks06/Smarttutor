import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home.js";
import Register from "./components/Register.js";
import Login from "./components/Login.js";
import About from "./components/About.js";
import Dashboard from "./components/Dashboard.tsx";

import AskDoubt from "./components/AskDoubt.js"; // assuming you have it
import ProtectedRoute from "./components/ProtectedRoute.js";

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
