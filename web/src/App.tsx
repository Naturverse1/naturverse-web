import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
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

// New sections
import Wellness from "./pages/wellness";
import Music from "./pages/music";
import Feedback from "./pages/feedback";

// Arcade games
import BrainChallenge from "./pages/arcade/BrainChallenge";
import NatureClicker from "./pages/arcade/NatureClicker";

// very light layout
function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <header style={{ padding: "16px 20px", borderBottom: "1px solid #eee" }}>
        <nav style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          <strong style={{ marginRight: 10 }}>The Naturverse</strong>
          <Link to="/">Home</Link>
          <Link to="/zones">Zones</Link>
          <Link to="/worlds">Worlds</Link>
          <Link to="/marketplace">Marketplace</Link>
          <Link to="/arcade">Arcade</Link>
          <Link to="/wellness">Wellness</Link>
          <Link to="/music">Music</Link>
          <Link to="/feedback">Feedback</Link>
          <span style={{ flex: 1 }} />
          <Link to="/profile">Profile</Link>
          <Link to="/settings">Settings</Link>
        </nav>
      </header>
      <main style={{ padding: "24px 20px", maxWidth: 1100, margin: "0 auto" }}>
        {children}
      </main>
      <footer style={{ padding: "24px 20px", borderTop: "1px solid #eee", marginTop: 40 }}>
        © {new Date().getFullYear()} Naturverse
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout><AppHome /></Layout>} />
        <Route path="/home" element={<Layout><Home /></Layout>} />
        <Route path="/about" element={<Layout><About /></Layout>} />
        <Route path="/contact" element={<Layout><Contact /></Layout>} />
        <Route path="/faq" element={<Layout><FAQ /></Layout>} />
        <Route path="/privacy" element={<Layout><Privacy /></Layout>} />
        <Route path="/terms" element={<Layout><Terms /></Layout>} />
        <Route path="/settings" element={<Layout><Settings /></Layout>} />
        <Route path="/stories" element={<Layout><Stories /></Layout>} />
        <Route path="/story-studio" element={<Layout><StoryStudio /></Layout>} />
        <Route path="/quizzes" element={<Layout><Quizzes /></Layout>} />
        <Route path="/observations" element={<Layout><Observations /></Layout>} />
        <Route path="/observations-demo" element={<Layout><ObservationsDemo /></Layout>} />
        <Route path="/map" element={<Layout><MapHub /></Layout>} />
        <Route path="/profile" element={<Layout><Profile /></Layout>} />
        <Route path="/login" element={<Layout><Login /></Layout>} />
        <Route path="/worlds" element={<Layout><Worlds /></Layout>} />
        <Route path="/world-hub" element={<Layout><WorldHub /></Layout>} />
        <Route path="/oceanworld" element={<Layout><OceanWorld /></Layout>} />
        <Route path="/desertworld" element={<Layout><DesertWorld /></Layout>} />
        <Route path="/naturversity" element={<Layout><Naturversity /></Layout>} />
        <Route path="/rainforest" element={<Layout><Rainforest /></Layout>} />

        {/* New sections */}
        <Route path="/wellness" element={<Layout><Wellness /></Layout>} />
        <Route path="/music" element={<Layout><Music /></Layout>} />
        <Route path="/feedback" element={<Layout><Feedback /></Layout>} />

        {/* Zones / shop / arcade */}
        <Route path="/zones" element={<Layout><Zones /></Layout>} />
        <Route path="/marketplace" element={<Layout><Marketplace /></Layout>} />
        <Route path="/arcade" element={<Layout><Arcade /></Layout>} />
        <Route path="/arcade/brain-challenge" element={<Layout><BrainChallenge /></Layout>} />
        <Route path="/arcade/nature-clicker" element={<Layout><NatureClicker /></Layout>} />

        <Route path="*" element={<Layout><NotFound /></Layout>} />
      </Routes>
    </BrowserRouter>
  );
}

