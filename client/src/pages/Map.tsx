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
    <div className="min-h-screen magic-gradient py-12 relative overflow-hidden">
      {/* Floating magical elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="floating-element absolute top-16 left-8 text-4xl animate-sparkle">✨</div>
        <div className="floating-element absolute top-28 right-12 text-3xl animate-sparkle">🌟</div>
        <div className="floating-element absolute bottom-32 left-16 text-5xl animate-sparkle">🦋</div>
        <div className="floating-element absolute bottom-16 right-8 text-4xl animate-sparkle">🌈</div>
        <div className="floating-element absolute top-48 left-1/4 text-3xl animate-sparkle">🍃</div>
        <div className="floating-element absolute bottom-48 right-1/4 text-4xl animate-sparkle">🌺</div>
        <div className="floating-element absolute top-80 right-1/3 text-3xl animate-sparkle">⭐</div>
        <div className="floating-element absolute bottom-80 left-1/3 text-4xl animate-sparkle">🎄</div>
      </div>
      
      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-fredoka text-gradient-rainbow mb-4 animate-bounce-in" data-testid="text-title">
            🗺️ Magical Map of Thailandia 🗺️
          </h1>
          <p className="text-white/90 text-xl animate-fade-in-delay magical-shadow">
            ✨ Explore the magical realms and discover hidden secrets in each zone! ✨
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {zones.map((zone, index) => (
            <Card 
              key={zone.id}
              className={`cursor-pointer transition-all duration-500 animate-fade-in-stagger ${
                zone.unlocked 
                  ? 'kid-friendly-card hover:scale-110 hover-wiggle' 
                  : 'opacity-50 kid-friendly-card'
              } ${selectedZone === zone.id ? 'ring-4 ring-magic ring-opacity-50 animate-pulse-glow' : ''}`}
              onClick={() => handleZoneClick(zone)}
              data-testid={`card-zone-${zone.id}`}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <CardHeader className="text-center">
                <div className={`w-24 h-24 mx-auto rounded-full bg-gradient-to-br ${zone.color} flex items-center justify-center text-4xl mb-4 magical-shadow-lg ${
                  zone.unlocked ? 'animate-bounce-gentle' : 'opacity-60'
                }`}>
                  {zone.emoji}
                </div>
                <CardTitle className={`text-2xl font-fredoka ${zone.unlocked ? 'text-magic' : 'text-gray-500'}`}>
                  {zone.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className={`text-sm mb-4 ${zone.unlocked ? 'text-forest' : 'text-gray-400'}`}>
                  {zone.description}
                </p>
                <div className="flex justify-center">
                  {zone.unlocked ? (
                    <div className="px-4 py-2 bg-nature/30 text-nature rounded-2xl text-sm font-fredoka font-bold magical-shadow hover-bounce">
                      ✨ Ready to Explore! ✨
                    </div>
                  ) : (
                    <div className="px-4 py-2 bg-gray-200 text-gray-500 rounded-2xl text-sm font-fredoka">
                      🔒 Complete More Quests 🔒
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {selectedZone && (
          <div className="text-center animate-bounce-in">
            <Card className="kid-friendly-card magical-shadow-lg">
              <CardContent className="pt-8">
                <div className="mb-6">
                  <div className="text-6xl mb-4 animate-wiggle">{zones.find(z => z.id === selectedZone)?.emoji}</div>
                  <h3 className="text-3xl font-fredoka text-gradient-rainbow mb-3">
                    Ready to explore {zones.find(z => z.id === selectedZone)?.name}?
                  </h3>
                  <p className="text-forest text-lg mb-6">
                    ✨ Begin your magical adventure in this enchanted realm! ✨
                  </p>
                </div>
                
                <Button
                  onClick={handleExplore}
                  className="kid-friendly-button text-xl px-12 py-6 animate-bounce-gentle"
                  data-testid="button-explore"
                >
                  🚀 Start Your Adventure! 🚀
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}