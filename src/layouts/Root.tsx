import React from 'react';
import { Outlet } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import HeadPreloads from '../components/HeadPreloads';
import RouteProgress from '../components/RouteProgress';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { ErrorBoundary } from '../components/ErrorBoundary';

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <HeadPreloads />
        <RouteProgress />
          <div className="nv-app">
            <Header />
            <div className="nv-content pageRoot">
              <Outlet />
            </div>
            <Footer />
          </div>
      </HelmetProvider>
    </ErrorBoundary>
  );
}
