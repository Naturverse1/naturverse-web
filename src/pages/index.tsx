import { useAuth } from '@/lib/auth-context';
import { Link } from 'react-router-dom';
import styles from '@/styles/home.module.css';

export default function Home() {
  const { user, signInWithGoogle, signInWithMagicLink } = useAuth();
  const isAuthed = !!user;

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <h1 className={styles.title}>Welcome to the Naturverse™</h1>
        <p className={styles.tagline}>
          A playful world of kingdoms, characters, and quests that teach wellness, creativity, and kindness.
        </p>
        {!isAuthed && (
          <div className={styles.authRow}>
            <button className={styles.cta} onClick={signInWithMagicLink}>
              Create account
            </button>
            <button className={styles.cta} onClick={signInWithGoogle}>
              Continue with Google
            </button>
          </div>
        )}
      </section>

      {/* Top tiles (centered; disabled when signed out) */}
      <div className={styles.topTiles}>
        {isAuthed ? (
          <>
            <Link to="/worlds" className={styles.topTile}>
              <span className={styles.topTileTitle}>Play</span>
              <span>Mini-games, stories, and map adventures across 14 kingdoms.</span>
            </Link>
            <Link to="/naturversity" className={styles.topTile}>
              <span className={styles.topTileTitle}>Learn</span>
              <span>Naturversity lessons in languages, art, music, wellness, and more.</span>
            </Link>
            <Link to="/naturbank" className={styles.topTile}>
              <span className={styles.topTileTitle}>Earn</span>
              <span>
                Collect badges, save favorites, and build your Navatar card.<br />
                <em>Natur Coin — coming soon</em>
              </span>
            </Link>
          </>
        ) : (
          <>
            <div className={`${styles.topTile} ${styles.disabled}`} aria-disabled="true">
              <span className={styles.topTileTitle}>Play</span>
              <span>Mini-games, stories, and map adventures across 14 kingdoms.</span>
            </div>
            <div className={`${styles.topTile} ${styles.disabled}`} aria-disabled="true">
              <span className={styles.topTileTitle}>Learn</span>
              <span>Naturversity lessons in languages, art, music, wellness, and more.</span>
            </div>
            <div className={`${styles.topTile} ${styles.disabled}`} aria-disabled="true">
              <span className={styles.topTileTitle}>Earn</span>
              <span>
                Collect badges, save favorites, and build your Navatar card.<br />
                <em>Natur Coin — coming soon</em>
              </span>
            </div>
          </>
        )}
      </div>

      {/* Bottom flow (LEFT aligned text; bold blue links) */}
      <div className={styles.flowCard}>
        <div className={styles.flowBox}>
          <div className={styles.flowHeading}>1) Create</div>
          <div>
            Create a free account ·{' '}
            <Link className={styles.flowLink} to="/navatar">
              create your Navatar
            </Link>
          </div>
        </div>
        <div className={styles.flowArrow} aria-hidden>
          ↓
        </div>
        <div className={styles.flowBox}>
          <div className={styles.flowHeading}>2) Pick a hub</div>
          <div>
            <Link className={styles.flowLink} to="/worlds">
              Worlds
            </Link>{' '}
            ·{' '}
            <Link className={styles.flowLink} to="/zones">
              Zones
            </Link>{' '}
            ·{' '}
            <Link className={styles.flowLink} to="/marketplace">
              Marketplace
            </Link>
          </div>
        </div>
        <div className={styles.flowArrow} aria-hidden>
          ↓
        </div>
        <div className={styles.flowBox}>
          <div className={styles.flowHeading}>3) Play · Learn · Earn</div>
          <div>
            Explore, meet characters, earn badges <em>(Natur Coin — coming soon)</em>
          </div>
        </div>
      </div>
    </main>
  );
}
