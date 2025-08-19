import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppHome from "./AppHome";

// Sections with folder indexes
import Zones from "./pages/zones";
import Marketplace from "./pages/marketplace";
import Arcade from "./pages/arcade";
import Naturversity from "./pages/naturversity";
import Rainforest from "./pages/rainforest";

// Single-file pages
import Worlds from "./pages/Worlds";
import WorldHub from "./pages/world-hub";
import OceanWorld from "./pages/OceanWorld";
import DesertWorld from "./pages/DesertWorld";
import Home from "./pages/Home";
import About from "./pages/about";
import Contact from "./pages/contact";
import Feedback from "./pages/feedback";
import FAQ from "./pages/faq";
import Privacy from "./pages/privacy";
import Terms from "./pages/terms";
import Settings from "./pages/settings";
import Stories from "./pages/Stories";
import StoryStudio from "./pages/story-studio";
import Quizzes from "./pages/Quizzes";
import Observations from "./pages/Observations";
import ObservationsDemo from "./pages/ObservationsDemo";
import MapHub from "./pages/MapHub";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

// Zones detail
import MusicZone from "./pages/zones/MusicZone";
import Wellness from "./pages/zones/Wellness";
import CreatorLab from "./pages/zones/CreatorLab";
import Community from "./pages/zones/Community";
import Teachers from "./pages/zones/Teachers";
import Partners from "./pages/zones/Partners";
import Parents from "./pages/zones/Parents";

// Content
import TurianTips from "./pages/TurianTips";

// Arcade games
import EcoRunner from "./pages/zones/arcade/eco-runner";
import MemoryMatch from "./pages/zones/arcade/memory-match";
import WordBuilder from "./pages/zones/arcade/word-builder";

// Web3 / Crypto
import Wallet from "./pages/web3/Wallet";
import Coins from "./pages/web3/Coins";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppHome />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/stories" element={<Stories />} />
        <Route path="/story-studio" element={<StoryStudio />} />
        <Route path="/quizzes" element={<Quizzes />} />
        <Route path="/observations" element={<Observations />} />
        <Route path="/observations-demo" element={<ObservationsDemo />} />
        <Route path="/map" element={<MapHub />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/worlds" element={<Worlds />} />
        <Route path="/world-hub" element={<WorldHub />} />
        <Route path="/oceanworld" element={<OceanWorld />} />
        <Route path="/desertworld" element={<DesertWorld />} />

        {/* Sections */}
        <Route path="/naturversity" element={<Naturversity />} />
        <Route path="/rainforest" element={<Rainforest />} />
        <Route path="/zones" element={<Zones />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/arcade" element={<Arcade />} />

        {/* Zones shortcuts */}
        <Route path="/zones/music" element={<MusicZone />} />
        <Route path="/zones/wellness" element={<Wellness />} />
        <Route path="/zones/creator-lab" element={<CreatorLab />} />
        <Route path="/zones/community" element={<Community />} />
        <Route path="/zones/teachers" element={<Teachers />} />
        <Route path="/zones/partners" element={<Partners />} />
        <Route path="/zones/parents" element={<Parents />} />

        {/* Content */}
        <Route path="/turian-tips" element={<TurianTips />} />

        {/* Arcade games */}
        <Route path="/arcade/eco-runner" element={<EcoRunner />} />
        <Route path="/arcade/memory-match" element={<MemoryMatch />} />
        <Route path="/arcade/word-builder" element={<WordBuilder />} />

        {/* Web3 */}
        <Route path="/web3/wallet" element={<Wallet />} />
        <Route path="/web3/coins" element={<Coins />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

