import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";

// Official Naturverse™ Assets
import TurianLogo from "@assets/turian_media_logo_transparent.png";
import TurianCharacter from "@assets/Turian_1754677394027.jpg";
import StorybookScene from "@assets/Storybook img_1754673794866.jpg";

// Character Assets for Quest Rewards
import CoconutCruze from "@assets/Coconut Cruze_1754677394021.png";
import BluButterfly from "@assets/Blu Butterfly_1754677394021.png";
import FrankieFrogs from "@assets/Frankie Frogs_1754677394022.png";
import DrP from "@assets/Dr P_1754677394022.png";
import JaySing from "@assets/Jay-Sing_1754677394023.png";
import NikkiMT from "@assets/Nikki MT_1754677394025.png";
import PineapplePapa from "@assets/Pineapple Pa-Pa_1754677394026.png";
import TommyTukTuk from "@assets/Tommy Tuk Tuk_1754677394026.png";

interface Quest {
  id: string;
  name: string;
  description: string;
  completed: boolean;
  progress: number;
  maxProgress: number;
  rewardCharacter: string;
  rewardImage: string;
  difficulty: "Easy" | "Medium" | "Hard";
  category: "Explorer" | "Learner" | "Creator" | "Helper";
}

export default function Quests() {
  const { user } = useAuth();
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadQuests();
  }, []);

  const loadQuests = async () => {
    try {
      // Using authentic Naturverse quest data with real characters
      const naturverseQuests: Quest[] = [
        {
          id: "turian-wisdom",
          name: "🌿 Learn with Turian",
          description: "Complete 3 nature lessons with Turian the Durian and discover the secrets of tropical fruits!",
          completed: false,
          progress: 1,
          maxProgress: 3,
          rewardCharacter: "Turian Medal",
          rewardImage: TurianCharacter,
          difficulty: "Easy",
          category: "Learner"
        },
        {
          id: "coconut-explorer",
          name: "🥥 Beach Adventure",
          description: "Explore 5 different beach zones with Coconut Cruze and learn about ocean ecosystems!",
          completed: false,
          progress: 2,
          maxProgress: 5,
          rewardCharacter: "Coconut Badge",
          rewardImage: CoconutCruze,
          difficulty: "Medium",
          category: "Explorer"
        },
        {
          id: "butterfly-garden",
          name: "🦋 Pollination Master",
          description: "Help Blue Butterfly pollinate 10 flowers and learn about the butterfly lifecycle!",
          completed: true,
          progress: 10,
          maxProgress: 10,
          rewardCharacter: "Butterfly Wings",
          rewardImage: BluButterfly,
          difficulty: "Easy",
          category: "Helper"
        },
        {
          id: "frog-pond-science",
          name: "🐸 Amphibian Expert",
          description: "Study with Frankie Frogs to understand pond ecosystems and complete the amphibian quiz!",
          completed: false,
          progress: 0,
          maxProgress: 1,
          rewardCharacter: "Frog Scientist Badge",
          rewardImage: FrankieFrogs,
          difficulty: "Medium",
          category: "Learner"
        },
        {
          id: "dr-p-experiment",
          name: "🧪 Science Discovery",
          description: "Conduct 3 safe experiments with Dr P and earn your junior scientist certificate!",
          completed: false,
          progress: 0,
          maxProgress: 3,
          rewardCharacter: "Lab Coat Award",
          rewardImage: DrP,
          difficulty: "Hard",
          category: "Learner"
        },
        {
          id: "jay-sing-concert",
          name: "🎵 Nature's Orchestra",
          description: "Create beautiful music with Jay-Sing by recording 5 different nature sounds!",
          completed: false,
          progress: 1,
          maxProgress: 5,
          rewardCharacter: "Musical Note Trophy",
          rewardImage: JaySing,
          difficulty: "Medium",
          category: "Creator"
        },
        {
          id: "nikki-mountain-climb",
          name: "🏔️ Peak Explorer",
          description: "Climb to the highest peak with Nikki MT and learn about mountain weather patterns!",
          completed: false,
          progress: 0,
          maxProgress: 1,
          rewardCharacter: "Summit Certificate",
          rewardImage: NikkiMT,
          difficulty: "Hard",
          category: "Explorer"
        },
        {
          id: "pineapple-farming",
          name: "🍍 Sustainable Farmer",
          description: "Learn sustainable farming with Pineapple Pa-Pa by growing your own virtual garden!",
          completed: false,
          progress: 3,
          maxProgress: 7,
          rewardCharacter: "Green Thumb Award",
          rewardImage: PineapplePapa,
          difficulty: "Medium",
          category: "Creator"
        },
      ];

      setQuests(naturverseQuests);
      setError("");
    } catch (err: any) {
      setError("Failed to load quests");
      console.error('Error loading quests:', err);
    } finally {
      setLoading(false);
    }
  };

  const completedQuests = quests.filter(q => q.completed);
  const totalQuests = quests.length;
  const overallProgress = (completedQuests.length / totalQuests) * 100;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-green-500";
      case "Medium": return "bg-yellow-500";
      case "Hard": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Explorer": return "border-blue-400 bg-blue-50";
      case "Learner": return "border-green-400 bg-green-50";
      case "Creator": return "border-purple-400 bg-purple-50";
      case "Helper": return "border-orange-400 bg-orange-50";
      default: return "border-gray-400 bg-gray-50";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <img 
            src={TurianCharacter}
            alt="Loading..." 
            className="w-24 h-24 rounded-full animate-spin mx-auto mb-4 border-4 border-green-400"
          />
          <p className="text-2xl font-bold text-green-700" style={{ fontFamily: 'Fredoka, sans-serif' }}>
            Loading Your Quests...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Magical Storybook Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat" 
        style={{
          backgroundImage: `
            linear-gradient(
              135deg,
              rgba(34, 197, 94, 0.3) 0%,
              rgba(59, 130, 246, 0.2) 30%,
              rgba(251, 146, 60, 0.25) 60%,
              rgba(234, 179, 8, 0.2) 100%
            ),
            url(${StorybookScene})
          `,
        }}
      />
      
      {/* Enhanced Magical Overlay */}
      <div className="absolute inset-0" style={{
        background: `
          radial-gradient(circle at 20% 30%, rgba(34,197,94,0.4) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(59,130,246,0.3) 0%, transparent 50%),
          radial-gradient(circle at 70% 80%, rgba(251,146,60,0.3) 0%, transparent 50%),
          linear-gradient(
            135deg, 
            rgba(220, 255, 220, 0.8) 0%, 
            rgba(240, 248, 255, 0.7) 50%, 
            rgba(255, 248, 220, 0.8) 100%
          )`
      }} />

      <div className="relative z-10 min-h-screen py-8 px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <img 
              src={TurianLogo} 
              alt="The Naturverse™" 
              className="w-16 h-16 mr-4"
            />
            <div>
              <h1 className="text-4xl md:text-6xl font-bold text-green-700" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                🏆 Naturverse Quests 🌟
              </h1>
              <p className="text-lg text-green-600" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                Complete adventures with your favorite characters!
              </p>
            </div>
          </div>

          {/* Progress Summary */}
          <div className="max-w-2xl mx-auto bg-white/95 backdrop-blur-sm p-6 rounded-3xl border-4 border-green-300/60 shadow-xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-700" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                  {completedQuests.length}
                </div>
                <div className="text-sm text-green-600" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                  Completed
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-700" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                  {quests.filter(q => q.progress > 0 && !q.completed).length}
                </div>
                <div className="text-sm text-blue-600" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                  In Progress
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-700" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                  {quests.filter(q => q.progress === 0).length}
                </div>
                <div className="text-sm text-orange-600" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                  Not Started
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-700" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                  {Math.round(overallProgress)}%
                </div>
                <div className="text-sm text-purple-600" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                  Overall
                </div>
              </div>
            </div>
            
            <div className="w-full bg-green-200 rounded-full h-4">
              <div 
                className="bg-gradient-to-r from-green-500 to-green-600 h-4 rounded-full transition-all duration-500"
                style={{ width: `${overallProgress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-2xl mx-auto mb-6 bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl font-medium">
            {error}
          </div>
        )}

        {/* Quests Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {quests.map((quest) => (
            <Card
              key={quest.id}
              className={`transition-all duration-300 bg-white/95 backdrop-blur-sm border-4 ${getCategoryColor(quest.category)} shadow-2xl rounded-3xl overflow-hidden hover:scale-105 ${quest.completed ? 'ring-4 ring-green-400' : ''}`}
            >
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <img 
                      src={quest.rewardImage} 
                      alt={quest.rewardCharacter} 
                      className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-xl bg-gradient-to-br from-white to-gray-100 p-1"
                    />
                    {quest.completed && (
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-400 rounded-full border-2 border-white flex items-center justify-center">
                        <span className="text-sm">🏆</span>
                      </div>
                    )}
                    {quest.progress > 0 && !quest.completed && (
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full border-2 border-white flex items-center justify-center">
                        <span className="text-sm">⚡</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <CardTitle className="text-xl font-bold text-gray-700 mb-2" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                  {quest.name}
                </CardTitle>
                
                <div className="flex justify-center space-x-2 mb-2">
                  <Badge className={`text-white ${getDifficultyColor(quest.difficulty)}`}>
                    {quest.difficulty}
                  </Badge>
                  <Badge variant="outline" className="font-bold">
                    {quest.category}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="p-6">
                <p className="text-sm text-gray-600 mb-4" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                  {quest.description}
                </p>
                
                <div className="mb-4">
                  <div className="flex justify-between text-sm font-bold text-gray-700 mb-2" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                    <span>Progress</span>
                    <span>{quest.progress}/{quest.maxProgress}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full transition-all duration-500 ${
                        quest.completed 
                          ? 'bg-gradient-to-r from-green-500 to-green-600' 
                          : 'bg-gradient-to-r from-blue-400 to-blue-500'
                      }`}
                      style={{ width: `${(quest.progress / quest.maxProgress) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="text-center">
                  {quest.completed ? (
                    <div className="text-green-600 font-bold text-lg" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                      ✅ Quest Complete! 
                      <div className="text-sm mt-1">Reward: {quest.rewardCharacter}</div>
                    </div>
                  ) : quest.progress > 0 ? (
                    <Button className="btn-magical-secondary text-sm px-4 py-2">
                      Continue Quest
                    </Button>
                  ) : (
                    <Button className="btn-magical text-sm px-4 py-2">
                      Start Quest
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Turian Guide */}
        <div className="fixed bottom-6 right-6 z-50">
          <div className="relative animate-float-bounce">
            <div className="w-24 h-24 p-2 bg-white/95 rounded-full border-4 border-green-400 shadow-2xl">
              <img 
                src={TurianCharacter} 
                alt="Turian Guide" 
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            
            {/* Speech Bubble */}
            <div className="absolute -top-16 -left-48 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-xl border-2 border-green-400 max-w-xs">
              <div className="text-center">
                <div className="text-sm font-bold text-green-700" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                  Complete quests to earn rewards! 🏆
                </div>
              </div>
              
              {/* Speech bubble pointer */}
              <div className="absolute bottom-0 right-8 transform translate-y-full">
                <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-t-[12px] border-l-transparent border-r-transparent border-t-green-400"></div>
                <div className="w-0 h-0 border-l-[8px] border-r-[8px] border-t-[8px] border-l-transparent border-r-transparent border-t-white absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-[1px]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}