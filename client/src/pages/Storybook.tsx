import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Official Naturverse™ Assets
import TurianLogo from "@assets/turian_media_logo_transparent.png";
import TurianCharacter from "@assets/Turian_1754677394027.jpg";
import StorybookScene from "@assets/Storybook img_1754673794866.jpg";
import ShroomForest from "@assets/Shroom forest_1754673794866.jpg";

// Character Assets for Stories
import CoconutCruze from "@assets/Coconut Cruze_1754677394021.png";
import BluButterfly from "@assets/Blu Butterfly_1754677394021.png";
import FrankieFrogs from "@assets/Frankie Frogs_1754677394022.png";
import DrP from "@assets/Dr P_1754677394022.png";
import JaySing from "@assets/Jay-Sing_1754677394023.png";
import NikkiMT from "@assets/Nikki MT_1754677394025.png";
import PineapplePapa from "@assets/Pineapple Pa-Pa_1754677394026.png";
import TommyTukTuk from "@assets/Tommy Tuk Tuk_1754677394026.png";

interface Story {
  id: string;
  title: string;
  description: string;
  character: string;
  characterImage: string;
  category: "adventure" | "educational" | "magical";
  duration: string;
  ageGroup: string;
  isUnlocked: boolean;
  isCompleted: boolean;
  progress: number;
  lessonTopic: string;
}

