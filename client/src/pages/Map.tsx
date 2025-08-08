import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

// Official Naturverse™ Assets
import TurianLogo from "@assets/turian_media_logo_transparent.png";
import TurianCharacter from "@assets/Turian_1754677394027.jpg";
import StorybookScene from "@assets/Storybook img_1754673794866.jpg";
import ShroomForest from "@assets/Shroom forest_1754673794866.jpg";

// Character Assets
import CoconutCruze from "@assets/Coconut Cruze_1754677394021.png";
import BluButterfly from "@assets/Blu Butterfly_1754677394021.png";
import FrankieFrogs from "@assets/Frankie Frogs_1754677394022.png";
import DrP from "@assets/Dr P_1754677394022.png";
import JaySing from "@assets/Jay-Sing_1754677394023.png";
import NikkiMT from "@assets/Nikki MT_1754677394025.png";
import PineapplePapa from "@assets/Pineapple Pa-Pa_1754677394026.png";
import TommyTukTuk from "@assets/Tommy Tuk Tuk_1754677394026.png";
import Snakers from "@assets/Snakers_1754677394026.png";
import Teeyor from "@assets/Teeyor_1754677394026.png";

interface Zone {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  character: string;
  characterImage: string;
  color: string;
  borderColor: string;
}

export default function Map() {
  const [location, setLocation] = useLocation();
  const [selectedZone, setSelectedZone] = useState<string | null>(null);

  const zones: Zone[] = [
    {
      id: "turian-kingdom",
      name: "Turian's Kingdom",
      description: "The magical durian kingdom where Turian teaches about tropical fruits and nature's wisdom!",
      unlocked: true,
      character: "Turian the Durian",
      characterImage: TurianCharacter,
      color: "from-green-400 to-green-600",
      borderColor: "border-green-400"
    },
    {
      id: "coconut-shores",
      name: "Coconut Shores",
      description: "Cruise with Coconut Cruze along beautiful beaches and learn about ocean life!",
      unlocked: true,
      character: "Coconut Cruze",
      characterImage: CoconutCruze,
      color: "from-blue-400 to-cyan-600",
      borderColor: "border-blue-400"
    },
    {
      id: "butterfly-meadows",
      name: "Butterfly Meadows",
      description: "Dance with Blue Butterfly through colorful flower fields and discover pollination magic!",
      unlocked: true,
      character: "Blue Butterfly",
      characterImage: BluButterfly,
      color: "from-purple-400 to-pink-600",
      borderColor: "border-purple-400"
    },
    {
      id: "frog-pond",
      name: "Frankie's Frog Pond",
      description: "Splash with Frankie Frogs and learn about amphibian life cycles and wetland ecosystems!",
      unlocked: true,
      character: "Frankie Frogs",
      characterImage: FrankieFrogs,
      color: "from-green-500 to-emerald-600",
      borderColor: "border-green-500"
    },
    {
      id: "doctor-lab",
      name: "Dr P's Lab",
      description: "Conduct exciting experiments with Dr P and discover the wonders of science!",
      unlocked: false,
      character: "Dr P",
      characterImage: DrP,
      color: "from-orange-400 to-red-500",
      borderColor: "border-orange-400"
    },
    {
      id: "singing-valley",
      name: "Jay-Sing Valley",
      description: "Make beautiful music with Jay-Sing and learn about sound, rhythm, and nature's orchestra!",
      unlocked: false,
      character: "Jay-Sing",
      characterImage: JaySing,
      color: "from-yellow-400 to-orange-500",
      borderColor: "border-yellow-400"
    },
    {
      id: "mountain-peaks",
      name: "Nikki's Mountain",
      description: "Climb high peaks with Nikki MT and explore mountain ecosystems and weather patterns!",
      unlocked: false,
      character: "Nikki MT",
      characterImage: NikkiMT,
      color: "from-indigo-400 to-blue-600",
      borderColor: "border-indigo-400"
    },
    {
      id: "pineapple-paradise",
      name: "Pineapple Paradise",
      description: "Explore tropical paradise with Pineapple Pa-Pa and learn about sustainable farming!",
      unlocked: false,
      character: "Pineapple Pa-Pa",
      characterImage: PineapplePapa,
      color: "from-yellow-500 to-amber-600",
      borderColor: "border-yellow-500"
    },
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

  const unlockedZones = zones.filter(z => z.unlocked).length;
  const totalZones = zones.length;

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
            url(${ShroomForest})
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
                🗺️ The Naturverse Map 🌍
              </h1>
              <p className="text-lg text-green-600" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                Choose your magical adventure destination!
              </p>
            </div>
          </div>

          {/* Progress */}
          <div className="max-w-md mx-auto bg-white/90 backdrop-blur-sm p-4 rounded-2xl border-4 border-green-300/60 shadow-xl">
            <p className="text-lg font-bold text-green-700 mb-2" style={{ fontFamily: 'Fredoka, sans-serif' }}>
              Exploration Progress: {unlockedZones}/{totalZones} Zones Unlocked
            </p>
            <div className="w-full bg-green-200 rounded-full h-4">
              <div 
                className="bg-gradient-to-r from-green-500 to-green-600 h-4 rounded-full transition-all duration-500"
                style={{ width: `${(unlockedZones / totalZones) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Map Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto mb-8">
          {zones.map((zone) => (
            <Card
              key={zone.id}
              className={`${
                zone.unlocked
                  ? `cursor-pointer hover:scale-105 ${selectedZone === zone.id ? 'ring-4 ring-yellow-400' : ''}`
                  : 'opacity-60 cursor-not-allowed'
              } transition-all duration-300 bg-white/95 backdrop-blur-sm border-4 ${zone.borderColor}/60 shadow-2xl rounded-3xl overflow-hidden`}
              onClick={() => handleZoneClick(zone)}
            >
              <CardHeader className={`text-center pb-4 bg-gradient-to-br ${zone.color}/20`}>
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <img 
                      src={zone.characterImage} 
                      alt={zone.character} 
                      className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-xl bg-gradient-to-br from-white to-gray-100 p-1"
                    />
                    {zone.unlocked && (
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-400 rounded-full border-2 border-white flex items-center justify-center">
                        <span className="text-sm">✓</span>
                      </div>
                    )}
                    {!zone.unlocked && (
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-gray-400 rounded-full border-2 border-white flex items-center justify-center">
                        <span className="text-sm">🔒</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <CardTitle className="text-xl font-bold text-gray-700 mb-2" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                  {zone.name}
                </CardTitle>
                <p className="text-sm text-gray-500 font-bold" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                  Guide: {zone.character}
                </p>
              </CardHeader>

              <CardContent className="text-center p-6">
                <p className="text-sm text-gray-600 mb-4" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                  {zone.description}
                </p>
                
                {zone.unlocked ? (
                  <div className="text-green-600 font-bold" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                    ✨ Ready to Explore! ✨
                  </div>
                ) : (
                  <div className="text-gray-500 font-bold" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                    🔒 Complete previous adventures to unlock
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Explore Button */}
        {selectedZone && (
          <div className="text-center">
            <Button 
              onClick={handleExplore}
              className="btn-magical text-2xl px-12 py-6 animate-bounce"
            >
              <span className="mr-3">🚀</span>
              Start Adventure!
              <span className="ml-3">✨</span>
            </Button>
          </div>
        )}

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
                  Choose your destination! 🗺️
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

        {/* Floating Characters */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-1/4 left-8 animate-float-bounce opacity-60" style={{animationDelay: '0s'}}>
            <div className="w-12 h-12 p-1 bg-white/60 rounded-2xl border-2 border-yellow-400 shadow-lg">
              <img 
                src={Snakers} 
                alt="Snakers" 
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
          </div>
          
          <div className="absolute top-1/3 right-12 animate-gentle-pulse opacity-50" style={{animationDelay: '2s'}}>
            <div className="w-10 h-10 p-1 bg-white/60 rounded-full border-2 border-pink-400 shadow-lg">
              <img 
                src={Teeyor} 
                alt="Teeyor" 
                className="w-full h-full object-cover rounded-full"
              />
            </div>
          </div>
          
          <div className="absolute bottom-1/4 left-1/4 animate-float-bounce opacity-40" style={{animationDelay: '1s'}}>
            <div className="w-14 h-14 p-1 bg-white/60 rounded-full border-2 border-blue-400 shadow-lg">
              <img 
                src={TommyTukTuk} 
                alt="Tommy Tuk Tuk" 
                className="w-full h-full object-cover rounded-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}