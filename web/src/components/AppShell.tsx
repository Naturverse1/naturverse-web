import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import MiniCartDrawer from './MiniCartDrawer';

export default function AppShell({ children }: { children?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener('minicart:open', handler);
    return () => window.removeEventListener('minicart:open', handler);
  }, []);
  return (
    <>
      <Navbar />
      <main className="page">{children ?? <Outlet />}</main>
      <Footer />
      <MiniCartDrawer open={open} onClose={() => setOpen(false)} />
    </>
  );
}