export default function Storybook() {
  const [stories, setStories] = useState<Story[]>([]);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [isReading, setIsReading] = useState(false);

  useEffect(() => {
    loadStories();
  }, []);

  const loadStories = async () => {
    // Authentic Naturverse stories featuring real characters
    const naturverseStories: Story[] = [
      {
        id: "turian-durian-kingdom",
        title: "Turian's Durian Kingdom",
        description: "Join Turian as he shows you the magical world of tropical fruits and teaches about nature's bounty!",
        character: "Turian the Durian",
        characterImage: TurianCharacter,
        category: "educational",
        duration: "12 min",
        ageGroup: "6-10",
        isUnlocked: true,
        isCompleted: true,
        progress: 100,
        lessonTopic: "Tropical Fruits & Plants"
      },
      {
        id: "coconut-cruze-beach",
        title: "Coconut Cruze's Beach Adventure",
        description: "Sail with Coconut Cruze along beautiful coastlines and discover amazing ocean creatures!",
        character: "Coconut Cruze",
        characterImage: CoconutCruze,
        category: "adventure",
        duration: "15 min",
        ageGroup: "7-11",
        isUnlocked: true,
        isCompleted: false,
        progress: 60,
        lessonTopic: "Ocean Ecosystems"
      },
      {
        id: "blue-butterfly-pollination",
        title: "Blue Butterfly's Flower Garden",
        description: "Dance with Blue Butterfly through colorful meadows and learn how pollination works!",
        character: "Blue Butterfly",
        characterImage: BluButterfly,
        category: "educational",
        duration: "10 min",
        ageGroup: "5-8",
        isUnlocked: true,
        isCompleted: true,
        progress: 100,
        lessonTopic: "Pollination & Lifecycles"
      },
      {
        id: "frankie-frogs-pond",
        title: "Frankie Frogs' Pond Mystery",
        description: "Explore the wetlands with Frankie Frogs and discover the secrets of amphibian life!",
        character: "Frankie Frogs",
        characterImage: FrankieFrogs,
        category: "adventure",
        duration: "13 min",
        ageGroup: "8-12",
        isUnlocked: true,
        isCompleted: false,
        progress: 30,
        lessonTopic: "Amphibians & Wetland Habitats"
      },
      {
        id: "dr-p-laboratory",
        title: "Dr P's Amazing Experiments",
        description: "Conduct safe science experiments with Dr P and discover the wonders of chemistry and physics!",
        character: "Dr P",
        characterImage: DrP,
        category: "educational",
        duration: "18 min",
        ageGroup: "9-13",
        isUnlocked: false,
        isCompleted: false,
        progress: 0,
        lessonTopic: "Science & Experiments"
      },
      {
        id: "jay-sing-forest-concert",
        title: "Jay-Sing's Forest Concert",
        description: "Create beautiful melodies with Jay-Sing and learn about sound, music, and nature's orchestra!",
        character: "Jay-Sing",
        characterImage: JaySing,
        category: "magical",
        duration: "16 min",
        ageGroup: "6-10",
        isUnlocked: false,
        isCompleted: false,
        progress: 0,
        lessonTopic: "Music & Sound Waves"
      },
      {
        id: "nikki-mt-mountain-climb",
        title: "Nikki MT's Mountain Adventure",
        description: "Climb to new heights with Nikki MT and explore mountain ecosystems and weather patterns!",
        character: "Nikki MT",
        characterImage: NikkiMT,
        category: "adventure",
        duration: "20 min",
        ageGroup: "10-14",
        isUnlocked: false,
        isCompleted: false,
        progress: 0,
        lessonTopic: "Geography & Weather"
      },
      {
        id: "pineapple-papa-farm",
        title: "Pineapple Pa-Pa's Sustainable Farm",
        description: "Learn about sustainable farming and growing healthy food with Pineapple Pa-Pa!",
        character: "Pineapple Pa-Pa",
        characterImage: PineapplePapa,
        category: "educational",
        duration: "14 min",
        ageGroup: "8-12",
        isUnlocked: false,
        isCompleted: false,
        progress: 0,
        lessonTopic: "Sustainable Agriculture"
      },
      {
        id: "tommy-tuk-tuk-race",
        title: "Tommy Tuk Tuk's Great Race",
        description: "Join Tommy Tuk Tuk on an exciting race through different terrains and learn about transportation!",
        character: "Tommy Tuk Tuk",
        characterImage: TommyTukTuk,
        category: "adventure",
        duration: "11 min",
        ageGroup: "5-9",
        isUnlocked: false,
        isCompleted: false,
        progress: 0,
        lessonTopic: "Transportation & Energy"
      },
    ];
    
    setStories(naturverseStories);
    setLoading(false);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "adventure": return "border-orange-400 bg-orange-50";
      case "educational": return "border-green-400 bg-green-50";
      case "magical": return "border-purple-400 bg-purple-50";
      default: return "border-gray-400 bg-gray-50";
    }
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "adventure": return "bg-orange-500";
      case "educational": return "bg-green-500";
      case "magical": return "bg-purple-500";
      default: return "bg-gray-500";
    }
  };

  const startReading = (story: Story) => {
    if (!story.isUnlocked) return;
    setSelectedStory(story);
    setIsReading(true);
  };

  const completedStories = stories.filter(s => s.isCompleted).length;
  const totalStories = stories.length;
  const overallProgress = (completedStories / totalStories) * 100;

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
            Loading Your Storybook...
          </p>
        </div>
      </div>
    );
  }

  if (isReading && selectedStory) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* Story Reading View */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat" 
          style={{
            backgroundImage: `
              linear-gradient(
                135deg,
                rgba(0, 0, 0, 0.3) 0%,
                rgba(0, 0, 0, 0.5) 100%
              ),
              url(${StorybookScene})
            `,
          }}
        />
        
        <div className="relative z-10 min-h-screen flex items-center justify-center p-8">
          <Card className="bg-white/95 backdrop-blur-md border-4 border-yellow-400/80 shadow-2xl rounded-3xl max-w-4xl w-full">
            <CardHeader className="text-center bg-gradient-to-br from-yellow-50 to-orange-50">
              <div className="flex justify-center mb-4">
                <img 
                  src={selectedStory.characterImage} 
                  alt={selectedStory.character} 
                  className="w-24 h-24 rounded-full object-cover border-4 border-yellow-400 shadow-xl"
                />
              </div>
              <CardTitle className="text-3xl font-bold text-gray-700 mb-2" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                {selectedStory.title}
              </CardTitle>
              <p className="text-lg text-gray-600" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                A magical story with {selectedStory.character}
              </p>
            </CardHeader>
            
            <CardContent className="p-8 text-center">
              <div className="text-xl text-gray-700 mb-8 leading-relaxed" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                <p className="mb-6">
                  🌟 Once upon a time in The Naturverse, {selectedStory.character} discovered something amazing...
                </p>
                <p className="mb-6">
                  {selectedStory.description}
                </p>
                <p className="mb-6">
                  In this interactive story, you'll learn about <strong>{selectedStory.lessonTopic}</strong> while going on an incredible adventure!
                </p>
                <p className="text-lg text-green-700 font-bold">
                  🎯 Educational Goal: Master the concepts of {selectedStory.lessonTopic} through storytelling!
                </p>
              </div>
              
              <div className="flex justify-center space-x-4">
                <Button 
                  onClick={() => setIsReading(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-bold px-8 py-3 rounded-2xl"
                  style={{ fontFamily: 'Fredoka, sans-serif' }}
                >
                  ← Back to Library
                </Button>
                <Button 
                  className="btn-magical px-8 py-3"
                >
                  🎬 Start Interactive Story
                </Button>
              </div>
            </CardContent>
          </Card>
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
                📚 Naturverse Storybook ✨
              </h1>
              <p className="text-lg text-green-600" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                Interactive stories with your favorite characters!
              </p>
            </div>
          </div>

          {/* Progress Summary */}
          <div className="max-w-2xl mx-auto bg-white/95 backdrop-blur-sm p-6 rounded-3xl border-4 border-green-300/60 shadow-xl">
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-700" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                  {completedStories}
                </div>
                <div className="text-sm text-green-600" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                  Stories Read
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-700" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                  {stories.filter(s => s.isUnlocked).length}
                </div>
                <div className="text-sm text-blue-600" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                  Available
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-700" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                  {Math.round(overallProgress)}%
                </div>
                <div className="text-sm text-purple-600" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                  Progress
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

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {stories.map((story) => (
            <Card
              key={story.id}
              className={`transition-all duration-300 bg-white/95 backdrop-blur-sm border-4 ${getCategoryColor(story.category)} shadow-2xl rounded-3xl overflow-hidden hover:scale-105 ${
                story.isCompleted ? 'ring-4 ring-green-400' : ''
              } ${story.isUnlocked ? 'cursor-pointer' : 'opacity-60 cursor-not-allowed'}`}
              onClick={() => startReading(story)}
            >
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <img 
                      src={story.characterImage} 
                      alt={story.character} 
                      className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-xl bg-gradient-to-br from-white to-gray-100 p-1"
                    />
                    {story.isCompleted && (
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-400 rounded-full border-2 border-white flex items-center justify-center">
                        <span className="text-sm">📖</span>
                      </div>
                    )}
                    {story.progress > 0 && !story.isCompleted && (
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full border-2 border-white flex items-center justify-center">
                        <span className="text-sm">📚</span>
                      </div>
                    )}
                    {!story.isUnlocked && (
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-gray-400 rounded-full border-2 border-white flex items-center justify-center">
                        <span className="text-sm">🔒</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <CardTitle className="text-xl font-bold text-gray-700 mb-2" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                  {story.title}
                </CardTitle>
                
                <div className="flex justify-center space-x-2 mb-2">
                  <Badge className={`text-white ${getCategoryBadge(story.category)}`}>
                    {story.category}
                  </Badge>
                  <Badge variant="outline" className="font-bold">
                    {story.ageGroup}
                  </Badge>
                </div>
                
                <p className="text-sm text-gray-500 font-bold" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                  Duration: {story.duration} | Topic: {story.lessonTopic}
                </p>
              </CardHeader>

              <CardContent className="p-6">
                <p className="text-sm text-gray-600 mb-4" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                  {story.description}
                </p>
                
                {story.progress > 0 && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm font-bold text-gray-700 mb-2" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                      <span>Reading Progress</span>
                      <span>{story.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${
                          story.isCompleted 
                            ? 'bg-gradient-to-r from-green-500 to-green-600' 
                            : 'bg-gradient-to-r from-blue-400 to-blue-500'
                        }`}
                        style={{ width: `${story.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                <div className="text-center">
                  {!story.isUnlocked ? (
                    <div className="text-gray-500 font-bold" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                      🔒 Complete previous stories to unlock
                    </div>
                  ) : story.isCompleted ? (
                    <div className="text-green-600 font-bold" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                      ✅ Story Complete! 
                      <div className="text-sm mt-1">🔄 Read Again</div>
                    </div>
                  ) : story.progress > 0 ? (
                    <div className="text-blue-600 font-bold" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                      📖 Continue Reading
                    </div>
                  ) : (
                    <div className="text-purple-600 font-bold" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                      ✨ Start Adventure!
                    </div>
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
                  Choose a story to start learning! 📚
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