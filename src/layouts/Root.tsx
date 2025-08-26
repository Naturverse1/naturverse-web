import React from 'react';
import { Outlet } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import HeadPreloads from '../components/HeadPreloads';
import RouteProgress from '../components/RouteProgress';
import SiteHeader from '../components/SiteHeader';
import Footer from '../components/Footer';
import { ErrorBoundary } from '../components/ErrorBoundary';

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <HeadPreloads />
        <RouteProgress />
        <div className="nv-root">
          <SiteHeader />
          <main className="pageRoot">
            <Outlet />
          </main>
          <Footer />
        </div>
      </HelmetProvider>
    </ErrorBoundary>
  );
}
