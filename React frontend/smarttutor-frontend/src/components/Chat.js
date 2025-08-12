import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  FaSearch,
  FaCopy,
  FaSignOutAlt,
  FaPaperPlane,
  FaUserCircle,
  FaChalkboardTeacher,
} from "react-icons/fa";
import bg from "../assets/smart-tutor-bg.png"; // <- ensure this path & filename match
import "./Chat.css";

const API_BASE = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";

export default function Chat() {
  const [history, setHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [selected, setSelected] = useState(null); // selected history id
  const [messages, setMessages] = useState([]); // { role: 'user'|'bot', text, timestamp }
  const [q, setQ] = useState("");
  const [search, setSearch] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  // helper for auth headers
  const authHeaders = () => {
    const token = localStorage.getItem("access");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    setFilteredHistory(
      history.filter((h) =>
        h.question.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [history, search]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  async function fetchHistory() {
    try {
      const res = await axios.get(`${API_BASE}/api/doubts/history/`, {
        headers: authHeaders(),
      });
      setHistory(res.data);
    } catch (err) {
      console.error("fetchHistory error:", err);
      // optionally show UI feedback
    }
  }

  function openHistoryItem(item) {
    setSelected(item.id);
    setMessages([
      { role: "user", text: item.question, timestamp: item.created_at },
      { role: "bot", text: item.answer || "No answer stored.", timestamp: item.created_at },
    ]);
  }

  async function handleSend(e) {
    e?.preventDefault?.();
    const txt = q.trim();
    if (!txt) return;

    // Optimistic UI: show user message immediately
    const now = new Date().toISOString();
    setMessages((m) => [...m, { role: "user", text: txt, timestamp: now }]);
    setQ("");
    setIsTyping(true);
    setLoading(true);

    try {
      const res = await axios.post(
        `${API_BASE}/api/doubts/`,
        { question: txt },
        { headers: { ...authHeaders(), "Content-Type": "application/json" } }
      );

      // Add tutor answer
      const answer = res.data.answer ?? "No answer returned.";
      const ts = res.data.created_at ?? new Date().toISOString();

      // remove any temporary typing placeholder and append bot answer
      setMessages((m) => [...m.filter(x => !(x.role==='bot' && x.text==='...typing...')), { role: "bot", text: answer, timestamp: ts }]);

      // refresh history
      fetchHistory();
      setSelected(res.data.id ?? null);
    } catch (err) {
      console.error("send error:", err);
      setMessages((m) => [...m, { role: "bot", text: "❌ Failed to get answer. Try again.", timestamp: new Date().toISOString() }]);
    } finally {
      setIsTyping(false);
      setLoading(false);
    }
  }

  function handleCopy(text) {
    if (!navigator.clipboard) {
      alert("Clipboard not supported");
      return;
    }
    navigator.clipboard.writeText(text).then(() => {
      const el = document.createElement("div");
      el.className = "ct-copy-toast";
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

  return (
    <div className="ct-root">
      {/* LEFT: History */}
      <aside className="ct-left">
        <div className="ct-left-top">
          <div className="ct-brand">
            <FaChalkboardTeacher className="ct-brand-icon" />
            <div className="ct-brand-text">
              <strong>Smart</strong>
              <span>Tutor</span>
            </div>
          </div>
          <button className="ct-logout" onClick={handleLogout} title="Logout">
            <FaSignOutAlt />
          </button>
        </div>

        <div className="ct-search">
          <FaSearch className="ct-search-icon" />
          <input
            placeholder="Search history..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="ct-history-list">
          {filteredHistory.length === 0 ? (
            <div className="ct-empty">No history yet</div>
          ) : (
            filteredHistory.map((h) => (
              <button
                key={h.id}
                className={`ct-history-item ${selected === h.id ? "selected" : ""}`}
                onClick={() => openHistoryItem(h)}
              >
                <div className="ct-hi-left"><FaUserCircle /></div>
                <div className="ct-hi-right">
                  <div className="ct-hi-q">{h.question}</div>
                  <div className="ct-hi-meta">{new Date(h.created_at).toLocaleString()}</div>
                </div>
              </button>
            ))
          )}
        </div>
      </aside>

      {/* RIGHT: Chat (with background image only) */}
      <main className="ct-right">
        <div className="ct-bg" style={{ backgroundImage: `url(${bg})` }} />

        {/* overlay made subtle so bg is visible */}
        <div className="ct-overlay" />

        <section className="ct-chat">
          <header className="ct-chat-header">
            <div>
              <div className="ct-chat-title">Tutor</div>
              <div className="ct-chat-sub">Friendly explanations • All ages</div>
            </div>
          </header>

          <div className="ct-messages" role="log" aria-live="polite">
            {messages.map((m, idx) => (
              <div key={idx} className={`ct-msg ${m.role === "user" ? "user" : "bot"}`}>
                <div className="ct-avatar">{m.role === "user" ? <FaUserCircle /> : <FaChalkboardTeacher />}</div>

                <div className="ct-bubble">
                  <div className="ct-text">{m.text}</div>

                  {m.role === "bot" && (
                    <button className="ct-copy" onClick={() => handleCopy(m.text)} title="Copy answer">
                      <FaCopy />
                    </button>
                  )}

                  <div className="ct-ts">
                    {m.timestamp ? new Date(m.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="ct-msg bot typing">
                <div className="ct-avatar"><FaChalkboardTeacher /></div>
                <div className="ct-bubble">
                  <div className="ct-typing-dots">
                    <span /><span /><span />
                  </div>
                </div>
              </div>
            )}

            <div ref={endRef} />
          </div>

          <form className="ct-input-area" onSubmit={(e) => { e.preventDefault(); handleSend(); }}>
            <textarea
              className="ct-input"
              placeholder="Type your question..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              rows={1}
            />
            <button className="ct-send" type="submit" disabled={loading}>
              <FaPaperPlane />
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
