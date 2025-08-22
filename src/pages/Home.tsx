import React from "react";

export default function Home() {
  return (
    <main className="home">
      {/* HERO */}
      <section className="hero">
        <div className="hero-body">
          <h1>✨ Welcome to the Naturverse™</h1>
          <p className="muted">
            A playful world of kingdoms, characters, and quests that teach
            wellness, creativity, and kindness.
          </p>
          <div className="cta-row">
            <a className="btn" href="/signup">Create account</a>
            <a className="btn ghost" href="/worlds">Explore Worlds</a>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="section">
        <h2>About us</h2>
        <p>
          Naturverse is an all-ages media universe built by Turian Media.
          We combine games, stories, music, and learning experiences so
          families can play and grow together — online and off.
        </p>
      </section>

      {/* MISSION */}
      <section className="section grid-2">
        <div>
          <h2>Our mission</h2>
          <p>
            Inspire healthy habits, spark creativity, and build resilient
            communities through joyful characters and positive play.
          </p>
          <ul className="bullets">
            <li>🧠 Grow wisdom & mindset</li>
            <li>💪 Move your body & breathe</li>
            <li>🎨 Create, share, and collaborate</li>
            <li>🌍 Celebrate cultures & kindness</li>
          </ul>
        </div>
        <div className="card soft">
          <h3>Our values</h3>
          <ul className="bullets tight">
            <li>Safety first</li>
            <li>Family friendly</li>
            <li>Privacy by design</li>
            <li>Accessible & inclusive</li>
          </ul>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section">
        <h2>How it works</h2>
        <div className="steps">
          <div className="step">
            <div className="num">1</div>
            <h4>Pick a hub</h4>
            <p>Start in Worlds, Zones, or the Marketplace.</p>
          </div>
          <div className="step">
            <div className="num">2</div>
            <h4>Choose a kingdom</h4>
            <p>Meet local heroes and explore the map.</p>
          </div>
          <div className="step">
            <div className="num">3</div>
            <h4>Play & learn</h4>
            <p>Quests, music, stories, and mini-games.</p>
          </div>
        </div>
      </section>

      {/* HUBS SHORTCUTS */}
      <section className="section">
        <h2>Jump into a hub</h2>
        <div className="cards four">
          <a className="card" href="/worlds">
            <h3>🌍 Worlds</h3>
            <p>Travel the 14 magical kingdoms.</p>
          </a>
          <a className="card" href="/zones">
            <h3>🎮 Zones</h3>
            <p>Arcade, music, wellness, creator lab.</p>
          </a>
          <a className="card" href="/marketplace">
            <h3>🛍️ Marketplace</h3>
            <p>Wishlists, catalog, checkout.</p>
          </a>
          <a className="card" href="/passport">
            <h3>📘 Passport</h3>
            <p>Track stamps, badges, XP & coins.</p>
          </a>
        </div>
      </section>

      {/* CTA */}
      <section className="section cta-block">
        <h2>Ready to join the journey?</h2>
        <div className="cta-row">
          <a className="btn" href="/signup">Sign up free</a>
          <a className="btn ghost" href="/login">Sign in</a>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="section">
        <h2>Newsletter</h2>
        <form className="newsletter" action="#" onSubmit={(e) => e.preventDefault()}>
          <input aria-label="Email" type="email" placeholder="you@example.com" required />
          <button className="btn" type="submit">Subscribe</button>
        </form>
        <p className="tiny muted">We send occasional updates. Unsubscribe anytime.</p>
      </section>
    </main>
  );
}

