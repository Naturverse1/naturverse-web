import React from 'react';
import { createBrowserRouter } from 'react-router-dom';

import Home from './pages/Home';
import WorldsIndex from './routes/worlds';
import WorldDetail from './routes/worlds/[slug]';
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
import Marketplace from './pages/marketplace';
import ProductPage from './pages/marketplace/[slug]';
import CatalogPage from './pages/marketplace/CatalogPage';
import WishlistPage from './pages/marketplace/WishlistPage';
import CheckoutPage from './pages/marketplace/CheckoutPage';
import CartPage from './pages/cart';
import Naturversity from './pages/Naturversity';
import Teachers from './pages/naturversity/Teachers';
import Partners from './pages/naturversity/Partners';
import Courses from './pages/naturversity/Courses';
import CourseDetail from './pages/naturversity/CourseDetail';
import LanguagesHub from './pages/naturversity/languages';
import LanguageDetail from './pages/naturversity/languages/[slug]';
import NaturBankPage from './pages/naturbank';
import BankWallet from './pages/naturbank/Wallet';
import BankToken from './pages/naturbank/Token';
import BankNFTs from './pages/naturbank/NFTs';
import BankLearn from './pages/naturbank/Learn';
import NavatarPage from './pages/Navatar';
import PassportPage from './pages/passport';
import LoginPage from './pages/Login';
import Turian from './routes/turian';
import ProfilePage from './pages/profile';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Contact from './pages/Contact';
import Accessibility from './pages/Accessibility';
import About from './pages/About';
import NotFound from './routes/NotFound';
import RootLayout from './layouts/Root';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'worlds', element: <WorldsIndex /> },
      { path: 'worlds/:slug', element: <WorldDetail /> },
      { path: 'zones', element: <Zones /> },
      { path: 'zones/arcade', element: <ArcadeZone /> },
      { path: 'zones/music', element: <MusicZone /> },
      { path: 'zones/wellness', element: <WellnessZone /> },
      { path: 'zones/creator-lab', element: <CreatorLabPage /> },
      { path: 'zones/stories', element: <Stories /> },
      { path: 'zones/quizzes', element: <Quizzes /> },
      { path: 'zones/observations', element: <Observations /> },
      { path: 'zones/culture', element: <Culture /> },
      { path: 'zones/community', element: <Community /> },
      { path: 'zones/future', element: <FutureZone /> },
      { path: 'marketplace', element: <Marketplace /> },
      { path: 'marketplace/:slug', element: <ProductPage /> },
      { path: 'marketplace/catalog', element: <CatalogPage /> },
      { path: 'marketplace/wishlist', element: <WishlistPage /> },
      { path: 'marketplace/checkout', element: <CheckoutPage /> },
      { path: 'cart', element: <CartPage /> },
      { path: 'naturversity', element: <Naturversity /> },
      { path: 'naturversity/teachers', element: <Teachers /> },
      { path: 'naturversity/partners', element: <Partners /> },
      { path: 'naturversity/courses', element: <Courses /> },
      { path: 'naturversity/course/:slug', element: <CourseDetail /> },
      { path: 'naturversity/languages', element: <LanguagesHub /> },
      { path: 'naturversity/languages/:slug', element: <LanguageDetail /> },
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
        { path: 'passport', element: <PassportPage /> },
        { path: 'login', element: <LoginPage /> },
        { path: 'turian', element: <Turian /> },
        { path: 'profile', element: <ProfilePage /> },
        { path: '404', element: <NotFound /> },
        { path: '*', element: <NotFound /> },
    ],
  },
]);
