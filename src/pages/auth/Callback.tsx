import { useEffect } from 'react';
import { supabase } from '@/lib/supabase-client';

/**
 * Supabase parses tokens from the URL on load.
 * We just nudge users home after session finalizes.
 */
export default function AuthCallback() {
  useEffect(() => {
    supabase.auth.getSession().finally(() => {
      // Optional: carry through ?next param if present
      const params = new URLSearchParams(window.location.search);
      const next = params.get('next') || '/';
      window.location.replace(next);
    });
  }, []);
  return null;
}
