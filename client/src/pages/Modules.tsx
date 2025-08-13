import { useState, useEffect } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface LearningModule {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  duration: string;
  progress: number;
  isCompleted: boolean;
  lessons: number;
}

export default function Modules() {
  const [modules, setModules] = useState<LearningModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    loadModules();
  }, []);

  const loadModules = async () => {
    // TODO: Connect to Supabase learning_modules table
    // Temporary mock data
    const mockModules: LearningModule[] = [
      {
        id: '1',
        title: '🌱 Plant Life Cycle',
        description: 'Learn how plants grow from seeds to full maturity and reproduce.',
        difficulty: 'beginner',
        category: 'botany',
        duration: '30 min',
        progress: 100,
        isCompleted: true,
        lessons: 5,
      },
      {
        id: '2',
        title: '🦋 Butterfly Metamorphosis',
        description: 'Discover the amazing transformation from caterpillar to butterfly.',
        difficulty: 'beginner',
        category: 'biology',
        duration: '25 min',
        progress: 60,
        isCompleted: false,
        lessons: 4,
      },
      {
        id: '3',
        title: '🌊 Ocean Ecosystems',
        description: 'Explore the diverse life forms in marine environments.',
        difficulty: 'intermediate',
        category: 'ecology',
        duration: '45 min',
        progress: 0,
        isCompleted: false,
        lessons: 7,
      },
      {
        id: '4',
        title: '🌙 Nocturnal Animals',
        description: 'Meet the creatures that come alive when the sun goes down.',
        difficulty: 'intermediate',
        category: 'zoology',
        duration: '35 min',
        progress: 25,
        isCompleted: false,
        lessons: 6,
      },
      {
        id: '5',
        title: '🌿 Photosynthesis Deep Dive',
        description: 'Advanced study of how plants convert sunlight into energy.',
        difficulty: 'advanced',
        category: 'botany',
        duration: '60 min',
        progress: 0,
        isCompleted: false,
        lessons: 8,
      },
      {
        id: '6',
        title: '🌍 Climate Patterns',
        description: 'Understanding weather systems and their impact on nature.',
        difficulty: 'advanced',
        category: 'environmental',
        duration: '50 min',
        progress: 0,
        isCompleted: false,
        lessons: 9,
      },
    ];

    setModules(mockModules);
    setLoading(false);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-nature text-white';
      case 'intermediate':
        return 'bg-sunny text-black';
      case 'advanced':
        return 'bg-coral text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress === 100) return 'bg-nature';
    if (progress > 0) return 'bg-sunny';
    return 'bg-gray-300';
  };

  const filteredModules = modules.filter((module) => {
    if (filter === 'all') return true;
    return module.difficulty === filter;
  });

  const completedModules = modules.filter((m) => m.isCompleted).length;
  const totalModules = modules.length;

  if (loading) {
    return (
      <div className="min-h-screen magic-gradient py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading learning modules...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen magic-gradient py-12">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-fredoka text-white mb-4" data-testid="text-title">
            📚 Learning Modules
          </h1>
          <p className="text-white/90 text-lg mb-6">
            Structured lessons to deepen your understanding of nature!
          </p>

          <Card className="backdrop-blur-sm bg-white/95 border-nature/20 shadow-xl mb-8">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-fredoka text-forest mb-2">
                  Your Progress: {completedModules} / {totalModules} Modules Complete
                </div>
                <Progress
                  value={(completedModules / totalModules) * 100}
                  className="w-full max-w-md mx-auto h-3"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter Buttons */}
        <div className="flex justify-center mb-8 space-x-4">
          {['all', 'beginner', 'intermediate', 'advanced'].map((level) => (
            <Button
              key={level}
              onClick={() => setFilter(level)}
              variant={filter === level ? 'default' : 'outline'}
              className={
                filter === level
                  ? 'bg-nature text-white'
                  : 'border-white text-white hover:bg-white hover:text-forest'
              }
              data-testid={`button-filter-${level}`}
            >
              {level === 'all' ? 'All Levels' : level.charAt(0).toUpperCase() + level.slice(1)}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredModules.map((module) => (
            <Card
              key={module.id}
              className="backdrop-blur-sm bg-white/95 border-nature/20 shadow-xl hover:scale-105 transition-all duration-200"
              data-testid={`card-module-${module.id}`}
            >
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-lg font-fredoka text-forest">{module.title}</CardTitle>
                  <Badge className={getDifficultyColor(module.difficulty)}>
                    {module.difficulty}
                  </Badge>
                </div>
                <p className="text-forest/80 text-sm">{module.description}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm text-forest/70">
                    <span>⏱️ {module.duration}</span>
                    <span>📖 {module.lessons} lessons</span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-forest/80">Progress</span>
                      <span className="text-forest font-medium">{module.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(module.progress)}`}
                        style={{ width: `${module.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <Button
                    className={`w-full ${
                      module.isCompleted
                        ? 'bg-nature text-white'
                        : module.progress > 0
                          ? 'bg-sunny hover:bg-yellow-500 text-black'
                          : 'bg-turquoise hover:bg-teal-600 text-white'
                    }`}
                    data-testid={`button-module-${module.id}`}
                  >
                    {module.isCompleted
                      ? '✅ Completed'
                      : module.progress > 0
                        ? '📖 Continue Learning'
                        : '🚀 Start Module'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
