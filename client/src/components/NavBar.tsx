import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';

// Import logo
import TurianLogo from '../assets/turian_media_logo_transparent.png';

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
              <img src={TurianLogo} alt="Turian Media" className="w-10 h-10 animate-gentle-pulse" />
              <span className="animate-sparkle-twinkle">🌿</span>
              <span>Naturverse</span>
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
                  <span className="mr-2 text-lg animate-sparkle-twinkle">📚</span>Learning Zone
                </Link>
                <Link to="/quiz" className="region-button bg-gradient-to-r from-magic to-sparkle" data-testid="nav-quiz">
                  <span className="mr-2 text-lg animate-sparkle-twinkle">🧠</span>Brain Games
                </Link>
                <Link to="/storybook" className="region-button bg-gradient-to-r from-coral to-sunset" data-testid="nav-storybook">
                  <span className="mr-2 text-lg animate-sparkle-twinkle">📖</span>Story Realm
                </Link>
              </div>
              
              {/* Creative & Musical Realms */}
              <div className="flex items-center space-x-2">
                <Link to="/navatar" className="region-button bg-gradient-to-r from-lavender to-magic" data-testid="nav-navatar">
                  <span className="mr-2 text-lg animate-sparkle-twinkle">🎨</span>Avatar Studio
                </Link>
                <Link to="/music" className="region-button bg-gradient-to-r from-sunny to-amber" data-testid="nav-music">
                  <span className="mr-2 text-lg animate-sparkle-twinkle">🎵</span>Music Island
                </Link>
                <Link to="/codex" className="region-button bg-gradient-to-r from-forest to-sage" data-testid="nav-codex">
                  <span className="mr-2 text-lg animate-sparkle-twinkle">📖</span>Knowledge Codex
                </Link>
              </div>
              
              {/* Special Magical Places */}
              <div className="flex items-center space-x-2">
                <Link to="/ai" className="region-button bg-gradient-to-r from-turquoise to-ocean animate-magical-pulse" data-testid="nav-ai">
                  <span className="mr-2 text-lg animate-character-float">🤖</span>Turian's Tower
                </Link>
                <Link to="/market" className="region-button bg-gradient-to-r from-emerald to-mint" data-testid="nav-market">
                  <span className="mr-2 text-lg animate-sparkle-twinkle">🏪</span>Magic Market
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