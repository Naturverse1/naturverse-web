import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthProvider, useAuth } from './context/AuthContext';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import NavatarCreator from './pages/NavatarCreator';
import Quests from './pages/Quests';
import Map from './pages/Map';
import Quiz from './pages/Quiz';
import Modules from './pages/Modules';
import Music from './pages/Music';
import Storybook from './pages/Storybook';
import Codex from './pages/Codex';
import AI from './pages/AI';
import Market from './pages/Market';
import Zone from './pages/Zone';

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground text-lg">Loading...</p>
        </div>
      </div>
    );
  }
  
  return user ? <>{children}</> : <Navigate to="/login" replace />;
};

const About: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-br from-mint via-background to-sage/5">
    <div className="container mx-auto px-6 py-20">
      <div className="text-center max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-display text-foreground mb-6">
          <span className="text-emerald">🌿</span> About <span className="text-gradient">Naturverse</span>
        </h1>
        <p className="text-muted-foreground text-xl leading-relaxed mb-8">
          Naturverse is an educational platform designed to inspire young minds through interactive nature exploration, 
          immersive learning experiences, and engaging content that fosters environmental awareness and scientific curiosity.
        </p>
        <div className="grid grid-auto-fit gap-8 mt-12">
          <div className="modern-card p-6 text-center">
            <div className="text-4xl mb-4">🌱</div>
            <h3 className="text-emerald font-display text-lg mb-3">Environmental Education</h3>
            <p className="text-muted-foreground text-sm">Learn about ecosystems, biodiversity, and conservation through interactive content.</p>
          </div>
          <div className="modern-card p-6 text-center">
            <div className="text-4xl mb-4">🔬</div>
            <h3 className="text-ocean font-display text-lg mb-3">Scientific Discovery</h3>
            <p className="text-muted-foreground text-sm">Explore the natural world through hands-on activities and virtual expeditions.</p>
          </div>
          <div className="modern-card p-6 text-center">
            <div className="text-4xl mb-4">🎓</div>
            <h3 className="text-forest font-display text-lg mb-3">Interactive Learning</h3>
            <p className="text-muted-foreground text-sm">Engage with quizzes, stories, and games designed to make learning memorable.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const App: React.FC = () => {
return (
<AuthProvider>
<QueryClientProvider client={queryClient}>
<TooltipProvider>
<Router>
<div className="min-h-screen bg-background">
<NavBar />
<main>
<Routes>
{/* Public Routes */}
<Route path="/" element={<Home />} />
<Route path="/about" element={<About />} />
<Route path="/signup" element={<Signup />} />
<Route path="/login" element={<Login />} />

{/* Protected Routes */}
<Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
<Route path="/navatar" element={<ProtectedRoute><NavatarCreator /></ProtectedRoute>} />
<Route path="/quests" element={<ProtectedRoute><Quests /></ProtectedRoute>} />
<Route path="/map" element={<ProtectedRoute><Map /></ProtectedRoute>} />
<Route path="/quiz" element={<ProtectedRoute><Quiz /></ProtectedRoute>} />
<Route path="/modules" element={<ProtectedRoute><Modules /></ProtectedRoute>} />
<Route path="/music" element={<ProtectedRoute><Music /></ProtectedRoute>} />
<Route path="/storybook" element={<ProtectedRoute><Storybook /></ProtectedRoute>} />
<Route path="/codex" element={<ProtectedRoute><Codex /></ProtectedRoute>} />
<Route path="/ai" element={<ProtectedRoute><AI /></ProtectedRoute>} />
<Route path="/market" element={<ProtectedRoute><Market /></ProtectedRoute>} />
<Route path="/zone/:name" element={<ProtectedRoute><Zone /></ProtectedRoute>} />
</Routes>
</main>
</div>
</Router>
</TooltipProvider>
</QueryClientProvider>
</AuthProvider>
);
};

export default App;