import React from 'react';
import { Link } from 'wouter';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';

// Official Naturverse™ Assets
import TurianLogo from "@assets/turian_media_logo_transparent.png";
import TurianCharacter from "@assets/Turian_1754677394027.jpg";

const NavBar: React.FC = () => {
  const { user, signOut } = useAuth();
  
  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b-4 border-green-300/60 shadow-2xl">
      <div className="container mx-auto px-6 py-3">
        <div className="flex justify-between items-center">
          {/* Logo and Brand */}
          <Link 
            to="/" 
            className="flex items-center space-x-4 hover:scale-105 transition-all duration-300"
            data-testid="nav-logo"
          >
            <div className="flex items-center space-x-3">
              <img 
                src={TurianLogo} 
                alt="The Naturverse™" 
                className="w-14 h-14 drop-shadow-xl" 
              />
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-green-700" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                  The Naturverse™
                </h1>
                <p className="text-xs text-green-600 hidden md:block" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                  Where Learning Becomes Adventure!
                </p>
              </div>
            </div>
          </Link>
          
          {/* Navigation Links */}
          {user ? (
            <div className="flex items-center space-x-2 md:space-x-4">
              <Link 
                to="/map" 
                className="px-4 py-2 text-lg font-bold text-green-700 hover:text-white hover:bg-green-500 rounded-2xl transition-all duration-300 hover:scale-105 shadow-lg border-2 border-green-300/50"
                style={{ fontFamily: 'Fredoka, sans-serif' }}
                data-testid="nav-map"
              >
                <span className="mr-2">🗺️</span>
                <span className="hidden sm:inline">Map</span>
              </Link>
              
              <Link 
                to="/quests" 
                className="px-4 py-2 text-lg font-bold text-blue-700 hover:text-white hover:bg-blue-500 rounded-2xl transition-all duration-300 hover:scale-105 shadow-lg border-2 border-blue-300/50"
                style={{ fontFamily: 'Fredoka, sans-serif' }}
                data-testid="nav-quests"
              >
                <span className="mr-2">🏆</span>
                <span className="hidden sm:inline">Quests</span>
              </Link>
              
              <Link 
                to="/storybook" 
                className="px-4 py-2 text-lg font-bold text-purple-700 hover:text-white hover:bg-purple-500 rounded-2xl transition-all duration-300 hover:scale-105 shadow-lg border-2 border-purple-300/50"
                style={{ fontFamily: 'Fredoka, sans-serif' }}
                data-testid="nav-storybook"
              >
                <span className="mr-2">📚</span>
                <span className="hidden sm:inline">Stories</span>
              </Link>
              
              <Link 
                to="/profile" 
                className="px-3 py-2 rounded-full border-3 border-green-400 hover:scale-110 transition-all duration-300 shadow-lg"
                data-testid="nav-profile"
              >
                <img 
                  src={TurianCharacter} 
                  alt="Profile" 
                  className="w-10 h-10 rounded-full object-cover"
                />
              </Link>
              
              <Button 
                onClick={handleSignOut}
                className="bg-red-500 hover:bg-red-600 text-white font-bold px-4 py-2 rounded-2xl shadow-lg border-2 border-red-300/50 transition-all duration-300 hover:scale-105"
                style={{ fontFamily: 'Fredoka, sans-serif' }}
                data-testid="button-sign-out"
              >
                <span className="mr-2">🚪</span>
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link 
                to="/about" 
                className="px-4 py-2 text-lg font-bold text-blue-700 hover:text-white hover:bg-blue-500 rounded-2xl transition-all duration-300 hover:scale-105 shadow-lg border-2 border-blue-300/50"
                style={{ fontFamily: 'Fredoka, sans-serif' }}
                data-testid="nav-about"
              >
                <span className="mr-2">ℹ️</span>
                <span className="hidden sm:inline">About</span>
              </Link>
              
              <Link 
                to="/signup" 
                className="px-4 py-2 text-lg font-bold text-orange-700 hover:text-white hover:bg-orange-500 rounded-2xl transition-all duration-300 hover:scale-105 shadow-lg border-2 border-orange-300/50"
                style={{ fontFamily: 'Fredoka, sans-serif' }}
                data-testid="nav-signup"
              >
                <span className="mr-2">✨</span>
                <span className="hidden sm:inline">Join</span>
              </Link>
              
              <Button 
                asChild 
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold px-6 py-3 rounded-2xl shadow-xl border-2 border-green-300/50 transition-all duration-300 hover:scale-105"
                style={{ fontFamily: 'Fredoka, sans-serif' }}
              >
                <Link to="/login" data-testid="nav-login">
                  <span className="mr-2">🚀</span>
                  <span className="hidden sm:inline">Start Exploring</span>
                  <span className="sm:hidden">Login</span>
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