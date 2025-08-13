import { useState, useEffect } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface SavedContent {
  id: string;
  title: string;
  type: 'navatar' | 'story' | 'quiz' | 'music' | 'achievement';
  description: string;
  createdAt: string;
  data: any;
  category?: string;
}

export default function Codex() {
  const [savedContent, setSavedContent] = useState<SavedContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    loadSavedContent();
  }, []);

  const loadSavedContent = async () => {
    // TODO: Connect to Supabase user_saved_content table
    // Temporary mock data
    const mockContent: SavedContent[] = [
      {
        id: '1',
        title: 'Forest Spirit Navatar',
        type: 'navatar',
        description: 'My first magical nature avatar with mystical spirit powers',
        createdAt: '2024-01-15',
        data: { category: 'spirit', appearance: 'mystical forest creature' },
        category: 'spirits',
      },
      {
        id: '2',
        title: 'The Magical Seed - Completed',
        type: 'story',
        description: 'Finished reading this beautiful story about growth and magic',
        createdAt: '2024-01-14',
        data: { progress: 100, rating: 5 },
      },
      {
        id: '3',
        title: 'Nature Symphony',
        type: 'music',
        description: 'My first composed melody using forest sounds and bird songs',
        createdAt: '2024-01-12',
        data: { instruments: ['wind-chimes', 'forest-piano'], duration: '2:30' },
      },
      {
        id: '4',
        title: 'Plant Life Expert',
        type: 'achievement',
        description: 'Earned for scoring 100% on the Plant Kingdom Basics quiz',
        createdAt: '2024-01-10',
        data: { badgeType: 'quiz-master', subject: 'botany' },
      },
      {
        id: '5',
        title: 'Ocean Depths Quiz - Perfect Score',
        type: 'quiz',
        description: 'Achieved a perfect score on the ocean ecosystem knowledge test',
        createdAt: '2024-01-08',
        data: { score: 100, attempts: 1, difficulty: 'intermediate' },
      },
      {
        id: '6',
        title: 'Butterfly Navatar',
        type: 'navatar',
        description: 'Colorful insect avatar inspired by monarch butterflies',
        createdAt: '2024-01-05',
        data: { category: 'insect', appearance: 'monarch butterfly with rainbow wings' },
        category: 'insects',
      },
    ];

    setSavedContent(mockContent);
    setLoading(false);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'navatar':
        return '🎨';
      case 'story':
        return '📚';
      case 'quiz':
        return '🧠';
      case 'music':
        return '🎵';
      case 'achievement':
        return '🏆';
      default:
        return '📄';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'navatar':
        return 'bg-magic text-white';
      case 'story':
        return 'bg-nature text-white';
      case 'quiz':
        return 'bg-turquoise text-white';
      case 'music':
        return 'bg-sunny text-black';
      case 'achievement':
        return 'bg-coral text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const filteredContent =
    activeTab === 'all' ? savedContent : savedContent.filter((item) => item.type === activeTab);

  const contentByType = {
    all: savedContent.length,
    navatar: savedContent.filter((c) => c.type === 'navatar').length,
    story: savedContent.filter((c) => c.type === 'story').length,
    quiz: savedContent.filter((c) => c.type === 'quiz').length,
    music: savedContent.filter((c) => c.type === 'music').length,
    achievement: savedContent.filter((c) => c.type === 'achievement').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen magic-gradient py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading your codex...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen magic-gradient py-12">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-fredoka text-white mb-4" data-testid="text-title">
            📖 Your Personal Codex
          </h1>
          <p className="text-white/90 text-lg">
            Your collection of saved content, achievements, and magical creations!
          </p>
        </div>

        {/* Summary Stats */}
        <Card className="backdrop-blur-sm bg-white/95 border-nature/20 shadow-xl mb-8">
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-center">
              <div>
                <div className="text-2xl font-fredoka text-forest">{contentByType.all}</div>
                <div className="text-sm text-forest/70">Total Items</div>
              </div>
              <div>
                <div className="text-2xl font-fredoka text-magic">{contentByType.navatar}</div>
                <div className="text-sm text-forest/70">🎨 Navatars</div>
              </div>
              <div>
                <div className="text-2xl font-fredoka text-nature">{contentByType.story}</div>
                <div className="text-sm text-forest/70">📚 Stories</div>
              </div>
              <div>
                <div className="text-2xl font-fredoka text-turquoise">{contentByType.quiz}</div>
                <div className="text-sm text-forest/70">🧠 Quizzes</div>
              </div>
              <div>
                <div className="text-2xl font-fredoka text-sunny">{contentByType.music}</div>
                <div className="text-sm text-forest/70">🎵 Music</div>
              </div>
              <div>
                <div className="text-2xl font-fredoka text-coral">{contentByType.achievement}</div>
                <div className="text-sm text-forest/70">🏆 Achievements</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content Tabs */}
        <Card className="backdrop-blur-sm bg-white/95 border-nature/20 shadow-xl">
          <CardHeader>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="all" data-testid="tab-all">
                  All ({contentByType.all})
                </TabsTrigger>
                <TabsTrigger value="navatar" data-testid="tab-navatar">
                  🎨 ({contentByType.navatar})
                </TabsTrigger>
                <TabsTrigger value="story" data-testid="tab-story">
                  📚 ({contentByType.story})
                </TabsTrigger>
                <TabsTrigger value="quiz" data-testid="tab-quiz">
                  🧠 ({contentByType.quiz})
                </TabsTrigger>
                <TabsTrigger value="music" data-testid="tab-music">
                  🎵 ({contentByType.music})
                </TabsTrigger>
                <TabsTrigger value="achievement" data-testid="tab-achievement">
                  🏆 ({contentByType.achievement})
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            {filteredContent.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4 opacity-50">📭</div>
                <h3 className="text-xl font-fredoka text-forest mb-2">No items yet</h3>
                <p className="text-forest/70">
                  {activeTab === 'all'
                    ? 'Start exploring The Naturverse to collect your first items!'
                    : `Create or complete ${activeTab} content to see it here.`}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredContent.map((item) => (
                  <Card
                    key={item.id}
                    className="hover:scale-105 transition-all duration-200 cursor-pointer border-l-4 border-l-transparent hover:border-l-nature"
                    data-testid={`card-content-${item.id}`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start mb-2">
                        <div className="text-3xl">{getTypeIcon(item.type)}</div>
                        <Badge className={getTypeColor(item.type)}>{item.type}</Badge>
                      </div>
                      <CardTitle className="text-lg font-fredoka text-forest leading-tight">
                        {item.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-forest/80 text-sm mb-3">{item.description}</p>

                      <div className="flex justify-between items-center mb-3">
                        <span className="text-xs text-forest/60">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                        {item.category && (
                          <Badge variant="secondary" className="text-xs">
                            {item.category}
                          </Badge>
                        )}
                      </div>

                      {/* Type-specific data display */}
                      {item.type === 'quiz' && item.data.score && (
                        <div className="text-center mb-3">
                          <div className="text-lg font-fredoka text-nature">
                            Score: {item.data.score}%
                          </div>
                        </div>
                      )}

                      {item.type === 'music' && item.data.duration && (
                        <div className="text-center mb-3">
                          <div className="text-sm text-forest/70">
                            ⏱️ Duration: {item.data.duration}
                          </div>
                        </div>
                      )}

                      <Button
                        size="sm"
                        className="w-full bg-nature hover:bg-forest text-white"
                        data-testid={`button-view-${item.id}`}
                      >
                        👁️ View Details
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
