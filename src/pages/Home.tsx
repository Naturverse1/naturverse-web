import React from "react";
import { Link } from "react-router-dom";
import "./home.css";
import Meta from "../components/Meta";
import Page from "../layouts/Page";

export default function Home() {
  return (
    <Page>
      <Meta title="Naturverse — Playful worlds for families"
            description="A playful world of kingdoms, characters, and quests that teach wellness, creativity, and kindness."
            url="https://thenaturverse.com/" />
      <div className="home">
      {/* Hero */}
      <header className="home-hero">
        <img
          src="/favicon-32x32.png"
          width={28}
          height={28}
          className="home-hero-icon"
          alt=""            /* decorative */
          aria-hidden="true"
        />
        <h1 className="home-title">Welcome to the Naturverse™</h1>
        <p className="home-subtitle">
          A playful world of kingdoms, characters, and quests that teach wellness, creativity, and kindness.
        </p>
        <div className="home-cta">
          <Link className="btn btn-primary" to="/signup">Create account</Link>
          <Link className="btn" to="/worlds">Explore Worlds</Link>
        </div>
      </header>

      {/* About */}
      <section className="home-section">
        <h2>About us</h2>
        <p>
          Naturverse is an all-ages media universe built by Turian Media. We combine games, stories, music, and learning
          experiences so families can play and grow together — online and off.
        </p>
      </section>

      {/* Mission */}
      <section className="home-section">
        <h2>Our mission</h2>
        <p>
          Inspire healthy habits, spark creativity, and build resilient communities through joyful characters and positive play.
        </p>
        <ul className="home-bullets">
          <li>🧠 Grow wisdom &amp; mindset</li>
          <li>🏃 Move your body &amp; breathe</li>
          <li>🎨 Create, share, and collaborate</li>
          <li>🌍 Celebrate cultures &amp; kindness</li>
        </ul>
      </section>

      {/* Values */}
      <section className="home-card">
        <h3>Our values</h3>
        <ul>
          <li>Safety first</li>
          <li>Family friendly</li>
          <li>Privacy by design</li>
          <li>Accessible &amp; inclusive</li>
        </ul>
      </section>

      {/* How it works */}
      <section className="home-section">
        <h2>How it works</h2>
        <ol className="home-steps">
          <li>Create a free account.</li>
          <li>Pick a hub (Worlds, Zones, or Marketplace).</li>
          <li>Play &amp; learn — explore the map, meet characters, earn badges.</li>
        </ol>
      </section>

      {/* Join + newsletter */}
      <section className="home-join">
        <h3>Ready to join the journey?</h3>
        <div className="home-cta">
          <Link className="btn btn-primary" to="/signup">Sign up free</Link>
          <Link className="btn" to="/login">Sign in</Link>
        </div>

        <form className="home-newsletter" onSubmit={(e) => e.preventDefault()}>
          <label htmlFor="newsletter" className="sr-only">Email address</label>
          <input id="newsletter" type="email" placeholder="you@example.com" />
          <button className="btn" type="submit">Subscribe</button>
        </form>
        <small>We send occasional updates. Unsubscribe anytime.</small>
      </section>
      </div>
    </Page>
  );
}

