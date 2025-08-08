import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';

// Import logo
import TurianLogo from '../assets/turian_media_logo_transparent.png';
import TurianImg from '../assets/Turian.jpg';
import MangoMikeImg from '../assets/Mango Mike.png';
import DrPImg from '../assets/Dr P.png';
import FrankieFrogsImg from '../assets/Frankie Frogs.png';
import BluButterflyImg from '../assets/Blu Butterfly.png';
import HankImg from '../assets/hank.png';
import PineapplePaImg from '../assets/Pineapple Pa-Pa.png';
import LaoCowImg from '../assets/Lao Cow.png';

const NavBar: React.FC = () => {
  const { user, signOut } = useAuth();
  
  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <nav className="nav-modern sticky top-0 z-50 backdrop-blur-lg bg-white/80 border-b border-emerald/20 shadow-xl">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-display text-4xl font-bold text-gradient hover:scale-105 transition-all duration-300 floating-sparkles">
            <span className="flex items-center gap-3">
              <div className="relative">
                <img src={TurianLogo} alt="Turian Media" className="w-20 h-20 animate-gentle-pulse drop-shadow-2xl hover:animate-bounce-playful" />
                <div className="absolute -top-2 -right-2 text-3xl animate-sparkle-twinkle">✨</div>
                <div className="absolute -bottom-1 -left-1 text-2xl animate-sparkle-twinkle stagger-1">🌟</div>
              </div>
              <span className="text-5xl animate-sparkle-twinkle">🌿</span>
              <span className="text-transparent bg-gradient-to-r from-emerald via-magic to-forest bg-clip-text font-bold text-magic-glow">Naturverse</span>
              <div className="flex gap-1 ml-3">
                <span className="text-2xl animate-sparkle-twinkle">🌟</span>
                <span className="text-2xl animate-sparkle-twinkle stagger-1">✨</span>
                <span className="text-xl animate-sparkle-twinkle stagger-2">🦋</span>
              </div>
            </span>
          </Link>
          
          {user ? (
            /* Magical Navigation for Authenticated Users */
            <div className="flex items-center space-x-2 overflow-x-auto">
              {/* Core Magical Regions */}
              <div className="flex items-center space-x-2">
                <Link to="/profile" className="region-button" data-testid="nav-profile">
                  <span className="mr-2 text-lg animate-sparkle-twinkle">👤</span>Profile
                </Link>
                <Link to="/map" className="region-button animate-region-glow" data-testid="nav-map">
                  <span className="mr-2 text-lg animate-sparkle-twinkle">🗺️</span>Adventure Map
                </Link>
                <Link to="/quests" className="region-button" data-testid="nav-quests">
                  <span className="mr-2 text-lg animate-sparkle-twinkle">🏆</span>Epic Quests
                </Link>
              </div>
              
              {/* Learning Realms & Activities */}
              <div className="flex items-center space-x-2">
                <Link to="/modules" className="region-button gradient-cool text-white hover:text-white shadow-lg" data-testid="nav-modules">
                  <img src={DrPImg} alt="Dr P" className="w-7 h-7 mr-2 object-contain animate-bounce-gentle hover:scale-110 transition-transform" />
                  <span className="text-playful font-bold">Learning Zone</span>
                </Link>
                <Link to="/quiz" className="region-button gradient-playful text-white hover:text-white shadow-lg" data-testid="nav-quiz">
                  <img src={FrankieFrogsImg} alt="Frankie Frogs" className="w-7 h-7 mr-2 object-contain animate-bounce-gentle hover:scale-110 transition-transform" />
                  <span className="text-playful font-bold">Brain Games</span>
                </Link>
                <Link to="/storybook" className="region-button gradient-warm text-white hover:text-white shadow-lg" data-testid="nav-storybook">
                  <img src={LaoCowImg} alt="Wise Lao Cow" className="w-7 h-7 mr-2 object-contain animate-bounce-gentle hover:scale-110 transition-transform" />
                  <span className="text-playful font-bold">Story Realm</span>
                </Link>
              </div>
              
              {/* Creative & Musical Realms */}
              <div className="flex items-center space-x-2">
                <Link to="/navatar" className="region-button bg-gradient-to-r from-grape to-bubblegum text-white hover:text-white shadow-lg btn-bounce" data-testid="nav-navatar">
                  <img src={BluButterflyImg} alt="Blu Butterfly" className="w-7 h-7 mr-2 object-contain animate-bounce-gentle hover:scale-110 transition-transform" />
                  <span className="text-playful font-bold">Avatar Studio</span>
                </Link>
                <Link to="/music" className="region-button bg-gradient-to-r from-tangerine to-lemon text-white hover:text-white shadow-lg btn-bounce" data-testid="nav-music">
                  <img src={MangoMikeImg} alt="Mango Mike" className="w-7 h-7 mr-2 object-contain animate-bounce-gentle hover:scale-110 transition-transform" />
                  <span className="text-playful font-bold">Music Island</span>
                </Link>
                <Link to="/codex" className="region-button bg-gradient-to-r from-lime to-emerald text-white hover:text-white shadow-lg" data-testid="nav-codex">
                  <img src={PineapplePaImg} alt="Pineapple Pa-Pa" className="w-7 h-7 mr-2 object-contain animate-bounce-gentle hover:scale-110 transition-transform" />
                  <span className="text-playful font-bold">Knowledge Codex</span>
                </Link>
              </div>
              
              {/* Special Magical Places */}
              <div className="flex items-center space-x-2">
                <Link to="/ai" className="region-button btn-rainbow text-white hover:text-white shadow-xl animate-magical-pulse" data-testid="nav-ai">
                  <img src={TurianImg} alt="Turian" className="w-8 h-8 mr-2 object-contain animate-character-float rounded-full border-2 border-white/50" />
                  <span className="text-playful font-bold text-shadow">Turian's Tower</span>
                </Link>
                <Link to="/market" className="region-button bg-gradient-to-r from-emerald to-mint text-white hover:text-white shadow-lg btn-bounce" data-testid="nav-market">
                  <img src={HankImg} alt="Hank" className="w-7 h-7 mr-2 object-contain animate-bounce-gentle hover:scale-110 transition-transform" />
                  <span className="text-playful font-bold">Magic Market</span>
                </Link>
              </div>
              
              {/* User Actions */}
              <div className="flex items-center ml-6">
                <Button 
                  onClick={handleSignOut}
                  variant="outline"
                  size="sm"
                  className="bg-gradient-to-r from-coral to-cherry text-white hover:text-white border-2 border-white/30 hover:border-white/60 transition-all duration-300 hover:scale-105 text-playful font-bold shadow-lg btn-bounce"
                  data-testid="button-sign-out"
                >
                  <span className="mr-2 text-lg animate-sparkle-twinkle">🚪</span>Sign Out
                </Button>
              </div>
            </div>
          ) : (
            /* Public Navigation for Unauthenticated Users */
            <div className="flex items-center space-x-3">
              <Link to="/" className="region-button gradient-cool text-white hover:text-white shadow-lg" data-testid="nav-home">
                <span className="mr-2 text-xl animate-sparkle-twinkle">🏠</span>
                <span className="text-playful font-bold">Home</span>
              </Link>
              <Link to="/about" className="region-button gradient-playful text-white hover:text-white shadow-lg" data-testid="nav-about">
                <span className="mr-2 text-xl animate-sparkle-twinkle">ℹ️</span>
                <span className="text-playful font-bold">About</span>
              </Link>
              <Link to="/signup" className="region-button btn-rainbow text-white hover:text-white shadow-xl animate-magical-pulse" data-testid="nav-signup">
                <span className="mr-2 text-xl animate-sparkle-twinkle">✨</span>
                <span className="text-playful font-bold">Join Adventure</span>
              </Link>
              <Button asChild className="btn-primary ml-4 text-xl px-8 py-4 hover:scale-105 transition-all duration-300 shadow-xl btn-bounce">
                <Link to="/login" data-testid="nav-login">
                  <span className="mr-3 text-2xl animate-sparkle-twinkle">🚀</span>
                  <span className="text-playful font-bold">Enter Naturverse</span>
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;