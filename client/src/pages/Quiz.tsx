import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

// Official Naturverse™ Character Assets
import TurianLogo from "@assets/turian_media_logo_transparent.png";
import TurianCharacter from "@assets/Turian_1754677394027.jpg";
import CoconutCruze from "@assets/Coconut Cruze_1754677394021.png";
import BluButterfly from "@assets/Blu Butterfly_1754677394021.png";
import FrankieFrogs from "@assets/Frankie Frogs_1754677394022.png";
import JaySing from "@assets/Jay-Sing_1754677394023.png";
import MangoMike from "@assets/Mango Mike_1754677394025.png";
import DrP from "@assets/Dr P_1754677394022.png";

// Background Assets
import StorybookScene from "@assets/Storybook img_1754673794866.jpg";
import ShroomForest from "@assets/Shroom forest_1754673794866.jpg";

export default function Quiz() {
  const [currentQuiz, setCurrentQuiz] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const quizzes = [
    {
      id: 'tropical-fruits',
      title: 'Tropical Fruit Adventure',
      character: MangoMike,
      characterName: 'Mango Mike',
      description: 'Test your knowledge about delicious tropical fruits with Mango Mike!',
      difficulty: 'Beginner',
      totalQuestions: 5,
      emoji: '🥭',
      color: 'from-orange-400 to-red-600',
      questions: [
        {
          question: "Which tropical fruit is known as the 'King of Fruits'?",
          options: ["Mango", "Durian", "Pineapple", "Papaya"],
          correct: 1,
          explanation: "Durian is called the 'King of Fruits' because of its large size and strong aroma!"
        }
      ]
    },
    {
      id: 'ocean-creatures',
      title: 'Ocean Exploration Quiz',
      character: CoconutCruze,
      characterName: 'Coconut Cruze',
      description: 'Dive deep with Coconut Cruze and discover amazing ocean creatures!',
      difficulty: 'Intermediate',
      totalQuestions: 5,
      emoji: '🌊',
      color: 'from-blue-400 to-cyan-600',
      questions: [
        {
          question: "Which ocean animal can change colors?",
          options: ["Shark", "Octopus", "Whale", "Dolphin"],
          correct: 1,
          explanation: "Octopuses can change their color and texture to camouflage with their surroundings!"
        }
      ]
    },
    {
      id: 'forest-friends',
      title: 'Forest Friends Challenge',
      character: FrankieFrogs,
      characterName: 'Frankie Frogs',
      description: 'Hop along with Frankie and learn about amazing forest animals!',
      difficulty: 'Beginner',
      totalQuestions: 5,
      emoji: '🐸',
      color: 'from-green-400 to-emerald-600',
      questions: [
        {
          question: "What do frogs use to breathe underwater?",
          options: ["Lungs", "Gills", "Their skin", "Special tubes"],
          correct: 2,
          explanation: "Frogs can breathe through their skin when underwater! This is called cutaneous respiration."
        }
      ]
    },
    {
      id: 'butterfly-magic',
      title: 'Butterfly Transformation',
      character: BluButterfly,
      characterName: 'Blu Butterfly',
      description: 'Learn about the magical process of metamorphosis with Blu Butterfly!',
      difficulty: 'Intermediate',
      totalQuestions: 4,
      emoji: '🦋',
      color: 'from-purple-400 to-pink-600',
      questions: [
        {
          question: "What is the correct order of butterfly metamorphosis?",
          options: [
            "Egg → Butterfly → Caterpillar → Chrysalis",
            "Egg → Caterpillar → Chrysalis → Butterfly",
            "Caterpillar → Egg → Butterfly → Chrysalis",
            "Chrysalis → Egg → Caterpillar → Butterfly"
          ],
          correct: 1,
          explanation: "The beautiful process goes: Egg → Caterpillar → Chrysalis → Butterfly!"
        }
      ]
    },
    {
      id: 'nature-sounds',
      title: 'Nature\'s Musical Symphony',
      character: JaySing,
      characterName: 'Jay-Sing',
      description: 'Discover the beautiful sounds of nature with Jay-Sing!',
      difficulty: 'Beginner',
      totalQuestions: 4,
      emoji: '🎵',
      color: 'from-yellow-400 to-orange-600',
      questions: [
        {
          question: "Why do birds sing in the morning?",
          options: [
            "They're just happy",
            "To find food",
            "To communicate with other birds",
            "Because they can't sleep"
          ],
          correct: 2,
          explanation: "Birds sing to communicate with their family and friends, and to mark their territory!"
        }
      ]
    },
    {
      id: 'plant-power',
      title: 'Amazing Plant Powers',
      character: DrP,
      characterName: 'Dr P',
      description: 'Explore the incredible world of plants with Dr P!',
      difficulty: 'Advanced',
      totalQuestions: 6,
      emoji: '🌱',
      color: 'from-green-400 to-teal-600',
      questions: [
        {
          question: "What process do plants use to make their own food?",
          options: ["Respiration", "Photosynthesis", "Digestion", "Fermentation"],
          correct: 1,
          explanation: "Photosynthesis is how plants use sunlight, water, and carbon dioxide to make their food!"
        }
      ]
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800 border-green-300';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Advanced': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const startQuiz = (quizId: string) => {
    setCurrentQuiz(quizId);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResults(false);
  };

  const selectAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const nextQuestion = () => {
    const quiz = quizzes.find(q => q.id === currentQuiz);
    if (!quiz) return;

    if (selectedAnswer === quiz.questions[currentQuestion].correct) {
      setScore(score + 1);
    }

    if (currentQuestion < quiz.totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      setShowResults(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuiz(null);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResults(false);
  };

  const currentQuizData = quizzes.find(q => q.id === currentQuiz);
  const currentQuestionData = currentQuizData?.questions[currentQuestion];

  if (currentQuiz && currentQuizData) {
    if (showResults) {
      return (
        <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-green-100 via-blue-100 to-purple-100">
          <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
            <Card className="quest-card w-full max-w-2xl animate-character-entrance">
              <CardHeader className="text-center pb-6">
                <div className="flex justify-center mb-4">
                  <img 
                    src={currentQuizData.character}
                    alt={currentQuizData.characterName}
                    className="w-24 h-24 rounded-full border-4 border-green-400 shadow-xl animate-gentle-pulse"
                  />
                </div>
                
                <CardTitle className="text-3xl font-magical text-green-700">
                  🎉 Quiz Complete! 🎉
                </CardTitle>
              </CardHeader>

              <CardContent className="text-center space-y-6">
                <div className="bg-gradient-to-br from-yellow-50 to-green-50 p-8 rounded-2xl border-4 border-yellow-200/60">
                  <div className="text-6xl mb-4">
                    {score === currentQuizData.totalQuestions ? '🌟' : score >= currentQuizData.totalQuestions * 0.7 ? '🎯' : '📚'}
                  </div>
                  
                  <h3 className="text-2xl font-magical text-green-700 mb-4">
                    Your Score: {score} / {currentQuizData.totalQuestions}
                  </h3>
                  
                  <p className="text-lg font-story text-green-600">
                    {score === currentQuizData.totalQuestions 
                      ? "Perfect! You're a nature expert!" 
                      : score >= currentQuizData.totalQuestions * 0.7 
                        ? "Great job! You know a lot about nature!"
                        : "Good try! Keep learning and you'll become a nature expert!"}
                  </p>
                </div>

                <div className="flex justify-center space-x-4">
                  <Button 
                    onClick={resetQuiz}
                    className="btn-nature text-lg font-bold"
                    data-testid="back-to-quizzes"
                  >
                    <span className="mr-2">🏠</span>
                    Back to Quizzes
                  </Button>
                  
                  <Button 
                    onClick={() => startQuiz(currentQuiz)}
                    className="btn-tropical text-lg font-bold"
                    data-testid="retake-quiz"
                  >
                    <span className="mr-2">🔄</span>
                    Try Again
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-100 via-purple-100 to-green-100">
        <div className="relative z-10 min-h-screen p-6">
          <div className="max-w-4xl mx-auto">
            {/* Quiz Header */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <img 
                  src={currentQuizData.character}
                  alt={currentQuizData.characterName}
                  className="w-20 h-20 rounded-full border-4 border-blue-400 shadow-xl animate-gentle-pulse"
                />
              </div>
              
              <h1 className="text-3xl font-magical text-blue-700 mb-2">
                {currentQuizData.title}
              </h1>
              
              <div className="flex justify-center items-center space-x-4 mb-4">
                <Progress 
                  value={((currentQuestion + 1) / currentQuizData.totalQuestions) * 100} 
                  className="w-64"
                />
                <span className="text-blue-600 font-bold">
                  {currentQuestion + 1} / {currentQuizData.totalQuestions}
                </span>
              </div>
            </div>

            {/* Question Card */}
            <Card className="quiz-card mb-8">
              <CardHeader>
                <CardTitle className="text-2xl font-magical text-center text-gray-700">
                  {currentQuestionData?.question}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                {currentQuestionData?.options.map((option, index) => (
                  <div 
                    key={index}
                    className={`quiz-option ${selectedAnswer === index ? 'selected' : ''}`}
                    onClick={() => selectAnswer(index)}
                    data-testid={`quiz-option-${index}`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-blue-500 text-white font-bold flex items-center justify-center">
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span className="text-lg font-playful">{option}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Next Button */}
            <div className="text-center">
              <Button 
                onClick={nextQuestion}
                disabled={selectedAnswer === null}
                className="btn-magical text-xl py-4 px-8"
                data-testid="next-question"
              >
                <span className="mr-2">
                  {currentQuestion < currentQuizData.totalQuestions - 1 ? '➡️' : '🏁'}
                </span>
                {currentQuestion < currentQuizData.totalQuestions - 1 ? 'Next Question' : 'Finish Quiz'}
                <span className="ml-2">✨</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Magical Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat" 
        style={{
          backgroundImage: `
            linear-gradient(
              135deg,
              rgba(59, 130, 246, 0.4) 0%,
              rgba(147, 51, 234, 0.3) 25%,
              rgba(239, 68, 68, 0.3) 50%,
              rgba(34, 197, 94, 0.3) 75%,
              rgba(251, 146, 60, 0.4) 100%
            ),
            url(${ShroomForest})
          `,
        }}
      />

      {/* Floating Sparkles */}
      <div className="floating-sparkles" style={{ top: '15%', left: '20%' }}>🧠</div>
      <div className="floating-sparkles" style={{ top: '25%', right: '25%', animationDelay: '1s' }}>🎯</div>
      <div className="floating-sparkles" style={{ bottom: '35%', left: '15%', animationDelay: '2s' }}>⭐</div>
      <div className="floating-sparkles" style={{ top: '65%', right: '20%', animationDelay: '1.5s' }}>✨</div>
      <div className="floating-sparkles" style={{ bottom: '25%', right: '15%', animationDelay: '3s' }}>🌟</div>

      <div className="relative z-10 min-h-screen py-8 px-6">
        {/* Header Section */}
        <div className="text-center mb-12 animate-character-entrance">
          <div className="flex items-center justify-center mb-6">
            <img 
              src={TurianLogo} 
              alt="The Naturverse™" 
              className="w-16 h-16 mr-4 animate-gentle-pulse"
            />
            <div>
              <h1 className="text-4xl md:text-6xl font-magical text-white drop-shadow-2xl text-magical-rainbow">
                🧠 Nature Quiz Challenge 🧠
              </h1>
              <p className="text-xl text-white drop-shadow-lg font-playful mt-2">
                Test your nature knowledge with our amazing quizzes!
              </p>
            </div>
          </div>
        </div>

        {/* Quiz Cards Grid */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {quizzes.map((quiz, index) => (
              <Card 
                key={quiz.id}
                className="zone-card animate-character-entrance cursor-pointer group"
                style={{ animationDelay: `${index * 0.1}s` }}
                data-testid={`quiz-card-${quiz.id}`}
              >
                <CardHeader className="pb-4">
                  <div className="flex justify-center mb-4">
                    <div className="relative">
                      <img 
                        src={quiz.character}
                        alt={quiz.characterName}
                        className="w-20 h-20 rounded-full border-4 border-white shadow-xl group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute -top-2 -right-2 text-2xl animate-sparkle-dance">
                        {quiz.emoji}
                      </div>
                    </div>
                  </div>
                  
                  <CardTitle className="text-2xl font-magical text-center text-blue-700 group-hover:text-purple-700 transition-colors duration-300">
                    {quiz.title}
                  </CardTitle>
                  
                  <div className="flex justify-center space-x-3 mt-3">
                    <div className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${getDifficultyColor(quiz.difficulty)}`}>
                      {quiz.difficulty}
                    </div>
                    <div className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border-2 border-blue-300">
                      {quiz.totalQuestions} Questions
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <p className="text-gray-600 font-story text-center leading-relaxed mb-6">
                    {quiz.description}
                  </p>

                  <div className="text-center">
                    <Button 
                      onClick={() => startQuiz(quiz.id)}
                      className="btn-magical w-full font-bold"
                      data-testid={`start-quiz-${quiz.id}`}
                    >
                      <span className="mr-2">🎯</span>
                      Start Quiz
                      <span className="ml-2">🧠</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Fun Learning Stats */}
        <div className="max-w-4xl mx-auto mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-white/90 backdrop-blur-sm rounded-3xl border-4 border-blue-300/60 shadow-xl animate-character-entrance">
            <div className="text-4xl mb-3">🧠</div>
            <div className="text-2xl font-bold text-blue-700 font-magical">25+</div>
            <div className="text-blue-600 font-playful">Brain Teasers</div>
          </div>
          
          <div className="text-center p-6 bg-white/90 backdrop-blur-sm rounded-3xl border-4 border-green-300/60 shadow-xl animate-character-entrance" style={{ animationDelay: '0.2s' }}>
            <div className="text-4xl mb-3">🏆</div>
            <div className="text-2xl font-bold text-green-700 font-magical">6</div>
            <div className="text-green-600 font-playful">Different Topics</div>
          </div>
          
          <div className="text-center p-6 bg-white/90 backdrop-blur-sm rounded-3xl border-4 border-purple-300/60 shadow-xl animate-character-entrance" style={{ animationDelay: '0.4s' }}>
            <div className="text-4xl mb-3">⭐</div>
            <div className="text-2xl font-bold text-purple-700 font-magical">Fun</div>
            <div className="text-purple-600 font-playful">Learning Experience</div>
          </div>
        </div>
      </div>

      {/* Turian Guide */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="relative animate-float-bounce">
          <div className="w-24 h-24 p-2 bg-white/95 rounded-full border-4 border-blue-400 shadow-2xl">
            <img 
              src={TurianCharacter} 
              alt="Turian Guide" 
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          
          <div className="absolute -top-16 -left-48 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-xl border-2 border-blue-400 max-w-xs">
            <div className="text-center">
              <div className="text-sm font-bold text-blue-700 font-playful">
                Pick a quiz to test your nature knowledge! 🧠🌟
              </div>
            </div>
            
            <div className="absolute bottom-0 right-8 transform translate-y-full">
              <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-t-[12px] border-l-transparent border-r-transparent border-t-blue-400"></div>
              <div className="w-0 h-0 border-l-[8px] border-r-[8px] border-t-[8px] border-l-transparent border-r-transparent border-t-white absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-[1px]"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}