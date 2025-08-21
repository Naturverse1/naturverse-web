import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Worlds from "./pages/Worlds";
import Zones from "./pages/Zones";
import Marketplace from "./pages/Marketplace";
import Naturversity from "./pages/Naturversity";
import Naturbank from "./pages/Naturbank";
import Navatar from "./pages/Navatar";
import Passport from "./pages/Passport";
import Turian from "./pages/Turian";
import Profile from "./pages/Profile";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/worlds" element={<Worlds />} />
      <Route path="/zones" element={<Zones />} />
      <Route path="/marketplace" element={<Marketplace />} />
      <Route path="/naturversity" element={<Naturversity />} />
      <Route path="/naturbank" element={<Naturbank />} />
      <Route path="/navatar" element={<Navatar />} />
      <Route path="/passport" element={<Passport />} />
      <Route path="/turian" element={<Turian />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
}
