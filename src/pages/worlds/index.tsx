import React from "react";
import { WORLDS } from "../../data/worlds";
import Meta from "../../components/Meta";
import Page from "../../layouts/Page";
import { Breadcrumbs } from "../../components/Breadcrumbs";

export default function WorldsIndex() {
  return (
    <Page title="Worlds">
      <Meta title="Worlds — Naturverse" description="Explore the 14 kingdoms." url="https://thenaturverse.com/worlds" />
      <Breadcrumbs />
      <p className="muted">Choose a kingdom to explore.</p>
      <div className="cards">
        {WORLDS.map(w => (
          <a className="card" key={w.slug} href={`/worlds/${w.slug}`}>
            <img src={w.map} alt={`${w.name} map`} loading="lazy" />
            <h2>{w.name}</h2>
            <p>{w.blurb}</p>
          </a>
        ))}
      </div>
    </Page>
  );
}
