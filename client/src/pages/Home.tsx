import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

export default function Home() {
  const { user, loading } = useAuth();
  const [location, setLocation] = useLocation();

  useEffect(() => {
    // Redirect authenticated users to the map page
    if (user && !loading) {
      setLocation('/map');
    }
  }, [user, loading, setLocation]);

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
            Loading The Naturverse...
          </p>
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

      {/* Hero Section */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Naturverse™ Header */}
        <div className="text-center pt-12 pb-8">
          <div className="flex items-center justify-center bg-white/95 backdrop-blur-sm px-10 py-6 rounded-3xl shadow-2xl border-4 border-yellow-400/80 mx-auto max-w-fit">
            <img 
              src={TurianLogo} 
              alt="The Naturverse™" 
              className="w-20 h-20 mr-6"
            />
            <div>
              <h1 className="text-4xl md:text-6xl font-bold text-green-700" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                The Naturverse™
              </h1>
              <p className="text-lg text-green-600" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                Where Learning Becomes Adventure!
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-7xl font-bold mb-6 text-green-800" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                🌿 Welcome to a Magical World! 🦋
              </h2>
              
              <p className="text-2xl md:text-3xl text-green-700 mb-12" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                Join Turian and friends on incredible educational adventures!
              </p>
              
              <Button asChild className="btn-magical text-2xl px-12 py-6">
                <Link to="/login">
                  <span className="mr-3">🚀</span>
                  Start Your Adventure
                  <span className="ml-3">✨</span>
                </Link>
              </Button>
            </div>

            {/* Character Showcase */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
              <div className="text-center">
                <div className="w-32 h-32 mx-auto mb-4 p-3 bg-white/90 rounded-3xl border-4 border-green-400 shadow-2xl hover:scale-105 transition-all duration-300">
                  <img 
                    src={TurianCharacter} 
                    alt="Turian the Durian" 
                    className="w-full h-full object-cover rounded-2xl"
                  />
                </div>
                <h3 className="text-xl font-bold text-green-700" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                  Turian 🌿
                </h3>
                <p className="text-green-600" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                  Your Guide
                </p>
              </div>

              <div className="text-center">
                <div className="w-32 h-32 mx-auto mb-4 p-3 bg-white/90 rounded-3xl border-4 border-blue-400 shadow-2xl hover:scale-105 transition-all duration-300">
                  <img 
                    src={CoconutCruze} 
                    alt="Coconut Cruze" 
                    className="w-full h-full object-cover rounded-2xl"
                  />
                </div>
                <h3 className="text-xl font-bold text-blue-700" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                  Coconut Cruze 🥥
                </h3>
                <p className="text-blue-600" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                  Ocean Explorer
                </p>
              </div>

              <div className="text-center">
                <div className="w-32 h-32 mx-auto mb-4 p-3 bg-white/90 rounded-3xl border-4 border-purple-400 shadow-2xl hover:scale-105 transition-all duration-300">
                  <img 
                    src={BluButterfly} 
                    alt="Blue Butterfly" 
                    className="w-full h-full object-cover rounded-2xl"
                  />
                </div>
                <h3 className="text-xl font-bold text-purple-700" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                  Blue Butterfly 🦋
                </h3>
                <p className="text-purple-600" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                  Sky Dancer
                </p>
              </div>

              <div className="text-center">
                <div className="w-32 h-32 mx-auto mb-4 p-3 bg-white/90 rounded-3xl border-4 border-green-400 shadow-2xl hover:scale-105 transition-all duration-300">
                  <img 
                    src={FrankieFrogs} 
                    alt="Frankie Frogs" 
                    className="w-full h-full object-cover rounded-2xl"
                  />
                </div>
                <h3 className="text-xl font-bold text-green-700" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                  Frankie Frogs 🐸
                </h3>
                <p className="text-green-600" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                  Pond Keeper
                </p>
              </div>
            </div>

            {/* Adventure Features */}
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="bg-white/95 backdrop-blur-sm border-4 border-blue-300/60 shadow-2xl rounded-3xl overflow-hidden hover:scale-105 transition-all duration-300">
                <CardHeader className="text-center bg-gradient-to-br from-blue-50 to-cyan-50 pb-4">
                  <div className="w-20 h-20 mx-auto mb-4 p-3 bg-white rounded-2xl shadow-xl">
                    <img 
                      src={DrP} 
                      alt="Explore" 
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </div>
                  <CardTitle className="text-2xl font-bold text-blue-700" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                    🗺️ Explore Worlds
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center p-6">
                  <p className="text-lg text-blue-600" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                    Discover magical lands and hidden treasures with your character guides!
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/95 backdrop-blur-sm border-4 border-orange-300/60 shadow-2xl rounded-3xl overflow-hidden hover:scale-105 transition-all duration-300">
                <CardHeader className="text-center bg-gradient-to-br from-orange-50 to-yellow-50 pb-4">
                  <div className="w-20 h-20 mx-auto mb-4 p-3 bg-white rounded-2xl shadow-xl">
                    <img 
                      src={JaySing} 
                      alt="Learn" 
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </div>
                  <CardTitle className="text-2xl font-bold text-orange-700" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                    📚 Learn & Play
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center p-6">
                  <p className="text-lg text-orange-600" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                    Educational quests and interactive stories that make learning fun!
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/95 backdrop-blur-sm border-4 border-green-300/60 shadow-2xl rounded-3xl overflow-hidden hover:scale-105 transition-all duration-300">
                <CardHeader className="text-center bg-gradient-to-br from-green-50 to-lime-50 pb-4">
                  <div className="w-20 h-20 mx-auto mb-4 p-3 bg-white rounded-2xl shadow-xl">
                    <img 
                      src={NikkiMT} 
                      alt="Create" 
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </div>
                  <CardTitle className="text-2xl font-bold text-green-700" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                    🎨 Create & Build
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center p-6">
                  <p className="text-lg text-green-600" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                    Design your avatar and create your own magical adventures!
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Floating Characters */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-8 animate-float-bounce opacity-80" style={{animationDelay: '0s'}}>
            <div className="w-16 h-16 p-2 bg-white/80 rounded-2xl border-3 border-yellow-400 shadow-xl">
              <img 
                src={PineapplePapa} 
                alt="Pineapple Pa-Pa" 
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
          </div>
          
          <div className="absolute top-1/3 right-12 animate-gentle-pulse opacity-70" style={{animationDelay: '2s'}}>
            <div className="w-14 h-14 p-2 bg-white/80 rounded-full border-3 border-pink-400 shadow-lg">
              <img 
                src={TommyTukTuk} 
                alt="Tommy Tuk Tuk" 
                className="w-full h-full object-cover rounded-full"
              />
            </div>
          </div>
          
          <div className="absolute bottom-1/4 left-1/4 animate-float-bounce opacity-75" style={{animationDelay: '1s'}}>
            <div className="w-12 h-12 p-2 bg-white/80 rounded-full border-2 border-purple-400 shadow-lg">
              <img 
                src={BluButterfly} 
                alt="Blue Butterfly" 
                className="w-full h-full object-cover rounded-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}