import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  FaSearch,
  FaCopy,
  FaSignOutAlt,
  FaPaperPlane,
  FaUserCircle,
  FaChalkboardTeacher,
  FaPlus,
  FaTrash
} from "react-icons/fa";
import bg from "../assets/smart-tutor-bg.png";
import "./AskDoubt.css";

const API_BASE = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";

export default function AskDoubt() {
  const [history, setHistory] = useState([]);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef(null);

  const headers = () => {
    const token = localStorage.getItem("access");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function fetchHistory() {
    try {
      const res = await axios.get(`${API_BASE}/api/doubts/history/`, {
        headers: headers(),
      });

      setHistory(Array.isArray(res.data.results) ? res.data.results : []);
    } catch (err) {
      console.error("History fetch error:", err);
      setHistory([]);
    }
  }

  function openHistoryItem(item) {
    setSelected(item.id);
    setMessages([
      { role: "user", text: item.question },
      { role: "bot", text: item.answer || "No answer stored." },
    ]);
  }

  async function handleSend(e) {
    e?.preventDefault?.();
    const text = input.trim();
    if (!text) return;

    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");
    setLoading(true);
    setTyping(true);

    try {
      const res = await axios.post(
        `${API_BASE}/api/doubts/`,
        { question: text },
        { headers: { ...headers(), "Content-Type": "application/json" } }
      );

      const answer = res.data.answer ?? "No answer returned.";
      setMessages((m) => [
        ...m.filter(x => !(x.role === 'bot' && x.text === '...thinking...')),
        { role: "bot", text: answer }
      ]);
      setSelected(res.data.id ?? null);
      fetchHistory();
    } catch (err) {
      console.error("Send error:", err);
      setMessages((m) => [
        ...m,
        { role: "bot", text: "❌ Failed to get an answer. Try again." }
      ]);
    } finally {
      setLoading(false);
      setTyping(false);
    }
  }

  function handleCopy(txt) {
    if (!navigator.clipboard) {
      alert("Clipboard not supported");
      return;
    }
    navigator.clipboard.writeText(txt).then(() => {
      const el = document.createElement("div");
      el.className = "st-copy-toast";
      el.innerText = "Copied!";
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 900);
    });
  }

  function handleLogout() {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    window.location.href = "/login";
  }

  // New Chat Feature
  function handleNewChat() {
    setMessages([]);
    setSelected(null);
  }

  // Delete History Feature
  async function handleDeleteHistory() {
    if (!window.confirm("Are you sure you want to delete all chat history?")) return;
    try {
      await axios.delete(`${API_BASE}/api/doubts/history/`, {
        headers: headers(),
      });
      setHistory([]);
      setMessages([]);
      setSelected(null);
    } catch (err) {
      console.error("Delete history error:", err);
      alert("Failed to delete history");
    }
  }

  const filtered = history.filter((h) =>
    h.question.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="st-root">
      {/* LEFT: History panel */}
      <aside className="st-left">
        <div className="st-left-top">
          <div className="st-brand">
            <FaChalkboardTeacher className="st-brand-icon" />
            <div className="st-brand-text">Smart Tutor</div>
          </div>
          <button className="st-logout" onClick={handleLogout} title="Logout">
            <FaSignOutAlt />
          </button>
        </div>

        <div className="st-actions">
          <button className="st-action-btn" onClick={handleNewChat} title="New Chat">
            <FaPlus /> New
          </button>
          <button className="st-action-btn" onClick={handleDeleteHistory} title="Delete History">
            <FaTrash /> Delete
          </button>
        </div>

        <div className="st-search">
          <FaSearch className="st-search-icon" />
          <input
            placeholder="Search history..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="st-history-list">
          {filtered.length === 0 ? (
            <div className="st-history-empty">No history yet</div>
          ) : (
            filtered.map((h) => (
              <button
                key={h.id}
                className={`st-history-item ${selected === h.id ? "selected" : ""}`}
                onClick={() => openHistoryItem(h)}
              >
                <div className="st-hi-left"><FaUserCircle /></div>
                <div className="st-hi-right">
                  <div className="st-hi-q">{h.question}</div>
                  <div className="st-hi-meta">{new Date(h.created_at).toLocaleString()}</div>
                </div>
              </button>
            ))
          )}
        </div>
      </aside>

      {/* RIGHT: Chat area */}
      <main className="st-right">
        <div
          className="st-bg"
          style={{ backgroundImage: `url(${bg})` }}
          aria-hidden="true"
        />
        <div className="st-overlay" />

        <section className="st-chat">
          <div className="st-messages" role="log" aria-live="polite">
            {messages.map((m, i) => (
              <div key={i} className={`st-msg ${m.role === "user" ? "user" : "bot"}`}>
                <div className="st-avatar">
                  {m.role === "user" ? <FaUserCircle /> : <FaChalkboardTeacher />}
                </div>
                <div className="st-bubble">
                  <div className="st-txt">{m.text}</div>
                  {m.role === "bot" && (
                    <button
                      className="st-copy"
                      onClick={() => handleCopy(m.text)}
                      aria-label="Copy answer"
                    >
                      <FaCopy />
                    </button>
                  )}
                </div>
              </div>
            ))}
            {typing && (
              <div className="st-msg bot typing">
                <div className="st-avatar"><FaChalkboardTeacher /></div>
                <div className="st-bubble">
                  <div className="st-typing-dots"><span /><span /><span /></div>
                </div>
              </div>
            )}
            <div ref={scrollRef} />
          </div>

          <form className="st-input-area" onSubmit={(e) => { e.preventDefault(); handleSend(); }}>
            <textarea
              className="st-input"
              placeholder="Ask your tutor..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={1}
            />
            <button className="st-send" type="submit" disabled={loading}>
              <FaPaperPlane />
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
