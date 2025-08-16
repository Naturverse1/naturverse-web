import React from "react";
import { Link } from "react-router-dom";
import useReducedMotion from "@/hooks/useReducedMotion";

interface ZoneTileProps {
  to: string;
  title: string;
  blurb: string;
  emoji?: string;
  accent?: string;
}

export default function ZoneTile({ to, title, blurb, emoji, accent = "#7dd3fc" }: ZoneTileProps) {
  const reducedMotion = useReducedMotion();

  const motionClasses = reducedMotion
    ? ""
    : "!transition-[transform,box-shadow] !duration-[220ms] !ease-out hover:-translate-y-1 hover:scale-[1.015] hover:shadow-[0_8px_24px_rgba(0,0,0,0.35)] focus-visible:-translate-y-1 focus-visible:scale-[1.015] focus-visible:shadow-[0_8px_24px_rgba(0,0,0,0.35)] active:translate-y-0 active:scale-[0.99]";

  return (
    <Link
      to={to}
      role="link"
      aria-label={`Enter ${title}`}
      tabIndex={0}
      style={{ outlineColor: accent }}
      className={`relative isolate flex min-h-[160px] flex-col gap-2 rounded-2xl border border-[rgba(255,255,255,0.12)] bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.04))] p-[18px] shadow-[0_6px_18px_rgba(0,0,0,0.25)] tile-focus ${motionClasses}`}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 rounded-2xl"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${accent}1f, transparent 70%)`,
          filter: "blur(18px)",
        }}
      />
      <div
        className="no-select pointer-events-none absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full text-lg"
        style={{ backgroundColor: `${accent}33` }}
      >
        {emoji ?? "✨"}
      </div>
      <h3
        className="text-lg font-semibold"
        style={{ textShadow: "0 1px 0 rgba(0,0,0,0.25)" }}
      >
        {title}
      </h3>
      <p
        className="text-sm opacity-80"
        style={{ textShadow: "0 1px 0 rgba(0,0,0,0.25)" }}
      >
        {blurb}
      </p>
    </Link>
  );
}
