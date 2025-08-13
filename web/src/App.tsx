import ObservationsPage from './pages/Observations';
import AuthGate from './components/AuthGate';

export default function App() {
  return (
    <AuthGate>
      <ObservationsPage />
    </AuthGate>
  );
}
