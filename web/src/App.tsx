import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home"; // keep your existing pages
import NotFound from "./pages/NotFound"; // add if missing

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      {/* keep your other routes here */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
