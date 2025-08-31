import React, { useEffect, useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { organizationLd, websiteLd } from './lib/jsonld';
import ToasterListener from './components/Toaster';
import RouteFX from './components/RouteFX';
import { logEvent } from './utils/telemetry';
import RouteFallback from './routes/RouteFallback';
import SkipLink from './components/SkipLink';
import NetworkBanner from './components/NetworkBanner';
import SearchProvider from './search/SearchProvider';
import CheckoutBanner from './components/CheckoutBanner';
import ToastHost from '@/components/ToastHost';
import CartShareLoader from '@/components/CartShareLoader';
// TEMP: disable interactions while we isolate the crash
// import { initInteractions } from './init/interactions';
import './init/runtime-logger'; // lightweight global error hooks

import './styles/magic.css';
import './styles/footer.css';
import './styles/a11y.css';
import './styles/images.css';
import './components/skeleton.css';
import './components/network.css';
// ✅ keep this as the final stylesheet import
import './styles/global.css';

export default function App() {
  const [path, setPath] = useState(
    typeof window !== 'undefined' ? window.location.pathname : '/',
  );

  useEffect(() => {
    logEvent('AppStarted', { timestamp: Date.now() });
    return router.subscribe((s) => setPath(s.location.pathname));
    // SAFE MODE: interactions temporarily disabled
  }, []);

  const onAuthRoute = path.startsWith('/auth/');

  return (
    <SearchProvider>
      <CartShareLoader />
      <ToastHost />
      {/* TEMP mobile verify: shrink type on <=768px */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
@media (max-width:768px){
  html{ font-size:15px !important; }
  h1,.page-title,.section-title{
    font-size: clamp(1.75rem,5.5vw,2.25rem) !important;
    line-height:1.2 !important;
    margin: 0 0 .75rem !important;
  }
  .btn, .button, button.btn-primary{
    padding:10px 14px !important;
    font-size:1rem !important;
    line-height:1.25 !important;
  }
  .container{ padding:0 12px !important; }
}
    `,
        }}
      />
      <div id="nv-page">
          {/* Keyboard-accessible jump link (first focusable on the page) */}
          <SkipLink />
          {!onAuthRoute && <NetworkBanner />}
          {!onAuthRoute && <CheckoutBanner />}

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
        </div>
      </SearchProvider>
  );
}
