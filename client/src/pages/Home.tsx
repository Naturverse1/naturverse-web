import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";

// Import character assets
import TurianImg from "../assets/Turian.jpg";
import TurianDurianImg from "../assets/Turian the Durian.png";
import DrPImg from "../assets/Dr P.png";
import FrankieFrogsImg from "../assets/Frankie Frogs.png";
import HankImg from "../assets/hank.png";
import LaoCowImg from "../assets/Lao Cow.png";
import MangoMikeImg from "../assets/Mango Mike.png";
import PineapplePaImg from "../assets/Pineapple Pa-Pa.png";
import BluButterflyImg from "../assets/Blu Butterfly.png";
import TommyTukTukImg from "../assets/Tommy Tuk Tuk.png";
import GuideImg from "../assets/Guide.png";
import JaySingImg from "../assets/Jay-Sing.png";
import InkieImg from "../assets/Inkie.png";
import TwokayImg from "../assets/2kay.png";
import NikkiMTImg from "../assets/Nikki MT.png";
import TurianLogo from "../assets/turian_media_logo_transparent.png";

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
    <div className="min-h-screen hero-magical-bg relative overflow-hidden" style={{
      background: `
        radial-gradient(circle at 25% 25%, hsl(var(--emerald) / 0.15) 0%, transparent 50%),
        radial-gradient(circle at 75% 75%, hsl(var(--magic) / 0.15) 0%, transparent 50%),
        radial-gradient(circle at 50% 10%, hsl(var(--sparkle) / 0.1) 0%, transparent 40%),
        radial-gradient(circle at 10% 90%, hsl(var(--coral) / 0.1) 0%, transparent 35%),
        radial-gradient(circle at 90% 10%, hsl(var(--ocean) / 0.1) 0%, transparent 45%),
        linear-gradient(135deg, hsl(var(--mint)) 0%, hsl(var(--background)) 50%, hsl(var(--accent)) 100%)
      `,
      backgroundAttachment: 'fixed',
      backgroundSize: '200% 200%, 200% 200%, 100% 100%, 150% 150%, 150% 150%, 100% 100%',
      animation: 'gradient-shift 15s ease-in-out infinite'
    }}>
      {/* Enhanced Magical Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Sparkling Elements */}
        <div className="absolute top-20 left-10 text-emerald/40 text-6xl animate-sparkle-twinkle float-1">🌟</div>
        <div className="absolute top-32 right-20 text-magic/40 text-5xl animate-sparkle-twinkle float-2">✨</div>
        <div className="absolute bottom-40 left-20 text-sparkle/40 text-4xl animate-sparkle-twinkle float-3">🌙</div>
        <div className="absolute bottom-20 right-10 text-emerald/40 text-5xl animate-sparkle-twinkle stagger-1">⭐</div>
        <div className="absolute top-1/2 left-5 text-magic/30 text-3xl animate-magical-bounce stagger-2">🪄</div>
        <div className="absolute top-1/3 right-5 text-sparkle/30 text-3xl animate-magical-bounce stagger-3">🧚‍♀️</div>
        
        {/* Nature Elements */}
        <div className="absolute top-16 left-1/4 text-forest/30 text-4xl animate-character-float stagger-4">🌿</div>
        <div className="absolute top-40 right-1/4 text-ocean/30 text-3xl animate-character-float stagger-5">🐟</div>
        <div className="absolute bottom-60 left-1/3 text-coral/30 text-5xl animate-character-float stagger-6">🌺</div>
        <div className="absolute bottom-80 right-1/3 text-sunny/30 text-4xl animate-character-float stagger-7">🌻</div>
        <div className="absolute top-60 left-16 text-sage/30 text-3xl animate-sparkle-pop stagger-8">🍀</div>
        <div className="absolute top-80 right-16 text-mint/40 text-4xl animate-sparkle-pop stagger-1">🌱</div>
        
        {/* Rainbow & Weather Elements */}
        <div className="absolute top-24 left-1/2 text-amber/30 text-5xl animate-magical-bounce stagger-2">🌈</div>
        <div className="absolute bottom-32 left-8 text-sky/30 text-4xl animate-gentle-pulse stagger-3">☁️</div>
        <div className="absolute bottom-16 right-1/4 text-sunset/30 text-3xl animate-gentle-pulse stagger-4">⛅</div>
        
        {/* Floating Character Shadows */}
        <div className="absolute top-1/4 left-8 opacity-20 animate-character-float">
          <img src={TurianImg} alt="" className="w-12 h-12 object-contain filter blur-sm" />
        </div>
        <div className="absolute bottom-1/4 right-8 opacity-20 animate-character-float float-2">
          <img src={BluButterflyImg} alt="" className="w-10 h-10 object-contain filter blur-sm" />
        </div>
        <div className="absolute top-2/3 left-1/4 opacity-15 animate-character-float float-3">
          <img src={MangoMikeImg} alt="" className="w-8 h-8 object-contain filter blur-sm" />
        </div>
      </div>
      
      {/* Hero Banner Section */}
      <div className="relative z-10">
        {/* Character Parade at Top - Enhanced with More Characters */}
        <div className="absolute top-0 left-0 right-0 h-40 overflow-hidden bg-gradient-to-b from-sparkle/20 via-transparent to-transparent">
          <div className="flex justify-between items-center h-full px-4">
            <div className="character-card p-3 animate-character-bounce-in char-1">
              <img src={TurianDurianImg} alt="Turian the Durian" className="w-16 h-16 object-contain drop-shadow-2xl" />
              <div className="text-xs font-bold text-emerald mt-1 text-center">Turian</div>
            </div>
            <div className="character-card p-3 animate-character-bounce-in char-2">
              <img src={DrPImg} alt="Dr P" className="w-14 h-14 object-contain drop-shadow-2xl" />
              <div className="text-xs font-bold text-ocean mt-1 text-center">Dr P</div>
            </div>
            <div className="character-card p-3 animate-character-bounce-in char-3">
              <img src={FrankieFrogsImg} alt="Frankie Frogs" className="w-16 h-16 object-contain drop-shadow-2xl" />
              <div className="text-xs font-bold text-magic mt-1 text-center">Frankie</div>
            </div>
            <div className="character-card p-3 animate-character-bounce-in char-4">
              <img src={BluButterflyImg} alt="Blu Butterfly" className="w-12 h-12 object-contain drop-shadow-2xl" />
              <div className="text-xs font-bold text-sky mt-1 text-center">Blu</div>
            </div>
            <div className="character-card p-3 animate-character-bounce-in char-5">
              <img src={MangoMikeImg} alt="Mango Mike" className="w-14 h-14 object-contain drop-shadow-2xl" />
              <div className="text-xs font-bold text-amber mt-1 text-center">Mike</div>
            </div>
            <div className="character-card p-3 animate-character-bounce-in char-6">
              <img src={TommyTukTukImg} alt="Tommy Tuk Tuk" className="w-14 h-14 object-contain drop-shadow-2xl" />
              <div className="text-xs font-bold text-coral mt-1 text-center">Tommy</div>
            </div>
            <div className="character-card p-3 animate-character-bounce-in char-7">
              <img src={GuideImg} alt="Guide" className="w-14 h-14 object-contain drop-shadow-2xl" />
              <div className="text-xs font-bold text-forest mt-1 text-center">Guide</div>
            </div>
          </div>
        </div>
        
        {/* Main Hero Content */}
        <div className="container mx-auto px-6 pt-48 pb-20 relative z-10">
          <div className="text-center max-w-5xl mx-auto">
            {/* Hero Title with Enhanced Magic */}
            <div className="relative mb-8">
              <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
                <img src={TurianLogo} alt="Turian Media" className="w-24 h-24 animate-gentle-pulse drop-shadow-2xl opacity-90 hover:scale-110 transition-transform" />
              </div>
              <h1 className="text-hero text-display text-foreground mb-6 animate-hero-entrance floating-sparkles" data-testid="text-welcome">
                <span className="text-7xl animate-sparkle-twinkle inline-block">🌿</span> 
                <span className="text-gradient drop-shadow-2xl text-magic-glow">Welcome to Naturverse</span>
                <span className="text-7xl animate-sparkle-twinkle inline-block ml-4">✨</span>
              </h1>
              {/* Enhanced floating sparkles around title */}
              <div className="absolute -top-8 left-1/4 text-sparkle/60 text-4xl animate-sparkle-pop stagger-1">✨</div>
              <div className="absolute -top-4 right-1/4 text-magic/60 text-3xl animate-sparkle-pop stagger-2">🌟</div>
              <div className="absolute -bottom-4 left-1/3 text-emerald/60 text-3xl animate-sparkle-pop stagger-3">⭐</div>
              <div className="absolute -top-6 left-1/6 text-coral/60 text-2xl animate-sparkle-pop stagger-4">🌈</div>
              <div className="absolute -bottom-2 right-1/3 text-ocean/60 text-2xl animate-sparkle-pop stagger-5">🐟</div>
              <div className="absolute -top-2 right-1/6 text-sunny/60 text-2xl animate-sparkle-pop stagger-6">🌻</div>
            </div>
            
            <div className="relative mb-16">
              <p className="text-sub-hero text-body-relaxed animate-hero-entrance stagger-1 text-balance leading-relaxed font-bold bg-gradient-to-r from-forest via-emerald to-magic bg-clip-text text-transparent">
                <span className="text-4xl animate-sparkle-twinkle">🧚‍♀️</span> Enter a <span className="text-magic font-black text-magic-glow">magical world</span> where nature comes alive! 
                Join your favorite characters on <span className="text-emerald font-black text-magic-glow">epic adventures</span>, 
                <span className="text-sparkle font-black text-magic-glow">learn amazing facts</span>, and become a true 
                <span className="bg-gradient-to-r from-sunset to-amber bg-clip-text text-transparent font-black text-magic-glow">Nature Hero</span>! <span className="text-4xl animate-sparkle-twinkle">🌟</span>
              </p>
              <div className="absolute -left-8 top-2 animate-character-float">
                <img src={InkieImg} alt="Inkie" className="w-12 h-12 object-contain drop-shadow-lg opacity-80" />
              </div>
              <div className="absolute -right-8 bottom-2 animate-character-float float-2">
                <img src={JaySingImg} alt="Jay-Sing" className="w-10 h-10 object-contain drop-shadow-lg opacity-80" />
              </div>
            </div>
            
            {/* Enhanced Call to Action */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-20 animate-hero-entrance stagger-2">
              <Button asChild size="lg" className="btn-rainbow text-2xl px-16 py-8 hover-lift animate-magical-pulse shadow-2xl btn-bounce">
                <Link to="/signup" data-testid="button-get-started" className="text-playful">
                  <span className="text-3xl mr-4 animate-sparkle-twinkle">✨</span>
                  <span className="font-bold text-shadow">Begin Your Magic Adventure!</span>
                  <span className="text-3xl ml-4 animate-sparkle-twinkle">🌟</span>
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="gradient-playful text-white hover:text-white text-2xl px-16 py-8 hover-lift border-2 border-white/30 shadow-xl btn-bounce">
                <Link to="/login" data-testid="button-sign-in" className="text-playful">
                  <span className="text-3xl mr-4 animate-sparkle-twinkle">🚀</span>
                  <span className="font-bold text-shadow">Return to Naturverse</span>
                </Link>
              </Button>
            </div>
            
            {/* Enhanced Character Showcase Row */}
            <div className="flex justify-center items-center gap-8 mb-16 animate-hero-entrance stagger-3 flex-wrap">
              <div className="card-playful animate-character-float float-1 text-center p-8 hover:scale-115 transition-all duration-500">
                <img src={HankImg} alt="Hank" className="w-24 h-24 mx-auto mb-4 object-contain drop-shadow-xl border-4 border-emerald/30 rounded-full p-1 bg-gradient-to-br from-emerald/10 to-mint/20" />
                <p className="text-lg font-bold text-emerald text-playful">Meet Hank!</p>
                <p className="text-sm text-muted-foreground mt-2 text-body-relaxed">Market Expert</p>
                <div className="text-2xl mt-2 animate-sparkle-twinkle">🛒</div>
              </div>
              <div className="card-playful animate-character-float float-2 text-center p-8 hover:scale-115 transition-all duration-500">
                <img src={LaoCowImg} alt="Lao Cow" className="w-24 h-24 mx-auto mb-4 object-contain drop-shadow-xl border-4 border-forest/30 rounded-full p-1 bg-gradient-to-br from-forest/10 to-sage/20" />
                <p className="text-lg font-bold text-forest text-playful">Wise Lao Cow</p>
                <p className="text-sm text-muted-foreground mt-2 text-body-relaxed">Story Master</p>
                <div className="text-2xl mt-2 animate-sparkle-twinkle">📚</div>
              </div>
              <div className="card-playful animate-character-float float-3 text-center p-8 hover:scale-115 transition-all duration-500">
                <img src={PineapplePaImg} alt="Pineapple Pa-Pa" className="w-24 h-24 mx-auto mb-4 object-contain drop-shadow-xl border-4 border-amber/30 rounded-full p-1 bg-gradient-to-br from-amber/10 to-sunny/20" />
                <p className="text-lg font-bold text-amber text-playful">Pineapple Pa-Pa</p>
                <p className="text-sm text-muted-foreground mt-2 text-body-relaxed">Knowledge Keeper</p>
                <div className="text-2xl mt-2 animate-sparkle-twinkle">🍍</div>
              </div>
              <div className="card-playful animate-character-float float-1 text-center p-8 hover:scale-115 transition-all duration-500">
                <img src={TwokayImg} alt="2kay" className="w-24 h-24 mx-auto mb-4 object-contain drop-shadow-xl border-4 border-magic/30 rounded-full p-1 bg-gradient-to-br from-magic/10 to-sparkle/20" />
                <p className="text-lg font-bold text-magic text-playful">2kay</p>
                <p className="text-sm text-muted-foreground mt-2 text-body-relaxed">Adventure Guide</p>
                <div className="text-2xl mt-2 animate-sparkle-twinkle">🗺️</div>
              </div>
              <div className="card-playful animate-character-float float-2 text-center p-8 hover:scale-115 transition-all duration-500">
                <img src={NikkiMTImg} alt="Nikki MT" className="w-24 h-24 mx-auto mb-4 object-contain drop-shadow-xl border-4 border-ocean/30 rounded-full p-1 bg-gradient-to-br from-ocean/10 to-turquoise/20" />
                <p className="text-lg font-bold text-ocean text-playful">Nikki MT</p>
                <p className="text-sm text-muted-foreground mt-2 text-body-relaxed">Explorer</p>
                <div className="text-2xl mt-2 animate-sparkle-twinkle">🔍</div>
              </div>
            </div>
          
            {/* Enhanced Magical Feature Grid with Characters */}
            <div className="grid grid-auto-fit gap-10 animate-hero-entrance stagger-4">
              <div className="card-playful p-12 text-center group hover:scale-110 transition-all duration-500 gradient-warm">
                <div className="relative mb-8">
                  <img src={LaoCowImg} alt="Story Master" className="w-20 h-20 mx-auto object-contain animate-character-float drop-shadow-2xl border-4 border-white/30 rounded-full p-2 bg-white/80" />
                  <div className="text-5xl absolute -top-3 -right-3 animate-sparkle-twinkle">📚</div>
                  <div className="text-3xl absolute -bottom-2 -left-2 animate-sparkle-twinkle stagger-1">✨</div>
                </div>
                <h3 className="text-white font-display text-3xl mb-8 font-bold text-shadow floating-sparkles">🌟 Magical Stories</h3>
                <p className="text-white/90 leading-relaxed text-xl font-medium text-body-relaxed text-shadow">Join Turian and friends on enchanted adventures through mystical forests, underwater kingdoms, and floating cloud cities!</p>
                <div className="mt-8 flex items-center justify-center gap-2">
                  <span className="text-lemon animate-sparkle-twinkle font-bold text-xl text-shadow btn-bounce">✨ Read Now ✨</span>
                </div>
              </div>
              
              <div className="card-playful p-12 text-center group hover:scale-110 transition-all duration-500 gradient-playful">
                <div className="relative mb-8">
                  <img src={FrankieFrogsImg} alt="Brain Games" className="w-20 h-20 mx-auto object-contain animate-character-float drop-shadow-2xl border-4 border-white/30 rounded-full p-2 bg-white/80" />
                  <div className="text-5xl absolute -top-3 -right-3 animate-sparkle-twinkle stagger-1">🎮</div>
                  <div className="text-3xl absolute -bottom-2 -left-2 animate-sparkle-twinkle stagger-2">⭐</div>
                </div>
                <h3 className="text-white font-display text-3xl mb-8 font-bold text-shadow floating-sparkles">🏆 Epic Quests</h3>
                <p className="text-white/90 leading-relaxed text-xl font-medium text-body-relaxed text-shadow">Complete magical missions, solve nature puzzles, and unlock special powers while learning about our amazing planet!</p>
                <div className="mt-8 flex items-center justify-center gap-2">
                  <span className="text-lime animate-sparkle-twinkle stagger-1 font-bold text-xl text-shadow btn-bounce">⭐ Play Now ⭐</span>
                </div>
              </div>
              
              <div className="card-playful p-12 text-center group hover:scale-110 transition-all duration-500 gradient-cool">
                <div className="relative mb-8">
                  <img src={TurianDurianImg} alt="Explorer" className="w-20 h-20 mx-auto object-contain animate-character-float drop-shadow-2xl border-4 border-white/30 rounded-full p-2 bg-white/80" />
                  <div className="text-5xl absolute -top-3 -right-3 animate-sparkle-twinkle stagger-2">🌍</div>
                  <div className="text-3xl absolute -bottom-2 -left-2 animate-sparkle-twinkle stagger-3">🧭</div>
                </div>
                <h3 className="text-white font-display text-3xl mb-8 font-bold text-shadow floating-sparkles">🗺️ Explore Worlds</h3>
                <p className="text-white/90 leading-relaxed text-xl font-medium text-body-relaxed text-shadow">Travel to incredible realms from tropical rainforests to snowy mountains, each filled with hidden treasures and new friends!</p>
                <div className="mt-8 flex items-center justify-center gap-2">
                  <span className="text-cherry animate-sparkle-twinkle stagger-2 font-bold text-xl text-shadow btn-bounce">🧭 Explore Now 🧭</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}