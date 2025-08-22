import React from 'react';
import { Outlet } from 'react-router-dom';
import Nav from '../components/Nav';
import Footer from '../components/Footer';

export default function RootLayout() {
  return (
    <div className="nv-root">
      <Nav />
      <main className="container">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
