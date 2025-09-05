import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';

import Home from './pages/Home';
import WorldsIndex from './routes/worlds';
import WorldDetail from './routes/worlds/[slug]';
import CharacterPage from './routes/worlds/characters/[name]';
import Zones from './routes/zones';
import ArcadeZone from './routes/zones/arcade';
import MusicZone from './routes/zones/music';
import WellnessZone from './routes/zones/wellness';
import CreatorLabPage from './pages/zones/creator-lab';
import Stories from './pages/zones/Stories';
import Quizzes from './pages/zones/Quizzes';
import Observations from './pages/zones/Observations';
import Community from './pages/zones/Community';
import Culture from './pages/zones/Culture';
import FutureZone from './pages/zones/Future';
import MarketplaceShop from './pages/marketplace';
import MarketplaceNFT from './pages/marketplace/nft';
import MarketplaceSpecials from './pages/marketplace/specials';
import MarketplaceWishlist from './pages/marketplace/wishlist';
import ProductPage from './pages/marketplace/[slug]';
import CartPage from './pages/cart';
import Naturversity from './pages/Naturversity';
import Teachers from './pages/naturversity/Teachers';
import Partners from './pages/naturversity/Partners';
import Courses from './pages/naturversity/Courses';
import CourseDetail from './pages/naturversity/CourseDetail';
import LanguagesHub from './pages/naturversity/languages';
import LanguageDetail from './pages/naturversity/languages/[slug]';
import NaturversityLayout from './layouts/Naturversity';
import NaturBankPage from './pages/naturbank';
import BankWallet from './pages/naturbank/Wallet';
import BankToken from './pages/naturbank/Token';
import BankNFTs from './pages/naturbank/NFTs';
import BankLearn from './pages/naturbank/Learn';
import NavatarPage from './pages/Navatar';
import NavatarCreate from './routes/navatar/create';
import PassportPage from './pages/passport';
import LoginPage from './pages/Login';
import Turian from './routes/turian';
import ProfilePage from './pages/profile';
import AuthCallback from './pages/auth/Callback';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Contact from './pages/Contact';
import Accessibility from './pages/Accessibility';
import About from './pages/About';
import NotFound from './pages/NotFound';
import RootLayout from './layouts/Root';
import ZonesLayout from './layouts/Zones';
import AnalyticsPage from './pages/analytics';
import ProtectedRoute from './components/ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'worlds', element: <WorldsIndex /> },
      { path: 'worlds/:slug', element: <WorldDetail /> },
      { path: 'worlds/:slug/characters/:name', element: <CharacterPage /> },
      {
        path: 'zones',
        element: <ZonesLayout />,
        children: [
          { index: true, element: <Zones /> },
          { path: 'arcade', element: <ArcadeZone /> },
          { path: 'music', element: <MusicZone /> },
          { path: 'wellness', element: <WellnessZone /> },
          { path: 'creator-lab', element: <CreatorLabPage /> },
          { path: 'stories', element: <Stories /> },
          { path: 'quizzes', element: <Quizzes /> },
          { path: 'observations', element: <Observations /> },
          { path: 'culture', element: <Culture /> },
          { path: 'community', element: <Community /> },
          { path: 'future', element: <FutureZone /> },
        ],
      },
      {
        path: 'marketplace',
        children: [
          { index: true, element: <MarketplaceShop /> },
          { path: 'nft', element: <MarketplaceNFT /> },
          { path: 'specials', element: <MarketplaceSpecials /> },
          { path: 'wishlist', element: <MarketplaceWishlist /> },
          { path: ':slug', element: <ProductPage /> },
        ],
      },
      { path: 'cart', element: <CartPage /> },
      { path: 'wishlist', element: <Navigate to="/marketplace/wishlist" replace /> },
      {
        path: 'naturversity',
        element: <NaturversityLayout />,
        children: [
          { index: true, element: <Naturversity /> },
          { path: 'teachers', element: <Teachers /> },
          { path: 'partners', element: <Partners /> },
          { path: 'courses', element: <Courses /> },
          { path: 'course/:slug', element: <CourseDetail /> },
          { path: 'languages', element: <LanguagesHub /> },
          { path: 'languages/:slug', element: <LanguageDetail /> },
        ],
      },
      { path: 'naturbank', element: <NaturBankPage /> },
      { path: 'naturbank/wallet', element: <BankWallet /> },
      { path: 'naturbank/natur', element: <BankToken /> },
      { path: 'naturbank/nfts', element: <BankNFTs /> },
      { path: 'naturbank/learn', element: <BankLearn /> },
      { path: 'terms', element: <Terms /> },
      { path: 'privacy', element: <Privacy /> },
      { path: 'contact', element: <Contact /> },
      { path: 'accessibility', element: <Accessibility /> },
      { path: 'about', element: <About /> },
        { path: 'navatar', element: <NavatarPage /> },
        { path: 'navatar/create', element: <NavatarCreate /> },
        { path: 'passport', element: <PassportPage /> },
        { path: 'auth/callback', element: <AuthCallback /> },
        { path: 'login', element: <LoginPage /> },
        { path: 'turian', element: <Turian /> },
        { path: 'profile', element: <ProfilePage /> },
        { path: 'analytics', element: <ProtectedRoute component={AnalyticsPage} /> },
        { path: '404', element: <NotFound /> },
        { path: '*', element: <NotFound /> },
    ],
  },
]);
