import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";

interface Quiz {
  id: string;
  title: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  questions: QuizQuestion[];
  category: string;
}

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface UserQuizAttempt {
  id: string;
  quiz_id: string;
  score: number;
  completed_at: string;
}

export default function Quiz() {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isQuizMode, setIsQuizMode] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadQuizzes();
  }, []);

  const loadQuizzes = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    
    try {
      setError("");
      
      // Load quizzes from Supabase
      const { data: quizzesData, error: quizzesError } = await supabase
        .from('quizzes')
        .select('*')
        .order('created_at', { ascending: true });
        
      if (quizzesError) {
        throw quizzesError;
      }
      
      // Transform and use Supabase data if available, otherwise use mock data
      if (quizzesData && quizzesData.length > 0) {
        const transformedQuizzes: Quiz[] = quizzesData.map(quiz => ({
          id: quiz.id,
          title: quiz.title,
          description: quiz.description,
          difficulty: quiz.difficulty || "easy",
          category: quiz.category || "general",
          questions: quiz.questions || []
        }));
        setQuizzes(transformedQuizzes);
      } else {
        // Use mock data as fallback
        const mockQuizzes: Quiz[] = [
          {
            id: "1",
            title: "🌿 Plant Kingdom Basics",
            description: "Test your knowledge of plants and their amazing features!",
            difficulty: "easy",
            category: "botany",
            questions: [
              {
                id: "q1",
                question: "What do plants need to make their own food?",
                options: ["Sunlight, water, and carbon dioxide", "Only water", "Only sunlight", "Soil and rocks"],
                correctAnswer: 0
              },
              {
                id: "q2",
                question: "Which part of the plant absorbs water from the soil?",
                options: ["Leaves", "Flowers", "Roots", "Stem"],
                correctAnswer: 2
              }
            ]
          },
          {
            id: "2",
            title: "🦋 Amazing Insects",
            description: "Discover fascinating facts about the world of insects!",
            difficulty: "medium",
            category: "entomology",
            questions: [
              {
                id: "q3",
                question: "How many legs do insects have?",
                options: ["4", "6", "8", "10"],
                correctAnswer: 1
              },
              {
                id: "q4",
                question: "What is the process called when a caterpillar becomes a butterfly?",
                options: ["Evolution", "Metamorphosis", "Transformation", "Migration"],
                correctAnswer: 1
              }
            ]
          }
        ];
        
        setQuizzes(mockQuizzes);
      }
      
    } catch (err: any) {
      setError(err.message || "Failed to load quizzes");
      console.error('Error loading quizzes:', err);
      
      // Fallback to mock data
      const mockQuizzes: Quiz[] = [
        {
          id: "1",
          title: "🌿 Plant Kingdom Basics",
          description: "Test your knowledge of plants and their amazing features!",
          difficulty: "easy",
          category: "botany",
          questions: [
            {
              id: "q1",
              question: "What do plants need to make their own food?",
              options: ["Sunlight, water, and carbon dioxide", "Only water", "Only sunlight", "Soil and rocks"],
              correctAnswer: 0
            },
            {
              id: "q2",
              question: "Which part of the plant absorbs water from the soil?",
              options: ["Leaves", "Flowers", "Roots", "Stem"],
              correctAnswer: 2
            }
          ]
        },
        {
          id: "2",
          title: "🦋 Amazing Insects",
          description: "Discover fascinating facts about the world of insects!",
          difficulty: "medium",
          category: "entomology",
          questions: [
            {
              id: "q3",
              question: "How many legs do insects have?",
              options: ["4", "6", "8", "10"],
              correctAnswer: 1
            },
            {
              id: "q4",
              question: "What is the process called when a caterpillar becomes a butterfly?",
              options: ["Evolution", "Metamorphosis", "Transformation", "Migration"],
              correctAnswer: 1
            }
          ]
        }
      ];
      
      setQuizzes(mockQuizzes);
    } finally {
      setLoading(false);
    }
  };

  const startQuiz = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setIsQuizMode(true);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = async () => {
    if (selectedAnswer === null || !selectedQuiz) return;

    if (selectedAnswer === selectedQuiz.questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }

    if (currentQuestion + 1 < selectedQuiz.questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      setShowResult(true);
      
      // Save attempt to Supabase user_quiz_attempts table
      if (user && selectedQuiz) {
        try {
          const { error: attemptError } = await supabase
            .from('user_quiz_attempts')
            .insert({
              user_id: user.id,
              quiz_id: selectedQuiz.id,
              score: Math.round((score / selectedQuiz.questions.length) * 100),
              completed_at: new Date().toISOString()
            });
            
          if (attemptError) {
            console.warn('Could not save quiz attempt:', attemptError);
          }
        } catch (err) {
          console.warn('Error saving quiz attempt:', err);
        }
      }
    }
  };

  const resetQuiz = () => {
    setIsQuizMode(false);
    setSelectedQuiz(null);
    setShowResult(false);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "bg-nature text-white";
      case "medium": return "bg-sunny text-black";
      case "hard": return "bg-coral text-white";
      default: return "bg-gray-500 text-white";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen magic-gradient py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading quizzes...</p>
        </div>
      </div>
    );
  }

  if (showResult && selectedQuiz) {
    const percentage = Math.round((score / selectedQuiz.questions.length) * 100);
    return (
      <div className="min-h-screen magic-gradient py-12">
        <div className="container mx-auto px-6 max-w-2xl">
          <Card className="backdrop-blur-sm bg-white/95 border-nature/20 shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-fredoka text-forest">
                🎉 Quiz Complete!
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-6xl mb-4">
                {percentage >= 90 ? "🏆" : percentage >= 70 ? "⭐" : "👍"}
              </div>
              <div className="text-2xl font-fredoka text-forest mb-2">
                Your Score: {score} / {selectedQuiz.questions.length}
              </div>
              <div className="text-lg text-forest/80 mb-6">
                {percentage}% Correct
              </div>
              <div className="space-y-3">
                <Button 
                  onClick={() => startQuiz(selectedQuiz)}
                  className="bg-nature hover:bg-forest text-white mr-4"
                  data-testid="button-retry"
                >
                  🔄 Try Again
                </Button>
                <Button 
                  onClick={resetQuiz}
                  variant="outline"
                  className="border-nature text-nature hover:bg-nature hover:text-white"
                  data-testid="button-back-to-quizzes"
                >
                  📚 Back to Quizzes
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isQuizMode && selectedQuiz) {
    const currentQ = selectedQuiz.questions[currentQuestion];
    const progress = ((currentQuestion + 1) / selectedQuiz.questions.length) * 100;

    return (
      <div className="min-h-screen magic-gradient py-12">
        <div className="container mx-auto px-6 max-w-2xl">
          <Card className="backdrop-blur-sm bg-white/95 border-nature/20 shadow-xl">
            <CardHeader>
              <div className="flex justify-between items-center mb-4">
                <CardTitle className="text-xl font-fredoka text-forest">
                  {selectedQuiz.title}
                </CardTitle>
                <Button 
                  onClick={resetQuiz}
                  variant="outline"
                  size="sm"
                  data-testid="button-exit-quiz"
                >
                  ❌ Exit
                </Button>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-forest/70">
                  <span>Question {currentQuestion + 1} of {selectedQuiz.questions.length}</span>
                  <span>Score: {score}</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <h3 className="text-lg font-medium text-forest mb-4">
                  {currentQ.question}
                </h3>
                <div className="space-y-3">
                  {currentQ.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                        selectedAnswer === index
                          ? 'border-nature bg-nature/10 text-forest'
                          : 'border-gray-200 hover:border-nature/50 text-forest/80'
                      }`}
                      data-testid={`button-answer-${index}`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
              <Button
                onClick={handleNextQuestion}
                disabled={selectedAnswer === null}
                className="w-full bg-nature hover:bg-forest text-white"
                data-testid="button-next-question"
              >
                {currentQuestion + 1 === selectedQuiz.questions.length ? "🏁 Finish Quiz" : "➡️ Next Question"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen magic-gradient py-12">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-fredoka text-white mb-4" data-testid="text-title">
            🧠 Quiz Player
          </h1>
          <p className="text-white/90 text-lg">
            Test your nature knowledge and learn amazing facts!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quizzes.map((quiz) => (
            <Card 
              key={quiz.id}
              className="backdrop-blur-sm bg-white/95 border-nature/20 shadow-xl hover:scale-105 transition-all duration-200"
              data-testid={`card-quiz-${quiz.id}`}
            >
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-xl font-fredoka text-forest">
                    {quiz.title}
                  </CardTitle>
                  <Badge className={getDifficultyColor(quiz.difficulty)}>
                    {quiz.difficulty}
                  </Badge>
                </div>
                <p className="text-forest/80 text-sm">
                  {quiz.description}
                </p>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-forest/70">
                    {quiz.questions.length} questions
                  </span>
                  <span className="text-sm text-forest/70">
                    Category: {quiz.category}
                  </span>
                </div>
                <Button
                  onClick={() => startQuiz(quiz)}
                  className="w-full bg-turquoise hover:bg-teal-600 text-white"
                  data-testid={`button-start-quiz-${quiz.id}`}
                >
                  🚀 Start Quiz
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}