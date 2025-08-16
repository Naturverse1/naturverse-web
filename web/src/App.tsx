import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Landing from "./pages/Landing";
import Map from "./pages/Map";
import Login from "./pages/Login";

export default function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/map" element={<Map />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
