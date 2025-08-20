import React from "react";
import { HUBS } from "../lib/content";
import { Link } from "react-router-dom";

export default function HubIndex() {
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-semibold">Explore the Naturverse</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {HUBS.map(h=>(
          <Link key={h.path} to={h.path} className="border rounded p-3 hover:shadow">
            <div className="font-semibold">{h.title}</div>
            <p className="text-sm text-neutral-600">{h.blurb}</p>
          </Link>
        ))}
        <Link to="/worlds" className="border rounded p-3 hover:shadow">
          <div className="font-semibold">Worlds</div>
          <p className="text-sm text-neutral-600">Visit all 14 kingdoms.</p>
        </Link>
      </div>
    </div>
  );
}
