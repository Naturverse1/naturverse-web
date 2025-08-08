import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface Zone {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  emoji: string;
  color: string;
}

export default function Map() {
  const navigate = useNavigate();
  const [selectedZone, setSelectedZone] = useState<string | null>(null);

  const zones: Zone[] = [
    {
      id: "thailandia",
      name: "Thailandia",
      description: "The mystical heart of The Naturverse, filled with ancient wisdom and magical creatures.",
      unlocked: true,
      emoji: "🏛️",
      color: "from-nature/20 to-turquoise/20"
    },
    {
      id: "crystal-caves",
      name: "Crystal Caves",
      description: "Sparkling underground chambers where gemstones hold the secrets of earth's magic.",
      unlocked: true,
      emoji: "💎",
      color: "from-magic/20 to-coral/20"
    },
    {
      id: "floating-gardens",
      name: "Floating Gardens",
      description: "Suspended islands of flora that drift through misty clouds high above.",
      unlocked: false,
      emoji: "🌸",
      color: "from-sunny/20 to-nature/20"
    },
    {
      id: "whispering-woods",
      name: "Whispering Woods",
      description: "Ancient forest where trees share their wisdom with those who listen carefully.",
      unlocked: false,
      emoji: "🌲",
      color: "from-forest/20 to-nature/20"
    },
    {
      id: "starlight-seas",
      name: "Starlight Seas",
      description: "Bioluminescent waters that glow with the light of fallen stars.",
      unlocked: false,
      emoji: "🌊",
      color: "from-turquoise/20 to-magic/20"
    },
    {
      id: "ember-peaks",
      name: "Ember Peaks",
      description: "Volcanic mountains where fire sprites dance among the warm stone.",
      unlocked: false,
      emoji: "🌋",
      color: "from-coral/20 to-sunny/20"
    }
  ];

  const handleZoneClick = (zone: Zone) => {
    if (!zone.unlocked) return;
    setSelectedZone(zone.id);
  };

  const handleExplore = () => {
    if (selectedZone) {
      navigate(`/zone/${selectedZone}`);
    }
  };

  return (
    <div className="min-h-screen magic-gradient py-12">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-fredoka text-white mb-4" data-testid="text-title">
            🗺️ Interactive Map of Thailandia
          </h1>
          <p className="text-white/90 text-lg">
            Explore the magical realms and discover hidden secrets in each zone!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {zones.map((zone) => (
            <Card 
              key={zone.id}
              className={`cursor-pointer transition-all duration-300 ${
                zone.unlocked 
                  ? 'hover:scale-105 backdrop-blur-sm bg-white/95 shadow-lg' 
                  : 'opacity-60 backdrop-blur-sm bg-gray-100/50'
              } ${selectedZone === zone.id ? 'ring-2 ring-nature' : ''}`}
              onClick={() => handleZoneClick(zone)}
              data-testid={`card-zone-${zone.id}`}
            >
              <CardHeader className="text-center">
                <div className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-br ${zone.color} flex items-center justify-center text-3xl mb-3 ${
                  zone.unlocked ? 'animate-pulse-slow' : ''
                }`}>
                  {zone.emoji}
                </div>
                <CardTitle className={`text-xl font-fredoka ${zone.unlocked ? 'text-forest' : 'text-gray-500'}`}>
                  {zone.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className={`text-sm mb-4 ${zone.unlocked ? 'text-forest/80' : 'text-gray-400'}`}>
                  {zone.description}
                </p>
                <div className="flex justify-center">
                  {zone.unlocked ? (
                    <div className="px-3 py-1 bg-nature/20 text-nature rounded-full text-sm font-medium">
                      ✨ Available
                    </div>
                  ) : (
                    <div className="px-3 py-1 bg-gray-200 text-gray-500 rounded-full text-sm">
                      🔒 Locked
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {selectedZone && (
          <div className="text-center">
            <Card className="backdrop-blur-sm bg-white/95 border-nature/20 shadow-xl">
              <CardContent className="pt-6">
                <div className="mb-4">
                  <h3 className="text-2xl font-fredoka text-forest mb-2">
                    Ready to explore {zones.find(z => z.id === selectedZone)?.name}?
                  </h3>
                  <p className="text-forest/80 mb-4">
                    Begin your adventure in this magical realm!
                  </p>
                </div>
                
                <Button
                  onClick={handleExplore}
                  className="bg-nature hover:bg-forest text-white px-8 py-3"
                  data-testid="button-explore"
                >
                  🚀 Start Exploring
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}