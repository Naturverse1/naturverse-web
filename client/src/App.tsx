import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { Route, Router } from 'wouter';

import NavBar from './components/NavBar';
import { TurianAiGuide } from './components/TurianAiGuide';
import { TooltipProvider } from './components/ui/tooltip';
import { AuthProvider, useAuth } from './context/AuthContext';
import AI from './pages/AI';
import Codex from './pages/Codex';
import Home from './pages/Home';
import Login from './pages/Login';
import Map from './pages/Map';
import Market from './pages/Market';
import Modules from './pages/Modules';
import Music from './pages/Music';
import NavatarCreator from './pages/NavatarCreator';
import Profile from './pages/Profile';
import Quests from './pages/Quests';
import Quiz from './pages/Quiz';
import Signup from './pages/Signup';
import Storybook from './pages/Storybook';
import Zone from './pages/Zone';

// Create About component since it might be missing
const About = () => (
  <div className="min-h-screen storybook-world flex items-center justify-center">
    <div className="text-center p-8">
      <h1
        className="text-6xl font-bold mb-8"
        style={{
          background: 'linear-gradient(135deg, #8B4513 0%, #D2691E 50%, #F39C12 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontFamily: 'Fredoka, cursive',
        }}
      >
        <span className="text-5xl mr-3 animate-float-bounce">🌿</span>
        About Naturverse
        <span className="text-5xl ml-3 animate-float-bounce">📚</span>
      </h1>
      <p className="text-2xl text-emerald-800 font-bold mb-6">
        A magical educational adventure for young explorers!
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
        <div className="bg-white/80 p-6 rounded-3xl shadow-magical animate-book-opening">
          <div className="text-4xl mb-4 animate-sparkle-dance">🗺️</div>
          <h3 className="text-xl font-bold text-emerald-700 mb-3">Explore</h3>
          <p className="text-emerald-600">
            Discover magical worlds through interactive maps and adventures.
          </p>
        </div>
        <div className="bg-white/80 p-6 rounded-3xl shadow-magical animate-book-opening">
          <div className="text-4xl mb-4 animate-sparkle-dance">📖</div>
          <h3 className="text-xl font-bold text-emerald-700 mb-3">Learn</h3>
          <p className="text-emerald-600">Immerse yourself in educational stories and quests.</p>
        </div>
        <div className="bg-white/80 p-6 rounded-3xl shadow-magical animate-book-opening">
          <div className="text-4xl mb-4 animate-sparkle-dance">🎨</div>
          <h3 className="text-xl font-bold text-emerald-700 mb-3">Create</h3>
          <p className="text-emerald-600">Build your own avatar and express your creativity.</p>
        </div>
      </div>
    </div>
  </div>
);

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-mint via-background to-sage/5 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald mx-auto mb-6"></div>
          <p className="text-emerald text-2xl font-bold animate-pulse">Loading magical world...</p>
          <div className="flex justify-center space-x-2 mt-4">
            <div className="text-3xl animate-bounce">🌟</div>
            <div className="text-3xl animate-bounce stagger-1">✨</div>
            <div className="text-3xl animate-bounce stagger-2">🦋</div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    window.location.href = '/login';
    return null;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <main className="content">
            <div className="min-h-screen storybook-world">
              <NavBar />
              <TurianAiGuide />
              <Route path="/" component={Home} />
              <Route path="/about" component={About} />
              <Route path="/signup" component={Signup} />
              <Route path="/login" component={Login} />

              {/* Protected Routes */}
              <Route path="/profile">
                {() => (
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                )}
              </Route>
              <Route path="/navatar">
                {() => (
                  <ProtectedRoute>
                    <NavatarCreator />
                  </ProtectedRoute>
                )}
              </Route>
              <Route path="/quests">
                {() => (
                  <ProtectedRoute>
                    <Quests />
                  </ProtectedRoute>
                )}
              </Route>
              <Route path="/map">
                {() => (
                  <ProtectedRoute>
                    <Map />
                  </ProtectedRoute>
                )}
              </Route>
              <Route path="/quiz">
                {() => (
                  <ProtectedRoute>
                    <Quiz />
                  </ProtectedRoute>
                )}
              </Route>
              <Route path="/modules">
                {() => (
                  <ProtectedRoute>
                    <Modules />
                  </ProtectedRoute>
                )}
              </Route>
              <Route path="/music">
                {() => (
                  <ProtectedRoute>
                    <Music />
                  </ProtectedRoute>
                )}
              </Route>
              <Route path="/storybook">
                {() => (
                  <ProtectedRoute>
                    <Storybook />
                  </ProtectedRoute>
                )}
              </Route>
              <Route path="/codex">
                {() => (
                  <ProtectedRoute>
                    <Codex />
                  </ProtectedRoute>
                )}
              </Route>
              <Route path="/ai">
                {() => (
                  <ProtectedRoute>
                    <AI />
                  </ProtectedRoute>
                )}
              </Route>
              <Route path="/market">
                {() => (
                  <ProtectedRoute>
                    <Market />
                  </ProtectedRoute>
                )}
              </Route>
              <Route path="/zone/:name">
                {({ name }) => (
                  <ProtectedRoute>
                    <Zone />
                  </ProtectedRoute>
                )}
              </Route>

              {/* Fallback route - render Home directly for unmatched paths */}
              <Route>
                <Home />
              </Route>
            </div>
          </main>
        </TooltipProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
};

export default App;
