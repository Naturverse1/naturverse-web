import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './lib/AuthProvider';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';
import Login from './pages/Login';
import AppHome from './pages/AppHome';
import Profile from './pages/Profile';
import MapHub from './pages/MapHub';
import RainforestWorld from './pages/RainforestWorld';
import OceanWorld from './pages/OceanWorld';
import DesertWorld from './pages/DesertWorld';
import Stories from './pages/Stories';
import Quizzes from './pages/Quizzes';
import Rainforest from './pages/Rainforest';
import Plants from './pages/rainforest/Plants';
import Animals from './pages/rainforest/Animals';
import Ecosystem from './pages/rainforest/Ecosystem';
import Quiz from './pages/rainforest/Quiz';

export default function App() {
  const location = useLocation();
  const showNavbar = location.pathname !== '/';
  return (
    <AuthProvider>
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/app" element={<ProtectedRoute><AppHome /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/map" element={<ProtectedRoute><MapHub /></ProtectedRoute>} />
        <Route path="/rainforest" element={<Rainforest />} />
        <Route path="/rainforest/plants" element={<Plants />} />
        <Route path="/rainforest/animals" element={<Animals />} />
        <Route path="/rainforest/ecosystem" element={<Ecosystem />} />
        <Route path="/rainforest/quiz" element={<Quiz />} />
        <Route path="/worlds/rainforest" element={<ProtectedRoute><RainforestWorld /></ProtectedRoute>} />
        <Route path="/worlds/ocean" element={<ProtectedRoute><OceanWorld /></ProtectedRoute>} />
        <Route path="/worlds/desert" element={<ProtectedRoute><DesertWorld /></ProtectedRoute>} />
        <Route path="/stories" element={<ProtectedRoute><Stories /></ProtectedRoute>} />
        <Route path="/quizzes" element={<ProtectedRoute><Quizzes /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}
