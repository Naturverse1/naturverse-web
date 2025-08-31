'use client';

import { useUser } from '@supabase/auth-helpers-react';
import styles from '@/styles/Home.module.css';
import { sendMagicLink, signInWithGoogle } from '@/lib/auth';

export default function Home() {
  const user = useUser();

  const SignedOutCTA = () => (
    <div className="welcome-buttons">
      <button
        className="btn btn-primary"
        onClick={async () => {
          const email = prompt('Enter your email to get a magic link:')?.trim();
          if (email) {
            await sendMagicLink(email);
          }
        }}
      >
        Create account
      </button>
      <button
        className="btn btn-secondary"
        onClick={async () => {
          await signInWithGoogle();
        }}
      >
        Continue with Google
      </button>
    </div>
  );

  return (
    <main className={styles.home}>
      <section className={styles.hero}>
        <h1>Welcome to the Naturverse™</h1>
        <p className="welcome-subtitle">A playful world of kingdoms, characters, and quests that teach wellness, creativity, and kindness.</p>
        {!user && <SignedOutCTA />}
      </section>

      {/* Play / Learn / Earn */}
      <section className={styles.tiles3}>
        <a className={`tile ${styles.infoCard}`} href="/zones/arcade">
          <h3>Play</h3>
          <p className="tile-subtitle">Mini-games, stories, and map adventures across 14 kingdoms.</p>
        </a>
        <a className={`tile ${styles.infoCard}`} href="/naturversity">
          <h3>Learn</h3>
          <p className="tile-subtitle">Naturversity lessons in languages, art, music, wellness, and more.</p>
        </a>
        <a className={`tile ${styles.infoCard}`} href="/passport">
          <h3>Earn</h3>
          <p className="tile-subtitle">Collect badges, save favorites, build your Navatar card.<br/><em>Natur Coin — coming soon</em></p>
        </a>
      </section>

      {/* How it works flow (vertical) */}
      <section className={styles.flowWrap}>
        <div className="step-box">
          <strong>1) Create</strong>
          <p>
            Create a free account{!user && ' or '}
            {!user && <a href="/navatar">create your Navatar</a>}.
          </p>
        </div>

        <div className={styles.flowArrow}>↓</div>

        <div className="step-box">
          <strong>2) Pick a hub</strong>
          <p>
            <a href="/worlds">Worlds</a> • <a href="/zones">Zones</a> • <a href="/marketplace">Marketplace</a>
          </p>
        </div>

        <div className={styles.flowArrow}>↓</div>

        <div className="step-box">
          <strong>3) Play · Learn · Earn</strong>
          <p>
            Explore, meet characters, earn badges<br/>
            <small>(Natur Coin — coming soon)</small>
          </p>
        </div>

        {!user && (
          <div className="welcome-buttons">
            <button
              className="btn btn-primary"
              onClick={async () => {
                const email = prompt('Enter your email to get a magic link:')?.trim();
                if (email) {
                  await sendMagicLink(email);
                }
              }}
            >
              Get started
            </button>
            <button
              className="btn btn-secondary"
              onClick={async () => {
                await signInWithGoogle();
              }}
            >
              Continue with Google
            </button>
          </div>
        )}
      </section>
    </main>
  );
}

