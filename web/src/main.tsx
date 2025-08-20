import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Root from './layouts/Root';
import Home from './pages/Home';
import SectionList from './pages/SectionList';
import SectionDetail from './pages/SectionDetail';
import TurianTips from './pages/tips';
/** Marketplace pages */
import MarketplaceHome from './pages/Marketplace';
import ProductDetail from './pages/Marketplace/ProductDetail';
import Cart from './pages/Marketplace/cart';
import Orders from './pages/Marketplace/orders';
import OrderDetail from './pages/Marketplace/OrderDetail';
import CheckoutLayout from './pages/Marketplace/checkout';
import Shipping from './pages/Marketplace/checkout/Shipping';
import Pay from './pages/Marketplace/checkout/Pay';
import Review from './pages/Marketplace/checkout/Review';
import Success from './pages/Marketplace/Success';
import Worlds from './pages/Worlds';
import Zones from './pages/Zones';
import ZoneDetail from './pages/ZoneDetail';
import Arcade from './pages/Arcade';
import Tapper from './pages/games/Tapper';
import Memory from './pages/games/Memory';
import Snake from './pages/games/Snake';

import './styles.css';

const router = createBrowserRouter([
  {
    path: '/', element: <Root/>, children: [
      { index: true, element: <Home/> },

      { path: 'stories', element: <SectionList/> },
      { path: 'stories/:slug', element: <SectionDetail/> },

      { path: 'quizzes', element: <SectionList/> },
      { path: 'quizzes/:slug', element: <SectionDetail/> },

      { path: 'observations', element: <SectionList/> },
      { path: 'observations/:slug', element: <SectionDetail/> },

      { path: 'tips', element: <TurianTips/> },
      { path: 'tips/:slug', element: <SectionDetail/> },

      {
        path: 'marketplace',
        children: [
          { index: true, element: <MarketplaceHome /> },
          { path: 'product/:id', element: <ProductDetail /> },
          { path: 'cart', element: <Cart /> },
          { path: 'orders', element: <Orders /> },
          { path: 'order/:id', element: <OrderDetail /> },
          { path: 'success', element: <Success /> },
          {
            path: 'checkout',
            element: <CheckoutLayout />,
            children: [
              { index: true, element: <Shipping /> },
              { path: 'shipping', element: <Shipping /> },
              { path: 'pay', element: <Pay /> },
              { path: 'review', element: <Review /> }
            ]
          }
        ]
      },

      { path: 'zones', element: <Zones/> },
      { path: 'zones/:slug', element: <ZoneDetail/> },

      { path: 'worlds', element: <Worlds/> },

      { path: 'arcade', element: <Arcade/> },
      { path: 'arcade/tapper', element: <Tapper/> },
      { path: 'arcade/memory', element: <Memory/> },
      { path: 'arcade/snake', element: <Snake/> },

      { path: 'profile', element: <SectionDetail/> }, // placeholder – can swap later
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode><RouterProvider router={router}/></React.StrictMode>
);
