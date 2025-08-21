import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";

export default function AppShell() {
  return (
    <>
      <Header />
      <main className="main"><Outlet /></main>
      <footer className="foot">© {new Date().getFullYear()} Naturverse</footer>
    </>
  );
}
