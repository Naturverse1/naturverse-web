import { Link } from "react-router-dom";

export default function Home() {
  return (
    <>
      <section className="nv-hero">
        <h1>Welcome to the Naturverse™</h1>
        <p>A playful world of kingdoms, characters, and quests that teach wellness, creativity, and kindness.</p>
        <div className="nv-ctaRow">
          <Link className="button" to="/signup">
            Create account
          </Link>
          <a className="button" href="/auth/google">
            Continue with Google
          </a>
        </div>
      </section>

      <section className="nv-tiles">
        <Link to="/worlds" className="card">
          <h3 className="nv-tileTitle">Play</h3>
          <p className="nv-tileCopy">
            Mini-games, stories, and map adventures across 14 kingdoms.
          </p>
        </Link>

        <Link to="/naturversity" className="card">
          <h3 className="nv-tileTitle">Learn</h3>
          <p className="nv-tileCopy">
            Naturversity lessons in languages, art, music, wellness, and more.
          </p>
        </Link>

        <Link to="/naturbank" className="card">
          <h3 className="nv-tileTitle">Earn</h3>
          <p className="nv-tileCopy">
            Collect badges, save favorites, and build your Navatar card.
            <br />
            <em>Natur Coin — coming soon</em>
          </p>
        </Link>
      </section>

      <section className="nv-flow">
        <div className="card">
          <div className="nv-stepTitle">1) Create</div>
          <div className="nv-stepBody">
            Create a free account · <Link to="/navatar">create your Navatar</Link>
          </div>
        </div>

        <div className="card" style={{ marginTop: "10px" }}>
          <div className="nv-stepTitle">2) Pick a hub</div>
          <div className="nv-stepBody">
            <strong>Worlds</strong> · <strong>Zones</strong> · <strong>Marketplace</strong>
          </div>
        </div>

        <div className="card" style={{ marginTop: "10px" }}>
          <div className="nv-stepTitle">3) Play · Learn · Earn</div>
          <div className="nv-stepBody">
            Explore, meet characters, earn badges
            <br />
            <small>(Natur Coin — coming soon)</small>
          </div>
        </div>
      </section>
    </>
  );
}

