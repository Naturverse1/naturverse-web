import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function OAuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    // On Netlify/Supabase, tokens are usually in the URL hash
    // We only need the SPA to boot; Supabase will read from hash/localStorage.
    // After one tick, send user to the homepage (or /profile if you prefer).
    const timer = setTimeout(() => navigate('/', { replace: true }), 50);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div style={{ padding: 24 }}>
      <p>Finishing sign-in…</p>
    </div>
  );
}
