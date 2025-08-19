import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from "@/lib/supabaseClient";

if (!supabase) throw new Error('Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Netlify.');

export default function AppRedirect() {
  const nav = useNavigate();
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        window.localStorage.setItem("naturverse-lastPath", window.location.pathname + window.location.search + window.location.hash);
      }
      nav(user ? "/profile" : "/login", { replace: true });
    });
  }, [nav]);
  return null;
}
