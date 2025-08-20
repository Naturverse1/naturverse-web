import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Root from './layouts/Root';
import Home from './pages/Home';
import Stories from './pages/Stories';
import StoryDetail from './pages/Stories/[id]';
import Quizzes from './pages/Quizzes';
import QuizDetail from './pages/Quizzes/[id]';
import Observations from './pages/Observations';
import TurianTips from './pages/TurianTips';
import Marketplace from './pages/Marketplace';
import ProductDetail from './pages/Marketplace/ProductDetail';
import CartPage from './pages/Marketplace/cart';
import Shipping from './pages/Marketplace/checkout';
import Review from './pages/Marketplace/checkout/Review';
import Pay from './pages/Marketplace/checkout/Pay';
import OrderSuccess from './pages/Marketplace/OrderSuccess';
import Worlds from './pages/Worlds';
import Zones from './pages/Zones';
import ZoneList from './pages/ZoneList';
import ZoneDoc from './pages/ZoneDoc';
import Arcade from './pages/Arcade';
import Music from './pages/Music';
import Wellness from './pages/Wellness';
import CreatorLab from './pages/CreatorLab';
import Community from './pages/Community';
import Teachers from './pages/Teachers';
import Partners from './pages/Partners';
import NaturversityHub from './pages/Naturversity';
import Web3Page from './pages/Naturversity/Web3';
import WalletsPage from './pages/Naturversity/Wallets';
import TeachersPageNv from './pages/Naturversity/Teachers';
import ParentsPageNv from './pages/Naturversity/Parents';
import DaoPage from './pages/Naturversity/DAO';
import Parents from './pages/Parents';
import Profile from './pages/Profile';
import { ContentProvider } from './context/ContentContext';

import './styles.css';

const router = createBrowserRouter([
  {
    path: '/', element: <Root/>, children: [
      { index: true, element: <Home/> },

      { path: 'stories', element: <Stories/> },
      { path: 'stories/:id', element: <StoryDetail/> },
      { path: 'quizzes', element: <Quizzes/> },
      { path: 'quizzes/:id', element: <QuizDetail/> },
      { path: 'observations', element: <Observations/> },
      { path: 'TurianTips', element: <TurianTips/> },
      { path: 'marketplace', element: <Marketplace/> },
      { path: 'marketplace/productdetail', element: <ProductDetail/> },
      { path: 'marketplace/cart', element: <CartPage/> },
      { path: 'marketplace/checkout', element: <Shipping/> },
      { path: 'marketplace/checkout/Review', element: <Review/> },
      { path: 'marketplace/checkout/Pay', element: <Pay/> },
      { path: 'marketplace/OrderSuccess', element: <OrderSuccess/> },

      { path: 'zones', element: <Zones/> },
      { path: 'zones/:zone', element: <ZoneList/> },
      { path: 'zones/:zone/:slug', element: <ZoneDoc/> },
      { path: 'worlds', element: <Worlds/> },
      { path: 'arcade', element: <Arcade/> },
      { path: 'music', element: <Music/> },
      { path: 'wellness', element: <Wellness/> },
      { path: 'creator-lab', element: <CreatorLab/> },
      { path: 'community', element: <Community/> },
      { path: 'teachers', element: <Teachers/> },
      { path: 'partners', element: <Partners/> },
      { path: 'naturversity', element: <NaturversityHub/> },
      { path: 'naturversity/web3', element: <Web3Page/> },
      { path: 'naturversity/wallets', element: <WalletsPage/> },
      { path: 'naturversity/teachers', element: <TeachersPageNv/> },
      { path: 'naturversity/parents', element: <ParentsPageNv/> },
      { path: 'naturversity/dao', element: <DaoPage/> },
      { path: 'parents', element: <Parents/> },

      { path: 'profile', element: <Profile/> },
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ContentProvider>
      <RouterProvider router={router}/>
    </ContentProvider>
  </React.StrictMode>,
);
