import React, { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { organizationLd, websiteLd } from './lib/jsonld';
import { CartProvider } from './lib/cart';
import ToasterListener from './components/Toaster';
import RouteFX from './components/RouteFX';
import TurianAssistant from './components/TurianAssistant';
import { useAuth } from './lib/auth-context';
import './styles/magic.css';
// TEMP: disable interactions while we isolate the crash
// import { initInteractions } from './init/interactions';
import './init/runtime-logger'; // lightweight global error hooks

export default function App() {
  const { ready, user } = useAuth();
  const isAuthed = ready && !!user;
  useEffect(() => {
    // SAFE MODE: interactions temporarily disabled
  }, []);
  return (
    <CartProvider>
      <>
        {/* Global route side-effects (scroll & focus) */}
        <RouteFX />
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
        <TurianAssistant isAuthed={isAuthed} />
      </>
    </CartProvider>
  );
}
