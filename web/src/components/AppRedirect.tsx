import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/supabaseClient';

export default function AppRedirect() {
  const nav = useNavigate();
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      nav(user ? "/profile" : "/login", { replace: true });
    });
  }, [nav]);
  return null;
}
