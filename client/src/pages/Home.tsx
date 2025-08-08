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
import BookImg from "@assets/book img_1754673794864.jpg";
import CharacterImg from "@assets/Character img_1754673794865.jpg";

// Character Assets Collection
import CoconutCruze from "@assets/Coconut Cruze_1754677394021.png";
import BluButterfly from "@assets/Blu Butterfly_1754677394021.png";
import FrankieFrogs from "@assets/Frankie Frogs_1754677394022.png";
import DrP from "@assets/Dr P_1754677394022.png";
import JaySing from "@assets/Jay-Sing_1754677394023.png";
import NikkiMT from "@assets/Nikki MT_1754677394025.png";
import MangoMike from "@assets/Mango Mike_1754677394025.png";
import PineapplePaPa from "@assets/Pineapple Pa-Pa_1754677394026.png";
import Snakers from "@assets/Snakers_1754677394026.png";
import TommyTukTuk from "@assets/Tommy Tuk Tuk_1754677394026.png";
import Teeyor from "@assets/Teeyor_1754677394026.png";
import PineapplePetey from "@assets/Pineapple Petey_1754677394026.png";

export default function Home() {
  const { user, loading } = useAuth();
  const [location, setLocation] = useLocation();

  // Array of all our amazing characters for floating animation
  const floatingCharacters = [
    { src: TurianCharacter, name: "Turian", position: "top-16 left-16", delay: "0s" },
    { src: CoconutCruze, name: "Coconut Cruze", position: "top-32 right-20", delay: "1s" },
    { src: BluButterfly, name: "Blu Butterfly", position: "bottom-40 left-12", delay: "2s" },
    { src: FrankieFrogs, name: "Frankie Frogs", position: "bottom-24 right-16", delay: "1.5s" },
    { src: JaySing, name: "Jay-Sing", position: "top-48 left-1/3", delay: "3s" },
    { src: MangoMike, name: "Mango Mike", position: "bottom-56 right-1/3", delay: "2.5s" },
    { src: DrP, name: "Dr P", position: "top-72 right-12", delay: "4s" },
    { src: PineapplePaPa, name: "Pineapple Pa-Pa", position: "bottom-72 left-1/4", delay: "3.5s" },
  ];

  const adventureZones = [
    {
      id: 'tropical-rainforest',
      title: 'Tropical Rainforest',
      character: TurianCharacter,
      characterName: 'Turian',
      description: 'Explore lush rainforests with Turian and discover amazing plants and animals!',
      route: '/storybook',
      emoji: '🌿',
      color: 'from-green-400 to-emerald-600',
      bgGradient: 'from-green-50 to-emerald-50',
    },
    {
      id: 'ocean-adventures',
      title: 'Ocean Adventures',
      character: CoconutCruze,
      characterName: 'Coconut Cruze',
      description: 'Dive into crystal clear waters and meet incredible sea creatures!',
      route: '/map',
      emoji: '🌊',
      color: 'from-blue-400 to-cyan-600',
      bgGradient: 'from-blue-50 to-cyan-50',
    },
    {
      id: 'magical-stories',
      title: 'Magical Stories',
      character: BluButterfly,
      characterName: 'Blu Butterfly',
      description: 'Read amazing stories about transformation and nature\'s magic!',
      route: '/storybook',
      emoji: '📚',
      color: 'from-purple-400 to-pink-600',
      bgGradient: 'from-purple-50 to-pink-50',
    },
    {
      id: 'nature-quizzes',
      title: 'Brain Challenge',
      character: MangoMike,
      characterName: 'Mango Mike',
      description: 'Test your nature knowledge with fun and educational quizzes!',
      route: '/quiz',
      emoji: '🧠',
      color: 'from-yellow-400 to-orange-600',
      bgGradient: 'from-yellow-50 to-orange-50',
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-blue-100 to-purple-100">
        <div className="text-center animate-character-entrance">
          <div className="relative mb-6">
            <img 
              src={TurianCharacter}
              alt="Loading Turian..." 
              className="w-32 h-32 rounded-full mx-auto border-4 border-green-400 shadow-2xl animate-gentle-pulse"
            />
            <div className="absolute -top-2 -right-2 text-4xl animate-sparkle-dance">✨</div>
          </div>
          <h2 className="text-3xl font-magical text-green-700 mb-2">
            Loading The Naturverse™...
          </h2>
          <p className="text-lg font-playful text-green-600">
            Preparing your magical adventure! 🌟
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Magical Multi-Layered Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat" 
        style={{
          backgroundImage: `
            linear-gradient(
              135deg,
              rgba(34, 197, 94, 0.3) 0%,
              rgba(59, 130, 246, 0.25) 20%,
              rgba(147, 51, 234, 0.2) 40%,
              rgba(251, 146, 60, 0.25) 60%,
              rgba(234, 179, 8, 0.2) 80%,
              rgba(239, 68, 68, 0.15) 100%
            ),
            url(${StorybookScene})
          `,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Enhanced Magical Light Effects */}
      <div className="absolute inset-0" style={{
        background: `
          radial-gradient(circle at 25% 25%, rgba(34,197,94,0.4) 0%, transparent 40%),
          radial-gradient(circle at 75% 25%, rgba(59,130,246,0.35) 0%, transparent 40%),
          radial-gradient(circle at 25% 75%, rgba(251,146,60,0.3) 0%, transparent 40%),
          radial-gradient(circle at 75% 75%, rgba(147,51,234,0.35) 0%, transparent 40%),
          radial-gradient(circle at 50% 50%, rgba(234,179,8,0.2) 0%, transparent 60%)
        `
      }}></div>

      {/* Floating Characters Throughout the Scene */}
      {floatingCharacters.map((character, index) => (
        <div 
          key={character.name}
          className={`floating-character ${character.position} w-20 h-20 md:w-24 md:h-24 animate-character-entrance`}
          style={{ animationDelay: character.delay }}
        >
          <img 
            src={character.src} 
            alt={character.name}
            className="w-full h-full object-cover rounded-full border-4 border-white/70 shadow-2xl animate-float-bounce"
          />
        </div>
      ))}

      {/* Floating Sparkles & Magic Elements */}
      <div className="floating-sparkles" style={{ top: '12%', left: '18%' }}>✨</div>
      <div className="floating-sparkles" style={{ top: '20%', right: '25%', animationDelay: '1s' }}>🌟</div>
      <div className="floating-sparkles" style={{ bottom: '35%', left: '20%', animationDelay: '2s' }}>⭐</div>
      <div className="floating-sparkles" style={{ top: '65%', right: '15%', animationDelay: '1.5s' }}>🌈</div>
      <div className="floating-sparkles" style={{ bottom: '25%', left: '70%', animationDelay: '3s' }}>🦋</div>
      <div className="floating-sparkles" style={{ top: '40%', left: '85%', animationDelay: '0.5s' }}>✨</div>
      <div className="floating-sparkles" style={{ bottom: '15%', right: '60%', animationDelay: '2.5s' }}>🌸</div>

      <div className="relative z-10 min-h-screen py-8 px-6">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-character-entrance">
          {/* Logo and Brand */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <img 
                src={TurianLogo} 
                alt="The Naturverse™" 
                className="w-28 h-28 md:w-36 md:h-36 drop-shadow-2xl animate-gentle-pulse"
              />
              <div className="absolute -top-3 -right-3 text-4xl animate-sparkle-dance">✨</div>
              <div className="absolute -bottom-2 -left-2 text-3xl animate-sparkle-dance" style={{ animationDelay: '1s' }}>🌟</div>
            </div>
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-magical text-white drop-shadow-2xl mb-6 text-magical-rainbow">
            Welcome to The Naturverse™!
          </h1>
          
          <p className="text-lg md:text-xl font-playful text-white drop-shadow-lg mb-8 max-w-3xl mx-auto leading-relaxed">
            🌟 Where Learning Becomes Adventure! 🌟
            <br />
            <span className="text-base md:text-lg">
              Discover nature's wonders through magical stories, fun quizzes, and amazing adventures!
            </span>
          </p>

          {/* Call to Action */}
          {!user ? (
            <Link to="/login">
              <Button className="btn-magical text-2xl py-6 px-12 font-bold shadow-2xl" data-testid="get-started">
                <span className="mr-3">🚀</span>
                Start Your Adventure
                <span className="ml-3">✨</span>
              </Button>
            </Link>
          ) : (
            <div className="space-y-4">
              <p className="text-xl text-white font-playful">
                Welcome back, brave explorer! Ready for more adventures?
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/map">
                  <Button className="btn-tropical text-lg py-3 px-6 font-bold" data-testid="continue-adventure">
                    <span className="mr-2">🗺️</span>
                    Continue Adventure
                  </Button>
                </Link>
                <Link to="/profile">
                  <Button className="btn-nature text-lg py-3 px-6 font-bold" data-testid="view-profile">
                    <span className="mr-2">👤</span>
                    My Profile
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Adventure Zones Grid */}
        <div className="max-w-6xl mx-auto mb-16">
          <div className="text-center mb-12 animate-character-entrance" style={{ animationDelay: '0.5s' }}>
            <h2 className="text-3xl md:text-4xl font-magical text-white drop-shadow-xl mb-4">
              🌟 Explore Amazing Worlds 🌟
            </h2>
            <p className="text-xl text-white drop-shadow-lg font-playful">
              Choose your next magical learning adventure!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {adventureZones.map((zone, index) => (
              <Link key={zone.id} to={zone.route}>
                <Card 
                  className="zone-card animate-character-entrance cursor-pointer group"
                  style={{ animationDelay: `${0.7 + index * 0.2}s` }}
                  data-testid={`zone-${zone.id}`}
                >
                  <CardHeader className="pb-4">
                    <div className="flex justify-center mb-6">
                      <div className="relative">
                        <img 
                          src={zone.character}
                          alt={zone.characterName}
                          className="w-24 h-24 rounded-full border-4 border-white shadow-xl group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute -top-3 -right-3 text-3xl animate-sparkle-dance">
                          {zone.emoji}
                        </div>
                      </div>
                    </div>
                    
                    <CardTitle className="text-3xl font-magical text-center text-green-700 group-hover:text-purple-700 transition-colors duration-300">
                      {zone.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="text-center">
                    <p className="text-lg font-story text-gray-600 leading-relaxed mb-6">
                      {zone.description}
                    </p>

                    <Button className="btn-magical w-full text-lg font-bold" data-testid={`explore-${zone.id}`}>
                      <span className="mr-2">🚀</span>
                      Explore Now
                      <span className="ml-2">✨</span>
                    </Button>
                  </CardContent>

                  {/* Magical Hover Effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${zone.bgGradient} opacity-0 group-hover:opacity-30 rounded-3xl transition-opacity duration-300`} />
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Featured Characters Showcase */}
        <div className="max-w-6xl mx-auto mb-16">
          <Card className="quest-card animate-character-entrance" style={{ animationDelay: '1.5s' }}>
            <CardHeader className="text-center pb-6">
              <div className="flex justify-center mb-4">
                <img 
                  src={CharacterImg}
                  alt="Meet Our Characters"
                  className="w-24 h-24 rounded-xl border-4 border-green-400 shadow-xl animate-gentle-pulse"
                />
              </div>
              
              <CardTitle className="text-3xl md:text-4xl font-magical text-green-700">
                🌺 Meet Your Adventure Guides 🌺
              </CardTitle>
            </CardHeader>

            <CardContent>
              <div className="bg-gradient-to-br from-green-50 to-blue-50 p-8 rounded-2xl border-4 border-green-200/60">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 mb-8">
                  {[
                    { src: TurianCharacter, name: "Turian", role: "Durian Guide" },
                    { src: CoconutCruze, name: "Coconut Cruze", role: "Ocean Explorer" },
                    { src: BluButterfly, name: "Blu Butterfly", role: "Story Teller" },
                    { src: FrankieFrogs, name: "Frankie Frogs", role: "Forest Friend" },
                    { src: JaySing, name: "Jay-Sing", role: "Music Maker" },
                    { src: MangoMike, name: "Mango Mike", role: "Quiz Master" },
                  ].map((character, index) => (
                    <div 
                      key={character.name}
                      className="text-center animate-character-entrance group"
                      style={{ animationDelay: `${2 + index * 0.1}s` }}
                    >
                      <img 
                        src={character.src}
                        alt={character.name}
                        className="w-16 h-16 rounded-full border-3 border-white shadow-lg mx-auto mb-2 group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="text-sm font-bold text-green-700 font-playful">{character.name}</div>
                      <div className="text-xs text-green-600">{character.role}</div>
                    </div>
                  ))}
                </div>

                <p className="text-center text-lg font-story text-green-600 leading-relaxed">
                  Each character is your personal guide to different aspects of nature! 
                  They'll help you learn, explore, and discover the amazing world around us. 
                  Every adventure is designed to be fun, safe, and educational!
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Platform Stats */}
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="text-center p-6 bg-white/90 backdrop-blur-sm rounded-3xl border-4 border-green-300/60 shadow-xl animate-character-entrance" style={{ animationDelay: '2.2s' }}>
            <div className="text-5xl mb-4">🌟</div>
            <div className="text-3xl font-bold text-green-700 font-magical">18+</div>
            <div className="text-green-600 font-playful text-lg">Amazing Characters</div>
          </div>
          
          <div className="text-center p-6 bg-white/90 backdrop-blur-sm rounded-3xl border-4 border-blue-300/60 shadow-xl animate-character-entrance" style={{ animationDelay: '2.4s' }}>
            <div className="text-5xl mb-4">📚</div>
            <div className="text-3xl font-bold text-blue-700 font-magical">50+</div>
            <div className="text-blue-600 font-playful text-lg">Learning Adventures</div>
          </div>
          
          <div className="text-center p-6 bg-white/90 backdrop-blur-sm rounded-3xl border-4 border-purple-300/60 shadow-xl animate-character-entrance" style={{ animationDelay: '2.6s' }}>
            <div className="text-5xl mb-4">🎯</div>
            <div className="text-3xl font-bold text-purple-700 font-magical">100%</div>
            <div className="text-purple-600 font-playful text-lg">Safe & Educational</div>
          </div>
        </div>
      </div>

      {/* Turian Floating Guide */}
      <div className="fixed bottom-8 right-8 z-50">
        <div className="relative animate-float-bounce">
          <div className="w-28 h-28 p-2 bg-white/95 rounded-full border-4 border-green-400 shadow-2xl">
            <img 
              src={TurianCharacter} 
              alt="Turian Guide" 
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          
          <div className="absolute -top-20 -left-56 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-xl border-2 border-green-400 max-w-xs hidden lg:block">
            <div className="text-center">
              <div className="text-sm font-bold text-green-700 font-playful">
                {user 
                  ? "Ready for your next adventure? Choose any zone to explore! 🌟✨"
                  : "Welcome to The Naturverse! Sign in to start your magical learning journey! 🌟📚"
                }
              </div>
            </div>
            
            <div className="absolute bottom-0 right-8 transform translate-y-full">
              <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-t-[12px] border-l-transparent border-r-transparent border-t-green-400"></div>
              <div className="w-0 h-0 border-l-[8px] border-r-[8px] border-t-[8px] border-l-transparent border-r-transparent border-t-white absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-[1px]"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}