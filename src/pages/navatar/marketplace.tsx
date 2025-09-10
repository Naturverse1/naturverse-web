import React from "react";
import NavatarCard from "../../components/NavatarCard";
import "../../styles/navatar.css";

const placeholders = Array.from({ length: 8 }).map((_, i) => ({
  id: i,
  title: "Coming soon",
}));

export default function NavatarMarketplaceStub() {
  return (
    <main className="container page-pad">
      <h1 className="center page-title">Marketplace (Coming Soon)</h1>
      <p className="center">Mockups and merch generator preview will appear here.</p>
      <div className="nv-grid">
        {placeholders.map((p) => (
          <div key={p.id} className="nv-pick" aria-hidden>
            <NavatarCard title={p.title} />
          </div>
        ))}
      </div>
    </main>
  );
}

