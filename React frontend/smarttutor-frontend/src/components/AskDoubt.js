import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AskDoubt.css";

export default function AskDoubt() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  // Fetch doubt history from backend
  const fetchHistory = async () => {
    try {
      const accessToken = localStorage.getItem("access_token"); // ✅ match with your login storage
      const res = await axios.get("http://127.0.0.1:8000/api/doubts/history/", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setHistory(res.data);
    } catch (err) {
      console.error("Failed to fetch history:", err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // Submit a new doubt
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return alert("Please enter your question!");

    setLoading(true);
    setAnswer("");

    try {
      const accessToken = localStorage.getItem("access_token");
      const response = await axios.post(
        "http://127.0.0.1:8000/api/doubts/",
        { question },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      setAnswer(response.data.answer || "No answer received.");
      setQuestion("");
      fetchHistory(); // Refresh history after adding new doubt
    } catch (error) {
      console.error(error);
      alert("❌ Failed to submit doubt. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="ask-page">
      <div className="ask-card">
        <h1>Ask a Doubt 🤔</h1>
        <p>Type your question below and get an instant AI answer!</p>

        <form onSubmit={handleSubmit}>
          <textarea
            placeholder="Enter your question here..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            rows={5}
          ></textarea>

          <button type="submit" disabled={loading}>
            {loading ? "Thinking..." : "Submit"}
          </button>
        </form>
      </div>

      {answer && (
        <div className="answer-box">
          <h3>AI Answer:</h3>
          <p>{answer}</p>
        </div>
      )}

      <div className="history">
        <h3>Previous Doubts</h3>
        {history.length === 0 ? (
          <p>No previous questions yet.</p>
        ) : (
          <ul>
            {history.map((item) => (
              <li key={item.id}>
                <strong>Q:</strong> {item.question} <br />
                <strong>A:</strong> {item.answer}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
