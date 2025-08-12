import React, { useEffect, useState } from "react";
import axios from "axios";
import "./DoubtHistory.css";

const API_BASE = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";

export default function DoubtHistory() {
  const [doubts, setDoubts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // initial load
    fetchPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchPage(p = 1) {
    setLoading(true);
    try {
      const token = localStorage.getItem("access");
      const res = await axios.get(`${API_BASE}/api/doubts/history/?page=${p}&page_size=8`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = res.data;
      if (p === 1) setDoubts(data.results);
      else setDoubts((prev) => [...prev, ...data.results]);
      setPage(data.page);
      setHasMore(data.has_more);
    } catch (err) {
      console.error("Failed to fetch history:", err);
    } finally {
      setLoading(false);
    }
  }

  function handleLoadMore() {
    if (hasMore) fetchPage(page + 1);
  }

  return (
    <div className="st-history-container">
      <h2 className="st-history-title">My Doubt History</h2>
      {doubts.length === 0 && !loading && <p className="st-empty">No doubts asked yet.</p>}
      <div className="st-history-list">
        {doubts.map((item) => (
          <div className="st-history-card" key={item.id}>
            <div className="st-history-question">❓ {item.question}</div>
            <div className="st-history-answer">💡 {item.answer}</div>
            <div className="st-history-meta">{new Date(item.created_at).toLocaleString()}</div>
          </div>
        ))}
      </div>

      {loading && <div className="st-loading">Loading...</div>}

      {hasMore && !loading && (
        <div className="st-load-more-wrap">
          <button className="st-load-more-btn" onClick={handleLoadMore}>Load more</button>
        </div>
      )}
    </div>
  );
}
