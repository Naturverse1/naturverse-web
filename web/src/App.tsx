import React from 'react';
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
import Settings from './pages/zones/Settings';
import WellnessZone from './pages/zones/Wellness';
import CreatorLab from './pages/zones/CreatorLab';
import Arcade from './pages/zones/arcade';
import Community from './pages/zones/Community';
import Lesson from './pages/naturversity/Lesson';
import About from './pages/About';
import StoryStudioPage from './pages/story-studio';
import AutoQuiz from './pages/auto-quiz';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import EcoRunner from './pages/zones/arcade/eco-runner';
import MemoryMatch from './pages/zones/arcade/memory-match';
import WordBuilder from './pages/zones/arcade/word-builder';
import ArcadeShop from './pages/zones/arcade/shop';
import { RequireAuth } from './context/AuthContext';
import MarketplacePage from './pages/marketplace/MarketplacePage';
import CartPage from './pages/marketplace/cart';
import OrdersPage from './pages/marketplace/orders';
import OrderDetailPage from './pages/marketplace/order';
import ItemPage from './pages/marketplace/item';
import CheckoutIndex from './pages/marketplace/checkout';
import Shipping from './pages/marketplace/checkout/Shipping';
import CheckoutReview from './pages/marketplace/checkout/Review';
import PayPage from './pages/marketplace/checkout/Pay';
import { CartProvider } from './context/CartContext';
import ProfileProvider from './context/ProfileContext';
import { WishlistProvider } from './context/WishlistContext';
import WishlistPage from './pages/marketplace/Wishlist';

export default function App() {
  return (
    <ProfileProvider>
      <CartProvider>
        <WishlistProvider>
          <Routes>
          <Route element={<AppShell />}> 
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/story-studio" element={<StoryStudioPage />} />
            <Route path="/auto-quiz" element={<AutoQuiz />} />
            <Route path="/worlds" element={<Worlds />} />
            <Route path="/worlds/:slug" element={<World />} />
            <Route
              path="/zones"
              element={
                <RequireAuth>
                  <ZonesHub />
                </RequireAuth>
              }
            />
            <Route
              path="/zones/naturversity"
              element={
                <RequireAuth>
                  <Naturversity />
                </RequireAuth>
              }
            />
            <Route
              path="/zones/music"
              element={
                <RequireAuth>
                  <MusicZone />
                </RequireAuth>
              }
            />
            <Route
              path="/zones/eco-lab"
              element={
                <RequireAuth>
                  <EcoLab />
                </RequireAuth>
              }
            />
            <Route
              path="/zones/story-studio"
              element={
                <RequireAuth>
                  <StoryStudio />
                </RequireAuth>
              }
            />
            <Route
              path="/zones/parents"
              element={
                <RequireAuth>
                  <Parents />
                </RequireAuth>
              }
            />
            <Route
              path="/zones/settings"
              element={
                <RequireAuth>
                  <Settings />
                </RequireAuth>
              }
            />
            <Route
              path="/zones/wellness"
              element={
                <RequireAuth>
                  <WellnessZone />
                </RequireAuth>
              }
            />
            <Route
              path="/zones/creator-lab"
              element={
                <RequireAuth>
                  <CreatorLab />
                </RequireAuth>
              }
            />
            <Route
              path="/zones/arcade"
              element={
                <RequireAuth>
                  <Arcade />
                </RequireAuth>
              }
            />
            <Route path="/zones/arcade/eco-runner" element={<EcoRunner />} />
            <Route path="/zones/arcade/memory-match" element={<MemoryMatch />} />
            <Route path="/zones/arcade/word-builder" element={<WordBuilder />} />
            <Route path="/zones/arcade/shop" element={<ArcadeShop />} />
            <Route
              path="/zones/community"
              element={
                <RequireAuth>
                  <Community />
                </RequireAuth>
              }
            />
            <Route path="/naturversity/lesson/:id" element={<Lesson />} />
            <Route
              path="/app"
              element={
                <RequireAuth>
                  <AppHome />
                </RequireAuth>
              }
            />
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
            <Route path="/marketplace/item" element={<ItemPage />} />
            <Route path="/marketplace/checkout" element={<CheckoutIndex />} />
            <Route path="/marketplace/checkout/shipping" element={<Shipping />} />
            <Route path="/marketplace/checkout/review" element={<CheckoutReview />} />
            <Route path="/marketplace/checkout/pay" element={<PayPage />} />
            <Route path="/marketplace/wishlist" element={<WishlistPage />} />
            <Route path="/marketplace/orders" element={<OrdersPage />} />
            <Route path="/marketplace/orders/:id" element={<OrderDetailPage />} />
            <Route path="*" element={<NotFound />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          </Routes>
          {/* global styles */}
          <link rel="stylesheet" href="/src/styles/ui.css" />
          <link rel="stylesheet" href="/src/styles/marketplace.css" />
        </WishlistProvider>
      </CartProvider>
    </ProfileProvider>
  );
}

