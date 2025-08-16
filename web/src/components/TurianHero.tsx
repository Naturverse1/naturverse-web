import React from "react";
import { Link } from "react-router-dom";
import useReducedMotion from "@/hooks/useReducedMotion";

export default function TurianHero() {
  const reduced = useReducedMotion();
  const floatClass = reduced
    ? ""
    : "!animate-[turian-float_6s_ease-in-out_infinite_alternate]";

  return (
    <section className="w-full px-4 pt-24 pb-12">
      <style>{`
        @keyframes turian-float {
          0% { transform: translateY(0) rotate(0deg); }
          100% { transform: translateY(-8px) rotate(1.5deg); }
        }
      `}</style>
      <div className="mx-auto max-w-6xl flex flex-col items-center gap-12 md:flex-row md:justify-between">
        <div className="max-w-[560px] w-full text-center md:text-left flex flex-col items-center md:items-start bg-black/20 md:bg-transparent rounded-lg p-4 md:p-0">
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight text-white">
            Meet Turian the Durian 🍈⚡
          </h1>
          <p className="mt-4 text-lg text-white/90">
            Your playful guide to nature quests, stories, and mini-labs.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 w-full">
            <Link
              to="/zones/naturversity"
              aria-label="Start Learning"
              className="w-full sm:w-auto px-6 py-3 rounded-md font-semibold text-center bg-white text-black"
            >
              Start Learning
            </Link>
            <Link
              to="/story-studio"
              aria-label="Create a Story"
              className="w-full sm:w-auto px-6 py-3 rounded-md font-semibold text-center bg-white/10 text-white"
            >
              Create a Story
            </Link>
          </div>
          <div className="mt-4">
            <Link
              to="/zones"
              aria-label="Explore all Zones"
              className="text-sm text-white underline underline-offset-2"
            >
              Explore all Zones
            </Link>
          </div>
          <p className="mt-4 text-xs text-white/70">
            Built for kids—safe, friendly, and ad-free.
          </p>
        </div>
        <div className={`relative ${floatClass} w-[260px] sm:w-[300px] md:w-[420px]`}>
          <div className="absolute inset-0 rounded-full bg-white/8 blur-2xl" />
          <svg
            viewBox="0 0 200 200"
            role="img"
            aria-label="Turian the Durian mascot"
            className="relative w-full h-auto text-white"
          >
            <g
              fill="currentColor"
              fillOpacity="0.9"
              stroke="currentColor"
              strokeOpacity="0.25"
              strokeWidth="4"
              strokeLinecap="round"
            >
              <circle cx="100" cy="100" r="60" />
              <path d="M100 20 L100 40" />
              <path d="M140 30 L130 50" />
              <path d="M170 60 L150 70" />
              <path d="M180 100 L160 100" />
              <path d="M170 140 L150 130" />
              <path d="M140 170 L130 150" />
              <path d="M100 180 L100 160" />
              <path d="M60 170 L70 150" />
              <path d="M30 140 L50 130" />
              <path d="M20 100 L40 100" />
              <path d="M30 60 L50 70" />
              <path d="M60 30 L70 50" />
            </g>
            <g
              fill="currentColor"
              stroke="currentColor"
              strokeOpacity="0.25"
              strokeWidth="2"
            >
              <circle cx="80" cy="90" r="5" />
              <circle cx="120" cy="90" r="5" />
              <path
                d="M85 115 Q100 125 115 115"
                fill="none"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </g>
            <path
              d="M150 120 L190 140 L150 160 Z"
              fill="currentColor"
              fillOpacity="0.3"
              stroke="currentColor"
              strokeOpacity="0.25"
              strokeWidth="2"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}

