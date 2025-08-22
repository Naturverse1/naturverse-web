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

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <CartProvider>
        <RouterProvider router={router} />
        <CartDrawer />
      </CartProvider>
    </React.StrictMode>,
);
