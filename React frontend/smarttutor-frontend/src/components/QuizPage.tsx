import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { ChevronRight, RotateCcw, Home, Trophy, CheckCircle, XCircle, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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

type QuizState = 'setup' | 'in_progress' | 'results';

const PREDEFINED_TOPICS = [
  'Python',
  'Django',
  'JavaScript',
  'React',
  'TypeScript',
  'Node.js',
  'HTML & CSS',
  'SQL',
  'Data Structures',
  'Algorithms'
];

const QuizPage = () => {
  const [quizState, setQuizState] = useState<QuizState>('setup');
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [customTopic, setCustomTopic] = useState<string>('');
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [results, setResults] = useState<QuizResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [showingResults, setShowingResults] = useState(false);
  
  const { toast } = useToast();
  const navigate = useNavigate();

  const generateQuiz = async () => {
    const topic = customTopic.trim() || selectedTopic;
    if (!topic) {
      toast({
        title: "Error",
        description: "Please select or enter a topic",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // Simulate API call - replace with actual API endpoint
      const response = await fetch('/api/quiz/generate/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate quiz');
      }

      const quizData: Quiz = await response.json();
      setQuiz(quizData);
      setQuizState('in_progress');
      setCurrentQuestionIndex(0);
      setAnswers([]);
      setSelectedAnswer('');
      
      toast({
        title: "Quiz Generated!",
        description: `${quizData.title} with ${quizData.questions.length} questions`,
      });
    } catch (error) {
      // For demo purposes, create a mock quiz
      const mockQuiz: Quiz = {
        quiz_id: Math.floor(Math.random() * 1000),
        title: `${topic} Basics Quiz`,
        questions: [
          {
            id: 1,
            text: `What is a key concept in ${topic}?`,
            options: ["Option A", "Option B", "Option C", "Option D"]
          },
          {
            id: 2,
            text: `Which of the following is true about ${topic}?`,
            options: ["Statement 1", "Statement 2", "Statement 3", "Statement 4"]
          },
          {
            id: 3,
            text: `What is the best practice when working with ${topic}?`,
            options: ["Practice A", "Practice B", "Practice C", "Practice D"]
          }
        ]
      };
      
      setQuiz(mockQuiz);
      setQuizState('in_progress');
      setCurrentQuestionIndex(0);
      setAnswers([]);
      setSelectedAnswer('');
      
      toast({
        title: "Demo Quiz Generated!",
        description: `${mockQuiz.title} with ${mockQuiz.questions.length} questions`,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const nextQuestion = () => {
    if (!selectedAnswer) {
      toast({
        title: "Please select an answer",
        description: "You must choose an option before continuing",
        variant: "destructive"
      });
      return;
    }

    const newAnswer: Answer = {
      question: quiz!.questions[currentQuestionIndex].id,
      answer: selectedAnswer
    };

    const updatedAnswers = [...answers, newAnswer];
    setAnswers(updatedAnswers);

    if (currentQuestionIndex < quiz!.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer('');
    } else {
      submitQuiz(updatedAnswers);
    }
  };

  const submitQuiz = async (finalAnswers: Answer[]) => {
    setLoading(true);
    try {
      // Simulate API call - replace with actual API endpoint
      const response = await fetch('/api/quiz/submit/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quiz_id: quiz!.quiz_id,
          answers: finalAnswers
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit quiz');
      }

      const resultsData: QuizResults = await response.json();
      setResults(resultsData);
    } catch (error) {
      // For demo purposes, create mock results
      const mockResults: QuizResults = {
        score: Math.floor(Math.random() * finalAnswers.length) + 1,
        total: finalAnswers.length,
        correct_answers: finalAnswers.slice(0, Math.floor(finalAnswers.length * 0.7)),
        explanations: {
          1: "This is the correct answer because...",
          2: "The right choice is this one due to...",
          3: "This answer is correct as it demonstrates..."
        }
      };
      setResults(mockResults);
    } finally {
      setLoading(false);
      setQuizState('results');
      setShowingResults(true);
    }
  };

  const retryQuiz = () => {
    setQuizState('setup');
    setQuiz(null);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setSelectedAnswer('');
    setResults(null);
    setShowingResults(false);
  };

  const backToDashboard = () => {
    navigate('/');
  };

  const progressPercentage = quiz ? ((currentQuestionIndex + 1) / quiz.questions.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
            Quiz Master
          </h1>
          <p className="text-muted-foreground">Test your knowledge and improve your skills</p>
        </div>

        {/* Setup Phase */}
        {quizState === 'setup' && (
          <Card className="quiz-card animate-fade-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-primary" />
                Choose Your Quiz Topic
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="topic-select">Select a topic</Label>
                <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                  <SelectTrigger id="topic-select">
                    <SelectValue placeholder="Choose from popular topics..." />
                  </SelectTrigger>
                  <SelectContent>
                    {PREDEFINED_TOPICS.map((topic) => (
                      <SelectItem key={topic} value={topic}>
                        {topic}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="text-center text-muted-foreground">
                <span>or</span>
              </div>

              <div className="space-y-2">
                <Label htmlFor="custom-topic">Enter a custom topic</Label>
                <Input
                  id="custom-topic"
                  placeholder="Type your own topic..."
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                />
              </div>

              <Button 
                onClick={generateQuiz} 
                disabled={loading || (!selectedTopic && !customTopic.trim())}
                className="w-full bg-gradient-primary hover:opacity-90 h-12 text-lg font-semibold"
              >
                {loading ? (
                  <div className="animate-quiz-pulse">Generating Quiz...</div>
                ) : (
                  <>
                    Start Quiz
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Quiz In Progress */}
        {quizState === 'in_progress' && quiz && (
          <div className="space-y-6 animate-slide-in">
            {/* Progress Bar */}
            <Card className="quiz-card">
              <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    Question {currentQuestionIndex + 1} of {quiz.questions.length}
                  </span>
                  <span className="text-sm font-medium text-primary">
                    {Math.round(progressPercentage)}%
                  </span>
                </div>
                <Progress value={progressPercentage} className="progress-bar" />
              </CardContent>
            </Card>

            {/* Current Question */}
            <Card className="quiz-card">
              <CardHeader>
                <CardTitle className="text-xl leading-relaxed">
                  {quiz.questions[currentQuestionIndex].text}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {quiz.questions[currentQuestionIndex].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(option)}
                    className={`quiz-option ${selectedAnswer === option ? 'selected' : ''}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${
                        selectedAnswer === option 
                          ? 'border-primary bg-primary' 
                          : 'border-border'
                      }`}>
                        {selectedAnswer === option && (
                          <div className="w-full h-full rounded-full bg-primary-foreground scale-50" />
                        )}
                      </div>
                      <span className="text-left">{option}</span>
                    </div>
                  </button>
                ))}

                <Button 
                  onClick={nextQuestion}
                  disabled={!selectedAnswer || loading}
                  className="w-full mt-6 bg-gradient-primary hover:opacity-90 h-12"
                >
                  {currentQuestionIndex === quiz.questions.length - 1 ? 
                    'Submit Quiz' : 'Next Question'}
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Results Phase */}
        {quizState === 'results' && results && showingResults && (
          <div className="space-y-6 animate-fade-up">
            {/* Score Card */}
            <Card className="quiz-card text-center">
              <CardContent className="pt-6">
                <div className="mb-6">
                  <Trophy className="h-16 w-16 text-primary mx-auto mb-4" />
                  <h2 className="text-3xl font-bold mb-2">Quiz Complete!</h2>
                  <div className="text-6xl font-bold bg-gradient-success bg-clip-text text-transparent mb-2">
                    {results.score}/{results.total}
                  </div>
                  <p className="text-xl text-muted-foreground">
                    {((results.score / results.total) * 100).toFixed(0)}% Score
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-4 rounded-lg bg-success/10 border border-success/20">
                    <CheckCircle className="h-8 w-8 text-success mx-auto mb-2" />
                    <div className="text-2xl font-bold text-success">{results.score}</div>
                    <div className="text-sm text-success-foreground">Correct</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                    <XCircle className="h-8 w-8 text-destructive mx-auto mb-2" />
                    <div className="text-2xl font-bold text-destructive">
                      {results.total - results.score}
                    </div>
                    <div className="text-sm text-destructive-foreground">Incorrect</div>
                  </div>
                </div>

                <div className="flex gap-4 justify-center">
                  <Button 
                    onClick={retryQuiz} 
                    variant="outline" 
                    className="flex items-center gap-2"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Retry Quiz
                  </Button>
                  <Button 
                    onClick={backToDashboard}
                    className="bg-gradient-primary hover:opacity-90 flex items-center gap-2"
                  >
                    <Home className="h-4 w-4" />
                    Back to Dashboard
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Explanations */}
            {results.explanations && (
              <Card className="quiz-card">
                <CardHeader>
                  <CardTitle>Answer Explanations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(results.explanations).map(([questionId, explanation]) => (
                    <div key={questionId} className="p-4 rounded-lg bg-muted/50 border border-border/30">
                      <div className="font-medium mb-2">Question {questionId}:</div>
                      <p className="text-muted-foreground">{explanation}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizPage;