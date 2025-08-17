import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function AppShell({ children }: { children?: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="page">{children ?? <Outlet />}</main>
      <Footer />
    </>
  );
}

