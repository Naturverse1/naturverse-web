import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/layout/Header";

import Home from "./routes";
import WorldsHub from "./routes/worlds";
import WorldDetail from "./routes/worlds/[slug]";
import NaturbankHub from "./routes/naturbank";
import Wallets from "./routes/naturbank/wallets";
import NaturToken from "./routes/naturbank/natur-token";
import LearnCrypto from "./routes/naturbank/learn";
import NFTsPage from "./routes/naturbank/nfts";
import NaturversityHub from "./routes/naturversity";
import Teachers from "./routes/naturversity/teachers";
import Partners from "./routes/naturversity/partners";
import Courses from "./routes/naturversity/courses";
import ZonesHub from "./routes/zones";
import ArcadeHub from "./routes/zones/arcade";
import GameDetail from "./routes/zones/arcade/game/[id]";
import MusicZone from "./routes/zones/music";
import WellnessZone from "./routes/zones/wellness";
import CreatorLab from "./routes/zones/creator-lab";
import StoriesZone from "./routes/zones/stories";
import QuizzesZone from "./routes/zones/quizzes";
import MarketplaceHub from "./routes/marketplace";
import Catalog from "./routes/marketplace/catalog";
import Wishlist from "./routes/marketplace/wishlist";
import Checkout from "./routes/marketplace/checkout";
import NavatarPage from "./routes/navatar";
import PassportPage from "./routes/passport";
import TurianGuide from "./routes/turian";
// If you already have a profile page, keep your existing import:
import Profile from "./routes/profile/Profile"; // or "./routes/profile" if that’s your file

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/worlds" element={<WorldsHub />} />
        <Route path="/worlds/:slug" element={<WorldDetail />} />

        <Route path="/naturbank" element={<NaturbankHub />} />
        <Route path="/naturbank/wallets" element={<Wallets />} />
        <Route path="/naturbank/natur-token" element={<NaturToken />} />
        <Route path="/naturbank/learn" element={<LearnCrypto />} />
        <Route path="/naturbank/nfts" element={<NFTsPage />} />

        <Route path="/naturversity" element={<NaturversityHub />} />
        <Route path="/naturversity/teachers" element={<Teachers />} />
        <Route path="/naturversity/partners" element={<Partners />} />
        <Route path="/naturversity/courses" element={<Courses />} />

        <Route path="/zones" element={<ZonesHub />} />
        <Route path="/zones/arcade" element={<ArcadeHub />} />
        <Route path="/zones/arcade/game/:id" element={<GameDetail />} />
        <Route path="/zones/music" element={<MusicZone />} />
        <Route path="/zones/wellness" element={<WellnessZone />} />
        <Route path="/zones/creator-lab" element={<CreatorLab />} />
        <Route path="/zones/stories" element={<StoriesZone />} />
        <Route path="/zones/quizzes" element={<QuizzesZone />} />

        <Route path="/marketplace" element={<MarketplaceHub />} />
        <Route path="/marketplace/catalog" element={<Catalog />} />
        <Route path="/marketplace/wishlist" element={<Wishlist />} />
        <Route path="/marketplace/checkout" element={<Checkout />} />

        <Route path="/navatar" element={<NavatarPage />} />
        <Route path="/passport" element={<PassportPage />} />
        <Route path="/turian" element={<TurianGuide />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}
