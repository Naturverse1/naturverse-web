import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import Home from "@/pages/Landing";
import Login from "@/pages/Login";
import AuthCallback from "@/pages/AuthCallback";
import Worlds from "@/pages/Worlds";
import World from "@/pages/World";
import AppHome from "@/pages/AppHome";
import ZonesHub from "@/pages/Zones";
import Naturversity from "@/pages/zones/Naturversity";
import MusicZone from "@/pages/zones/MusicZone";
import EcoLab from "@/pages/zones/EcoLab";
import StoryStudio from "@/pages/zones/StoryStudio";
import Parents from "@/pages/zones/Parents";
import Settings from "@/pages/zones/Settings";
import WellnessZone from "@/pages/zones/Wellness";
import CreatorLab from "@/pages/zones/CreatorLab";
import Arcade from "@/pages/zones/Arcade";
import Community from "@/pages/zones/Community";
import Lesson from "@/pages/naturversity/Lesson";
import About from "@/pages/About";
import StoryStudioPage from "@/pages/story-studio";
import AutoQuiz from "@/pages/auto-quiz";

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
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
