import React from 'react';
import { Link } from 'wouter';
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
          <Link to="/" className="text-display text-3xl md:text-4xl font-bold text-gradient hover:scale-105 transition-all duration-300">
            <span className="flex items-center gap-2 md:gap-3">
              <div className="relative flex-shrink-0">
                <img src={TurianLogo} alt="The Naturverse" className="w-16 h-16 md:w-20 md:h-20 drop-shadow-2xl" />
                <div className="absolute -top-2 -right-2 text-2xl animate-sparkle-twinkle">✨</div>
              </div>
              <span className="text-3xl md:text-5xl flex-shrink-0">🌿</span>
              <span className="text-transparent bg-gradient-to-r from-emerald via-forest to-sage bg-clip-text font-bold min-w-0 truncate">The Naturverse™</span>
            </span>
          </Link>
          
          {user ? (
            <div className="flex items-center space-x-3 overflow-x-auto">
              <Link to="/map" className="nav-link" data-testid="nav-map">
                <span className="mr-2 text-lg">🗺️</span>Map
              </Link>
              <Link to="/quests" className="nav-link" data-testid="nav-quests">
                <span className="mr-2 text-lg">🏆</span>Quests
              </Link>
              <Link to="/profile" className="nav-link" data-testid="nav-profile">
                <span className="mr-2 text-lg">👤</span>Profile
              </Link>
              <Button 
                onClick={handleSignOut}
                className="btn-secondary"
                data-testid="button-sign-out"
              >
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link to="/about" className="nav-link" data-testid="nav-about">
                About
              </Link>
              <Link to="/signup" className="nav-link" data-testid="nav-signup">
                Sign Up
              </Link>
              <Button asChild className="btn-primary">
                <Link to="/login" data-testid="nav-login">
                  <span className="mr-2">🚀</span>
                  Start Exploring
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