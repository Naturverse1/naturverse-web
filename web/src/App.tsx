import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Zones from './pages/Zones';
import Worlds from './pages/Worlds';
import Marketplace from './pages/Marketplace';
import Arcade from './pages/Arcade';
import Music from './pages/Music';
import Wellness from './pages/Wellness';
import CreatorLab from './pages/CreatorLab';
import Community from './pages/Community';
import Teachers from './pages/Teachers';
import Partners from './pages/Partners';
import Naturversity from './pages/Naturversity';
import Parents from './pages/Parents';
import Stories from './pages/Stories';
import Quizzes from './pages/Quizzes';
import Observations from './pages/Observations';
import Tips from './pages/Tips';
import Account from './pages/Account';
import Web3 from './pages/Web3';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      {/* Explore */}
      <Route path="/zones" element={<Zones />} />
      <Route path="/worlds" element={<Worlds />} />
      <Route path="/marketplace" element={<Marketplace />} />
      <Route path="/arcade" element={<Arcade />} />

      {/* Zones (shortcuts) */}
      <Route path="/music" element={<Music />} />
      <Route path="/wellness" element={<Wellness />} />
      <Route path="/creator-lab" element={<CreatorLab />} />
      <Route path="/community" element={<Community />} />
      <Route path="/teachers" element={<Teachers />} />
      <Route path="/partners" element={<Partners />} />
      <Route path="/naturversity" element={<Naturversity />} />
      <Route path="/parents" element={<Parents />} />

      {/* Content */}
      <Route path="/stories" element={<Stories />} />
      <Route path="/quizzes" element={<Quizzes />} />
      <Route path="/observations" element={<Observations />} />
      <Route path="/tips" element={<Tips />} />

      {/* Account / Web3 */}
      <Route path="/account" element={<Account />} />
      <Route path="/web3" element={<Web3 />} />

      {/* Old hashes/legacy fallbacks if any */}
      <Route path="/home" element={<Navigate to="/" replace />} />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
