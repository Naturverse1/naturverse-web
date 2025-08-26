import React from 'react';
import { Outlet } from 'react-router-dom';
import SiteHeader from '../components/SiteHeader';
import Footer from '../components/Footer';
import RouteProgress from '../components/RouteProgress';

export default function RootLayout() {
  return (
    <div className="nv-root">
      <SiteHeader />
      <RouteProgress />
      <main className="pageRoot">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
