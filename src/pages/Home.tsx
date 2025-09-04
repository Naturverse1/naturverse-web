import styles from './Home.module.css';
import { Link } from 'react-router-dom';
import { signInWithGoogle, sendMagicLink } from '@/lib/auth';
import { useAuth } from '@/lib/auth-context';
import ClickableCard from '@/components/ClickableCard';
import { BRAND_NAME } from '@/lib/brand';

export default function Home() {
  const { user } = useAuth();
  const isAuthed = !!user;

  return (
    <main className={`${styles.page} ${!user ? 'guest-locked' : ''}`}>
      <section className={styles.hero}>
        <h1 className={styles.title}>Welcome to {BRAND_NAME}</h1>
        <p className={styles.subtitle}>
          A playful world of kingdoms, characters, and quests that teach wellness, creativity, and
          kindness.
        </p>
        {!user && (
          <div className={`${styles.ctaRow} auth-buttons`}>
            <button
              type="button"
              className={styles.cta}
              onClick={async () => {
                const email = prompt('Enter your email to get a magic link:')?.trim();
                if (email) await sendMagicLink(email);
              }}
            >
              Create account
            </button>
            <button
              type="button"
              className={styles.cta}
              onClick={async () => {
                await signInWithGoogle();
              }}
            >
              Continue with Google
            </button>
          </div>
        )}
      </section>

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
