import React from "react";
import { Link } from "react-router-dom";

const Item = ({ to, label }: { to: string; label: string }) => (
  <li className="my-1">
    <Link className="text-blue-600 hover:underline" to={to}>
      {label}
    </Link>
  </li>
);

export default function AppHome() {
  return (
    <section>
      <h1 className="text-3xl font-bold mb-2">The Naturverse</h1>
      <p className="mb-6">Welcome 🌿 Naturverse is live and the client router is working.</p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Explore</h2>
      <ul>
        <Item to="/zones" label="Zones" />
        <Item to="/marketplace" label="Marketplace" />
        <Item to="/arcade" label="Arcade" />
        <Item to="/naturversity" label="Naturversity" />
        <Item to="/rainforest" label="Rainforest" />
        <Item to="/worlds" label="Worlds" />
        <Item to="/world-hub" label="World Hub" />
        <Item to="/oceanworld" label="Ocean World" />
        <Item to="/desertworld" label="Desert World" />
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">Content</h2>
      <ul>
        <Item to="/stories" label="Stories" />
        <Item to="/quizzes" label="Quizzes" />
        <Item to="/observations" label="Observations" />
        <Item to="/observations-demo" label="Observations Demo" />
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">Account</h2>
      <ul>
        <Item to="/profile" label="Profile" />
        <Item to="/settings" label="Settings" />
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">Help</h2>
      <ul>
        <Item to="/map" label="Map Hub" />
        <Item to="/faq" label="FAQ" />
        <Item to="/contact" label="Contact" />
        <Item to="/privacy" label="Privacy" />
        <Item to="/terms" label="Terms" />
      </ul>
    </section>
  );
}

