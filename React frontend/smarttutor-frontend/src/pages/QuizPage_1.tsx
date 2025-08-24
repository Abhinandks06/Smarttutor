// src/pages/QuizPage.tsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Icons
import { Trophy } from "lucide-react";

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
}

type QuizState = "setup" | "in_progress" | "results";

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

  const navigate = useNavigate();

  // Generate Quiz (mock)
  const generateQuiz = async () => {
    const topic = customTopic.trim() || selectedTopic;
    if (!topic) {
      alert("Please select or enter a topic");
      return;
    }

    setLoading(true);
    try {
      const mockQuiz: Quiz = {
        quiz_id: Math.floor(Math.random() * 1000),
        title: `${topic} Basics Quiz`,
        questions: [
          { id: 1, text: `What is a key concept in ${topic}?`, options: ["Option A", "Option B", "Option C", "Option D"] },
          { id: 2, text: `Which of the following is true about ${topic}?`, options: ["Statement 1", "Statement 2", "Statement 3", "Statement 4"] },
        ],
      };
      setQuiz(mockQuiz);
      setQuizState("in_progress");
    } finally {
      setLoading(false);
      setCurrentQuestionIndex(0);
      setAnswers([]);
      setSelectedAnswer("");
    }
  };

  const nextQuestion = () => {
    if (!quiz) return;
    if (!selectedAnswer) {
      alert("Pick an answer before continuing");
      return;
    }

    const updatedAnswers = [...answers, { question: quiz.questions[currentQuestionIndex].id, answer: selectedAnswer }];
    setAnswers(updatedAnswers);

    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer("");
    } else {
      // mock results
      const mockResults: QuizResults = {
        score: Math.floor(Math.random() * updatedAnswers.length) + 1,
        total: updatedAnswers.length,
        correct_answers: updatedAnswers.slice(0, Math.floor(updatedAnswers.length * 0.7)),
      };
      setResults(mockResults);
      setQuizState("results");
    }
  };

  const retryQuiz = () => {
    setQuizState("setup");
    setQuiz(null);
    setAnswers([]);
    setSelectedAnswer("");
    setResults(null);
  };

  const backToDashboard = () => navigate("/dashboard");

  const progressPercentage = quiz ? ((currentQuestionIndex + 1) / quiz.questions.length) * 100 : 0;

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-3xl font-bold text-center mb-6">Quiz Master</h1>

      {/* Setup Screen */}
      {quizState === "setup" && (
        <div className="max-w-md mx-auto bg-white shadow rounded p-6">
          <h2 className="text-xl font-semibold mb-4">Choose a Quiz Topic</h2>
          <select
            className="w-full border rounded p-2 mb-4"
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
          >
            <option value="">-- Pick a topic --</option>
            {PREDEFINED_TOPICS.map((topic) => (
              <option key={topic} value={topic}>
                {topic}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Or enter your own..."
            className="w-full border rounded p-2 mb-4"
            value={customTopic}
            onChange={(e) => setCustomTopic(e.target.value)}
          />
          <button
            onClick={generateQuiz}
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            {loading ? "Loading..." : "Start Quiz"}
          </button>
        </div>
      )}

      {/* Quiz In Progress */}
      {quizState === "in_progress" && quiz && (
        <div className="max-w-md mx-auto bg-white shadow rounded p-6">
          <h2 className="text-xl font-semibold mb-4">
            Question {currentQuestionIndex + 1}/{quiz.questions.length}
          </h2>
          <p className="mb-4">{quiz.questions[currentQuestionIndex].text}</p>
          {quiz.questions[currentQuestionIndex].options.map((opt, i) => (
            <button
              key={i}
              onClick={() => setSelectedAnswer(opt)}
              className={`w-full text-left border p-2 mb-2 rounded ${
                selectedAnswer === opt ? "bg-blue-200" : "hover:bg-gray-100"
              }`}
            >
              {opt}
            </button>
          ))}

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded h-2 my-4">
            <div className="bg-blue-500 h-2 rounded" style={{ width: `${progressPercentage}%` }}></div>
          </div>

          <button
            onClick={nextQuestion}
            className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
          >
            {currentQuestionIndex === quiz.questions.length - 1 ? "Submit Quiz" : "Next"}
          </button>
        </div>
      )}

      {/* Results Screen */}
      {quizState === "results" && results && (
        <div className="max-w-md mx-auto bg-white shadow rounded p-6 text-center">
          <Trophy className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
          <h2 className="text-xl font-bold mb-2">
            Your Score: {results.score}/{results.total}
          </h2>
          <div className="flex gap-4 justify-center mt-4">
            <button
              onClick={retryQuiz}
              className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
            >
              Retry
            </button>
            <button
              onClick={backToDashboard}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizPage;
