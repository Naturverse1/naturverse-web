import React from 'react';
import { Outlet } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import HeadPreloads from '../components/HeadPreloads';
import RouteProgress from '../components/RouteProgress';
import Warmup from '../boot/Warmup';
import SiteHeader from '../components/SiteHeader';
import Footer from '../components/Footer';

export default function RootLayout() {
  return (
    <HelmetProvider>
      <HeadPreloads />
      <RouteProgress />
      <Warmup />
      <div className="nv-root">
        <SiteHeader />
        <main className="pageRoot">
          <Outlet />
        </main>
        <Footer />
      </div>
    </HelmetProvider>
  );
}
