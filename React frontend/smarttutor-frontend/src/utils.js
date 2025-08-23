// src/utils.js

// Change this if your Django backend runs on another host/port
export const API_BASE = "http://127.0.0.1:8000";

// Return headers with JWT token (from localStorage)
export function headers() {
  const token = localStorage.getItem("access");
  return token
    ? { Authorization: `Bearer ${token}` }
    : {};
}

// Optional: handle refresh token (SimpleJWT)
// Call this before making requests if you want auto-refresh
export async function refreshTokenIfNeeded() {
  const token = localStorage.getItem("access");
  const refresh = localStorage.getItem("refresh");

  if (!token || !refresh) return false;

  // decode token expiry
  const [, payload] = token.split(".");
  const { exp } = JSON.parse(atob(payload));
  const isExpired = Date.now() >= exp * 1000;

  if (isExpired) {
    try {
      const res = await fetch(`${API_BASE}/api/token/refresh/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh }),
      });
      if (!res.ok) throw new Error("Refresh failed");
      const data = await res.json();
      localStorage.setItem("access", data.access);
      return true;
    } catch (err) {
      console.error("Token refresh failed", err);
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      return false;
    }
  }

  return true;
}
