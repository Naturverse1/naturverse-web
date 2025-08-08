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
    <nav className="sticky top-0 z-50 backdrop-blur-lg shadow-xl" style={{
      background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,240,220,0.9) 50%, rgba(240,255,240,0.9) 100%)',
      border: 'none',
      borderBottom: '3px solid rgba(139, 69, 19, 0.2)'
    }}>
      <div className="container mx-auto px-6 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="hover:scale-105 transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img src={TurianLogo} alt="Naturverse" className="w-14 h-14 animate-gentle-pulse drop-shadow-2xl" />
                <div className="absolute -top-1 -right-1 text-lg animate-sparkle-orbit">✨</div>
                <div className="absolute -bottom-1 -left-1 text-lg animate-sparkle-orbit-reverse">🌟</div>
              </div>
              <div className="font-bold text-3xl" style={{
                background: 'linear-gradient(135deg, #8B4513 0%, #D2691E 50%, #F39C12 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                fontFamily: 'Fredoka, cursive'
              }}>
                <span className="text-2xl animate-float-bounce mr-2">🌿</span>
                Naturverse
                <span className="text-2xl animate-float-bounce ml-2">📖</span>
              </div>
            </div>
          </Link>
          
          {user ? (
            /* Magical Navigation for Authenticated Users */
            <div className="flex items-center space-x-3 overflow-x-auto">
              <Link 
                to="/map" 
                className="magical-nav-btn" 
                data-testid="nav-map"
                style={{
                  background: 'linear-gradient(135deg, #27AE60, #2ECC71)',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '1.5rem',
                  fontWeight: 'bold',
                  fontSize: '0.9rem',
                  border: '2px solid rgba(255,255,255,0.3)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                  fontFamily: 'Fredoka, cursive'
                }}
              >
                <span className="text-lg mr-2 animate-sparkle-dance">🗺️</span>Map
              </Link>
              
              <Link 
                to="/quests" 
                className="magical-nav-btn" 
                data-testid="nav-quests"
                style={{
                  background: 'linear-gradient(135deg, #F39C12, #E67E22)',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '1.5rem',
                  fontWeight: 'bold',
                  fontSize: '0.9rem',
                  border: '2px solid rgba(255,255,255,0.3)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                  fontFamily: 'Fredoka, cursive'
                }}
              >
                <span className="text-lg mr-2 animate-sparkle-dance">🏆</span>Quests
              </Link>
              
              <Link 
                to="/storybook" 
                className="magical-nav-btn" 
                data-testid="nav-storybook"
                style={{
                  background: 'linear-gradient(135deg, #9B59B6, #8E44AD)',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '1.5rem',
                  fontWeight: 'bold',
                  fontSize: '0.9rem',
                  border: '2px solid rgba(255,255,255,0.3)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                  fontFamily: 'Fredoka, cursive'
                }}
              >
                <span className="text-lg mr-2 animate-sparkle-dance">📚</span>Stories
              </Link>
              
              <Link 
                to="/ai" 
                className="magical-nav-btn" 
                data-testid="nav-ai"
                style={{
                  background: 'linear-gradient(135deg, #E74C3C, #C0392B)',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '1.5rem',
                  fontWeight: 'bold',
                  fontSize: '0.9rem',
                  border: '2px solid rgba(255,255,255,0.3)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                  fontFamily: 'Fredoka, cursive'
                }}
              >
                <span className="text-lg mr-2 animate-sparkle-dance">🤖</span>Turian
              </Link>
              
              <Link 
                to="/profile" 
                className="magical-nav-btn" 
                data-testid="nav-profile"
                style={{
                  background: 'linear-gradient(135deg, #3498DB, #2980B9)',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '1.5rem',
                  fontWeight: 'bold',
                  fontSize: '0.9rem',
                  border: '2px solid rgba(255,255,255,0.3)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                  fontFamily: 'Fredoka, cursive'
                }}
              >
                <span className="text-lg mr-2 animate-sparkle-dance">👤</span>Profile
              </Link>
              
              <Button 
                onClick={handleSignOut}
                className="magical-nav-btn" 
                data-testid="button-sign-out"
                style={{
                  background: 'linear-gradient(135deg, #E67E22, #D35400)',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '1.5rem',
                  fontWeight: 'bold',
                  fontSize: '0.9rem',
                  border: '2px solid rgba(255,255,255,0.3)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                  fontFamily: 'Fredoka, cursive'
                }}
              >
                <span className="text-lg mr-2 animate-sparkle-dance">🚪</span>Logout
              </Button>
            </div>
          ) : (
            /* Public Navigation for Unauthenticated Users */
            <div className="flex items-center space-x-3">
              <Link 
                to="/about" 
                className="magical-nav-btn" 
                data-testid="nav-about"
                style={{
                  background: 'linear-gradient(135deg, #3498DB, #2980B9)',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '1.5rem',
                  fontWeight: 'bold',
                  fontSize: '0.9rem',
                  border: '2px solid rgba(255,255,255,0.3)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                  fontFamily: 'Fredoka, cursive'
                }}
              >
                <span className="text-lg mr-2 animate-sparkle-dance">ℹ️</span>About
              </Link>
              
              <Link 
                to="/signup" 
                className="magical-nav-btn" 
                data-testid="nav-signup"
                style={{
                  background: 'linear-gradient(135deg, #9B59B6, #8E44AD)',
                  color: 'white',
                  padding: '0.5rem 1.5rem',
                  borderRadius: '1.5rem',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  border: '2px solid rgba(255,255,255,0.3)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                  fontFamily: 'Fredoka, cursive'
                }}
              >
                <span className="text-lg mr-2 animate-sparkle-dance">✨</span>Join Adventure
              </Link>
              
              <Button asChild style={{
                background: 'linear-gradient(135deg, #E74C3C, #C0392B)',
                color: 'white',
                padding: '0.75rem 2rem',
                borderRadius: '1.5rem',
                fontWeight: 'bold',
                fontSize: '1.1rem',
                border: '2px solid rgba(255,255,255,0.3)',
                boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
                fontFamily: 'Fredoka, cursive'
              }}>
                <Link to="/login" data-testid="nav-login" className="hover:scale-105 transition-transform duration-300">
                  <span className="text-xl mr-2 animate-float-bounce">🚀</span>
                  Enter Naturverse
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