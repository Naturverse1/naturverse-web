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
      <section className="hero">
        <div className="wrap">
          <h1>Welcome to the Naturverse™</h1>
          <p className="lead">
            A playful world of kingdoms, characters, and quests that teach
            wellness, creativity, and kindness.
          </p>

          {showAuthButtons && (
            <AuthButtons cta="Create account" className="mt-4" />
          )}
        </div>
      </section>

      {/* === Top tiles === */}
      <section className="tiles">
        <MaybeLink to="/zones" enabled={canClick} className="tile clickable">
          <h3>Play</h3>
          <p>Mini-games, stories, and map adventures across 14 kingdoms.</p>
        </MaybeLink>

        <MaybeLink to="/naturversity" enabled={canClick} className="tile clickable">
          <h3>Learn</h3>
          <p>Naturversity lessons in languages, art, music, wellness, and more.</p>
        </MaybeLink>

        <MaybeLink to="/naturbank" enabled={canClick} className="tile clickable">
          <h3>Earn</h3>
          <p>Collect badges, save favorites, and build your Navatar card.</p>
          <small>Natur Coin — coming soon</small>
        </MaybeLink>
      </section>

      {/* === Flow === */}
      <section className="flow">
        {/* 1) Create → /navatar */}
        <MaybeLink to="/navatar" enabled={canClick} className="flowRow clickable">
          <div className="flowTitle">1) Create</div>
          <div className="flowDesc">Create a free account · create your Navatar</div>
        </MaybeLink>

        {/* Arrow */}
        <div className="flowArrow">↓</div>

        {/* 2) Pick a hub — keep three links, but bold style */}
        <div className="flowRow">
          <div className="flowTitle">2) Pick a hub</div>
          <div className="flowDesc">
            <a href="/worlds" className="hubLink">
              Worlds
            </a>{" "}
            · <a href="/zones" className="hubLink">Zones</a> ·{" "}
            <a href="/marketplace" className="hubLink">Marketplace</a>
          </div>
        </div>

        {/* Arrow */}
        <div className="flowArrow">↓</div>

        {/* 3) Play · Learn · Earn → /worlds (left label clickable) */}
        <MaybeLink to="/worlds" enabled={canClick} className="flowRow clickable">
          <div className="flowTitle">3) Play · Learn · Earn</div>
          <div className="flowDesc">
            Explore, meet characters, earn badges <br />
            <small>(Natur Coin — coming soon)</small>
          </div>
        </MaybeLink>
      </section>
    </main>
  );
}

