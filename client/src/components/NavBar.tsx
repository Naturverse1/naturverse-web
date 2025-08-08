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
          <Link to="/" className="font-display text-3xl font-bold text-gradient hover:scale-105 transition-all duration-300">
            <span className="flex items-center gap-3">
              <div className="relative">
                <img src={TurianLogo} alt="Turian Media" className="w-16 h-16 animate-gentle-pulse drop-shadow-lg" />
                <div className="absolute -top-1 -right-1 text-2xl animate-sparkle-twinkle">✨</div>
              </div>
              <span className="text-4xl animate-sparkle-twinkle">🌿</span>
              <span className="text-transparent bg-gradient-to-r from-emerald via-magic to-forest bg-clip-text font-bold">Naturverse</span>
              <div className="flex gap-1 ml-2">
                <span className="text-lg animate-sparkle-twinkle">🌟</span>
                <span className="text-lg animate-sparkle-twinkle stagger-1">✨</span>
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
                <Link to="/modules" className="region-button bg-gradient-to-r from-ocean to-sky" data-testid="nav-modules">
                  <img src={DrPImg} alt="Dr P" className="w-6 h-6 mr-2 object-contain animate-bounce-gentle" />
                  <span>Learning Zone</span>
                </Link>
                <Link to="/quiz" className="region-button bg-gradient-to-r from-magic to-sparkle" data-testid="nav-quiz">
                  <img src={FrankieFrogsImg} alt="Frankie Frogs" className="w-6 h-6 mr-2 object-contain animate-bounce-gentle" />
                  <span>Brain Games</span>
                </Link>
                <Link to="/storybook" className="region-button bg-gradient-to-r from-coral to-sunset" data-testid="nav-storybook">
                  <img src={LaoCowImg} alt="Wise Lao Cow" className="w-6 h-6 mr-2 object-contain animate-bounce-gentle" />
                  <span>Story Realm</span>
                </Link>
              </div>
              
              {/* Creative & Musical Realms */}
              <div className="flex items-center space-x-2">
                <Link to="/navatar" className="region-button bg-gradient-to-r from-lavender to-magic" data-testid="nav-navatar">
                  <img src={BluButterflyImg} alt="Blu Butterfly" className="w-6 h-6 mr-2 object-contain animate-bounce-gentle" />
                  <span>Avatar Studio</span>
                </Link>
                <Link to="/music" className="region-button bg-gradient-to-r from-sunny to-amber" data-testid="nav-music">
                  <img src={MangoMikeImg} alt="Mango Mike" className="w-6 h-6 mr-2 object-contain animate-bounce-gentle" />
                  <span>Music Island</span>
                </Link>
                <Link to="/codex" className="region-button bg-gradient-to-r from-forest to-sage" data-testid="nav-codex">
                  <img src={PineapplePaImg} alt="Pineapple Pa-Pa" className="w-6 h-6 mr-2 object-contain animate-bounce-gentle" />
                  <span>Knowledge Codex</span>
                </Link>
              </div>
              
              {/* Special Magical Places */}
              <div className="flex items-center space-x-2">
                <Link to="/ai" className="region-button bg-gradient-to-r from-turquoise to-ocean animate-magical-pulse" data-testid="nav-ai">
                  <img src={TurianImg} alt="Turian" className="w-6 h-6 mr-2 object-contain animate-character-float rounded-full" />
                  <span>Turian's Tower</span>
                </Link>
                <Link to="/market" className="region-button bg-gradient-to-r from-emerald to-mint" data-testid="nav-market">
                  <img src={HankImg} alt="Hank" className="w-6 h-6 mr-2 object-contain animate-bounce-gentle" />
                  <span>Magic Market</span>
                </Link>
              </div>
              
              {/* User Actions */}
              <div className="flex items-center ml-6">
                <Button 
                  onClick={handleSignOut}
                  variant="outline"
                  size="sm"
                  className="btn-ghost text-destructive hover:text-destructive hover:bg-destructive/10 border-2 border-coral hover:border-coral/60 transition-all duration-300 hover:scale-105"
                  data-testid="button-sign-out"
                >
                  <span className="mr-2 text-lg">🚪</span>Sign Out
                </Button>
              </div>
            </div>
          ) : (
            /* Public Navigation for Unauthenticated Users */
            <div className="flex items-center space-x-3">
              <Link to="/" className="region-button bg-gradient-to-r from-mint to-sage" data-testid="nav-home">
                <span className="mr-2 text-lg animate-sparkle-twinkle">🏠</span>Home
              </Link>
              <Link to="/about" className="region-button bg-gradient-to-r from-ocean to-sky" data-testid="nav-about">
                <span className="mr-2 text-lg animate-sparkle-twinkle">ℹ️</span>About
              </Link>
              <Link to="/signup" className="region-button bg-gradient-to-r from-magic to-sparkle animate-magical-pulse" data-testid="nav-signup">
                <span className="mr-2 text-lg animate-sparkle-twinkle">✨</span>Join Adventure
              </Link>
              <Button asChild className="btn-primary ml-4 text-lg px-6 py-3 hover:scale-105 transition-all duration-300">
                <Link to="/login" data-testid="nav-login">
                  <span className="mr-2 text-xl animate-sparkle-twinkle">🚀</span>Enter Naturverse
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