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
          <main id="main">
            <RouterProvider router={router} />
          </main>
        </ErrorBoundary>
        <CartDrawer />
      </CartProvider>
    </>
  );
}
