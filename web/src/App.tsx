import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Nav from "./components/Nav";

// Lazy imports (only what we’ve seen in your repo tree)
const Home = lazy(() => import("./pages/Home"));
const Health = lazy(() => import("./pages/Health"));
const Login = lazy(() => import("./pages/Login"));
const Profile = lazy(() => import("./pages/Profile"));
const Settings = lazy(() => import("./pages/settings"));
const About = lazy(() => import("./pages/about"));
const Contact = lazy(() => import("./pages/contact"));
const FAQ = lazy(() => import("./pages/faq"));
const Privacy = lazy(() => import("./pages/privacy"));
const Terms = lazy(() => import("./pages/terms"));

const Worlds = lazy(() => import("./pages/Worlds"));
const WorldHub = lazy(() => import("./pages/world-hub"));
const MapHub = lazy(() => import("./pages/MapHub"));
const Observations = lazy(() => import("./pages/Observations"));
const ObservationsDemo = lazy(() => import("./pages/ObservationsDemo"));
const Quizzes = lazy(() => import("./pages/Quizzes"));
const Stories = lazy(() => import("./pages/Stories"));
const StoryStudio = lazy(() => import("./pages/story-studio"));

const DesertWorld = lazy(() => import("./pages/DesertWorld"));
const OceanWorld = lazy(() => import("./pages/OceanWorld"));
const Rainforest = lazy(() => import("./pages/Rainforest"));
const RainforestWorld = lazy(() => import("./pages/RainforestWorld"));

const Marketplace = lazy(() => import("./pages/marketplace"));
const Naturversity = lazy(() => import("./pages/naturversity"));
const Zones = lazy(() => import("./pages/zones"));
const NotFound = lazy(() => import("./pages/NotFound"));

function App() {
  return (
    <BrowserRouter>
      <Nav />
      <main style={{ maxWidth: 960, margin: "0 auto", padding: "1.5rem" }}>
        <Suspense fallback={<p>Loading…</p>}>
          <Routes>
            {/* core */}
            <Route path="/" element={<Home />} />
            <Route path="/health" element={<Health />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />

            {/* info */}
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />

            {/* experiences */}
            <Route path="/worlds" element={<Worlds />} />
            <Route path="/world-hub" element={<WorldHub />} />
            <Route path="/map" element={<MapHub />} />
            <Route path="/observations" element={<Observations />} />
            <Route path="/observations/demo" element={<ObservationsDemo />} />
            <Route path="/quizzes" element={<Quizzes />} />
            <Route path="/stories" element={<Stories />} />
            <Route path="/story-studio" element={<StoryStudio />} />

            {/* biomes */}
            <Route path="/desert" element={<DesertWorld />} />
            <Route path="/ocean" element={<OceanWorld />} />
            <Route path="/rainforest" element={<Rainforest />} />
            <Route path="/rainforest/world" element={<RainforestWorld />} />

            {/* sections */}
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/naturversity" element={<Naturversity />} />
            <Route path="/zones" element={<Zones />} />

            {/* compatibility + 404 */}
            <Route path="/home" element={<Navigate to="/" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
    </BrowserRouter>
  );
}

export default App;
