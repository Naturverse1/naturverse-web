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
      <div className="min-h-screen magic-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }
  
  return user ? <>{children}</> : <Navigate to="/login" replace />;
};

const About: React.FC = () => <h2>About the Project</h2>;

const App: React.FC = () => {
return (
<AuthProvider>
<QueryClientProvider client={queryClient}>
<TooltipProvider>
<Router>
<NavBar />
<div style={{ padding: '2rem' }}>
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
</div>
</Router>
</TooltipProvider>
</QueryClientProvider>
</AuthProvider>
);
};

export default App;