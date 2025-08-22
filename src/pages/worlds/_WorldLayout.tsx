import React from "react";
import "../styles/worlds.css";

type Props = {
  title: string;
  mapSrc: string;
  children: React.ReactNode;
  mapAlt?: string;
};

export default function WorldLayout({ title, mapSrc, mapAlt = `${title} map`, children }: Props) {
  return (
    <div className="world-page">
      <section className="world-hero" aria-label={`${title} map`}>
        <img
          className="world-hero__img"
          src={mapSrc}
          alt={mapAlt}
          loading="lazy"
          decoding="async"
        />
      </section>

      <h1 className="world-title">🌍 {title}</h1>
      <p className="world-subtle">
        Welcome to {title} — explore traditions, landmarks, and celebrations.
      </p>

      {children}
    </div>
  );
}
