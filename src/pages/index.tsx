import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import styles from '../styles/home.module.css'

export default function Home() {
  const { user, loading } = useAuth()

  const SignedOutCTAs = (
    <div className="welcome-buttons">
      <Link className={styles.btn} to="/auth">Create account</Link>
      <Link className={styles.btnSecondary} to="/auth/google">Continue with Google</Link>
    </div>
  )

  return (
    <main className={styles.wrap}>
      <section className={styles.hero}>
        <h1>Welcome to the Naturverse™</h1>
        <p className="welcome-subtitle">A playful world of kingdoms, characters, and quests that teach wellness, creativity, and kindness.</p>

        {!loading && !user && SignedOutCTAs}
      </section>

      <section className={styles.pills}>
        <div className={`tile ${styles.pill}`}>
          <h3>🎮 Play</h3>
          <p className="tile-subtitle">Mini-games, stories, and map adventures across 14 kingdoms.</p>
        </div>
        <div className={`tile ${styles.pill}`}>
          <h3>📚 Learn</h3>
          <p className="tile-subtitle">Naturversity lessons in languages, art, music, wellness, and more.</p>
        </div>
        <div className={`tile ${styles.pill}`}>
          <h3>🪙 Earn</h3>
          <p className="tile-subtitle">Collect badges, save favorites, and build your Navatar card.<br/><em>Natur Coin — coming soon</em></p>
        </div>
      </section>

      <section className={styles.flow}>
        <div className="step-box">
          <strong>1) Create</strong>
          <p>Create a free account / create your Navatar</p>
        </div>
        <div className={styles.arrow}>↓</div>
        <div className="step-box">
          <strong>2) Pick a hub</strong>
          <p>
            <Link to="/worlds">Worlds</Link> • <Link to="/zones">Zones</Link> • <Link to="/marketplace">Marketplace</Link>
          </p>
        </div>
        <div className={styles.arrow}>↓</div>
        <div className="step-box">
          <strong>3) Play · Learn · Earn</strong>
          <p>Explore, meet characters, earn badges</p>
          <small>(Natur Coin — coming soon)</small>
        </div>

        {!loading && !user && (
          <div className="welcome-buttons">
            <Link className={styles.btn} to="/auth">Get started</Link>
            <Link className={styles.btnSecondary} to="/auth/google">Continue with Google</Link>
          </div>
        )}
      </section>
    </main>
  )
}
