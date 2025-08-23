import React from "react";
import { KINGDOMS, KingdomId, imgUrl } from "../data/kingdoms";
import "../styles/worlds.css";
import SmartImg from "./SmartImg";

type Props = { id: KingdomId };

export default function WorldLayout({ id }: Props) {
  const k = KINGDOMS[id];
  const folder = k.title; // TitleCase matches your public folder name

  return (
    <main id="main" className="world-wrap container-narrow world-page">
      <h1 className="world-title">{k.title}</h1>

      {/* Map hero */}
      <section className="world-hero card">
        <figure className="hero-figure">
          <SmartImg
            src={imgUrl(folder, k.mapFile)}
            alt={`${k.title} map`}
            ratio="wide"
            width={1280}
            height={720}
            loading="eager"
          />
        </figure>
        <div className="hero-meta">
          <h2>World Map</h2>
          <p>Zoom into landmarks, routes, and regions.</p>
        </div>
      </section>

      {/* Characters grid */}
      <section className="world-section">
        <h2>Characters</h2>
        {k.characters.length === 0 ? (
          <div className="coming-soon">Gallery coming soon.</div>
        ) : (
          <ul className="char-grid">
            {k.characters.map((file) => (
              <li key={file} className="char-card">
                <div className="char-thumb">
                  <SmartImg
                    src={imgUrl(folder, file)}
                    alt={file.replace(/\.[^.]+$/, "")}
                    ratio="tall"
                    width={320}
                    height={420}
                    onError={(e) => {
                      // friendly fallback if a filename is missing
                      (e.currentTarget as HTMLImageElement).style.display = "none";
                      e.currentTarget.parentElement!.classList.add("thumb-missing");
                    }}
                  />
                </div>
                <div className="char-name">
                  {file.replace(/\.[^.]+$/, "")}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
