import styles from './Home.module.css';
import { Link } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';

export default function Home() {
  const { user } = useAuth();

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <h1 className={styles.title}>Welcome to the Naturverse™</h1>
        <p className={styles.subtitle}>
          A playful world of kingdoms, characters, and quests that teach wellness, creativity, and
          kindness.
        </p>
        {!user && (
          <div className={styles.ctaRow}>
            <Link to="/auth/signup" className={styles.cta}>
              Create account
            </Link>
            <Link to="/auth/google" className={styles.cta}>
              Continue with Google
            </Link>
          </div>
        )}
      </section>

      {/* Top feature tiles — text centered */}
      <section className={styles.featureGrid}>
        <Link to={user ? '/worlds' : '#'} className={styles.featureCard} tabIndex={0}>
          <h3 className={styles.cardTitleCenter}>Play</h3>
          <p className={styles.cardTextCenter}>
            Mini-games, stories, and map adventures across 14 kingdoms.
          </p>
        </Link>
        <Link to={user ? '/naturversity' : '#'} className={styles.featureCard} tabIndex={0}>
          <h3 className={styles.cardTitleCenter}>Learn</h3>
          <p className={styles.cardTextCenter}>
            Naturversity lessons in languages, art, music, wellness, and more.
          </p>
        </Link>
        <Link to={user ? '/naturbank' : '#'} className={styles.featureCard} tabIndex={0}>
          <h3 className={styles.cardTitleCenter}>Earn</h3>
          <p className={styles.cardTextCenter}>
            Collect badges, save favorites, and build your Navatar card.
            <br />
            <em>Natur Coin — coming soon</em>
          </p>
        </Link>
      </section>

      {/* Bottom flow — text left-aligned */}
      <section className={styles.flowWrap}>
        <div className={styles.flowStep}>
          <div className={styles.flowHead}>1) Create</div>
          <div className={styles.flowBody}>
            Create a free account · <Link to="/navatar">create your Navatar</Link>
          </div>
        </div>
        <div className={styles.flowStep}>
          <div className={styles.flowHead}>2) Pick a hub</div>
          <div className={styles.flowBody}>
            <Link to="/worlds" className={styles.flowLink}>
              Worlds
            </Link>{' '}
            ·{' '}
            <Link to="/zones" className={styles.flowLink}>
              Zones
            </Link>{' '}
            ·{' '}
            <Link to="/marketplace" className={styles.flowLink}>
              Marketplace
            </Link>
          </div>
        </div>
        <div className={styles.flowStep}>
          <div className={styles.flowHead}>3) Play · Learn · Earn</div>
          <div className={styles.flowBody}>
            Explore, meet characters, earn badges <em>(Natur Coin — coming soon)</em>
          </div>
        </div>
      </section>
    </main>
  );
}
