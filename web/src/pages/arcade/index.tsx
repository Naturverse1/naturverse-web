import React from "react";
import { Link } from "react-router-dom";

export default function Arcade() {
  return (
    <section>
      <h2 className="text-2xl font-semibold mb-2">🎮 Arcade</h2>
      <p className="mb-4">Interactive Naturverse games.</p>
      <ul className="list-disc ml-5">
        <li><Link to="/quizzes" className="text-blue-600 hover:underline">Brain Challenge</Link> (coming soon)</li>
      </ul>
    </section>
  );
}

