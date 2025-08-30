import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        // Allow Supabase to finish processing the fragment token:
        const { error } = await supabase.auth.getSession();
        if (error) throw error;
        // Clean the URL (remove the long #access_token=…)
        history.replaceState(null, '', '/auth/callback');
        // go home (or to intended route)
        navigate('/', { replace: true });
      } catch {
        navigate('/', { replace: true });
      }
    })();
  }, [navigate]);

  return null;
}

