import Link from 'next/link';
import AuthButtons from '@/components/auth/AuthButtons';

export default function Home() {
  return (
    <main className="page narrow">
      <section className="hero">
        <h1>Welcome to the Naturverse™</h1>
        <p>A playful world of kingdoms, characters, and quests that teach wellness, creativity, and kindness.</p>
        <div className="hero-ctas">
          <Link className="btn" href="/worlds">Explore Worlds</Link>
          <Link className="btn ghost" href="/zones">Play Games</Link>
        </div>
      </section>

      <section className="grid grid-3">
        <Link href="/zones" className="card hover">
          <h3>🎮 Play</h3>
          <p>Mini-games, leaderboards, and tournaments.</p>
        </Link>

        <Link href="/naturversity" className="card hover">
          <h3>📘 Learn</h3>
          <p>Teachers, languages, and courses across the 14 kingdoms.</p>
        </Link>

        <Link href="/naturbank" className="card hover">
          <h3>💰 Earn</h3>
          <p>Quests and rewards that build real-life skills.</p>
        </Link>
      </section>

      <section className="grid gap-lg">
        <AuthButtons />
      </section>
    </main>
  );
}

