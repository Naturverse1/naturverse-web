import { Link, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Zones from "./pages/Zones";
import Marketplace from "./pages/Marketplace";
import Arcade from "./pages/Arcade";
import Worlds from "./pages/Worlds";

import Music from "./pages/zones/Music";
import Wellness from "./pages/zones/Wellness";
import CreatorLab from "./pages/zones/CreatorLab";
import Community from "./pages/zones/Community";
import Teachers from "./pages/zones/Teachers";
import Partners from "./pages/zones/Partners";
import Naturversity from "./pages/zones/Naturversity";
import Parents from "./pages/zones/Parents";

import Stories from "./pages/content/Stories";
import Quizzes from "./pages/content/Quizzes";
import Observations from "./pages/content/Observations";
import Tips from "./pages/content/Tips";
import Account from "./pages/Account";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/zones" element={<Zones />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/arcade" element={<Arcade />} />
        <Route path="/worlds" element={<Worlds />} />

        <Route path="/zones/music" element={<Music />} />
        <Route path="/zones/wellness" element={<Wellness />} />
        <Route path="/zones/creator-lab" element={<CreatorLab />} />
        <Route path="/zones/community" element={<Community />} />
        <Route path="/zones/teachers" element={<Teachers />} />
        <Route path="/zones/partners" element={<Partners />} />
        <Route path="/zones/naturversity" element={<Naturversity />} />
        <Route path="/zones/parents" element={<Parents />} />

        <Route path="/content/stories" element={<Stories />} />
        <Route path="/content/quizzes" element={<Quizzes />} />
        <Route path="/content/observations" element={<Observations />} />
        <Route path="/tips" element={<Tips />} />
        <Route path="/account" element={<Account />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

function NotFound() {
  return (
    <div style={{ padding: 24 }}>
      <h1>404 — Not Found</h1>
      <p>
        <Link to="/">Go home</Link>
      </p>
    </div>
  );
}
