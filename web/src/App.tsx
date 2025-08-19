import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppHome from "./AppHome";

// Sections with folder indexes (stubs added where needed)
import Zones from "./pages/zones";
import Marketplace from "./pages/marketplace";
import Arcade from "./pages/arcade";
import Naturversity from "./pages/naturversity";
import Rainforest from "./pages/rainforest";

// Single-file pages that already exist
import Worlds from "./pages/Worlds";
import WorldHub from "./pages/world-hub";
import OceanWorld from "./pages/OceanWorld";
import DesertWorld from "./pages/DesertWorld";
import Home from "./pages/Home";
import About from "./pages/about";
import Contact from "./pages/contact";
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

// NEW pages
import TurianTips from "./pages/TurianTips";
import Feedback from "./pages/feedback";
import Account from "./pages/account";
import AccountOrders from "./pages/account/Orders";
import AccountAddresses from "./pages/account/Addresses";
import AccountWishlist from "./pages/account/Wishlist";

// Zones sub-pages (NEW)
import ZoneCommunity from "./pages/zones/Community";
import ZoneCreatorLab from "./pages/zones/CreatorLab";
import ZoneEcoLab from "./pages/zones/EcoLab";
import ZoneMusic from "./pages/zones/MusicZone";
import ZoneNaturversity from "./pages/zones/Naturversity";
import ZoneParents from "./pages/zones/Parents";
import ZoneTeachers from "./pages/zones/Teachers";
import ZonePartners from "./pages/zones/Partners";
import ZoneSettings from "./pages/zones/Settings";
import ZoneStoryStudio from "./pages/zones/StoryStudio";
import ZoneWellness from "./pages/zones/Wellness";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppHome />} />

        {/* Core */}
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
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

        {/* Worlds */}
        <Route path="/worlds" element={<Worlds />} />
        <Route path="/world-hub" element={<WorldHub />} />
        <Route path="/oceanworld" element={<OceanWorld />} />
        <Route path="/desertworld" element={<DesertWorld />} />

        {/* NEW: Tips & Feedback */}
        <Route path="/tips" element={<TurianTips />} />
        <Route path="/feedback" element={<Feedback />} />

        {/* Marketplace */}
        <Route path="/marketplace" element={<Marketplace />} />

        {/* Account */}
        <Route path="/account" element={<Account />} />
        <Route path="/account/orders" element={<AccountOrders />} />
        <Route path="/account/addresses" element={<AccountAddresses />} />
        <Route path="/account/wishlist" element={<AccountWishlist />} />

        {/* Zones index + deep links */}
        <Route path="/zones" element={<Zones />} />
        <Route path="/zones/community" element={<ZoneCommunity />} />
        <Route path="/zones/creator-lab" element={<ZoneCreatorLab />} />
        <Route path="/zones/ecolab" element={<ZoneEcoLab />} />
        <Route path="/zones/music" element={<ZoneMusic />} />
        <Route path="/zones/naturversity" element={<ZoneNaturversity />} />
        <Route path="/zones/parents" element={<ZoneParents />} />
        <Route path="/zones/teachers" element={<ZoneTeachers />} />
        <Route path="/zones/partners" element={<ZonePartners />} />
        <Route path="/zones/settings" element={<ZoneSettings />} />
        <Route path="/zones/story-studio" element={<ZoneStoryStudio />} />
        <Route path="/zones/wellness" element={<ZoneWellness />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

