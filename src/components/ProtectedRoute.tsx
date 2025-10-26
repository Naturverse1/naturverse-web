import { ComponentType } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuthUser } from '@/lib/session';
import { DEFAULT_REDIRECT_PATH } from '@/lib/auth';

type Props = { component: ComponentType<any> };

export default function ProtectedRoute({ component: C }: Props) {
  const { user, loading } = useAuthUser();
  const location = useLocation();

  if (loading) {
    return (
      <div className="guard">
        <h1>Checking access…</h1>
        <p className="muted">Hold on while we confirm your session.</p>
      </div>
    );
  }

  if (!user) {
    const next = location.pathname + location.search || DEFAULT_REDIRECT_PATH;
    return <UnauthedFallback next={next} />;
  }

  return <C />;
}

function UnauthedFallback({ next }: { next: string }) {
  const href = `/login?next=${encodeURIComponent(next)}`;
  return (
    <div className="guard">
      <h1>Sign in required</h1>
      <p className="muted">Please sign in to access this page.</p>
      <div className="row">
        <a className="btn" href={href}>
          Sign in
        </a>
        <a className="btn outline" href="/">
          Back home
        </a>
      </div>
    </div>
  );
}

