import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useWebGLSupport from "@/hooks/useWebGLSupport";
import useReducedMotion from "@/hooks/useReducedMotion";
import IslandHub3D from "@/components/IslandHub3D";
import IslandHubFallback from "@/components/IslandHubFallback";
import { invalidate } from "@react-three/fiber";

interface PortalMeta {
  key: string;
  label: string;
  color: string;
  route: string;
  top: string;
  left: string;
}

const portals: PortalMeta[] = [
  { key: "naturversity", label: "Naturversity", color: "#7dd3fc", route: "/zones/naturversity", top: "35%", left: "60%" },
  { key: "music", label: "Music", color: "#a78bfa", route: "/zones/music", top: "40%", left: "30%" },
  { key: "wellness", label: "Wellness", color: "#34d399", route: "/zones/wellness", top: "55%", left: "70%" },
  { key: "creator", label: "Creator Lab", color: "#f472b6", route: "/zones/creator-lab", top: "58%", left: "40%" },
];

export default function WorldHub() {
  const webgl = useWebGLSupport();
  const reduced = useReducedMotion();
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Naturverse Hub (3D Beta)";
  }, []);

  const handleActive = (k: string | null) => {
    setActive(k);
    if (reduced) invalidate();
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <Link to="/zones" className="text-sm text-blue-300 hover:underline">
        ← Back to zones
      </Link>
      <div className="mt-4 w-full flex flex-col items-center">
        <div className="relative w-full max-w-[1100px]">
          <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
            {webgl ? (
              <IslandHub3D reduced={reduced} active={active} onActiveChange={handleActive} />
            ) : (
              <IslandHubFallback />
            )}
            {webgl && (
              <div className="absolute inset-0 pointer-events-none">
                {portals.map((p) => (
                  <Link
                    key={p.key}
                    to={p.route}
                    className="pointer-events-auto absolute text-xs text-white"
                    style={{ top: p.top, left: p.left, transform: "translate(-50%, -50%)" }}
                    onFocus={() => handleActive(p.key)}
                    onBlur={() => handleActive(null)}
                  >
                    {p.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="mt-4 flex flex-wrap justify-center gap-4 text-xs text-white/80">
          {portals.map((p) => (
            <div key={p.key} className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full" style={{ background: p.color }} />
              <span>{p.label}</span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
