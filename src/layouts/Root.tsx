import React from 'react';
import { Outlet } from 'react-router-dom';
import SiteHeader from '../components/SiteHeader';
import Footer from '../components/Footer';

export default function RootLayout() {
  return (
    <div className="nv-root">
      <SiteHeader />
      <main id="main">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
