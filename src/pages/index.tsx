import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <main id="main" className="home">
      {/* Hero */}
      <section className="home-hero">
        <div className="home-hero-badge">
          <img
            src="/favicon-32x32.png"
            width={28}
            height={28}
            alt="Turian"
            className="inline-icon"
            loading="eager"
          />
        </div>
        <h1>Welcome to the Naturverse™</h1>
        <p className="subtitle">
          A playful world of kingdoms, characters, and quests that teach wellness, creativity, and kindness.
        </p>
        <div className="hero-cta">
          <Link className="btn primary" to="/signup">Create account</Link>
          <Link className="btn primary" to="/worlds">Explore Worlds</Link>
          {/* buttons keep .primary class for blue styling */}
        </div>
      </section>

      {/* About / Mission */}
      <section className="home-section">
        <h2>About us</h2>
        <p>
          Naturverse is an all-ages media universe built by Turian Media. We combine games, stories, music, and
          learning experiences so families can play and grow together — online and off.
        </p>
      </section>

      <section className="home-section">
        <h2>Our mission</h2>
        <ul className="bullet-grid">
          <li>Grow wisdom &amp; mindset</li>
          <li>Move your body &amp; breathe</li>
          <li>Create, share, and collaborate</li>
          <li>Celebrate cultures &amp; kindness</li>
        </ul>
      </section>

      <section className="home-card">
        <h3>Our values</h3>
        <ul className="values">
          <li>Safety first</li>
          <li>Family friendly</li>
          <li>Privacy by design</li>
          <li>Accessible &amp; inclusive</li>
        </ul>
      </section>

      {/* How it works */}
      <section className="home-section">
        <h2>How it works</h2>
        <ol className="steps">
          <li>Pick a hub.</li>
          <li>Choose a kingdom.</li>
          <li>Play &amp; learn.</li>
        </ol>
      </section>

      {/* Hubs */}
      <section className="home-grid">
        <a className="hub-card" href="/worlds">
          <div className="hub-emoji">🌍</div>
          <h3>Worlds</h3>
          <p>Travel the 14 magical kingdoms.</p>
        </a>

        <a className="hub-card" href="/zones">
          <div className="hub-emoji">🎮</div>
          <h3>Zones</h3>
          <p>Arcade, music, wellness, creator lab.</p>
        </a>

        <a className="hub-card" href="/marketplace">
          <div className="hub-emoji">🛍️</div>
          <h3>Marketplace</h3>
          <p>Wishlists, catalog, checkout.</p>
        </a>

        <a className="hub-card" href="/passport">
          <div className="hub-emoji">📘</div>
          <h3>Passport</h3>
          <p>Track stamps, badges, XP &amp; coins.</p>
        </a>
      </section>

      {/* CTA */}
      <section className="home-cta">
        <h2>Ready to join the journey?</h2>
        <div className="hero-cta">
          <Link className="btn primary" to="/signup">Sign up free</Link>
          <Link className="btn" to="/signin">Sign in</Link>
        </div>
      </section>
    </main>
  );
}

