import React from "react";
import Navbar from "../Navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="container mx-auto max-w-5xl px-4 py-8 flex-1">
        {children}
      </main>
      <footer className="border-t py-6 text-sm text-center text-gray-500">
        © {new Date().getFullYear()} The Naturverse
      </footer>
    </div>
  );
}

