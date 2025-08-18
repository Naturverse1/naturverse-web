import React, { Suspense, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import AppShell from './components/AppShell';
import Home from './pages/Home';
import Login from './pages/Login';
import AuthCallback from './pages/AuthCallback';
import Worlds from './pages/Worlds';
import World from './pages/World';
import AppHome from './pages/AppHome';
import ZonesHub from './pages/zones';
import Naturversity from './pages/zones/Naturversity';
import MusicZone from './pages/zones/MusicZone';
import EcoLab from './pages/zones/EcoLab';
import StoryStudio from './pages/zones/StoryStudio';
import Parents from './pages/zones/Parents';
import ZoneSettings from './pages/zones/Settings';
import Settings from './pages/settings';
import WellnessZone from './pages/zones/Wellness';
import CreatorLab from './pages/zones/CreatorLab';
import Arcade from './pages/zones/arcade';
import Community from './pages/zones/Community';
import Lesson from './pages/naturversity/Lesson';
import About from './pages/about';
import FAQ from './pages/faq';
import Privacy from './pages/privacy';
import Terms from './pages/terms';
import Contact from './pages/contact';
import StoryStudioPage from './pages/story-studio';
import AutoQuiz from './pages/auto-quiz';
import Profile from './pages/Profile';
import EcoRunner from './pages/zones/arcade/eco-runner';
import MemoryMatch from './pages/zones/arcade/memory-match';
import WordBuilder from './pages/zones/arcade/word-builder';
import ArcadeShop from './pages/zones/arcade/shop';
import { RequireAuth } from './context/AuthContext';
import MarketplacePage from './pages/marketplace';
import CartPage from './pages/marketplace/cart';
import OrdersPage from './pages/marketplace/orders';
import OrderDetailPage from './pages/marketplace/order';
import ProductDetail from './pages/marketplace/ProductDetail';
import Checkout from './pages/marketplace/Checkout';
import Success from './pages/marketplace/Success';
import Orders from './pages/account/Orders';
import Addresses from './pages/account/Addresses';
import AccountOrderDetail from './pages/account/OrderDetail';
import Wishlist from './pages/account/Wishlist';
import { CartProvider } from './context/CartContext';
import ProfileProvider from './context/ProfileContext';
import ToastHost from './components/ui/ToastHost';
import { ErrorBoundary } from './components/ErrorBoundary';
import NotFound from './pages/errors/NotFound';
import ServerError from './pages/errors/ServerError';
import { applyThemeFromStorage, applyReducedMotionFromStorage } from './lib/prefs';

export default function App() {
  useEffect(() => {
    applyThemeFromStorage();
    applyReducedMotionFromStorage();
  }, []);
  return (
    <ProfileProvider>
      <CartProvider>
        <Suspense fallback={<div className="container" style={{ padding: '24px' }}>Loading...</div>}>
          <ToastHost />
          <ErrorBoundary>
            <Routes>
            <Route element={<AppShell />}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/story-studio" element={<StoryStudioPage />} />
              <Route path="/auto-quiz" element={<AutoQuiz />} />
              <Route path="/worlds" element={<Worlds />} />
              <Route path="/worlds/:slug" element={<World />} />
              <Route path="/zones" element={<ZonesHub />} />
              <Route path="/zones/naturversity" element={<Naturversity />} />
              <Route path="/zones/music" element={<MusicZone />} />
              <Route path="/zones/eco-lab" element={<EcoLab />} />
              <Route path="/zones/story-studio" element={<StoryStudio />} />
              <Route path="/zones/parents" element={<Parents />} />
              <Route path="/zones/settings" element={<ZoneSettings />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/zones/wellness" element={<WellnessZone />} />
              <Route path="/zones/creator-lab" element={<CreatorLab />} />
              <Route path="/zones/arcade" element={<Arcade />} />
              <Route path="/zones/arcade/eco-runner" element={<EcoRunner />} />
              <Route path="/zones/arcade/memory-match" element={<MemoryMatch />} />
              <Route path="/zones/arcade/word-builder" element={<WordBuilder />} />
              <Route path="/zones/arcade/shop" element={<ArcadeShop />} />
              <Route path="/zones/community" element={<Community />} />
              <Route path="/naturversity/lesson/:id" element={<Lesson />} />
              <Route path="/app" element={<AppHome />} />
              <Route
                path="/profile"
                element={
                  <RequireAuth>
                    <Profile />
                  </RequireAuth>
                }
              />
              <Route path="/marketplace" element={<MarketplacePage />} />
              <Route path="/marketplace/cart" element={<CartPage />} />
              <Route path="/marketplace/item" element={<ProductDetail />} />
              <Route path="/marketplace/checkout" element={<Checkout />} />
              <Route path="/marketplace/success" element={<Success />} />
              <Route path="/marketplace/orders" element={<OrdersPage />} />
              <Route path="/marketplace/orders/:id" element={<OrderDetailPage />} />
              <Route
                path="/account/orders"
                element={
                  <RequireAuth>
                    <Orders />
                  </RequireAuth>
                }
              />
              <Route
                path="/account/orders/:id"
                element={
                  <RequireAuth>
                    <AccountOrderDetail />
                  </RequireAuth>
                }
              />
              <Route
                path="/account/addresses"
                element={
                  <RequireAuth>
                    <Addresses />
                  </RequireAuth>
                }
              />
              <Route
                path="/account/wishlist"
                element={
                  <RequireAuth>
                    <Wishlist />
                  </RequireAuth>
                }
              />
            </Route>
            <Route path="/login" element={<Login />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/error" element={<ServerError />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          </ErrorBoundary>
        </Suspense>
        {/* global styles */}
        <link rel="stylesheet" href="/src/styles/ui.css" />
        <link rel="stylesheet" href="/src/styles/marketplace.css" />
      </CartProvider>
    </ProfileProvider>
  );
}

