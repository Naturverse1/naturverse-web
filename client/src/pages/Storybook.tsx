import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface Story {
  id: string;
  title: string;
  description: string;
  category: "adventure" | "educational" | "magical";
  duration: string;
  ageGroup: string;
  isUnlocked: boolean;
  isCompleted: boolean;
  progress: number;
  coverEmoji: string;
}

export default function Storybook() {
  const [stories, setStories] = useState<Story[]>([]);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isReading, setIsReading] = useState(false);

  useEffect(() => {
    loadStories();
  }, []);

  const loadStories = async () => {
    // TODO: Connect to Supabase stories table
    // Temporary mock data
    const mockStories: Story[] = [
      {
        id: "1",
        title: "The Magical Seed",
        description: "Follow Luna as she discovers a seed that grows into something extraordinary.",
        category: "magical",
        duration: "10 min",
        ageGroup: "6-9",
        isUnlocked: true,
        isCompleted: true,
        progress: 100,
        coverEmoji: "🌱"
      },
      {
        id: "2",
        title: "Butterfly's Big Journey",
        description: "Join Maya the caterpillar on her transformation into a beautiful butterfly.",
        category: "educational",
        duration: "8 min",
        ageGroup: "5-8",
        isUnlocked: true,
        isCompleted: false,
        progress: 60,
        coverEmoji: "🦋"
      },
      {
        id: "3",
        title: "The Whispering Forest",
        description: "Adventure through an ancient forest where trees share their secrets.",
        category: "adventure",
        duration: "15 min",
        ageGroup: "8-12",
        isUnlocked: true,
        isCompleted: false,
        progress: 0,
        coverEmoji: "🌲"
      },
      {
        id: "4",
        title: "Ocean's Hidden Treasure",
        description: "Dive deep with Coral the fish to find a legendary underwater treasure.",
        category: "adventure",
        duration: "12 min",
        ageGroup: "7-11",
        isUnlocked: false,
        isCompleted: false,
        progress: 0,
        coverEmoji: "🐠"
      },
      {
        id: "5",
        title: "The Night Owl's Wisdom",
        description: "Learn about nocturnal animals with Oliver the wise old owl.",
        category: "educational",
        duration: "9 min",
        ageGroup: "6-10",
        isUnlocked: false,
        isCompleted: false,
        progress: 0,
        coverEmoji: "🦉"
      },
      {
        id: "6",
        title: "Crystal Cave Mystery",
        description: "Solve puzzles with Echo the bat in the mysterious crystal caves.",
        category: "magical",
        duration: "18 min",
        ageGroup: "9-13",
        isUnlocked: false,
        isCompleted: false,
        progress: 0,
        coverEmoji: "💎"
      }
    ];
    
    setStories(mockStories);
    setLoading(false);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "adventure": return "bg-coral text-white";
      case "educational": return "bg-nature text-white";
      case "magical": return "bg-magic text-white";
      default: return "bg-gray-500 text-white";
    }
  };

  const startReading = (story: Story) => {
    if (!story.isUnlocked) return;
    setSelectedStory(story);
    setCurrentPage(0);
    setIsReading(true);
  };

  const nextPage = () => {
    setCurrentPage(currentPage + 1);
    // TODO: Update progress in database
  };

  const finishStory = () => {
    setIsReading(false);
    setSelectedStory(null);
    // TODO: Mark story as completed in database
  };

  if (loading) {
    return (
      <div className="min-h-screen magic-gradient py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading storybook...</p>
        </div>
      </div>
    );
  }

  if (isReading && selectedStory) {
    const totalPages = 8; // Mock story length
    const progress = ((currentPage + 1) / totalPages) * 100;

    return (
      <div className="min-h-screen magic-gradient py-12">
        <div className="container mx-auto px-6 max-w-3xl">
          <Card className="backdrop-blur-sm bg-white/95 border-nature/20 shadow-xl">
            <CardHeader>
              <div className="flex justify-between items-center mb-4">
                <CardTitle className="text-xl font-fredoka text-forest">
                  {selectedStory.title}
                </CardTitle>
                <Button 
                  onClick={() => setIsReading(false)}
                  variant="outline"
                  size="sm"
                  data-testid="button-close-story"
                >
                  ❌ Close
                </Button>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-forest/70">
                  <span>Page {currentPage + 1} of {totalPages}</span>
                  <span>Progress: {Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-8">
                <div className="text-8xl mb-6 animate-pulse-slow">
                  {selectedStory.coverEmoji}
                </div>
                <div className="bg-gradient-to-br from-nature/10 to-turquoise/10 rounded-xl p-8 border-2 border-dashed border-nature/30">
                  <div className="text-lg text-forest leading-relaxed">
                    {/* Mock story content based on page */}
                    {currentPage === 0 && (
                      <div>
                        <h3 className="text-2xl font-fredoka text-forest mb-4">Chapter 1: The Beginning</h3>
                        <p>Once upon a time, in a magical land filled with wonders, there lived a curious little character who was about to embark on the most amazing adventure...</p>
                      </div>
                    )}
                    {currentPage === 1 && (
                      <div>
                        <h3 className="text-2xl font-fredoka text-forest mb-4">Chapter 2: The Discovery</h3>
                        <p>As they wandered through the enchanted forest, something extraordinary caught their attention. It sparkled and shimmered in the morning sunlight...</p>
                      </div>
                    )}
                    {currentPage >= 2 && (
                      <div>
                        <h3 className="text-2xl font-fredoka text-forest mb-4">Chapter {currentPage + 1}: The Adventure Continues</h3>
                        <p>The story unfolds with more magical moments, valuable lessons, and wonderful discoveries about the natural world around us...</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center space-x-4">
                {currentPage > 0 && (
                  <Button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    variant="outline"
                    className="border-nature text-nature hover:bg-nature hover:text-white"
                    data-testid="button-previous-page"
                  >
                    ← Previous
                  </Button>
                )}
                
                {currentPage < totalPages - 1 ? (
                  <Button
                    onClick={nextPage}
                    className="bg-nature hover:bg-forest text-white"
                    data-testid="button-next-page"
                  >
                    Next →
                  </Button>
                ) : (
                  <Button
                    onClick={finishStory}
                    className="bg-coral hover:bg-red-500 text-white"
                    data-testid="button-finish-story"
                  >
                    🏁 Finish Story
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen magic-gradient py-12">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-fredoka text-white mb-4" data-testid="text-title">
            📚 Story Module Reader
          </h1>
          <p className="text-white/90 text-lg">
            Immerse yourself in magical tales that teach and inspire!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stories.map((story) => (
            <Card 
              key={story.id}
              className={`transition-all duration-200 ${
                story.isUnlocked 
                  ? 'hover:scale-105 backdrop-blur-sm bg-white/95 shadow-lg cursor-pointer' 
                  : 'opacity-60 backdrop-blur-sm bg-gray-100/50'
              }`}
              onClick={() => story.isUnlocked && startReading(story)}
              data-testid={`card-story-${story.id}`}
            >
              <CardHeader className="text-center">
                <div className={`text-6xl mb-3 ${story.isUnlocked ? 'animate-bounce-gentle' : 'opacity-50'}`}>
                  {story.coverEmoji}
                </div>
                <div className="flex justify-center mb-2">
                  <Badge className={getCategoryColor(story.category)}>
                    {story.category}
                  </Badge>
                </div>
                <CardTitle className={`text-lg font-fredoka ${story.isUnlocked ? 'text-forest' : 'text-gray-500'}`}>
                  {story.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className={`text-sm mb-4 ${story.isUnlocked ? 'text-forest/80' : 'text-gray-400'}`}>
                  {story.description}
                </p>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-xs text-forest/70">
                    <span>⏱️ {story.duration}</span>
                    <span>👶 Ages {story.ageGroup}</span>
                  </div>
                  
                  {story.progress > 0 && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-forest/80">Progress</span>
                        <span className="text-forest font-medium">{story.progress}%</span>
                      </div>
                      <Progress value={story.progress} className="h-1" />
                    </div>
                  )}

                  <div className="text-center">
                    {!story.isUnlocked ? (
                      <div className="px-3 py-2 bg-gray-200 text-gray-500 rounded-lg text-sm">
                        🔒 Complete previous stories to unlock
                      </div>
                    ) : story.isCompleted ? (
                      <div className="px-3 py-2 bg-nature/20 text-nature rounded-lg text-sm font-medium">
                        ✅ Completed
                      </div>
                    ) : story.progress > 0 ? (
                      <div className="px-3 py-2 bg-sunny/20 text-orange-800 rounded-lg text-sm font-medium">
                        📖 Continue Reading
                      </div>
                    ) : (
                      <div className="px-3 py-2 bg-turquoise/20 text-teal-800 rounded-lg text-sm font-medium">
                        🚀 Start Reading
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}