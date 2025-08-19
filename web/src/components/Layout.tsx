import React from "react";
import NavBar from "./NavBar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-1">{children}</main>
      <footer className="border-t text-center text-sm py-4">
        © {new Date().getFullYear()} Naturverse
      </footer>
    </div>
  );
}
