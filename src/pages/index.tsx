import { useAuth } from '@/lib/auth-context';
import styles from './home.module.css';

export default function Home() {
  const { user } = useAuth();
  const authed = !!user;

    return (
      <main className="page-wrapper homepage">
      <section className="hero">
        <h1 className="hero__title">Welcome to the Naturverse™</h1>
        <p className="hero__tag">
          A playful world of kingdoms, characters, and quests that teach wellness, creativity,
          and kindness.
        </p>

        {!authed && (
          <div className="hero__cta">
            <a href="/auth/magic" className="btn btn-primary">
              Create account
            </a>
            <a href="/auth/google" className="btn btn-secondary">
              Continue with Google
            </a>
          </div>
        )}
      </section>

      {/* TOP: Play / Learn / Earn (centered) */}
      <div className="play-learn-earn">
        <section className={styles.tilesCenter}>
          <div className={styles.tileWrap}>
            <FeatureTile
              title="Play"
              body="Mini-games, stories, and map adventures across 14 kingdoms."
              href="/worlds"
            />
          </div>
          <div className={styles.tileWrap}>
            <FeatureTile
              title="Learn"
              body="Naturversity lessons in languages, art, music, wellness, and more."
              href="/naturversity"
            />
          </div>
          <div className={styles.tileWrap}>
            <FeatureTile
              title="Earn"
              body="Collect badges, save favorites, and build your Navatar card. Natur Coin — coming soon"
              href="/naturbank"
            />
          </div>
        </section>
      </div>

      {/* BOTTOM: Create flow (left-aligned) */}
      <div className="create-flow">
        <section className={styles.flowLeft}>
          <FlowStep title="1) Create">
            Create a free account ·{' '}
            <a href={authed ? '/navatar' : '/auth/magic'}>create your Navatar</a>
          </FlowStep>
          <FlowStep title="2) Pick a hub">
            <a href="/worlds">
              <b>Worlds</b>
            </a>{' '}
            ·{' '}
            <a href="/zones">
              <b>Zones</b>
            </a>{' '}
            ·{' '}
            <a href="/marketplace">
              <b>Marketplace</b>
            </a>
          </FlowStep>
          <FlowStep title="3) Play · Learn · Earn">
            Explore, meet characters, earn badges <em>(Natur Coin — coming soon)</em>
          </FlowStep>
        </section>
      </div>
    </main>
  );
}

function FeatureTile({
  title,
  body,
  href,
}: {
  title: string;
  body: string;
  href: string;
}) {
  const { user } = useAuth();
  const authed = !!user;

  return (
    <a
      href={authed ? href : '#'}
      onClick={(e) => {
        if (!authed) e.preventDefault();
      }}
      aria-disabled={!authed}
      className={`home-tile ${authed ? '' : 'is-disabled'}`}
    >
      <div className="home-tile__title">{title}</div>
      <div className="home-tile__body">{body}</div>
    </a>
  );
}

function FlowStep({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flow-card">
      <div className="flow-card__title">{title}</div>
      <div className="flow-card__body">{children}</div>
    </div>
  );
}

