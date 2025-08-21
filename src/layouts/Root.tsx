import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";

export default function RootLayout() {
  return (
    <div className="nv-root">
      <Header />
      <main className="container">
        <Outlet />
      </main>
    </div>
  );
}
