import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { CartProvider } from './hooks/useCart';
import CartDrawer from './components/cart/CartDrawer';
import ErrorBoundary from './components/ErrorBoundary';
import { organizationLd, websiteLd } from './lib/jsonld';

export default function App() {
  useEffect(() => {
    // ensure any plain <img> without loading attr is lazy
    const imgs = document.querySelectorAll('img:not([loading])');
    imgs.forEach((img) => img.setAttribute('loading', 'lazy'));
  }, []);

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
      <ErrorBoundary>
        <CartProvider>
          <RouterProvider router={router} />
          <CartDrawer />
        </CartProvider>
      </ErrorBoundary>
    </>
  );
}
