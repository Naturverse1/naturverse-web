import React, { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { organizationLd, websiteLd } from './lib/jsonld';
import ToasterListener from './components/Toaster';
import RouteFX from './components/RouteFX';
import { logEvent } from './utils/telemetry';
import RouteFallback from './routes/RouteFallback';
import './styles/magic.css';
// TEMP: disable interactions while we isolate the crash
// import { initInteractions } from './init/interactions';
import './init/runtime-logger'; // lightweight global error hooks
import Footer from './components/Footer';
import './styles/footer.css';
import SkipLink from './components/SkipLink';
import './styles/a11y.css';
import './styles/images.css';
import './components/skeleton.css';
import NetworkBanner from './components/NetworkBanner';
import './components/network.css';
import SearchProvider from './search/SearchProvider';
import CheckoutBanner from './components/CheckoutBanner';
import ToastHost from '@/components/ToastHost';
import CartShareLoader from '@/components/CartShareLoader';

export default function App() {
  useEffect(() => {
    logEvent('AppStarted', { timestamp: Date.now() });
    // SAFE MODE: interactions temporarily disabled
  }, []);
  return (
    <SearchProvider>
      <CartShareLoader />
      <ToastHost />
      <div id="nv-page">
          {/* Keyboard-accessible jump link (first focusable on the page) */}
          <SkipLink />
          <NetworkBanner />
          <CheckoutBanner />

          {/* Convert content wrapper into the "main" landmark and jump target */}
          <main
            id="main"
            className="nv-content"
            tabIndex={-1}
            role="main"
            aria-label="Main content"
          >
            <React.Suspense fallback={<RouteFallback />}>
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
              <div className="container">
                <RouterProvider router={router} />
              </div>
              <ToasterListener />
            </React.Suspense>
          </main>

          <Footer />
        </div>
      </SearchProvider>
  );
}
