import React, { useEffect, useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { organizationLd, websiteLd } from './lib/jsonld';
import { CartProvider } from './lib/cart';
import ToasterListener from './components/Toaster';
import RouteFX from './components/RouteFX';
import CommandPaletteSafe from './components/CommandPalette';
import './styles/magic.css';
// TEMP: disable interactions while we isolate the crash
// import { initInteractions } from './init/interactions';
import './init/runtime-logger'; // lightweight global error hooks

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      document.body.classList.add('loaded');
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-sky-50">
        <img src="/loading.svg" alt="loading..." className="w-24 h-24 animate-spin" />
      </div>
    );
  }

  return (
    <CartProvider>
      <>
        {/* Global route side-effects (scroll & focus) */}
        <RouteFX />
        <CommandPaletteSafe />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteLd) }}
        />
        <main id="main" className="nv-page">
          <div className="container">
            <RouterProvider router={router} />
          </div>
        </main>
        <ToasterListener />
      </>
    </CartProvider>
  );
}
