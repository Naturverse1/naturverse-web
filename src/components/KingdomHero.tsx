import React from "react";
import KingdomImage from "./KingdomImage";
import { KINGDOMS } from "../content/kingdoms";

export default function KingdomHero({ kingdom }: { kingdom: string }) {
  const meta = KINGDOMS.find(k => k.key === kingdom) ?? { title: kingdom, subtitle: "" };
  return (
    <section className="kingdom-hero">
      <div className="hero-img">
        <KingdomImage kingdom={kingdom} kind="hero" />
      </div>
      <div className="hero-text">
        <h1>{meta.title}</h1>
        {meta.subtitle ? <p className="muted">{meta.subtitle}</p> : null}
      </div>
    </section>
  );
}
