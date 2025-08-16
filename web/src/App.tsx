import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import Home from "@/pages/Landing";         // <- use your existing landing component name
import Login from "@/pages/Login";
import AuthCallback from "@/pages/AuthCallback";
import Worlds from "@/pages/Worlds";
import World from "@/pages/World";
import AppHome from "@/pages/AppHome";
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
