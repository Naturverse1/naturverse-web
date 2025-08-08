import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";

// Import character assets
import TurianImg from "../assets/Turian.jpg";
import DrPImg from "../assets/Dr P.png";
import FrankieFrogsImg from "../assets/Frankie Frogs.png";
import HankImg from "../assets/hank.png";
import LaoCowImg from "../assets/Lao Cow.png";
import MangoMikeImg from "../assets/Mango Mike.png";
import PineapplePaImg from "../assets/Pineapple Pa-Pa.png";
import BluButterflyImg from "../assets/Blu Butterfly.png";

export default function Home() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect authenticated users to the map page
    if (user && !loading) {
      navigate('/map');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  // Show landing page for unauthenticated users
  return (
    <div className="min-h-screen hero-magical-bg relative overflow-hidden">
      {/* Magical Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 text-emerald/30 text-6xl animate-sparkle-twinkle float-1">🌟</div>
        <div className="absolute top-32 right-20 text-magic/30 text-5xl animate-sparkle-twinkle float-2">✨</div>
        <div className="absolute bottom-40 left-20 text-sparkle/30 text-4xl animate-sparkle-twinkle float-3">🌙</div>
        <div className="absolute bottom-20 right-10 text-emerald/30 text-5xl animate-sparkle-twinkle stagger-1">⭐</div>
        <div className="absolute top-1/2 left-5 text-magic/20 text-3xl animate-magical-bounce stagger-2">🪄</div>
        <div className="absolute top-1/3 right-5 text-sparkle/20 text-3xl animate-magical-bounce stagger-3">🧚‍♀️</div>
      </div>
      
      {/* Hero Banner Section */}
      <div className="relative z-10">
        {/* Character Parade at Top */}
        <div className="absolute top-0 left-0 right-0 h-32 overflow-hidden">
          <div className="flex justify-between items-center h-full px-8">
            <img src={TurianImg} alt="Turian the Durian" 
                 className="w-20 h-20 object-contain animate-character-bounce-in char-1 drop-shadow-lg" />
            <img src={DrPImg} alt="Dr P" 
                 className="w-16 h-16 object-contain animate-character-bounce-in char-2 drop-shadow-lg" />
            <img src={FrankieFrogsImg} alt="Frankie Frogs" 
                 className="w-18 h-18 object-contain animate-character-bounce-in char-3 drop-shadow-lg" />
            <img src={BluButterflyImg} alt="Blu Butterfly" 
                 className="w-14 h-14 object-contain animate-character-bounce-in char-4 drop-shadow-lg" />
            <img src={MangoMikeImg} alt="Mango Mike" 
                 className="w-16 h-16 object-contain animate-character-bounce-in char-5 drop-shadow-lg" />
          </div>
        </div>
        
        {/* Main Hero Content */}
        <div className="container mx-auto px-6 pt-40 pb-20 relative z-10">
          <div className="text-center max-w-5xl mx-auto">
            {/* Hero Title with Enhanced Magic */}
            <div className="relative mb-8">
              <h1 className="text-6xl md:text-8xl font-display text-foreground mb-6 animate-hero-entrance" data-testid="text-welcome">
                <span className="text-7xl animate-sparkle-twinkle inline-block">🌿</span> 
                <span className="text-gradient drop-shadow-2xl">Welcome to Naturverse</span>
                <span className="text-7xl animate-sparkle-twinkle inline-block ml-4">✨</span>
              </h1>
              {/* Floating sparkles around title */}
              <div className="absolute -top-8 left-1/4 text-sparkle/60 text-4xl animate-sparkle-pop stagger-1">✨</div>
              <div className="absolute -top-4 right-1/4 text-magic/60 text-3xl animate-sparkle-pop stagger-2">🌟</div>
              <div className="absolute -bottom-4 left-1/3 text-emerald/60 text-3xl animate-sparkle-pop stagger-3">⭐</div>
            </div>
            
            <p className="text-muted-foreground text-2xl md:text-3xl mb-16 animate-hero-entrance stagger-1 text-balance leading-relaxed font-medium">
              🧚‍♀️ Enter a <span className="text-magic font-bold">magical world</span> where nature comes alive! 
              Join your favorite characters on <span className="text-emerald font-bold">epic adventures</span>, 
              <span className="text-sparkle font-bold">learn amazing facts</span>, and become a true 
              <span className="text-gradient font-bold">Nature Hero</span>! 🌟
            </p>
            
            {/* Enhanced Call to Action */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-20 animate-hero-entrance stagger-2">
              <Button asChild size="lg" className="btn-primary text-xl px-12 py-6 hover-lift animate-magical-pulse">
                <Link to="/signup" data-testid="button-get-started">
                  <span className="text-2xl mr-3 animate-sparkle-twinkle">✨</span>
                  <span className="font-bold">Begin Your Magic Adventure!</span>
                  <span className="text-2xl ml-3 animate-sparkle-twinkle">🌟</span>
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="btn-outline text-xl px-12 py-6 hover-lift border-2 border-emerald hover:bg-emerald/10">
                <Link to="/login" data-testid="button-sign-in">
                  <span className="text-2xl mr-3">🚀</span>
                  <span className="font-bold">Return to Naturverse</span>
                </Link>
              </Button>
            </div>
            
            {/* Character Showcase Row */}
            <div className="flex justify-center items-center gap-8 mb-16 animate-hero-entrance stagger-3">
              <div className="character-card animate-character-float float-1 text-center">
                <img src={HankImg} alt="Hank" className="w-16 h-16 mx-auto mb-2 object-contain" />
                <p className="text-sm font-medium text-foreground">Meet Hank!</p>
              </div>
              <div className="character-card animate-character-float float-2 text-center">
                <img src={LaoCowImg} alt="Lao Cow" className="w-16 h-16 mx-auto mb-2 object-contain" />
                <p className="text-sm font-medium text-foreground">Wise Lao Cow</p>
              </div>
              <div className="character-card animate-character-float float-3 text-center">
                <img src={PineapplePaImg} alt="Pineapple Pa-Pa" className="w-16 h-16 mx-auto mb-2 object-contain" />
                <p className="text-sm font-medium text-foreground">Pineapple Pa-Pa</p>
              </div>
            </div>
          
            {/* Magical Feature Grid */}
            <div className="grid grid-auto-fit gap-8 animate-hero-entrance stagger-4">
              <div className="character-card p-10 text-center group hover:scale-105 transition-all duration-300">
                <div className="text-6xl mb-6 animate-magical-bounce group-hover:scale-125 transition-transform duration-300">📚</div>
                <h3 className="text-emerald font-display text-2xl mb-6 font-bold">🌟 Magical Stories</h3>
                <p className="text-foreground leading-relaxed text-lg font-medium">Join Turian and friends on enchanted adventures through mystical forests, underwater kingdoms, and floating cloud cities!</p>
                <div className="mt-4 text-magic animate-sparkle-twinkle">✨ Read Now ✨</div>
              </div>
              
              <div className="character-card p-10 text-center group hover:scale-105 transition-all duration-300">
                <div className="text-6xl mb-6 animate-magical-bounce group-hover:scale-125 transition-transform duration-300 stagger-1">🎮</div>
                <h3 className="text-ocean font-display text-2xl mb-6 font-bold">🏆 Epic Quests</h3>
                <p className="text-foreground leading-relaxed text-lg font-medium">Complete magical missions, solve nature puzzles, and unlock special powers while learning about our amazing planet!</p>
                <div className="mt-4 text-sparkle animate-sparkle-twinkle stagger-1">⭐ Play Now ⭐</div>
              </div>
              
              <div className="character-card p-10 text-center group hover:scale-105 transition-all duration-300">
                <div className="text-6xl mb-6 animate-magical-bounce group-hover:scale-125 transition-transform duration-300 stagger-2">🌍</div>
                <h3 className="text-forest font-display text-2xl mb-6 font-bold">🗺️ Explore Worlds</h3>
                <p className="text-foreground leading-relaxed text-lg font-medium">Travel to incredible realms from tropical rainforests to snowy mountains, each filled with hidden treasures and new friends!</p>
                <div className="mt-4 text-emerald animate-sparkle-twinkle stagger-2">🧭 Explore Now 🧭</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}