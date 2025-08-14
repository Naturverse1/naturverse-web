import { Routes, Route, Navigate } from 'react-router-dom';
import ObservationsPage from './pages/Observations';
import AuthGate from './components/AuthGate';
import { AuthProvider, useAuth } from './auth';

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { isAuthed, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return isAuthed ? children : <Navigate to="/" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<AuthGate />} />
        <Route path="/app" element={<ProtectedRoute><ObservationsPage /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}
