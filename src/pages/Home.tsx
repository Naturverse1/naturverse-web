import AuthButtons from "@/components/AuthButtons";
import { useAuth } from "@/lib/auth-context";
import "../styles/home.css";

function MaybeLink({
  to,
  enabled,
  className,
  children,
}: React.PropsWithChildren<{ to: string; enabled: boolean; className?: string }>) {
  return enabled ? (
    <a href={to} className={className}>
      {children}
    </a>
  ) : (
    <div className={className} style={{ cursor: "default" }}>
      {children}
    </div>
  );
}

export default function Home() {
  const { user, ready } = useAuth();
  const showAuthButtons = ready && !user;
  const canClick = ready && !!user;

  return (
    <main className="home">
      {/* HERO */}
      <section className="home-hero">
        <h1>Welcome to the Naturverse™</h1>
        <p className="lead">
          A playful world of kingdoms, characters, and quests that teach
          wellness, creativity, and kindness.
        </p>

        {showAuthButtons && (
          <AuthButtons cta="Create account" className="mt-4" />
        )}
      </section>

      {/* === Top tiles === */}
      <section className="home-tiles">
        <MaybeLink to="/zones" enabled={canClick} className="tile card">
          <h3 className="tile-title">Play</h3>
          <p className="tile-sub">Mini-games, stories, and map adventures across 14 kingdoms.</p>
        </MaybeLink>

        <MaybeLink to="/naturversity" enabled={canClick} className="tile card">
          <h3 className="tile-title">Learn</h3>
          <p className="tile-sub">Naturversity lessons in languages, art, music, wellness, and more.</p>
        </MaybeLink>

        <MaybeLink to="/naturbank" enabled={canClick} className="tile card">
          <h3 className="tile-title">Earn</h3>
          <p className="tile-sub">Collect badges, save favorites, and build your Navatar card.</p>
          <small className="muted">Natur Coin — coming soon</small>
        </MaybeLink>
      </section>

      {/* === Flow === */}
      <section className="home-flow">
        {/* 1) Create → /navatar */}
        <MaybeLink to="/navatar" enabled={canClick} className="flow-row card flow-click">
          <div className="flow-title">1) Create</div>
          <div className="flow-desc">Create a free account · create your Navatar</div>
        </MaybeLink>

        {/* Arrow */}
        <div className="flow-arrow">↓</div>

        {/* 2) Pick a hub — keep three links, but bold style */}
        <div className="flow-row card">
          <div className="flow-title">2) Pick a hub</div>
          <div className="flow-desc">
            <a href="/worlds" className="hub-link">
              Worlds
            </a>{" "}
            · <a href="/zones" className="hub-link">Zones</a> ·{" "}
            <a href="/marketplace" className="hub-link">Marketplace</a>
          </div>
        </div>

        {/* Arrow */}
        <div className="flow-arrow">↓</div>

        {/* 3) Play · Learn · Earn → /worlds (left label clickable) */}
        <MaybeLink to="/worlds" enabled={canClick} className="flow-row card flow-click">
          <div className="flow-title">3) Play · Learn · Earn</div>
          <div className="flow-desc">
            Explore, meet characters, earn badges <br />
            <small className="muted">(Natur Coin — coming soon)</small>
          </div>
        </MaybeLink>
      </section>
    </main>
  );
}

