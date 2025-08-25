import { useAuth } from '@/lib/auth-context';

export default function Home() {
  const { user } = useAuth();
  const authed = !!user;

  const Tile = ({
    title,
    body,
    href,
  }: {
    title: string;
    body: string;
    href: string;
  }) => (
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

  return (
    <main className="page-wrapper">
      <section className="hero">
        <h1 className="hero__title">Welcome to the Naturverse™</h1>
        <p className="hero__tag">
          A playful world of kingdoms, characters, and quests that teach wellness, creativity,
          and kindness.
        </p>

        <div className="hero__cta">
          <a href="/auth/magic" className="btn btn-primary">
            Create account
          </a>
          <a href="/auth/google" className="btn btn-secondary">
            Continue with Google
          </a>
        </div>
      </section>

      <section className="home-tiles">
        <Tile
          title="Play"
          body="Mini-games, stories, and map adventures across 14 kingdoms."
          href="/worlds"
        />
        <Tile
          title="Learn"
          body="Naturversity lessons in languages, art, music, wellness, and more."
          href="/naturversity"
        />
        <Tile
          title="Earn"
          body="Collect badges, save favorites, and build your Navatar card. Natur Coin — coming soon"
          href="/naturbank"
        />
      </section>

      <section className="home-flow">
        <div className="flow-card">
          <div className="flow-card__title">1) Create</div>
          <div className="flow-card__body">
            Create a free account ·{' '}
            <a href={authed ? '/navatar' : '/auth/magic'}>create your Navatar</a>
          </div>
        </div>
        <div className="flow-arrow">↓</div>

        <div className="flow-card">
          <div className="flow-card__title">2) Pick a hub</div>
          <div className="flow-card__body flow-links">
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
          </div>
        </div>
        <div className="flow-arrow">↓</div>

        <div className="flow-card">
          <div className="flow-card__title">3) Play · Learn · Earn</div>
          <div className="flow-card__body">
            Explore, meet characters, earn badges <em>(Natur Coin — coming soon)</em>
          </div>
        </div>
      </section>
    </main>
  );
}

