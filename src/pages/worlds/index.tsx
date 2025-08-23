import React, { useEffect, useState } from "react";
import { WORLDS } from "../../data/worlds";
import Meta from "../../components/Meta";
import Breadcrumbs from "../../components/Breadcrumbs";
import SmartImg from "../../components/SmartImg";
import SkeletonGrid from "../../components/SkeletonGrid";

export default function WorldsIndex() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 250);
    return () => clearTimeout(t);
  }, []);

  return (
      <div className="page-wrap">
        <Meta title="Worlds — Naturverse" description="Explore the 14 kingdoms." />
        <Breadcrumbs items={[{ href:"/", label:"Home" }, { label:"Worlds" }]} />
      <p className="muted">Choose a kingdom to explore.</p>
      {ready ? (
      <div className="cards">
        {WORLDS.map((w) => (
            <a className="card" key={w.slug} href={`/worlds/${w.slug}`}>
              <SmartImg src={w.map} alt={`${w.name} map`} ratio="wide" width={800} height={450} />
              <h2>{w.name}</h2>
              <p>{w.blurb}</p>
            </a>
        ))}
      </div>
      ) : (
        <SkeletonGrid count={14} />
      )}
    </div>
  );
}
