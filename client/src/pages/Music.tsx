import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MusicTool {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'compose' | 'play' | 'learn';
}

export default function Music() {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const musicTools: MusicTool[] = [
    {
      id: 'nature-composer',
      name: 'Nature Composer',
      description: 'Create melodies inspired by natural sounds and rhythms',
      icon: '🎵',
      category: 'compose',
    },
    {
      id: 'forest-piano',
      name: 'Forest Piano',
      description: 'Play virtual piano with nature-themed sound effects',
      icon: '🎹',
      category: 'play',
    },
    {
      id: 'animal-drums',
      name: 'Animal Drums',
      description: 'Drum beats that sound like different animal calls',
      icon: '🥁',
      category: 'play',
    },
    {
      id: 'wind-chimes',
      name: 'Magic Wind Chimes',
      description: 'Create ethereal melodies with mystical wind chimes',
      icon: '🎐',
      category: 'compose',
    },
    {
      id: 'rhythm-academy',
      name: 'Rhythm Academy',
      description: 'Learn basic music theory through interactive lessons',
      icon: '📚',
      category: 'learn',
    },
    {
      id: 'sound-garden',
      name: 'Sound Garden',
      description: 'Mix and match nature sounds to create ambient music',
      icon: '🌺',
      category: 'compose',
    },
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'compose':
        return 'bg-nature text-white';
      case 'play':
        return 'bg-turquoise text-white';
      case 'learn':
        return 'bg-sunny text-strong';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const handleToolSelect = (toolId: string) => {
    setSelectedTool(toolId);
    // TODO: Implement actual music tool functionality
  };

  const handlePlayDemo = () => {
    setIsPlaying(!isPlaying);
    // TODO: Implement audio playback
    setTimeout(() => setIsPlaying(false), 3000); // Demo simulation
  };

  return (
    <div className="min-h-screen magic-gradient py-12">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-fredoka text-white mb-4" data-testid="text-title">
            🎵 Music Zone
          </h1>
          <p className="text-white/90 text-lg">
            Compose, play, and learn music inspired by the sounds of nature!
          </p>
        </div>

        {!selectedTool ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {musicTools.map((tool) => (
              <Card
                key={tool.id}
                className="backdrop-blur-sm bg-white/95 border-nature/20 shadow-xl hover:scale-105 transition-all duration-200 cursor-pointer"
                onClick={() => handleToolSelect(tool.id)}
                data-testid={`card-tool-${tool.id}`}
              >
                <CardHeader className="text-center">
                  <div className="text-5xl mb-3 animate-bounce-gentle">{tool.icon}</div>
                  <div className="flex justify-center mb-2">
                    <Badge className={getCategoryColor(tool.category)}>{tool.category}</Badge>
                  </div>
                  <CardTitle className="text-xl font-fredoka text-forest">{tool.name}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-forest/80 text-sm mb-4">{tool.description}</p>
                  <Button
                    className="bg-turquoise hover:bg-teal-600 text-white"
                    data-testid={`button-select-${tool.id}`}
                  >
                    🎯 Select Tool
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <Card className="backdrop-blur-sm bg-white/95 border-nature/20 shadow-xl">
              <CardHeader className="text-center">
                <div className="flex justify-between items-center mb-4">
                  <Button
                    onClick={() => setSelectedTool(null)}
                    variant="outline"
                    className="border-nature text-nature hover:bg-nature hover:text-white"
                    data-testid="button-back"
                  >
                    ← Back to Tools
                  </Button>
                  <Badge
                    className={getCategoryColor(
                      musicTools.find((t) => t.id === selectedTool)?.category || '',
                    )}
                  >
                    {musicTools.find((t) => t.id === selectedTool)?.category}
                  </Badge>
                </div>
                <div className="text-6xl mb-4 animate-pulse-slow">
                  {musicTools.find((t) => t.id === selectedTool)?.icon}
                </div>
                <CardTitle className="text-3xl font-fredoka text-forest">
                  {musicTools.find((t) => t.id === selectedTool)?.name}
                </CardTitle>
                <p className="text-forest/80 text-lg mt-2">
                  {musicTools.find((t) => t.id === selectedTool)?.description}
                </p>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-6">
                  {/* Music Interface Placeholder */}
                  <div className="bg-gradient-to-br from-nature/10 to-turquoise/10 rounded-xl p-8 border-2 border-dashed border-nature/30">
                    <div className="text-4xl mb-4">🎼</div>
                    <h3 className="text-xl font-fredoka text-forest mb-4">
                      Interactive Music Interface
                    </h3>
                    <p className="text-forest/70 mb-6">
                      This is where the music creation magic happens!
                      {selectedTool === 'nature-composer' &&
                        ' Drag and drop nature sounds to create your melody.'}
                      {selectedTool === 'forest-piano' &&
                        ' Click the keys or use your keyboard to play beautiful sounds.'}
                      {selectedTool === 'animal-drums' &&
                        ' Tap the drums to hear different animal sounds and beats.'}
                      {selectedTool === 'wind-chimes' &&
                        ' Touch the chimes to create mystical, flowing melodies.'}
                      {selectedTool === 'rhythm-academy' &&
                        ' Follow along with the lessons to learn music fundamentals.'}
                      {selectedTool === 'sound-garden' &&
                        ' Mix nature sounds to create your perfect ambient soundscape.'}
                    </p>

                    <div className="flex justify-center space-x-4">
                      <Button
                        onClick={handlePlayDemo}
                        disabled={isPlaying}
                        className="bg-nature hover:bg-forest text-white px-6 py-3"
                        data-testid="button-play-demo"
                      >
                        {isPlaying ? '🎵 Playing...' : '▶️ Play Demo'}
                      </Button>
                      <Button
                        variant="outline"
                        className="border-turquoise text-turquoise hover:bg-turquoise hover:text-white px-6 py-3"
                        data-testid="button-save-composition"
                      >
                        💾 Save Creation
                      </Button>
                    </div>
                  </div>

                  {/* Quick Tips */}
                  <Card className="bg-sunny/10 border-sunny/30">
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-center space-x-2 mb-2">
                        <span className="text-xl">💡</span>
                        <span className="font-fredoka text-forest">Quick Tip</span>
                      </div>
                      <p className="text-forest/80 text-sm text-center">
                        {selectedTool === 'nature-composer' &&
                          'Try layering bird songs with water sounds for a peaceful forest ambiance!'}
                        {selectedTool === 'forest-piano' &&
                          'Hold down keys longer to create sustained, dreamy notes.'}
                        {selectedTool === 'animal-drums' &&
                          'Combine different animal sounds to create unique rhythm patterns.'}
                        {selectedTool === 'wind-chimes' &&
                          'Gentle touches create softer tones, while quick taps make brighter sounds.'}
                        {selectedTool === 'rhythm-academy' &&
                          'Practice daily for just 5 minutes to improve your musical skills!'}
                        {selectedTool === 'sound-garden' &&
                          'Start with rain sounds as your base, then add other nature elements slowly.'}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
