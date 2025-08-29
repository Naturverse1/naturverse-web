import { useAuth } from '@/lib/auth-context';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithGoogle } from '@/lib/auth';
import styles from '@/styles/home.module.css';
import MiniQuestSection from '@/components/miniquests/MiniQuestSection';

export default function Home() {
  const { user } = useAuth();
  const isAuthed = !!user;
  const navigate = useNavigate();

  const handleGoogle = async () => {
    sessionStorage.setItem('post-auth-redirect', window.location.pathname + window.location.search);
    await signInWithGoogle();
  };

  const handleCreate = () => {
    navigate('/login');
  };

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <h1 className={styles.title}>Welcome to the Naturverse™</h1>
        <p className={styles.tagline}>
          A playful world of kingdoms, characters, and quests that teach wellness, creativity, and
          kindness.
        </p>
        {!isAuthed && (
          <div className={styles.authRow}>
            <button className={styles.cta} onClick={handleCreate}>
              Create account
            </button>
            <button className={styles.cta} onClick={handleGoogle}>
              Continue with Google
            </button>
          </div>
        )}
      </section>

      <div className="mt-4 p-4 bg-yellow-100 border border-yellow-300 rounded-md text-yellow-900 shadow">
        <h2 className="text-lg font-semibold">🌟 What’s New</h2>
        <p>
          Mini-quests and Zones Explorer are coming soon! This message confirms the latest deploy is
          live ✅
        </p>
      </div>

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
                Collect badges, save favorites, and build your Navatar card.
                <br />
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
                Collect badges, save favorites, and build your Navatar card.
                <br />
                <em>Natur Coin — coming soon</em>
              </span>
            </div>
          </>
        )}
      </div>

      <MiniQuestSection />

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
