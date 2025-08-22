import React from "react";

export default function WorldLayout({
  title,
  mapSrc,
  children,
}: {
  title: string;
  mapSrc: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="page-wrap">
      <h1>{title}</h1>
      <div className="cards">
        <div className="card">
          <img src={mapSrc} alt={`${title} map`} loading="lazy" />
          <h2>World Map</h2>
          <p>Zoom into landmarks, routes, and regions.</p>
        </div>
        <div className="card">
          <h2>Characters</h2>
          <p>Gallery coming soon.</p>
        </div>
        <div className="card">
          <h2>Culture</h2>
          <p>Festivals, food, music and more.</p>
        </div>
      </div>
      {children}
    </div>
  );
}
