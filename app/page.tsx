'use client';

import { useUser } from '@supabase/auth-helpers-react';
import styles from '@/styles/Home.module.css';

export default function Home() {
  const user = useUser();

  const SignedOutCTA = () => (
    <div className={styles.ctaRow}>
      <a className="btn btn-primary" href="/auth">Create account</a>
      <a className="btn btn-secondary" href="/auth/google">Continue with Google</a>
    </div>
  );

  return (
    <main className={styles.home}>
      <section className={styles.hero}>
        <h1>Welcome to the Naturverse™</h1>
        <p>A playful world of kingdoms, characters, and quests that teach wellness, creativity, and kindness.</p>
        {!user && <SignedOutCTA />}
      </section>

      {/* Play / Learn / Earn */}
      <section className={styles.tiles3}>
        <a className={styles.infoCard} href="/zones/arcade">
          <h3>Play</h3>
          <p>Mini-games, stories, and map adventures across 14 kingdoms.</p>
        </a>
        <a className={styles.infoCard} href="/naturversity">
          <h3>Learn</h3>
          <p>Naturversity lessons in languages, art, music, wellness, and more.</p>
        </a>
        <a className={styles.infoCard} href="/passport">
          <h3>Earn</h3>
          <p>Collect badges, save favorites, build your Navatar card.<br/><em>Natur Coin — coming soon</em></p>
        </a>
      </section>

      {/* How it works flow (vertical) */}
      <section className={styles.flowWrap}>
        <div className={styles.flowCard}>
          <div className={styles.flowStep}>1) Create</div>
          <div className={styles.flowText}>
            Create a free account{!user && ' or '}
            {!user && <a href="/navatar">create your Navatar</a>}.
          </div>
        </div>

        <div className={styles.flowArrow}>↓</div>

        <div className={styles.flowCard}>
          <div className={styles.flowStep}>2) Pick a hub</div>
          <div className={styles.flowText}>
            <a href="/worlds">Worlds</a> • <a href="/zones">Zones</a> • <a href="/marketplace">Marketplace</a>
          </div>
        </div>

        <div className={styles.flowArrow}>↓</div>

        <div className={styles.flowCard}>
          <div className={styles.flowStep}>3) Play · Learn · Earn</div>
          <div className={styles.flowText}>
            Explore, meet characters, earn badges<br/>
            <small>(Natur Coin — coming soon)</small>
          </div>
        </div>

        {!user && (
          <div className={styles.ctaRowBottom}>
            <a className="btn btn-primary" href="/auth">Get started</a>
            <a className="btn btn-secondary" href="/auth/google">Continue with Google</a>
          </div>
        )}
      </section>
    </main>
  );
}

