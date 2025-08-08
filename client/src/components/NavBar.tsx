import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NavBar: React.FC = () => {
  const { user, signOut } = useAuth();
  
  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <nav className="magic-gradient shadow-lg magical-shadow-lg">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="font-fredoka text-3xl text-white hover:text-sunny transition-all duration-300 hover-wiggle">
            <span className="text-gradient-rainbow">🌿 Naturverse</span>
          </Link>
          
          {user ? (
            /* Main Navigation for Authenticated Users */
            <div className="flex items-center space-x-6 overflow-x-auto">
              {/* Core Navigation */}
              <div className="flex items-center space-x-4">
                <Link to="/profile" className="text-white hover:text-sunny transition-all duration-300 font-medium whitespace-nowrap hover-bounce bg-white/10 px-3 py-2 rounded-xl hover:bg-white/20" data-testid="nav-profile">
                  👤 Profile
                </Link>
                <Link to="/map" className="text-white hover:text-sunny transition-all duration-300 font-medium whitespace-nowrap hover-bounce bg-white/10 px-3 py-2 rounded-xl hover:bg-white/20" data-testid="nav-map">
                  🗺️ Map
                </Link>
                <Link to="/quests" className="text-white hover:text-sunny transition-all duration-300 font-medium whitespace-nowrap hover-bounce bg-white/10 px-3 py-2 rounded-xl hover:bg-white/20" data-testid="nav-quests">
                  🏆 Quests
                </Link>
              </div>
              
              {/* Learning & Activities */}
              <div className="flex items-center space-x-4">
                <Link to="/modules" className="text-white hover:text-sunny transition-all duration-300 font-medium whitespace-nowrap hover-bounce bg-white/10 px-3 py-2 rounded-xl hover:bg-white/20" data-testid="nav-modules">
                  📚 Learn
                </Link>
                <Link to="/quiz" className="text-white hover:text-sunny transition-all duration-300 font-medium whitespace-nowrap hover-bounce bg-white/10 px-3 py-2 rounded-xl hover:bg-white/20" data-testid="nav-quiz">
                  🧠 Quiz
                </Link>
                <Link to="/storybook" className="text-white hover:text-sunny transition-all duration-300 font-medium whitespace-nowrap hover-bounce bg-white/10 px-3 py-2 rounded-xl hover:bg-white/20" data-testid="nav-storybook">
                  📖 Stories
                </Link>
              </div>
              
              {/* Creative & Social */}
              <div className="flex items-center space-x-4">
                <Link to="/navatar" className="text-white hover:text-sunny transition-all duration-300 font-medium whitespace-nowrap hover-bounce bg-white/10 px-3 py-2 rounded-xl hover:bg-white/20" data-testid="nav-navatar">
                  🎨 Navatar
                </Link>
                <Link to="/music" className="text-white hover:text-sunny transition-all duration-300 font-medium whitespace-nowrap hover-bounce bg-white/10 px-3 py-2 rounded-xl hover:bg-white/20" data-testid="nav-music">
                  🎵 Music
                </Link>
                <Link to="/codex" className="text-white hover:text-sunny transition-all duration-300 font-medium whitespace-nowrap hover-bounce bg-white/10 px-3 py-2 rounded-xl hover:bg-white/20" data-testid="nav-codex">
                  📖 Codex
                </Link>
              </div>
              
              {/* AI & Market */}
              <div className="flex items-center space-x-4">
                <Link to="/ai" className="text-white hover:text-sunny transition-all duration-300 font-medium whitespace-nowrap hover-bounce bg-white/10 px-3 py-2 rounded-xl hover:bg-white/20" data-testid="nav-ai">
                  🤖 Turian
                </Link>
                <Link to="/market" className="text-white hover:text-sunny transition-all duration-300 font-medium whitespace-nowrap hover-bounce bg-white/10 px-3 py-2 rounded-xl hover:bg-white/20" data-testid="nav-market">
                  🏪 Market
                </Link>
              </div>
              
              {/* User Actions */}
              <div className="flex items-center space-x-4">
                <button 
                  onClick={handleSignOut}
                  className="kid-friendly-button hover:bg-red-500 font-medium whitespace-nowrap"
                  data-testid="button-sign-out"
                >
                  🚪 Sign Out
                </button>
              </div>
            </div>
          ) : (
            /* Public Navigation for Unauthenticated Users */
            <ul className="flex items-center space-x-6">
              <li>
                <Link to="/" className="text-white hover:text-sunny transition-all duration-300 font-medium hover-bounce bg-white/10 px-3 py-2 rounded-xl hover:bg-white/20" data-testid="nav-home">
                  🏠 Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-white hover:text-sunny transition-all duration-300 font-medium hover-bounce bg-white/10 px-3 py-2 rounded-xl hover:bg-white/20" data-testid="nav-about">
                  ℹ️ About
                </Link>
              </li>
              <li>
                <Link to="/signup" className="text-white hover:text-sunny transition-all duration-300 font-medium hover-bounce bg-white/10 px-3 py-2 rounded-xl hover:bg-white/20" data-testid="nav-signup">
                  ✨ Sign Up
                </Link>
              </li>
              <li>
                <Link 
                  to="/login" 
                  className="kid-friendly-button hover:bg-teal-500"
                  data-testid="nav-login"
                >
                  🚀 Login
                </Link>
              </li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;