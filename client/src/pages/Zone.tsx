import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface ZoneData {
  id: string;
  name: string;
  description: string;
  emoji: string;
  theme: string;
  activities: ZoneActivity[];
  discoveries: ZoneDiscovery[];
  progress: number;
  isUnlocked: boolean;
}

interface ZoneActivity {
  id: string;
  name: string;
  type: "exploration" | "quiz" | "story" | "mini-game";
  description: string;
  icon: string;
  completed: boolean;
  difficulty: "easy" | "medium" | "hard";
}

interface ZoneDiscovery {
  id: string;
  name: string;
  description: string;
  icon: string;
  discovered: boolean;
  hint?: string;
}

export default function Zone() {
  const { name } = useParams<{ name: string }>();
  const navigate = useNavigate();
  const [zoneData, setZoneData] = useState<ZoneData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedActivity, setSelectedActivity] = useState<ZoneActivity | null>(null);

  useEffect(() => {
    loadZoneData();
  }, [name]);

  const loadZoneData = async () => {
    // TODO: Connect to Supabase zones table
    // Mock data based on zone name
    const mockZoneData: Record<string, ZoneData> = {
      thailandia: {
        id: "thailandia",
        name: "Thailandia",
        description: "The mystical heart of The Naturverse, where ancient wisdom meets magical nature. Explore temples surrounded by lush forests and discover the secrets of harmony between civilization and the wild.",
        emoji: "🏛️",
        theme: "from-nature/30 to-turquoise/30",
        progress: 45,
        isUnlocked: true,
        activities: [
          {
            id: "temple-exploration",
            name: "Temple of Wisdom",
            type: "exploration",
            description: "Discover ancient knowledge hidden within mystical temple walls",
            icon: "🏛️",
            completed: true,
            difficulty: "easy"
          },
          {
            id: "forest-quiz",
            name: "Sacred Forest Quiz",
            type: "quiz",
            description: "Test your knowledge of the plants and animals in sacred groves",
            icon: "🌳",
            completed: true,
            difficulty: "medium"
          },
          {
            id: "elephant-story",
            name: "The Gentle Giants",
            type: "story",
            description: "Learn about the wisdom of elephants in Thai culture",
            icon: "🐘",
            completed: false,
            difficulty: "easy"
          },
          {
            id: "lotus-game",
            name: "Lotus Pond Puzzle",
            type: "mini-game",
            description: "Help lotus flowers bloom by solving nature puzzles",
            icon: "🪷",
            completed: false,
            difficulty: "medium"
          }
        ],
        discoveries: [
          {
            id: "golden-temple",
            name: "Golden Temple Relic",
            description: "An ancient artifact that glows with natural energy",
            icon: "⚱️",
            discovered: true
          },
          {
            id: "spirit-orchid",
            name: "Spirit Orchid",
            description: "A rare flower that only blooms during full moons",
            icon: "🌺",
            discovered: true
          },
          {
            id: "wisdom-tree",
            name: "Tree of Wisdom",
            description: "A ancient tree said to hold the knowledge of ages",
            icon: "🌳",
            discovered: false,
            hint: "Complete all temple activities to unlock this discovery"
          },
          {
            id: "sacred-spring",
            name: "Sacred Spring",
            description: "A mystical water source with healing properties",
            icon: "💧",
            discovered: false,
            hint: "Help 5 other explorers to find this hidden spring"
          }
        ]
      },
      "crystal-caves": {
        id: "crystal-caves",
        name: "Crystal Caves",
        description: "Deep underground chambers where gemstones grow like flowers and echo with ancient magic. Each crystal formation tells a story of Earth's geological wonders.",
        emoji: "💎",
        theme: "from-magic/30 to-coral/30",
        progress: 20,
        isUnlocked: true,
        activities: [
          {
            id: "gem-identification",
            name: "Gemstone Hunter",
            type: "exploration",
            description: "Learn to identify different types of crystals and minerals",
            icon: "💎",
            completed: true,
            difficulty: "easy"
          },
          {
            id: "geology-quiz",
            name: "Earth's Treasures Quiz",
            type: "quiz",
            description: "Test your knowledge of how crystals and caves are formed",
            icon: "🪨",
            completed: false,
            difficulty: "hard"
          },
          {
            id: "cave-story",
            name: "The Crystal Guardian",
            type: "story",
            description: "Meet the mystical being who protects the cave's treasures",
            icon: "🧙‍♂️",
            completed: false,
            difficulty: "medium"
          }
        ],
        discoveries: [
          {
            id: "rainbow-crystal",
            name: "Rainbow Crystal",
            description: "A crystal that refracts light into beautiful rainbows",
            icon: "🌈",
            discovered: true
          },
          {
            id: "singing-stones",
            name: "Singing Stones",
            description: "Crystals that create musical tones when touched",
            icon: "🎵",
            discovered: false,
            hint: "Complete the Crystal Guardian story"
          }
        ]
      }
    };

    const zone = mockZoneData[name || ""];
    if (zone) {
      setZoneData(zone);
    }
    setLoading(false);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "bg-nature text-white";
      case "medium": return "bg-sunny text-black";
      case "hard": return "bg-coral text-white";
      default: return "bg-gray-500 text-white";
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "exploration": return "🔍";
      case "quiz": return "🧠";
      case "story": return "📚";
      case "mini-game": return "🎮";
      default: return "⭐";
    }
  };

  const handleActivityStart = (activity: ZoneActivity) => {
    setSelectedActivity(activity);
    // TODO: Navigate to appropriate activity based on type
    switch (activity.type) {
      case "quiz":
        navigate("/quiz");
        break;
      case "story":
        navigate("/storybook");
        break;
      default:
        // Mock activity start
        break;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen magic-gradient py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading zone...</p>
        </div>
      </div>
    );
  }

  if (!zoneData) {
    return (
      <div className="min-h-screen magic-gradient py-12 flex items-center justify-center">
        <Card className="backdrop-blur-sm bg-white/95 border-nature/20 shadow-xl max-w-md">
          <CardContent className="text-center pt-6">
            <div className="text-6xl mb-4">🗺️</div>
            <h2 className="text-2xl font-fredoka text-forest mb-2">Zone Not Found</h2>
            <p className="text-forest/80 mb-4">
              The zone "{name}" doesn't exist or hasn't been unlocked yet.
            </p>
            <Button 
              onClick={() => navigate("/map")}
              className="bg-nature hover:bg-forest text-white"
            >
              🔙 Back to Map
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const completedActivities = zoneData.activities.filter(a => a.completed).length;
  const totalActivities = zoneData.activities.length;
  const discoveredItems = zoneData.discoveries.filter(d => d.discovered).length;
  const totalDiscoveries = zoneData.discoveries.length;

  return (
    <div className="min-h-screen magic-gradient py-12">
      <div className="container mx-auto px-6 max-w-6xl">
        {/* Zone Header */}
        <div className="text-center mb-8">
          <Button 
            onClick={() => navigate("/map")}
            variant="outline"
            className="mb-4 border-white text-white hover:bg-white hover:text-forest"
          >
            ← Back to Map
          </Button>
          
          <div className="text-8xl mb-4 animate-bounce-gentle">{zoneData.emoji}</div>
          <h1 className="text-4xl font-fredoka text-white mb-4" data-testid="text-zone-title">
            {zoneData.name}
          </h1>
          <p className="text-white/90 text-lg max-w-3xl mx-auto">
            {zoneData.description}
          </p>
        </div>

        {/* Progress Overview */}
        <Card className="backdrop-blur-sm bg-white/95 border-nature/20 shadow-xl mb-8">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-2xl font-fredoka text-forest mb-2">Zone Progress</div>
                <Progress value={zoneData.progress} className="h-3 mb-2" />
                <p className="text-forest/70">{zoneData.progress}% Complete</p>
              </div>
              <div>
                <div className="text-2xl font-fredoka text-forest mb-2">Activities</div>
                <div className="text-3xl text-turquoise">{completedActivities}/{totalActivities}</div>
                <p className="text-forest/70">Completed</p>
              </div>
              <div>
                <div className="text-2xl font-fredoka text-forest mb-2">Discoveries</div>
                <div className="text-3xl text-magic">{discoveredItems}/{totalDiscoveries}</div>
                <p className="text-forest/70">Found</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Activities */}
          <Card className="backdrop-blur-sm bg-white/95 border-nature/20 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-fredoka text-forest">
                🎯 Zone Activities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {zoneData.activities.map((activity) => (
                  <Card 
                    key={activity.id}
                    className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                      activity.completed ? 'bg-nature/10 border-nature/30' : 'hover:shadow-md'
                    }`}
                    onClick={() => !activity.completed && handleActivityStart(activity)}
                    data-testid={`card-activity-${activity.id}`}
                  >
                    <CardContent className="pt-4">
                      <div className="flex items-center space-x-4">
                        <div className="text-3xl">
                          {activity.completed ? "✅" : activity.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-fredoka text-forest">{activity.name}</h3>
                            <Badge className={getDifficultyColor(activity.difficulty)}>
                              {activity.difficulty}
                            </Badge>
                          </div>
                          <p className="text-sm text-forest/80">{activity.description}</p>
                        </div>
                        <div className="text-2xl">
                          {getActivityIcon(activity.type)}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Discoveries */}
          <Card className="backdrop-blur-sm bg-white/95 border-nature/20 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-fredoka text-forest">
                🔍 Zone Discoveries
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {zoneData.discoveries.map((discovery) => (
                  <Card 
                    key={discovery.id}
                    className={`${
                      discovery.discovered 
                        ? 'bg-magic/10 border-magic/30' 
                        : 'bg-gray-50 border-gray-200'
                    }`}
                    data-testid={`card-discovery-${discovery.id}`}
                  >
                    <CardContent className="pt-4">
                      <div className="flex items-center space-x-4">
                        <div className={`text-3xl ${discovery.discovered ? 'animate-pulse-slow' : 'opacity-30'}`}>
                          {discovery.discovered ? discovery.icon : "❓"}
                        </div>
                        <div className="flex-1">
                          <h3 className={`font-fredoka mb-1 ${
                            discovery.discovered ? 'text-magic' : 'text-gray-500'
                          }`}>
                            {discovery.discovered ? discovery.name : "???"}
                          </h3>
                          <p className={`text-sm ${
                            discovery.discovered ? 'text-forest/80' : 'text-gray-400'
                          }`}>
                            {discovery.discovered ? discovery.description : discovery.hint || "Complete more activities to reveal this discovery"}
                          </p>
                        </div>
                        <div className="text-lg">
                          {discovery.discovered ? "✨" : "🔒"}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}