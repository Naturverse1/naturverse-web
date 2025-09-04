import BluButterfly from '@assets/Blu Butterfly_1754677394021.png';
import CoconutCruze from '@assets/Coconut Cruze_1754677394021.png';
import FrankieFrogs from '@assets/Frankie Frogs_1754677394022.png';
import JaySing from '@assets/Jay-Sing_1754677394023.png';
import MangoMike from '@assets/Mango Mike_1754677394025.png';
import TurianCharacter from '@assets/Turian_1754677394027.jpg';
import TurianLogo from '@assets/turian_media_logo_transparent.png';
import React from 'react';
import { Link, useLocation } from 'wouter';

import { useAuth } from '../context/AuthContext';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

// Official Naturverse™ Assets

const NavBar: React.FC = () => {
  const [location] = useLocation();
  const { user, profile, signOut } = useAuth();

  const navItems = [
    {
      href: '/',
      label: 'Home',
      icon: '🏠',
      character: TurianCharacter,
      color: 'from-green-400 to-green-600',
    },
    {
      href: '/map',
      label: 'Map',
      icon: '🗺️',
      character: CoconutCruze,
      color: 'from-blue-400 to-blue-600',
    },
    {
      href: '/quests',
      label: 'Quests',
      icon: '⚡',
      character: FrankieFrogs,
      color: 'from-purple-400 to-purple-600',
    },
    {
      href: '/storybook',
      label: 'Stories',
      icon: '📚',
      character: BluButterfly,
      color: 'from-pink-400 to-pink-600',
    },
    {
      href: '/navatar',
      label: 'Navatar',
      icon: '👤',
      character: JaySing,
      color: 'from-yellow-400 to-orange-500',
    },
    {
      href: '/quiz',
      label: 'Quiz',
      icon: '🧠',
      character: MangoMike,
      color: 'from-red-400 to-red-600',
    },
  ];

  const handleSignOut = async () => {
    await signOut();
  };

  const isActive = (href: string) => {
    if (href === '/' && location === '/') return true;
    if (href !== '/' && location.startsWith(href)) return true;
    return false;
  };

  if (!user) return null;

  return (
    <nav className="sticky top-0 z-50 nav-magical shadow-2xl">
      <div className="container mx-auto px-4 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          {/* Magical Logo and Brand */}
          <Link
            to="/"
            className="flex items-center space-x-4 hover:scale-105 transition-all duration-300 animate-gentle-pulse"
            data-testid="nav-logo"
          >
            <div className="flex items-center space-x-3">
              <div className="relative">
                <img
                  src={TurianLogo}
                  alt="The Naturverse™"
                  className="w-16 h-16 drop-shadow-2xl animate-sparkle-dance"
                />
                <div className="absolute -top-1 -right-1 text-yellow-300 text-xl animate-sparkle-dance">
                  ✨
                </div>
              </div>
              <div>
                <h1 className="text-2xl lg:text-4xl font-magical text-white drop-shadow-lg">
                  The Naturverse™
                </h1>
                <p className="text-sm text-yellow-200 hidden md:block font-playful">
                  Where Learning Becomes Adventure! 🌟
                </p>
              </div>
            </div>
          </Link>

          {/* Navigation Items */}
          <div className="hidden lg:flex items-center space-x-2">
            {navItems.map((item, index) => (
              <Link
                key={item.href}
                to={item.href}
                className={`nav-item group relative ${isActive(item.href) ? 'text-yellow-300 scale-105' : ''}`}
                data-testid={`nav-${item.label.toLowerCase()}`}
              >
                <div className="flex items-center space-x-2 px-4 py-3 rounded-2xl">
                  {/* Character Avatar */}
                  <div className="relative">
                    <img
                      src={item.character}
                      alt={item.label}
                      className="w-8 h-8 rounded-full border-2 border-white/50 shadow-lg group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute -top-1 -right-1 text-xs">{item.icon}</div>
                  </div>

                  <span className="font-bold text-lg">{item.label}</span>
                </div>

                {/* Hover Background */}
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-30 rounded-2xl transition-opacity duration-300`}
                />
              </Link>
            ))}
          </div>

          {/* Mobile Navigation Menu */}
          <div className="lg:hidden flex items-center space-x-2">
            {navItems.slice(0, 3).map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`nav-item ${isActive(item.href) ? 'text-yellow-300 scale-110' : ''} p-2`}
                data-testid={`nav-mobile-${item.label.toLowerCase()}`}
              >
                <div className="flex flex-col items-center">
                  <img
                    src={item.character}
                    alt={item.label}
                    className="w-8 h-8 rounded-full border-2 border-white/50 shadow-lg"
                  />
                  <span className="text-xs mt-1 font-bold">{item.icon}</span>
                </div>
              </Link>
            ))}
          </div>

          {/* User Authentication Section */}
          {user ? (
            <div className="flex items-center space-x-4">
              {/* User Profile */}
              <Link
                to="/profile"
                className="flex items-center space-x-2 hover:scale-105 transition-all duration-300"
              >
                <Avatar className="w-12 h-12 border-4 border-white/50 shadow-xl">
                  <AvatarImage
                    src={profile?.avatar_url || undefined}
                    alt={profile?.display_name || 'User'}
                  />
                  <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-400 text-white font-bold">
                    <img
                      src={TurianCharacter}
                      alt="Default Avatar"
                      className="w-full h-full object-cover rounded-full"
                    />
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block">
                  <div className="text-white font-bold text-sm font-playful">Welcome back!</div>
                  <div className="text-yellow-200 text-xs">
                    {profile?.display_name || 'Explorer'}
                  </div>
                </div>
              </Link>

              {/* Sign Out Button */}
              <Button
                onClick={handleSignOut}
                className="btn-tropical text-sm font-bold"
                data-testid="nav-signout"
              >
                <span className="mr-2">🚪</span>
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link to="/login">
                <Button className="btn-magical text-lg font-bold" data-testid="nav-signin">
                  <span className="mr-2">🌟</span>
                  Sign In
                  <span className="ml-2">✨</span>
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Floating Sparkles */}
      <div className="floating-sparkles" style={{ top: '20px', left: '15%' }}>
        ✨
      </div>
      <div
        className="floating-sparkles"
        style={{ top: '40px', right: '25%', animationDelay: '1s' }}
      >
        🌟
      </div>
      <div
        className="floating-sparkles"
        style={{ bottom: '10px', left: '30%', animationDelay: '2s' }}
      >
        ⭐
      </div>
      <div
        className="floating-sparkles"
        style={{ top: '15px', right: '10%', animationDelay: '1.5s' }}
      >
        ✨
      </div>
    </nav>
  );
};

export default NavBar;
