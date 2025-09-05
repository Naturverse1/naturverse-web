import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase-client';

export default function AuthCallback() {
  const nav = useNavigate();

  useEffect(() => {
    // supabase sets the session automatically on return
    const next = sessionStorage.getItem('postAuthRedirect') || '/';
    const t = setTimeout(() => nav(next, { replace: true }), 100);
    return () => clearTimeout(t);
  }, [nav]);

  return null;
}
