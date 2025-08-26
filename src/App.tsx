import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { organizationLd, websiteLd } from './lib/jsonld';
import { CartProvider } from './lib/cart';
import ToasterListener from './components/Toaster';
import RouteFX from './components/RouteFX';
import './styles/magic.css';

export default function App() {
  return (
    <CartProvider>
      <>
        {/* Global route visual effects (page fade-in) */}
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
      </>
    </CartProvider>
  );
}

