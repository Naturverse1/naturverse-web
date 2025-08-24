import React from "react";
import { WORLDS } from "../../data/worlds";
import ImageSafe from "../../components/ImageSafe";
import Meta from "../../components/Meta";
import Breadcrumbs from "../../components/Breadcrumbs";
import PageHead from "../../components/PageHead";

export default function WorldsIndex() {
  return (
    <div className="page-wrap">
      <PageHead title="Naturverse — Worlds" description="Explore the 14 kingdoms." />
      <Meta title="Worlds — Naturverse" description="Explore the 14 kingdoms." />
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Worlds" }]} />
      <h1>Worlds</h1>
      <p className="muted">Choose a kingdom to explore.</p>
      <div className="cards grid-gap">
        {WORLDS.map((w) => (
          <a key={w.slug} className="card" href={`/worlds/${w.slug}`}>
            {w.hero && <ImageSafe src={w.hero} alt={w.title} />}
            <h2>{w.title}</h2>
            <p>{w.blurb}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
