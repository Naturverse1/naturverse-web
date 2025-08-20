import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Root from './layouts/Root';
import Home from './pages/Home';
import Stories from './pages/Stories';
import Quizzes from './pages/Quizzes';
import Observations from './pages/Observations';
import Tips from './pages/tips';
import Marketplace from './pages/Marketplace';
import ProductDetail from './pages/Marketplace/ProductDetail';
import CartPage from './pages/Marketplace/cart';
import Shipping from './pages/Marketplace/checkout';
import Review from './pages/Marketplace/checkout/Review';
import Pay from './pages/Marketplace/checkout/Pay';
import OrderSuccess from './pages/Marketplace/OrderSuccess';
import Worlds from './pages/Worlds';
import Zones from './pages/Zones';
import Arcade from './pages/Arcade';
import Music from './pages/Music';
import Wellness from './pages/Wellness';
import CreatorLab from './pages/CreatorLab';
import Community from './pages/Community';
import Teachers from './pages/Teachers';
import Partners from './pages/Partners';
import Naturversity from './pages/Naturversity';
import Parents from './pages/Parents';
import Profile from './pages/Profile';

import './styles.css';

const router = createBrowserRouter([
  {
    path: '/', element: <Root/>, children: [
      { index: true, element: <Home/> },

      { path: 'stories', element: <Stories/> },
      { path: 'quizzes', element: <Quizzes/> },
      { path: 'observations', element: <Observations/> },
      { path: 'tips', element: <Tips/> },
      { path: 'marketplace', element: <Marketplace/> },
      { path: 'marketplace/productdetail', element: <ProductDetail/> },
      { path: 'marketplace/cart', element: <CartPage/> },
      { path: 'marketplace/checkout', element: <Shipping/> },
      { path: 'marketplace/checkout/Review', element: <Review/> },
      { path: 'marketplace/checkout/Pay', element: <Pay/> },
      { path: 'marketplace/OrderSuccess', element: <OrderSuccess/> },

      { path: 'zones', element: <Zones/> },
      { path: 'worlds', element: <Worlds/> },
      { path: 'arcade', element: <Arcade/> },
      { path: 'music', element: <Music/> },
      { path: 'wellness', element: <Wellness/> },
      { path: 'creator-lab', element: <CreatorLab/> },
      { path: 'community', element: <Community/> },
      { path: 'teachers', element: <Teachers/> },
      { path: 'partners', element: <Partners/> },
      { path: 'naturversity', element: <Naturversity/> },
      { path: 'parents', element: <Parents/> },

      { path: 'profile', element: <Profile/> },
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode><RouterProvider router={router}/></React.StrictMode>,
);
