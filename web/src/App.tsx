import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppHome from "./AppHome";
// zones
import Zones from "./pages/zones";
import MusicZone from "./pages/zones/MusicZone";
// content
import TurianTips from "./pages/TurianTips";
// marketplace & account
import Marketplace from "./pages/marketplace";
import AccountHome from "./pages/account/AccountHome";
// fallbacks
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppHome />} />
        <Route path="/zones" element={<Zones />} />
        <Route path="/zones/music" element={<MusicZone />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/account" element={<AccountHome />} />
        <Route path="/turian-tips" element={<TurianTips />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
