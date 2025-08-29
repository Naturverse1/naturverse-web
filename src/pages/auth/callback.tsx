import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/auth';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const returnTo = localStorage.getItem('returnTo') || '/';
    localStorage.removeItem('returnTo');

    const timer = setTimeout(() => {
      navigate(returnTo, { replace: true });
    }, 60);

    return () => clearTimeout(timer);
  }, [navigate]);

  return <div style={{ padding: 24 }}>Signing you in…</div>;
}

