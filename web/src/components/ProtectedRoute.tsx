import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <div style={{padding:32}}>Loading…</div>;
  if (!user) {
    window.localStorage.setItem("naturverse-lastPath", location.pathname + location.search + location.hash);
    return <Navigate to="/login" replace />;
  }
  return children;
}
