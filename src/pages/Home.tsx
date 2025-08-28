import styles from './Home.module.css';
import { Link } from 'react-router-dom';
import { signInWithGoogle, sendMagicLink } from '@/lib/auth';
import { useAuth } from '@/lib/auth-context';
import ClickableCard from '@/components/ClickableCard';
import MiniQuests from '../components/MiniQuests';
import SearchBox from '../components/SearchBox';

export default function Home() {
  const { user } = useAuth();
  const isAuthed = !!user;

  return (
    <main className={`${styles.page} nv-container`}>
      <section className={styles.hero}>
        <h1 className={styles.title}>Welcome to the Naturverse™</h1>
        <p className={styles.subtitle}>
          A playful world of kingdoms, characters, and quests that teach wellness, creativity, and
          kindness.
        </p>
        {!user && (
          <div className={styles.ctaRow}>
            <button
              type="button"
              className={styles.cta}
              onClick={async () => {
                const email = prompt('Enter your email to get a magic link:')?.trim();
                if (email) {
                  sessionStorage.setItem('post-auth-redirect', window.location.pathname + window.location.search);
                  await sendMagicLink(email);
                }
              }}
            >
              Create account
            </button>
            <button
              type="button"
              className={styles.cta}
              onClick={async () => {
                sessionStorage.setItem('post-auth-redirect', window.location.pathname + window.location.search);
                await signInWithGoogle();
              }}
            >
              Continue with Google
            </button>
          </div>
        )}
      </section>

      <div className="nv-what">
        <span role="img" aria-label="sparkles">✨</span>
        <strong> What’s New</strong>
        <span> Mini-quests and Zones Explorer are coming soon! This message confirms the latest deploy is live ✅</span>
      </div>

      <div className="nv-home-tools">
        <SearchBox onFocus={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))} />
      </div>

      {/* Top feature tiles — text centered */}
      <section className={styles.featureGrid}>
        <ClickableCard
          to="/zones"
          enabled={isAuthed}
          ariaLabel="Open Zones"
          className={styles.featureCard}
        >
          <h3 className={styles.cardTitleCenter}>Play</h3>
          <p className={styles.cardTextCenter}>
            Mini-games, stories, and map adventures across 14 kingdoms.
          </p>
        </ClickableCard>
        <ClickableCard
          to="/naturversity"
          enabled={isAuthed}
          ariaLabel="Open Naturversity"
          className={styles.featureCard}
        >
          <h3 className={styles.cardTitleCenter}>Learn</h3>
          <p className={styles.cardTextCenter}>
            Naturversity lessons in languages, art, music, wellness, and more.
          </p>
        </ClickableCard>
        <ClickableCard
          to="/naturbank"
          enabled={isAuthed}
          ariaLabel="Open NaturBank"
          className={styles.featureCard}
        >
          <h3 className={styles.cardTitleCenter}>Earn</h3>
          <p className={styles.cardTextCenter}>
            Collect badges, save favorites, and build your Navatar card.
            <br />
            <em>Natur Coin — coming soon</em>
          </p>
        </ClickableCard>
      </section>

      <MiniQuests />

      {/* Bottom flow — text left-aligned */}
      <section className={styles.flowWrap}>
        <ClickableCard
          to="/navatar"
          enabled={isAuthed}
          ariaLabel="Create your Navatar"
          className={styles.flowStep}
        >
          <div className={styles.flowHead}>1) Create</div>
          <div className={styles.flowBody}>
            Create a free account ·{' '}
            {isAuthed ? (
              <Link to="/navatar">create your Navatar</Link>
            ) : (
              <span>create your Navatar</span>
            )}
          </div>
        </ClickableCard>
        <ClickableCard
          to="/zones"
          enabled={isAuthed}
          ariaLabel="Pick a hub"
          className={styles.flowStep}
        >
          <div className={styles.flowHead}>2) Pick a hub</div>
          <div className={styles.flowBody}>
            {isAuthed ? (
              <>
                <Link to="/worlds" className={styles.flowLink}>
                  Worlds
                </Link>
                {' '}
                ·{' '}
                <Link to="/zones" className={styles.flowLink}>
                  Zones
                </Link>
                {' '}
                ·{' '}
                <Link to="/marketplace" className={styles.flowLink}>
                  Marketplace
                </Link>
              </>
            ) : (
              <>
                <span className={styles.flowLink}>Worlds</span> ·{' '}
                <span className={styles.flowLink}>Zones</span> ·{' '}
                <span className={styles.flowLink}>Marketplace</span>
              </>
            )}
          </div>
        </ClickableCard>
        <ClickableCard
          to="/passport"
          enabled={isAuthed}
          ariaLabel="Play Learn Earn"
          className={styles.flowStep}
        >
          <div className={styles.flowHead}>3) Play · Learn · Earn</div>
          <div className={styles.flowBody}>
            Explore, meet characters, earn badges <em>(Natur Coin — coming soon)</em>
          </div>
        </ClickableCard>
      </section>
    </main>
  );
}
