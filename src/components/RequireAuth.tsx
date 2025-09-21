import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthUser } from '@/lib/session';
import { DEFAULT_REDIRECT_PATH } from '@/lib/auth';

export default function RequireAuth({ children }: { children: ReactNode }) {
  const { user, loading } = useAuthUser();
  const location = useLocation();

  if (loading) {
    return (
      <div className="center-pad">
        <div className="spinner" />
      </div>
    );
  }

  if (!user) {
    const next = encodeURIComponent(location.pathname + location.search || DEFAULT_REDIRECT_PATH);
    return <Navigate to={`/login?next=${next}`} replace />;
  }

  return <>{children}</>;
}

