import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import PageLoader from "./components/PageLoader";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<PageLoader file="Home.tsx" />} />
          <Route path="/worlds" element={<PageLoader file="Worlds.tsx" />} />
          <Route path="/zones" element={<PageLoader file="Zones.tsx" />} />
          <Route path="/arcade" element={<PageLoader file="Arcade.tsx" />} />
          <Route path="/marketplace" element={<PageLoader file="Marketplace.tsx" />} />
          <Route path="/music" element={<PageLoader file="Music.tsx" />} />
          <Route path="/wellness" element={<PageLoader file="Wellness.tsx" />} />
          <Route path="/creators-lab" element={<PageLoader file="CreatorsLab.tsx" />} />
          <Route path="/teachers" element={<PageLoader file="Teachers.tsx" />} />
          <Route path="/partners" element={<PageLoader file="Partners.tsx" />} />
          <Route path="/turian-tips" element={<PageLoader file="TurianTips.tsx" />} />
          <Route path="/profile" element={<PageLoader file="Profile.tsx" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
