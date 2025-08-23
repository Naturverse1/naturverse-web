import React from 'react';
import { createBrowserRouter } from 'react-router-dom';

import Home from './pages/Home';
import WorldsIndex from './pages/worlds';
import Thailandia from './pages/worlds/thailandia';
import Brazilandia from './pages/worlds/brazilandia';
import Indillandia from './pages/worlds/indillandia';
import Amerilandia from './pages/worlds/amerilandia';
import Australandia from './pages/worlds/australandia';
import Chilandia from './pages/worlds/chilandia';
import Japonica from './pages/worlds/Japonica';
import Africana from './pages/worlds/Africana';
import Europalia from './pages/worlds/Europalia';
import Britannula from './pages/worlds/Britannula';
import Kiwilandia from './pages/worlds/Kiwilandia';
import Madagascaria from './pages/worlds/Madagascaria';
import Greenlandia from './pages/worlds/Greenlandia';
import Antarctiland from './pages/worlds/Antarctiland';
import World from './routes/worlds/World';
import Zones from './routes/zones';
import ArcadeZone from './routes/zones/arcade';
import MusicZone from './routes/zones/music';
import WellnessZone from './routes/zones/wellness';
import CreatorLabZone from './routes/zones/creator-lab';
import Stories from './pages/zones/Stories';
import Quizzes from './pages/zones/Quizzes';
import Observations from './pages/zones/Observations';
import Community from './pages/zones/Community';
import Culture from './pages/zones/Culture';
import FutureZone from './pages/zones/Future';
import Marketplace from './pages/Marketplace';
import Catalog from './pages/marketplace/Catalog';
import Wishlist from './pages/marketplace/Wishlist';
import Checkout from './pages/marketplace/Checkout';
import Naturversity from './pages/Naturversity';
import Teachers from './pages/naturversity/Teachers';
import Partners from './pages/naturversity/Partners';
import Courses from './pages/naturversity/Courses';
import CourseDetail from './pages/naturversity/CourseDetail';
import Naturbank from './pages/Naturbank';
import BankWallet from './pages/naturbank/Wallet';
import BankToken from './pages/naturbank/Token';
import BankNFTs from './pages/naturbank/NFTs';
import BankLearn from './pages/naturbank/Learn';
import NavatarPage from './pages/Navatar';
import Passport from './pages/Passport';
import LoginPage from './pages/Login';
import Turian from './routes/turian';
import ProfilePage from './pages/Profile';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Contact from './pages/Contact';
import Accessibility from './pages/Accessibility';
import About from './pages/About';
import NotFound from './pages/NotFound';
import RootLayout from './layouts/Root';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'worlds', element: <WorldsIndex /> },
      { path: 'worlds/thailandia', element: <Thailandia /> },
      { path: 'worlds/brazilandia', element: <Brazilandia /> },
      { path: 'worlds/indillandia', element: <Indillandia /> },
      { path: 'worlds/amerilandia', element: <Amerilandia /> },
      { path: 'worlds/australandia', element: <Australandia /> },
      { path: 'worlds/chilandia', element: <Chilandia /> },
      { path: 'worlds/japonica', element: <Japonica /> },
      { path: 'worlds/africana', element: <Africana /> },
      { path: 'worlds/europalia', element: <Europalia /> },
      { path: 'worlds/britannula', element: <Britannula /> },
      { path: 'worlds/kiwilandia', element: <Kiwilandia /> },
      { path: 'worlds/madagascaria', element: <Madagascaria /> },
      { path: 'worlds/greenlandia', element: <Greenlandia /> },
      { path: 'worlds/antarctiland', element: <Antarctiland /> },
      { path: 'worlds/:slug', element: <World /> },
      { path: 'zones', element: <Zones /> },
      { path: 'zones/arcade', element: <ArcadeZone /> },
      { path: 'zones/music', element: <MusicZone /> },
      { path: 'zones/wellness', element: <WellnessZone /> },
      { path: 'zones/creator-lab', element: <CreatorLabZone /> },
      { path: 'zones/stories', element: <Stories /> },
      { path: 'zones/quizzes', element: <Quizzes /> },
      { path: 'zones/observations', element: <Observations /> },
      { path: 'zones/culture', element: <Culture /> },
      { path: 'zones/community', element: <Community /> },
      { path: 'zones/future', element: <FutureZone /> },
      { path: 'marketplace', element: <Marketplace /> },
      { path: 'marketplace/catalog', element: <Catalog /> },
      { path: 'marketplace/wishlist', element: <Wishlist /> },
      { path: 'marketplace/checkout', element: <Checkout /> },
      { path: 'naturversity', element: <Naturversity /> },
      { path: 'naturversity/teachers', element: <Teachers /> },
      { path: 'naturversity/partners', element: <Partners /> },
      { path: 'naturversity/courses', element: <Courses /> },
      { path: 'naturversity/course/:slug', element: <CourseDetail /> },
      { path: 'naturbank', element: <Naturbank /> },
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
      { path: 'passport', element: <Passport /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'turian', element: <Turian /> },
      { path: 'profile', element: <ProfilePage /> },
      { path: '404', element: <NotFound /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]);
