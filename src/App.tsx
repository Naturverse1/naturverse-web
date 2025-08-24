import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { CartProvider } from './hooks/useCart';
import CartDrawer from './components/cart/CartDrawer';
import { organizationLd, websiteLd } from './lib/jsonld';
import ErrorBoundary from './components/ErrorBoundary';

export default function App() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteLd) }}
      />
      <CartProvider>
        <ErrorBoundary>
          <a
            href="#main"
            className="skip-link"
            style={{ position: "absolute", left: -9999, top: "auto", width: 1, height: 1, overflow: "hidden" }}
            onFocus={(e) => {
              Object.assign(e.currentTarget.style, { left: "8px", top: "8px", width: "auto", height: "auto" });
            }}
            onBlur={(e) => {
              Object.assign(e.currentTarget.style, { left: "-9999px", top: "auto", width: 1, height: 1 });
            }}
          >
            Skip to content
          </a>
          <main id="main" className="container-nv">
            <RouterProvider router={router} />
          </main>
        </ErrorBoundary>
        <CartDrawer />
      </CartProvider>
    </>
  );
}
