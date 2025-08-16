import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import Home from "@/pages/Landing";         // <- use your existing landing component name
import Login from "@/pages/Login";
import AuthCallback from "@/pages/AuthCallback";
import Worlds from "@/pages/Worlds";
import World from "@/pages/World";
import AppHome from "@/pages/AppHome";
import ZonesHub from "@/pages/ZonesHub";
import Naturversity from "@/pages/zones/Naturversity";
import Music from "@/pages/zones/Music";
import Wellness from "@/pages/zones/Wellness";
import MakerLab from "@/pages/zones/MakerLab";
import Arcade from "@/pages/zones/Arcade";
import Library from "@/pages/zones/Library";

import Profile from "@/pages/Profile";
import NotFound from "@/pages/NotFound";
import { RequireAuth } from "@/lib/auth";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-br from-[#0b1020] via-[#101a38] to-[#1e2046]">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/worlds" element={<Worlds />} />
          <Route path="/worlds/:slug" element={<World />} />
          <Route path="/zones" element={<ZonesHub />} />
          <Route path="/zones/naturversity" element={<Naturversity />} />
          <Route path="/zones/music" element={<Music />} />
          <Route path="/zones/wellness" element={<Wellness />} />
          <Route path="/zones/maker-lab" element={<MakerLab />} />
          <Route path="/zones/arcade" element={<Arcade />} />
          <Route path="/zones/library" element={<Library />} />
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
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
