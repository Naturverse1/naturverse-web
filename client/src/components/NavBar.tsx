import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';

const NavBar: React.FC = () => {
  const { user, signOut } = useAuth();
  
  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <nav className="nav-modern sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="font-display text-2xl font-bold text-emerald hover:text-emerald/80 transition-colors duration-200">
            <span className="flex items-center gap-2">
              <span className="text-2xl">🌿</span>
              <span>Naturverse</span>
            </span>
          </Link>
          
          {user ? (
            /* Main Navigation for Authenticated Users */
            <div className="flex items-center space-x-1 overflow-x-auto">
              {/* Core Navigation */}
              <div className="flex items-center space-x-1">
                <Link to="/profile" className="nav-link" data-testid="nav-profile">
                  <span className="mr-2">👤</span>Profile
                </Link>
                <Link to="/map" className="nav-link nav-link-active" data-testid="nav-map">
                  <span className="mr-2">🗺️</span>Map
                </Link>
                <Link to="/quests" className="nav-link" data-testid="nav-quests">
                  <span className="mr-2">🏆</span>Quests
                </Link>
              </div>
              
              {/* Learning & Activities */}
              <div className="flex items-center space-x-1">
                <Link to="/modules" className="nav-link" data-testid="nav-modules">
                  <span className="mr-2">📚</span>Learn
                </Link>
                <Link to="/quiz" className="nav-link" data-testid="nav-quiz">
                  <span className="mr-2">🧠</span>Quiz
                </Link>
                <Link to="/storybook" className="nav-link" data-testid="nav-storybook">
                  <span className="mr-2">📖</span>Stories
                </Link>
              </div>
              
              {/* Creative & Social */}
              <div className="flex items-center space-x-1">
                <Link to="/navatar" className="nav-link" data-testid="nav-navatar">
                  <span className="mr-2">🎨</span>Navatar
                </Link>
                <Link to="/music" className="nav-link" data-testid="nav-music">
                  <span className="mr-2">🎵</span>Music
                </Link>
                <Link to="/codex" className="nav-link" data-testid="nav-codex">
                  <span className="mr-2">📖</span>Codex
                </Link>
              </div>
              
              {/* AI & Market */}
              <div className="flex items-center space-x-1">
                <Link to="/ai" className="nav-link" data-testid="nav-ai">
                  <span className="mr-2">🤖</span>Turian
                </Link>
                <Link to="/market" className="nav-link" data-testid="nav-market">
                  <span className="mr-2">🏪</span>Market
                </Link>
              </div>
              
              {/* User Actions */}
              <div className="flex items-center ml-4">
                <Button 
                  onClick={handleSignOut}
                  variant="outline"
                  size="sm"
                  className="btn-ghost text-destructive hover:text-destructive hover:bg-destructive/10"
                  data-testid="button-sign-out"
                >
                  <span className="mr-2">🚪</span>Sign Out
                </Button>
              </div>
            </div>
          ) : (
            /* Public Navigation for Unauthenticated Users */
            <div className="flex items-center space-x-2">
              <Link to="/" className="nav-link" data-testid="nav-home">
                <span className="mr-2">🏠</span>Home
              </Link>
              <Link to="/about" className="nav-link" data-testid="nav-about">
                <span className="mr-2">ℹ️</span>About
              </Link>
              <Link to="/signup" className="nav-link" data-testid="nav-signup">
                <span className="mr-2">✨</span>Sign Up
              </Link>
              <Button asChild className="btn-primary ml-4">
                <Link to="/login" data-testid="nav-login">
                  <span className="mr-2">🚀</span>Login
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