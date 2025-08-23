import React from 'react';
import { Outlet } from 'react-router-dom';
import SiteHeader from '../components/SiteHeader';
import Footer from '../components/Footer';

export default function RootLayout() {
  return (
    <div className="nv-root">
      <a href="#main-content" className="visually-hidden-focusable">Skip to content</a>
      <SiteHeader />
      <main id="main-content" className="container">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
