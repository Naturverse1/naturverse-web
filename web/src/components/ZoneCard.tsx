import React from "react";
import { Link } from "react-router-dom";

type Props = {
  to: string;
  title: string;
  blurb: string;
  emoji?: string;
};

export default function ZoneCard({ to, title, blurb, emoji }: Props) {
  return (
    <Link
      to={to}
      className="block rounded-xl border border-white/10 bg-white/5 p-5 hover:bg-white/10"
    >
      <div className="flex items-center gap-3">
        <div className="text-2xl">{emoji ?? "✨"}</div>
        <h3 className="text-xl font-semibold text-white">{title}</h3>
      </div>
      <p className="text-white/70 mt-2">{blurb}</p>
      <div className="mt-4 text-sky-300">Enter →</div>
    </Link>
  );
}
