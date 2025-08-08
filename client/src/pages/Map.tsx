import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

// Import character assets for storybook integration
import TurianDurianImg from "../assets/Turian the Durian.png";
import DrPImg from "../assets/Dr P.png";
import FrankieFrogsImg from "../assets/Frankie Frogs.png";
import BluButterflyImg from "../assets/Blu Butterfly.png";
import MangoMikeImg from "../assets/Mango Mike.png";
import TommyTukTukImg from "../assets/Tommy Tuk Tuk.png";
import GuideImg from "../assets/Guide.png";
import JaySingImg from "../assets/Jay-Sing.png";

interface Zone {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  emoji: string;
  color: string;
}

export default function Map() {
  const [location, setLocation] = useLocation();
  const [selectedZone, setSelectedZone] = useState<string | null>(null);

  const zones: Zone[] = [
    {
      id: "thailandia",
      name: "Thailandia",
      description: "🏰 The enchanted kingdom where Turian guides brave explorers through magical temples and golden lotus fields!",
      unlocked: true,
      emoji: "🏛️",
      color: "from-emerald/20 to-turquoise/20"
    },
    {
      id: "crystal-caves",
      name: "Crystal Caves",
      description: "💎 Deep underground wonderland where Dr P teaches the secrets of sparkling gemstones and crystal magic!",
      unlocked: true,
      emoji: "💎",
      color: "from-magic/20 to-coral/20"
    },
    {
      id: "floating-gardens",
      name: "Floating Gardens",
      description: "🌺 Sky-high botanical paradise where Blu Butterfly dances among clouds and rainbow blooms!",
      unlocked: false,
      emoji: "🌸",
      color: "from-sunny/20 to-magic/20"
    },
    {
      id: "whispering-woods",
      name: "Whispering Woods",
      description: "🌲 Ancient enchanted forest where Guide shares the old tree's wisdom and forest creature secrets!",
      unlocked: false,
      emoji: "🌲",
      color: "from-forest/20 to-sage/20"
    },
    {
      id: "starlight-seas",
      name: "Starlight Seas",
      description: "🌊 Glowing oceanic realm where Mango Mike explores bioluminescent waters and starfish villages!",
      unlocked: false,
      emoji: "🌊",
      color: "from-ocean/20 to-turquoise/20"
    },
    {
      id: "ember-peaks",
      name: "Ember Peaks",
      description: "🌋 Fiery mountain adventure where Tommy Tuk Tuk races through volcanic valleys and lava streams!",
      unlocked: false,
      emoji: "🌋",
      color: "from-coral/20 to-sunset/20"
    }
  ];

  const handleZoneClick = (zone: Zone) => {
    if (!zone.unlocked) return;
    setSelectedZone(zone.id);
  };

  const handleExplore = () => {
    if (selectedZone) {
      setLocation(`/zone/${selectedZone}`);
    }
  };

  return (
    <div className="min-h-screen hero-magical-bg relative overflow-hidden" style={{
      background: `
        radial-gradient(circle at 30% 40%, hsl(var(--emerald) / 0.15) 0%, transparent 50%),
        radial-gradient(circle at 70% 70%, hsl(var(--magic) / 0.12) 0%, transparent 50%),
        radial-gradient(circle at 20% 80%, hsl(var(--sparkle) / 0.1) 0%, transparent 40%),
        radial-gradient(circle at 90% 20%, hsl(var(--ocean) / 0.1) 0%, transparent 45%),
        radial-gradient(circle at 50% 10%, hsl(var(--coral) / 0.08) 0%, transparent 35%),
        linear-gradient(135deg, hsl(var(--mint)) 0%, hsl(var(--background)) 40%, hsl(var(--storybook-blue) / 0.3) 70%, hsl(var(--storybook-purple) / 0.2) 100%)
      `,
      backgroundAttachment: 'fixed',
      backgroundSize: '200% 200%, 200% 200%, 150% 150%, 150% 150%, 100% 100%, 100% 100%',
      animation: 'gradient-shift 12s ease-in-out infinite'
    }}>
      {/* Enhanced Magical Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Map Elements */}
        <div className="absolute top-20 left-10 text-emerald/40 text-5xl animate-sparkle-twinkle float-1">🗺️</div>
        <div className="absolute top-32 right-20 text-magic/40 text-4xl animate-sparkle-twinkle float-2">✨</div>
        <div className="absolute bottom-40 left-20 text-ocean/40 text-6xl animate-sparkle-twinkle float-3">🏝️</div>
        <div className="absolute bottom-20 right-10 text-emerald/40 text-4xl animate-sparkle-twinkle stagger-1">🌟</div>
        <div className="absolute top-1/2 left-5 text-coral/30 text-3xl animate-magical-bounce stagger-2">🧭</div>
        <div className="absolute top-1/3 right-5 text-sparkle/30 text-5xl animate-magical-bounce stagger-3">⭐</div>
        
        {/* Adventure Elements */}
        <div className="absolute top-16 left-1/4 text-forest/30 text-4xl animate-character-float stagger-4">🌲</div>
        <div className="absolute top-40 right-1/4 text-turquoise/30 text-3xl animate-character-float stagger-5">🌊</div>
        <div className="absolute bottom-60 left-1/3 text-sunset/30 text-5xl animate-character-float stagger-6">🌋</div>
        <div className="absolute bottom-80 right-1/3 text-magic/30 text-4xl animate-character-float stagger-7">💎</div>
        <div className="absolute top-60 left-16 text-sunny/30 text-3xl animate-sparkle-pop stagger-8">🌸</div>
        <div className="absolute top-80 right-16 text-emerald/40 text-4xl animate-sparkle-pop stagger-1">🏛️</div>
        
        {/* Character Shadows in Background */}
        <div className="absolute top-1/4 left-8 opacity-20 animate-character-float">
          <img src={TurianDurianImg} alt="" className="w-12 h-12 object-contain filter blur-sm" />
        </div>
        <div className="absolute bottom-1/4 right-8 opacity-20 animate-character-float float-2">
          <img src={BluButterflyImg} alt="" className="w-10 h-10 object-contain filter blur-sm" />
        </div>
        <div className="absolute top-2/3 left-1/4 opacity-15 animate-character-float float-3">
          <img src={DrPImg} alt="" className="w-8 h-8 object-contain filter blur-sm" />
        </div>
        <div className="absolute bottom-1/3 right-1/4 opacity-15 animate-character-float float-1">
          <img src={GuideImg} alt="" className="w-8 h-8 object-contain filter blur-sm" />
        </div>
      </div>
      
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        {/* Storybook Map Header */}
        <div className="text-center mb-16 book-open-effect pt-12">
          <div className="relative mb-8">
            <h1 className="storybook-title text-hero text-display mb-8 animate-hero-entrance floating-sparkles character-entrance" data-testid="text-title">
              <span className="text-6xl animate-sparkle-twinkle inline-block">🗺️</span>
              <span className="text-gradient drop-shadow-2xl">Adventure Map</span>
              <span className="text-6xl animate-sparkle-twinkle inline-block ml-4">🌟</span>
            </h1>
            {/* Floating sparkles around title */}
            <div className="absolute -top-8 left-1/4 text-sparkle/60 text-4xl animate-sparkle-pop stagger-1">✨</div>
            <div className="absolute -top-4 right-1/4 text-magic/60 text-3xl animate-sparkle-pop stagger-2">🌟</div>
            <div className="absolute -bottom-4 left-1/3 text-emerald/60 text-3xl animate-sparkle-pop stagger-3">⭐</div>
            <div className="absolute -top-6 left-1/6 text-coral/60 text-2xl animate-sparkle-pop stagger-4">🏝️</div>
            <div className="absolute -bottom-2 right-1/3 text-ocean/60 text-2xl animate-sparkle-pop stagger-5">🧭</div>
          </div>
          
          <div className="relative mb-12">
            <p className="text-sub-hero text-body-relaxed animate-hero-entrance stagger-1 text-balance leading-relaxed font-bold text-storybook-glow character-entrance max-w-4xl mx-auto">
              <span className="text-4xl animate-sparkle-twinkle">🧚‍♀️</span> Choose your next <span className="text-magic font-black text-magic-glow">magical destination</span>! 
              Each realm holds <span className="text-emerald font-black text-magic-glow">incredible secrets</span>, 
              <span className="text-sparkle font-black text-magic-glow">amazing creatures</span>, and 
              <span className="bg-gradient-to-r from-sunset to-amber bg-clip-text text-transparent font-black text-magic-glow">epic adventures</span> waiting for you! <span className="text-4xl animate-sparkle-twinkle">✨</span>
            </p>
            <div className="absolute -left-8 top-2 animate-character-float">
              <img src={JaySingImg} alt="Jay-Sing" className="w-12 h-12 object-contain drop-shadow-lg opacity-80" />
            </div>
            <div className="absolute -right-8 bottom-2 animate-character-float float-2">
              <img src={FrankieFrogsImg} alt="Frankie Frogs" className="w-10 h-10 object-contain drop-shadow-lg opacity-80" />
            </div>
          </div>
        </div>

        {/* Enhanced Storybook Zone Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 mb-16">
          {zones.map((zone, index) => (
            <Card 
              key={zone.id}
              className={`cursor-pointer transition-all duration-500 animate-hero-entrance character-entrance ${
                zone.unlocked 
                  ? 'card-playful hover:scale-105 hover-lift' 
                  : 'opacity-60 card-playful'
              } ${selectedZone === zone.id ? 'ring-4 ring-magic/60 shadow-2xl scale-105' : ''} p-8`}
              onClick={() => handleZoneClick(zone)}
              data-testid={`card-zone-${zone.id}`}
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <CardHeader className="text-center pb-6">
                <div className={`relative w-36 h-36 mx-auto rounded-full bg-gradient-to-br ${zone.color} backdrop-blur-sm border-4 border-white/30 flex items-center justify-center text-7xl mb-8 shadow-2xl transition-all duration-500 ${
                  zone.unlocked ? 'animate-magical-pulse hover:scale-110 hover:shadow-magical' : 'opacity-60'
                }`}>
                  {zone.emoji}
                  {zone.unlocked && (
                    <>
                      <div className="absolute -top-3 -right-3 text-3xl animate-sparkle-twinkle">✨</div>
                      <div className="absolute -bottom-3 -left-3 text-2xl animate-sparkle-twinkle stagger-1">⭐</div>
                    </>
                  )}
                  {!zone.unlocked && (
                    <div className="absolute -top-2 -right-2 text-3xl opacity-80">🔒</div>
                  )}
                </div>
                <CardTitle className={`text-3xl font-display font-bold mb-4 ${
                  zone.unlocked ? 'text-gradient drop-shadow-lg' : 'text-muted-foreground'
                }`}>
                  {zone.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className={`text-lg mb-8 leading-relaxed font-medium ${
                  zone.unlocked ? 'text-foreground/90' : 'text-muted-foreground/60'
                } text-balance`}>
                  {zone.description}
                </p>
                <div className="flex justify-center">
                  {zone.unlocked ? (
                    <div className="storybook-button text-lg px-8 py-4 rounded-2xl font-bold text-emerald border-2 border-emerald/30 bg-gradient-to-r from-emerald/10 to-mint/20 hover:from-emerald to-magic hover:text-white transition-all duration-300 hover:scale-105 hover:shadow-xl backdrop-blur-sm">
                      <span className="text-2xl mr-3 animate-sparkle-twinkle">✨</span>
                      Ready to Explore!
                      <span className="text-2xl ml-3 animate-sparkle-twinkle">🌟</span>
                    </div>
                  ) : (
                    <div className="px-8 py-4 bg-muted/60 text-muted-foreground rounded-2xl text-lg font-medium border border-muted-foreground/20">
                      <span className="text-xl mr-2">🔒</span>
                      Complete More Adventures
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {selectedZone && (
          <div className="text-center animate-hero-entrance character-entrance">
            <Card className="card-playful max-w-2xl mx-auto p-12 border-4 border-magic/40 shadow-magical relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-br from-sparkle/10 to-magic/10 pointer-events-none"></div>
              <CardContent className="relative z-10">
                <div className="mb-12">
                  <div className="relative mb-8">
                    <div className="text-8xl mb-6 animate-magical-pulse hover:scale-110 transition-all duration-500 drop-shadow-2xl">
                      {zones.find(z => z.id === selectedZone)?.emoji}
                    </div>
                    {/* Floating sparkles around selected emoji */}
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4 text-sparkle/80 text-3xl animate-sparkle-twinkle">✨</div>
                    <div className="absolute bottom-0 left-1/4 text-magic/80 text-2xl animate-sparkle-twinkle stagger-1">⭐</div>
                    <div className="absolute bottom-0 right-1/4 text-emerald/80 text-2xl animate-sparkle-twinkle stagger-2">🌟</div>
                  </div>
                  
                  <h3 className="storybook-title text-4xl font-display mb-8 font-bold floating-sparkles">
                    <span className="text-4xl animate-sparkle-twinkle mr-4">🎭</span>
                    Ready for <span className="text-gradient drop-shadow-lg">{zones.find(z => z.id === selectedZone)?.name}</span>?
                    <span className="text-4xl animate-sparkle-twinkle ml-4">🎭</span>
                  </h3>
                  
                  <p className="text-foreground/90 text-2xl mb-12 leading-relaxed font-bold text-storybook-glow text-balance">
                    <span className="text-3xl animate-sparkle-twinkle">🧚‍♀️</span> Begin your <span className="text-magic font-black text-magic-glow">magical adventure</span> in this 
                    <span className="text-emerald font-black text-magic-glow"> enchanting realm</span>! <span className="text-3xl animate-sparkle-twinkle">✨</span>
                  </p>
                </div>
                
                <Button
                  onClick={handleExplore}
                  size="xxl"
                  className="storybook-button text-3xl px-20 py-10 hover-lift animate-magical-pulse shadow-2xl font-bold"
                  data-testid="button-explore"
                >
                  <span className="mr-6 text-4xl animate-sparkle-twinkle">🚀</span>
                  <span className="font-bold text-shadow">Start Epic Journey!</span>
                  <span className="ml-6 text-4xl animate-sparkle-twinkle">⭐</span>
                </Button>
              </CardContent>
              
              {/* Floating character for selected zone */}
              <div className="absolute top-4 right-4 animate-character-float opacity-60">
                <img src={TommyTukTukImg} alt="Adventure Guide" className="w-16 h-16 object-contain drop-shadow-lg" />
              </div>
              <div className="absolute bottom-4 left-4 animate-character-float float-2 opacity-60">
                <img src={MangoMikeImg} alt="Guide" className="w-12 h-12 object-contain drop-shadow-lg" />
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}