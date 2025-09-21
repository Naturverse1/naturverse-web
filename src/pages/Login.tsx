import { useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import { useAuthUser } from '@/lib/session';
import { DEFAULT_REDIRECT_PATH, resolveRedirectPath } from '@/lib/auth';

export default function LoginPage() {
  const { user, loading } = useAuthUser();
  const navigate = useNavigate();
  const location = useLocation();

  const next = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return resolveRedirectPath(params.get('next'), DEFAULT_REDIRECT_PATH);
  }, [location.search]);

  useEffect(() => {
    if (!loading && user) {
      navigate(next, { replace: true });
    }
  }, [loading, user, navigate, next]);

  const showLoading = loading && !user;

  return (
    <main className="page">
      <header className="page-header">
        <h1>Login</h1>
        <p>Use a magic link or sign in with a provider.</p>
      </header>

      {showLoading ? (
        <p>Checking your session…</p>
      ) : (
        <LoginForm next={next} />
      )}
    </main>
  );
}
