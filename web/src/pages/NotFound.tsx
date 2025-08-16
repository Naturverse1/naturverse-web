import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-20 text-center text-white">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="mt-2 text-white/80">That page wandered off into the forest.</p>
      <Link to="/" className="inline-block mt-6 text-sky-300 underline">Go Home</Link>
    </main>
  );
}
