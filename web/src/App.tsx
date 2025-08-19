import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";

// helper to lazy-load a page (keeps build green even if some pages are temporarily missing)
function lazyPage<T extends React.ComponentType<any>>(path: string) {
  return lazy(() => import(/* @vite-ignore */ `./pages/${path}`));
}

// Core pages (present in your repo/zip)
const Home = lazyPage("Home");
const Worlds = lazyPage("Worlds");
const Zones = lazyPage("Zones");
const Arcade = lazyPage("Arcade");
const MarketplaceIndex = lazyPage("Marketplace/index");
const Music = lazyPage("Music");
const Wellness = lazyPage("Wellness");

// Extra sections we created
const CreatorsLab = lazyPage("CreatorsLab");
const Teachers = lazyPage("Teachers");
const Partners = lazyPage("Partners");
const TurianTips = lazyPage("TurianTips");
const Profile = lazyPage("Profile");

// Fallback
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Suspense fallback={<div>Loading…</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/worlds" element={<Worlds />} />
            <Route path="/zones" element={<Zones />} />
            <Route path="/arcade" element={<Arcade />} />
            <Route path="/marketplace/*" element={<MarketplaceIndex />} />
            <Route path="/music" element={<Music />} />
            <Route path="/wellness" element={<Wellness />} />
            <Route path="/creators-lab" element={<CreatorsLab />} />
            <Route path="/teachers" element={<Teachers />} />
            <Route path="/partners" element={<Partners />} />
            <Route path="/turian-tips" element={<TurianTips />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Layout>
    </BrowserRouter>
  );
}
