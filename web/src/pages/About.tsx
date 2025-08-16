import React from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10 text-white">
      <Breadcrumbs
        items={[
          { label: "Naturverse" },
          { label: "Home", to: "/" },
          { label: "About" }
        ]}
      />
      <h1 className="text-3xl font-bold">About Naturverse</h1>
      <p className="text-white/80 mt-2">
        We’re building a playful learning space that bridges curiosity and creativity.
      </p>

      <section className="mt-6 rounded-lg border border-white/10 bg-white/5 p-4">
        <h2 className="text-xl font-semibold">What’s inside</h2>
        <ul className="list-disc pl-6 mt-2 text-white/80">
          <li>Worlds</li>
          <li>Zones</li>
        </ul>
      </section>

      <p className="mt-6 text-sky-300">
        <Link to="/">Back to Home</Link> · <Link to="/zones">Explore Zones</Link>
      </p>
    </main>
  );
}
