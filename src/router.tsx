import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { logEvent } from './utils/telemetry';

import Home from './pages/Home';
import WorldsExplorer from './pages/worlds';
import WorldDetail from './routes/worlds/[slug]';
import CharacterPage from './routes/worlds/characters/[name]';
import ZonesExplorer from './pages/ZonesExplorer';
import ZoneDetail from './pages/zones/[slug]';
import MarketplacePage from './pages/marketplace';
import ProductPage from './pages/marketplace/[slug]';
import CartPage from './pages/cart';
import WishlistPage from './pages/wishlist';
import QuestsList from './pages/quests';
import NewQuest from './pages/quests/new';
import QuestDetail from './pages/quests/[slug]';
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
import PassportPage from './pages/passport';
import ProgressPage from './pages/progress';
import LoginPage from './pages/Login';
import Turian from './routes/turian';
import ProfilePage from './pages/profile';
import AuthCallback from './pages/AuthCallback';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Contact from './pages/Contact';
import Accessibility from './pages/Accessibility';
import About from './pages/About';
import SearchPage from './pages/search';
import NotFound from './pages/NotFound';
import RootLayout from './layouts/Root';
import RouteError from './routes/RouteError';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <RouteError />,
    children: [
      { index: true, element: <Home /> },
      { path: 'worlds', element: <WorldsExplorer /> },
      { path: 'worlds/:slug', element: <WorldDetail /> },
      { path: 'worlds/:slug/characters/:name', element: <CharacterPage /> },
      { path: 'zones', element: <ZonesExplorer /> },
      { path: 'zones/:slug', element: <ZoneDetail /> },
      { path: 'search', element: <SearchPage /> },

      {
        path: 'marketplace',
        children: [
          { index: true, element: <MarketplacePage /> },
          { path: ':slug', element: <ProductPage /> },
        ],
      },
      { path: 'cart', element: <CartPage /> },
      { path: 'wishlist', element: <WishlistPage /> },
      { path: 'quests', element: <QuestsList /> },
      { path: 'quests/new', element: <NewQuest /> },
      { path: 'quests/:slug', element: <QuestDetail /> },
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
        { path: 'progress', element: <ProgressPage /> },
        { path: 'passport', element: <PassportPage /> },
        { path: 'auth/callback', element: <AuthCallback /> },
        { path: 'login', element: <LoginPage /> },
        { path: 'turian', element: <Turian /> },
        { path: 'profile', element: <ProfilePage /> },
        { path: '404', element: <NotFound /> },
        { path: '*', element: <NotFound /> },
    ],
  },
]);

if (typeof window !== 'undefined') {
  let prev = window.location.pathname;
  router.subscribe((state) => {
    const next = state.location.pathname;
    if (next !== prev) {
      prev = next;
      logEvent('RouteChange', { path: next });
    }
  });
}
