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
    <div className="min-h-screen bg-gradient-to-br from-sage/5 via-background to-mint relative">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-16 left-8 text-emerald/20 text-3xl animate-subtle-float">🇺🇭</div>
        <div className="absolute top-28 right-12 text-forest/20 text-2xl animate-subtle-float stagger-1">🌿</div>
        <div className="absolute bottom-32 left-16 text-ocean/20 text-3xl animate-subtle-float stagger-2">🌍</div>
        <div className="absolute bottom-16 right-8 text-emerald/20 text-2xl animate-subtle-float stagger-3">✨</div>
      </div>
      
      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-display text-foreground mb-6 animate-fade-in" data-testid="text-title">
            <span className="text-emerald">🗺️</span> Explore <span className="text-gradient">Thailandia</span>
          </h1>
          <p className="text-muted-foreground text-xl md:text-2xl animate-fade-in stagger-1 text-balance leading-relaxed max-w-3xl mx-auto">
            Discover diverse ecosystems and embark on educational adventures across different zones of our natural world.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {zones.map((zone, index) => (
            <Card 
              key={zone.id}
              className={`cursor-pointer transition-all duration-300 animate-fade-in stagger-${Math.min(index + 1, 3)} ${
                zone.unlocked 
                  ? 'modern-card-interactive hover-lift hover-glow' 
                  : 'opacity-50 modern-card'
              } ${selectedZone === zone.id ? 'ring-2 ring-primary shadow-lg' : ''}`}
              onClick={() => handleZoneClick(zone)}
              data-testid={`card-zone-${zone.id}`}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <CardHeader className="text-center">
                <div className={`w-28 h-28 mx-auto rounded-full bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center text-6xl mb-6 shadow-lg hover:shadow-xl transition-all duration-300 ${
                  zone.unlocked ? 'animate-gentle-pulse hover:scale-110' : 'opacity-60'
                }`}>
                  {zone.emoji}
                </div>
                <CardTitle className={`text-2xl font-display font-bold ${zone.unlocked ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {zone.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className={`text-lg mb-6 leading-relaxed ${zone.unlocked ? 'text-muted-foreground' : 'text-muted-foreground/60'}`}>
                  {zone.description}
                </p>
                <div className="flex justify-center">
                  {zone.unlocked ? (
                    <div className="px-6 py-3 bg-primary/10 text-primary rounded-xl text-lg font-bold border border-primary/20 hover:bg-primary/20 transition-all duration-300">
                      ✨ Ready to Explore
                    </div>
                  ) : (
                    <div className="px-6 py-3 bg-muted text-muted-foreground rounded-xl text-lg font-medium">
                      🔒 Complete More Quests
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {selectedZone && (
          <div className="text-center animate-scale-in">
            <Card className="modern-card-elevated max-w-lg mx-auto">
              <CardContent className="pt-8">
                <div className="mb-8">
                  <div className="text-7xl mb-6 animate-gentle-pulse hover:scale-110 transition-all duration-300">{zones.find(z => z.id === selectedZone)?.emoji}</div>
                  <h3 className="text-3xl font-display text-foreground mb-6 font-bold">
                    Ready to explore <span className="text-gradient">{zones.find(z => z.id === selectedZone)?.name}</span>?
                  </h3>
                  <p className="text-muted-foreground text-xl mb-8 leading-relaxed font-medium">
                    Begin your educational adventure in this fascinating ecosystem.
                  </p>
                </div>
                
                <Button
                  onClick={handleExplore}
                  size="xl"
                  className="btn-primary text-2xl px-12 py-6 hover-lift font-bold shadow-lg"
                  data-testid="button-explore"
                >
                  <span className="mr-4 text-3xl">🚀</span>Start Exploration
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}