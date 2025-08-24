// src/pages/QuizPage.tsx
import React, { useState } from "react";
import "./quiz.css";

type QuizState = "setup" | "in_progress" | "results";

interface Question {
  id: number;
  text: string;
  options: string[];
}

interface Quiz {
  quiz_id: number;
  title: string;
  questions: Question[];
}

interface Answer {
  question: number;
  answer: string;
}

interface QuizResults {
  score: number;
  total: number;
  correct_answers: Answer[];
  explanations?: { [key: number]: string };
}

const PREDEFINED_TOPICS = [
  "Python",
  "Django",
  "JavaScript",
  "React",
  "TypeScript",
  "Node.js",
  "HTML & CSS",
  "SQL",
  "Data Structures",
  "Algorithms",
];

const QuizPage: React.FC = () => {
  const [quizState, setQuizState] = useState<QuizState>("setup");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [customTopic, setCustomTopic] = useState("");
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [results, setResults] = useState<QuizResults | null>(null);
  const [loading, setLoading] = useState(false);

  const topic = (customTopic.trim() || selectedTopic).trim();

  const generateQuiz = async () => {
    if (!topic) {
      alert("Please select or enter a topic");
      return;
    }
    setLoading(true);
    try {
      // Call your backend if available:
      const response = await fetch("/api/quiz/generate/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      });

      if (!response.ok) throw new Error("Backend not reachable");

      const quizData: Quiz = await response.json();
      setQuiz(quizData);
      setQuizState("in_progress");
      setCurrentQuestionIndex(0);
      setAnswers([]);
      setSelectedAnswer("");
    } catch (e) {
      // Fallback mock quiz so page works without backend
      const mockQuiz: Quiz = {
        quiz_id: Math.floor(Math.random() * 100000),
        title: `${topic} Basics Quiz`,
        questions: [
          { id: 1, text: `What is a key concept in ${topic}?`, options: ["Option A", "Option B", "Option C", "Option D"] },
          { id: 2, text: `Which statement is true about ${topic}?`, options: ["Statement 1", "Statement 2", "Statement 3", "Statement 4"] },
          { id: 3, text: `Best practice when working with ${topic}?`, options: ["Practice A", "Practice B", "Practice C", "Practice D"] }
        ]
      };
      setQuiz(mockQuiz);
      setQuizState("in_progress");
      setCurrentQuestionIndex(0);
      setAnswers([]);
      setSelectedAnswer("");
    } finally {
      setLoading(false);
    }
  };

  const nextQuestion = () => {
    if (!quiz) return;
    if (!selectedAnswer) {
      alert("Please select an option");
      return;
    }
    const updatedAnswers = [...answers, { question: quiz.questions[currentQuestionIndex].id, answer: selectedAnswer }];
    setAnswers(updatedAnswers);

    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer("");
    } else {
      submitQuiz(updatedAnswers);
    }
  };

  const submitQuiz = async (finalAnswers: Answer[]) => {
    setLoading(true);
    try {
      const response = await fetch("/api/quiz/submit/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quiz_id: quiz?.quiz_id, answers: finalAnswers }),
      });

      if (!response.ok) throw new Error("Backend not reachable");

      const resultsData: QuizResults = await response.json();
      setResults(resultsData);
    } catch (e) {
      // Mock results
      const score = Math.floor(Math.random() * (finalAnswers.length + 1));
      setResults({
        score,
        total: finalAnswers.length,
        correct_answers: finalAnswers.slice(0, Math.max(0, score)),
        explanations: { 1: "Because reasons.", 2: "See docs.", 3: "By definition." },
      });
    } finally {
      setLoading(false);
      setQuizState("results");
    }
  };

  const retryQuiz = () => {
    setQuizState("setup");
    setQuiz(null);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setSelectedAnswer("");
    setResults(null);
  };

  const progressPct = quiz ? Math.round(((currentQuestionIndex + 1) / quiz.questions.length) * 100) : 0;

  return (
    <div className="quiz-root">
      <div className="quiz-container">
        <h1 className="quiz-title">Quiz Master</h1>
        <p className="quiz-subtitle">Test your knowledge and improve your skills</p>

        {quizState === "setup" && (
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Choose Your Quiz Topic</h2>
            </div>
            <div className="card-content">
              <label className="label" htmlFor="topic-select">Select a topic</label>
              <select
                id="topic-select"
                className="select"
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
              >
                <option value="">-- Choose from popular topics --</option>
                {PREDEFINED_TOPICS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>

              <div className="or">or</div>

              <label className="label" htmlFor="custom-topic">Enter a custom topic</label>
              <input
                id="custom-topic"
                className="input"
                placeholder="Type your own topic..."
                value={customTopic}
                onChange={(e) => setCustomTopic(e.target.value)}
              />

              <button
                className="btn primary full"
                onClick={generateQuiz}
                disabled={loading || !topic}
              >
                {loading ? "Generating Quiz..." : "Start Quiz"}
              </button>
            </div>
          </div>
        )}

        {quizState === "in_progress" && quiz && (
          <div className="stack">
            <div className="card">
              <div className="card-content">
                <div className="progress-row">
                  <span className="muted">Question {currentQuestionIndex + 1} of {quiz.questions.length}</span>
                  <span className="primary">{progressPct}%</span>
                </div>
                <div className="progress">
                  <div className="progress-bar" style={{ width: `${progressPct}%` }} />
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h3 className="card-title">{quiz.questions[currentQuestionIndex].text}</h3>
              </div>
              <div className="card-content">
                {quiz.questions[currentQuestionIndex].options.map((opt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`option ${selectedAnswer === opt ? "selected" : ""}`}
                    onClick={() => setSelectedAnswer(opt)}
                  >
                    <span>{opt}</span>
                  </button>
                ))}
                <button
                  className="btn primary full mt"
                  onClick={nextQuestion}
                  disabled={!selectedAnswer || loading}
                >
                  {currentQuestionIndex === quiz.questions.length - 1 ? "Submit Quiz" : "Next Question"}
                </button>
              </div>
            </div>
          </div>
        )}

        {quizState === "results" && results && (
          <div className="stack">
            <div className="card center">
              <div className="card-content">
                <div className="trophy">🏆</div>
                <h2 className="score-title">Quiz Complete!</h2>
                <div className="score">
                  {results.score}/{results.total}
                </div>
                <p className="muted">{Math.round((results.score / results.total) * 100)}% Score</p>

                <div className="results-grid">
                  <div className="pill success">
                    <div className="pill-value">{results.score}</div>
                    <div className="pill-label">Correct</div>
                  </div>
                  <div className="pill danger">
                    <div className="pill-value">{results.total - results.score}</div>
                    <div className="pill-label">Incorrect</div>
                  </div>
                </div>

                <div className="actions">
                  <button className="btn outline" onClick={retryQuiz}>Retry Quiz</button>
                  <a className="btn primary" href="/dashboard">Back to Dashboard</a>
                </div>
              </div>
            </div>

            {results.explanations && (
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Answer Explanations</h3>
                </div>
                <div className="card-content">
                  {Object.entries(results.explanations).map(([qid, text]) => (
                    <div key={qid} className="explanation">
                      <div className="explanation-q">Question {qid}</div>
                      <div className="explanation-a">{text}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizPage;
