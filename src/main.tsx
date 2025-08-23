import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { CartProvider } from './hooks/useCart';
import CartDrawer from './components/cart/CartDrawer';
import './styles.css';
import './styles/shop.css';
import './styles/edu.css';
import './main.css';
import { ErrorBoundary } from './components/ErrorBoundary';
import { organizationLd, websiteLd } from './lib/jsonld';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <ErrorBoundary>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteLd) }}
        />
        <CartProvider>
          <RouterProvider router={router} />
          <CartDrawer />
        </CartProvider>
      </ErrorBoundary>
    </React.StrictMode>,
);
