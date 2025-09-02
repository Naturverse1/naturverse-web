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
import ProductPage from './pages/marketplace/[sku]';
import CartLoad from './pages/cart-load';
import QuestsList from './pages/quests';
import NewQuest from './pages/quests/new';
import QuestDetail from './pages/quests/[id]';
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
import NavatarHub from './pages/navatar';
import NavatarPick from './pages/navatar/pick';
import PassportPage from './pages/passport';
import ProgressPage from './pages/progress';
import LoginPage from './pages/Login';
import Turian from './routes/turian';
import ProfilePage from './pages/profile';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Contact from './pages/Contact';
import Accessibility from './pages/Accessibility';
import About from './pages/About';
import SearchPage from './pages/search';
import AdminLogs from './pages/admin/logs';
import NotFound from './pages/NotFound';
import RootLayout from './layouts/Root';
import RouteError from './routes/RouteError';
import AuthCallback from '@/pages/AuthCallback';
import MiniQuests from './pages/MiniQuests';
import PlayQuest from './pages/play/[slug]';
import SuccessPage from './pages/success';
import CancelPage from './pages/cancel';
import OrdersPage from './pages/orders';
import CheckoutPage from './pages/checkout';

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
      { path: 'play', element: <MiniQuests /> },
      { path: 'play/:quest', element: <PlayQuest /> },

      { path: 'marketplace', element: <MarketplacePage /> },
      { path: 'marketplace/:sku', element: <ProductPage /> },
      { path: 'checkout', element: <CheckoutPage /> },
      { path: 'success', element: <SuccessPage /> },
      { path: 'cancel', element: <CancelPage /> },
      { path: 'c/:code', element: <CartLoad /> },
      { path: 'quests', element: <QuestsList /> },
      { path: 'quests/new', element: <NewQuest /> },
      { path: 'quests/:id', element: <QuestDetail /> },
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
      { path: 'navatar', element: <NavatarHub /> },
      { path: 'navatar/pick', element: <NavatarPick /> },
      { path: 'progress', element: <ProgressPage /> },
      { path: 'passport', element: <PassportPage /> },
      { path: 'orders', element: <OrdersPage /> },
      { path: 'auth/callback', element: <AuthCallback /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'turian', element: <Turian /> },
      { path: 'profile', element: <ProfilePage /> },
      { path: 'admin/logs', element: <AdminLogs /> },
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
