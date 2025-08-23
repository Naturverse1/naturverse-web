import React from "react";
import { Link } from "react-router-dom";
import Seo from "../components/Seo";
import { Img } from "../components";

export default function Home() {
  return (
    <>
      <Seo
        title="Welcome"
        description="Explore kingdoms, quests, and characters in the Naturverse."
      />
      <main id="main" className="home">
      {/* Hero */}
      <section className="home-hero">
        <div className="home-hero-badge">
          <Img
            src="/favicon-32x32.png"
            width={28}
            height={28}
            alt="Turian"
            className="inline-icon"
          />
        </div>
        <h1>Welcome to the Naturverse™</h1>
        <p className="subtitle">
          A playful world of kingdoms, characters, and quests that teach wellness, creativity, and kindness.
        </p>
        <div className="hero-cta">
          <a className="btn btn-primary" href="/signup">Create account</a>
          <a className="btn btn-outline" href="/worlds">Explore Worlds</a>
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
        <a className="hub-card card" href="/worlds">
          <div className="hub-emoji">🌍</div>
          <h3 className="card-header">Worlds</h3>
          <p>Travel the 14 magical kingdoms.</p>
        </a>

        <a className="hub-card card" href="/zones">
          <div className="hub-emoji">🎮</div>
          <h3 className="card-header">Zones</h3>
          <p>Arcade, music, wellness, creator lab.</p>
        </a>

        <a className="hub-card card" href="/marketplace">
          <div className="hub-emoji">🛍️</div>
          <h3 className="card-header">Marketplace</h3>
          <p>Wishlists, catalog, checkout.</p>
        </a>

        <a className="hub-card card" href="/passport">
          <div className="hub-emoji">📘</div>
          <h3 className="card-header">Passport</h3>
          <p>Track stamps, badges, XP &amp; coins.</p>
        </a>
      </section>

      {/* CTA */}
      <section className="home-cta">
        <h2>Ready to join the journey?</h2>
        <div className="hero-cta">
          <Link className="btn btn-primary" to="/signup">Sign up free</Link>
          <Link className="btn" to="/signin">Sign in</Link>
        </div>
      </section>
    </main>
    </>
  );
}

