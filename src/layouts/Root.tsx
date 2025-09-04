import React from 'react';
import { Outlet } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import HeadPreloads from '../components/HeadPreloads';
import RouteProgress from '../components/RouteProgress';
import SiteHeader from '../components/SiteHeader';
import Footer from '../components/Footer';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { useAuth } from '@/lib/auth-context';

export default function RootLayout() {
  const { user } = useAuth();
  const signedOut = !user;

  return (
    <ErrorBoundary>
      <HelmetProvider>
        <HeadPreloads />
        <RouteProgress />
        <div className="nv-root">
          {!signedOut && <SiteHeader />}
          {signedOut && (
            <div className="auth-gate-callout">
              <h2>Welcome to the Naturverse</h2>
              <p>Please sign in to continue.</p>
              <div className="auth-actions">
                {/* keep your existing Create/Google buttons here */}
              </div>
            </div>
          )}
          <main
            className={`pageRoot${signedOut ? ' inert-when-signed-out' : ''}`}
            aria-hidden={false}
          >
            <Outlet />
          </main>
          <Footer />
        </div>
      </HelmetProvider>
    </ErrorBoundary>
  );
}
