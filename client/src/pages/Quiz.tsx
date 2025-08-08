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
      <div className="min-h-screen magic-gradient py-12 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="floating-element absolute top-20 left-10 text-4xl animate-sparkle">✨</div>
          <div className="floating-element absolute bottom-20 right-10 text-4xl animate-sparkle">🧠</div>
          <div className="floating-element absolute top-40 right-20 text-3xl animate-sparkle">📚</div>
        </div>
        <div className="text-center relative z-10">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent mx-auto mb-6 magical-shadow"></div>
          <p className="text-white text-xl font-fredoka animate-bounce-gentle">🔍 Finding Amazing Quizzes! 🔍</p>
        </div>
      </div>
    );
  }

  if (showResult && selectedQuiz) {
    const percentage = Math.round((score / selectedQuiz.questions.length) * 100);
    return (
      <div className="min-h-screen magic-gradient py-12 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="floating-element absolute top-20 left-10 text-4xl animate-sparkle">🎉</div>
          <div className="floating-element absolute top-32 right-20 text-3xl animate-sparkle">⭐</div>
          <div className="floating-element absolute bottom-32 left-20 text-5xl animate-sparkle">🏆</div>
          <div className="floating-element absolute bottom-20 right-10 text-4xl animate-sparkle">✨</div>
        </div>
        <div className="container mx-auto px-6 max-w-2xl relative z-10">
          <Card className="kid-friendly-card magical-shadow-lg animate-bounce-in">
            <CardHeader className="text-center">
              <CardTitle className="text-4xl font-fredoka text-gradient-rainbow animate-bounce-gentle">
                🎉 Amazing Work! 🎉
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-8xl mb-6 animate-bounce-gentle">
                {percentage >= 90 ? "🏆" : percentage >= 70 ? "⭐" : "👍"}
              </div>
              <div className="text-3xl font-fredoka text-magic mb-3">
                Your Score: {score} / {selectedQuiz.questions.length}
              </div>
              <div className="text-2xl text-coral mb-6 font-bold">
                {percentage}% Correct!
              </div>
              <div className="mb-6">
                {percentage >= 90 ? (
                  <p className="text-lg text-forest font-fredoka">🌟 Outstanding! You're a nature expert! 🌟</p>
                ) : percentage >= 70 ? (
                  <p className="text-lg text-forest font-fredoka">⭐ Great job! You know so much about nature! ⭐</p>
                ) : (
                  <p className="text-lg text-forest font-fredoka">👍 Good try! Keep learning and you'll get even better! 👍</p>
                )}
              </div>
              <div className="space-y-4">
                <Button 
                  onClick={() => startQuiz(selectedQuiz)}
                  className="kid-friendly-button mr-4 animate-bounce-gentle"
                  data-testid="button-retry"
                >
                  🔄 Try Again! 🔄
                </Button>
                <Button 
                  onClick={resetQuiz}
                  className="kid-friendly-button bg-turquoise hover:bg-teal-500 animate-bounce-gentle"
                  data-testid="button-back-to-quizzes"
                >
                  📚 More Quizzes! 📚
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
      <div className="min-h-screen magic-gradient py-12 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="floating-element absolute top-20 left-10 text-3xl animate-sparkle">🤔</div>
          <div className="floating-element absolute bottom-20 right-10 text-3xl animate-sparkle">💡</div>
          <div className="floating-element absolute top-40 right-20 text-4xl animate-sparkle">🧠</div>
        </div>
        <div className="container mx-auto px-6 max-w-2xl relative z-10">
          <Card className="kid-friendly-card magical-shadow-lg">
            <CardHeader>
              <div className="flex justify-between items-center mb-4">
                <CardTitle className="text-2xl font-fredoka text-magic">
                  {selectedQuiz.title}
                </CardTitle>
                <Button 
                  onClick={resetQuiz}
                  className="kid-friendly-button bg-coral hover:bg-red-500 text-sm px-4 py-2"
                  data-testid="button-exit-quiz"
                >
                  ❌ Exit
                </Button>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-lg text-forest font-fredoka">
                  <span>Question {currentQuestion + 1} of {selectedQuiz.questions.length}</span>
                  <span>Score: {score} ⭐</span>
                </div>
                <Progress value={progress} className="h-4 magical-shadow" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-8">
                <h3 className="text-xl font-fredoka text-forest mb-6 animate-fade-in">
                  {currentQ.question}
                </h3>
                <div className="space-y-4">
                  {currentQ.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      className={`w-full p-5 text-left rounded-2xl border-3 transition-all duration-300 font-medium magical-shadow hover:scale-105 ${
                        selectedAnswer === index
                          ? 'border-magic bg-magic/20 text-forest sparkle-hover'
                          : 'border-gray-200 hover:border-nature text-forest/90 hover:bg-nature/10'
                      }`}
                      data-testid={`button-answer-${index}`}
                    >
                      <span className="mr-3 text-xl">{String.fromCharCode(65 + index)}</span>
                      {option}
                    </button>
                  ))}
                </div>
              </div>
              <Button
                onClick={handleNextQuestion}
                disabled={selectedAnswer === null}
                className="w-full kid-friendly-button text-xl py-6 animate-bounce-gentle"
                data-testid="button-next-question"
              >
                {currentQuestion + 1 === selectedQuiz.questions.length ? "🏁 Finish Quiz! 🏁" : "➡️ Next Question! ➡️"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen magic-gradient py-12 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="floating-element absolute top-16 left-8 text-4xl animate-sparkle">🧠</div>
        <div className="floating-element absolute top-28 right-12 text-3xl animate-sparkle">📝</div>
        <div className="floating-element absolute bottom-32 left-16 text-5xl animate-sparkle">🌟</div>
        <div className="floating-element absolute bottom-16 right-8 text-4xl animate-sparkle">💡</div>
        <div className="floating-element absolute top-48 left-1/4 text-3xl animate-sparkle">🏆</div>
        <div className="floating-element absolute bottom-48 right-1/4 text-4xl animate-sparkle">⭐</div>
      </div>
      <div className="container mx-auto px-6 max-w-4xl relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-fredoka text-gradient-rainbow mb-4 animate-bounce-in" data-testid="text-title">
            🧠 Quiz Adventure! 🧠
          </h1>
          <p className="text-white/90 text-xl animate-fade-in-delay magical-shadow">
            ✨ Test your nature knowledge and learn amazing facts! ✨
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {quizzes.map((quiz, index) => (
            <Card 
              key={quiz.id}
              className="kid-friendly-card hover:scale-110 transition-all duration-500 animate-fade-in-stagger hover-wiggle"
              data-testid={`card-quiz-${quiz.id}`}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <CardHeader>
                <div className="flex justify-between items-start mb-3">
                  <CardTitle className="text-2xl font-fredoka text-magic">
                    {quiz.title}
                  </CardTitle>
                  <Badge className={`${getDifficultyColor(quiz.difficulty)} text-lg px-3 py-1 rounded-xl font-fredoka`}>
                    {quiz.difficulty}
                  </Badge>
                </div>
                <p className="text-forest text-base">
                  {quiz.description}
                </p>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-6">
                  <span className="text-base text-turquoise font-bold">
                    📝 {quiz.questions.length} questions
                  </span>
                  <span className="text-base text-coral font-bold">
                    🏷️ {quiz.category}
                  </span>
                </div>
                <Button
                  onClick={() => startQuiz(quiz)}
                  className="w-full kid-friendly-button text-xl py-4 animate-bounce-gentle"
                  data-testid={`button-start-quiz-${quiz.id}`}
                >
                  🚀 Start Quiz Adventure! 🚀
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}