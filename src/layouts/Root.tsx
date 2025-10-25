import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import HeadPreloads from '../components/HeadPreloads';
import RouteProgress from '../components/RouteProgress';
import SiteHeader from '../components/SiteHeader';
import Footer from '../components/Footer';
import { ErrorBoundary } from '../components/ErrorBoundary';
import AuthButtons from '../components/AuthButtons';
import { supabase } from '@/lib/supabase-client';
import type { User } from '@supabase/supabase-js';

export default function RootLayout() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setUser(data.session?.user ?? null);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return (
    <ErrorBoundary>
      <HelmetProvider>
        <HeadPreloads />
        <RouteProgress />
        <div className="nv-root">
          {user && <SiteHeader />}
          <main className="pageRoot">
            {user ? (
              <Outlet />
            ) : !loading ? (
              <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
                <h1>Welcome to the Naturverse</h1>
                <p>Please sign in to continue.</p>
                <AuthButtons className="justify-center" />
              </div>
            ) : null}
          </main>
          <Footer />
        </div>
      </HelmetProvider>
    </ErrorBoundary>
  );
}
