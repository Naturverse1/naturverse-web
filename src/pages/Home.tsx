import AuthButtons from "../components/AuthButtons";
import "../styles/home.css";

export default function Home() {
  return (
    <main className="home">
      {/* HERO */}
      <section className="hero">
        <div className="wrap">
          <h1>Welcome to the Naturverse™</h1>
          <p className="lead">
            A playful world of kingdoms, characters, and quests that teach
            wellness, creativity, and kindness.
          </p>

          <AuthButtons cta="Create account" className="mt-4" />
        </div>
      </section>

      {/* 3-UP: Play / Learn / Earn */}
      <section className="triptych">
        <div className="card">
          <h3>Play</h3>
          <p>Mini-games, stories, and map adventures across 14 kingdoms.</p>
        </div>
        <div className="card">
          <h3>Learn</h3>
          <p>Naturversity lessons in languages, art, music, wellness, and more.</p>
        </div>
        <div className="card">
          <h3>Earn</h3>
          <p>Collect badges, save favorites, and build your Navatar card.</p>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how">
        <div className="panel">
          <h2>How it works</h2>
          <ol>
            <li>Create a free account.</li>
            <li>Pick a hub: <a href="/worlds">Worlds</a>, <a href="/zones">Zones</a>, or <a href="/marketplace">Marketplace</a>.</li>
            <li>Play & learn — explore, meet characters, earn badges.</li>
          </ol>
          <AuthButtons cta="Get started" variant="outline" size="md" className="mt-3" />
        </div>
      </section>
    </main>
  );
}

