import AuthButtons from "@/components/AuthButtons";
import { useAuth } from "@/lib/auth-context";
import styles from "./home.module.css";

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
    <main>
      <section className={styles.hero}>
        <h1 className={styles.title}>Welcome to the Naturverse™</h1>
        <p className={styles.subtitle}>
          A playful world of kingdoms, characters, and quests that teach wellness, creativity, and kindness.
        </p>
        {showAuthButtons && <AuthButtons cta="Create account" className="mt-4" />}
      </section>

      {/* Top Tiles */}
      <section className={styles.tilesRow}>
        <MaybeLink to="/worlds" enabled={canClick} className={styles.tile}>
          <div className={styles.tileHeading}>Play</div>
          <div className={styles.tileBody}>
            Mini-games, stories, and map adventures across 14 kingdoms.
          </div>
        </MaybeLink>

        <MaybeLink to="/naturversity" enabled={canClick} className={styles.tile}>
          <div className={styles.tileHeading}>Learn</div>
          <div className={styles.tileBody}>
            Naturversity lessons in languages, art, music, wellness, and more.
          </div>
        </MaybeLink>

        <MaybeLink to="/naturbank" enabled={canClick} className={styles.tile}>
          <div className={styles.tileHeading}>Earn</div>
          <div className={styles.tileBody}>
            Collect badges, save favorites, and build your Navatar card.
            <br />
            <span className={styles.soon}>Natur Coin — coming soon</span>
          </div>
        </MaybeLink>
      </section>

      {/* Flow */}
      <section className={styles.flow}>
        <div className={styles.flowCard}>
          <div className={styles.flowHeading}>1) Create</div>
          <div className={styles.flowBody}>
            Create a free account · <a className={styles.inlineLink} href="/navatar">create your Navatar</a>
          </div>
        </div>

        <div className={styles.arrow}>↓</div>

        <div className={styles.flowCard}>
          <div className={styles.flowHeading}>2) Pick a hub</div>
          <div className={styles.flowBody}>
            <a className={styles.inlineLinkStrong} href="/worlds">Worlds</a> · <a className={styles.inlineLinkStrong} href="/zones">Zones</a> · <a className={styles.inlineLinkStrong} href="/marketplace">Marketplace</a>
          </div>
        </div>

        <div className={styles.arrow}>↓</div>

        <MaybeLink to="/worlds" enabled={canClick} className={styles.flowCard}>
          <div className={styles.flowHeading}>3) Play · Learn · Earn</div>
          <div className={styles.flowBody}>
            Explore, meet characters, earn badges
            <div className={styles.soon}>Natur Coin — coming soon</div>
          </div>
        </MaybeLink>
      </section>
    </main>
  );
}

