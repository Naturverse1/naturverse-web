
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/providers/AuthProvider';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Profile from '@/pages/Profile';
import AppPage from '@/pages/AppPage';
import AuthCallback from '@/pages/AuthCallback';

function Protected({ children }: { children: JSX.Element }) {
  const { authLoaded, session } = useAuth();
  const loc = useLocation();
  if (!authLoaded) return null;           // wait for first check
  if (!session) return <Navigate to="/login" replace state={{ from: loc.pathname }} />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/app" element={<Protected><AppPage /></Protected>} />
      <Route path="/profile" element={<Protected><Profile /></Protected>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
