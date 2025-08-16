import React from "react";
import { Link } from "react-router-dom";

const portals = [
  { key: "naturversity", color: "#7dd3fc", route: "/zones/naturversity", label: "Naturversity" },
  { key: "music", color: "#a78bfa", route: "/zones/music", label: "Music" },
  { key: "wellness", color: "#34d399", route: "/zones/wellness", label: "Wellness" },
  { key: "creator", color: "#f472b6", route: "/zones/creator-lab", label: "Creator Lab" },
];

export default function IslandHubFallback() {
  return (
    <div className="w-full flex flex-col items-center gap-6">
      <svg
        role="img"
        aria-label="Floating island illustration"
        width="300"
        height="200"
        viewBox="0 0 300 200"
      >
        <ellipse cx="150" cy="150" rx="130" ry="30" fill="#0ea5e9" opacity="0.15" />
        <polygon points="150,60 50,140 250,140" fill="#93c5fd" />
      </svg>
      <p className="text-sm text-white/80 text-center">
        3D is disabled on this device—using a lightweight view.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        {portals.map((p) => (
          <Link
            key={p.key}
            to={p.route}
            className="px-4 py-2 rounded-full text-sm font-medium text-black"
            style={{ background: p.color }}
          >
            {p.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
