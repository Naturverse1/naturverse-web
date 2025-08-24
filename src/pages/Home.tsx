import AuthButtons from "../components/AuthButtons";
import { useAuthUser } from "../lib/useAuthUser";
import "../styles/home.css";

export default function Home() {
  const { user } = useAuthUser();
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

          {!user && <AuthButtons cta="Create account" className="mt-4" />}
        </div>
      </section>

      {/* 3-UP: Play / Learn / Earn */}
      <section className="triptych">
        <div className="card">
          <h3 className="bubble-title">
            <span className="bubble-emoji" aria-hidden>🎮</span> Play
          </h3>
          <p>Mini-games, stories, and map adventures across 14 kingdoms.</p>
        </div>
        <div className="card">
          <h3 className="bubble-title">
            <span className="bubble-emoji" aria-hidden>📚</span> Learn
          </h3>
          <p>Naturversity lessons in languages, art, music, wellness, and more.</p>
        </div>
        <div className="card">
          <h3 className="bubble-title">
            <span className="bubble-emoji" aria-hidden>🪙</span> Earn
          </h3>
          <p>
            Collect badges, save favorites, and build your Navatar card.
            <br />
            <em>Natur Coin — coming soon</em>
          </p>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how">
        <div className="panel flow-vertical">
          <div className="flow-step">
            <h4>1) Create</h4>
            <p>Create a free account.</p>
          </div>
          <div className="flow-arrow-down" aria-hidden>↓</div>
          <div className="flow-step">
            <h4>2) Pick a hub</h4>
            <p>
              <a href="/worlds">Worlds</a> • <a href="/zones">Zones</a> •{" "}
              <a href="/marketplace">Marketplace</a>
            </p>
          </div>
          <div className="flow-arrow-down" aria-hidden>↓</div>
          <div className="flow-step">
            <h4>3) Play · Learn · Earn</h4>
            <p>
              Explore, meet characters, earn badges <br />
              <span className="muted">(Natur Coin — coming soon)</span>
            </p>
          </div>
        </div>

        {!user && (
          <AuthButtons
            cta="Get started"
            variant="outline"
            size="md"
            className="flow-cta"
          />
        )}
      </section>
    </main>
  );
}

