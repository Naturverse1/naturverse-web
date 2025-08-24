import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import styles from '../styles/home.module.css'

export default function Home() {
  const { user, loading } = useAuth()

  const SignedOutCTAs = (
    <div className={styles.ctaRow}>
      <Link className={styles.btn} to="/auth">Create account</Link>
      <Link className={styles.btnSecondary} to="/auth/google">Continue with Google</Link>
    </div>
  )

  return (
    <main className={styles.wrap}>
      <section className={styles.hero}>
        <h1>Welcome to the Naturverse™</h1>
        <p>A playful world of kingdoms, characters, and quests that teach wellness, creativity, and kindness.</p>

        {!loading && !user && SignedOutCTAs}
      </section>

      <section className={styles.pills}>
        <div className={styles.pill}>
          <h3>🎮 Play</h3>
          <p>Mini-games, stories, and map adventures across 14 kingdoms.</p>
        </div>
        <div className={styles.pill}>
          <h3>📚 Learn</h3>
          <p>Naturversity lessons in languages, art, music, wellness, and more.</p>
        </div>
        <div className={styles.pill}>
          <h3>🪙 Earn</h3>
          <p>Collect badges, save favorites, and build your Navatar card.<br/><em>Natur Coin — coming soon</em></p>
        </div>
      </section>

      <section className={styles.flow}>
        <div className={styles.flowCard}>
          <strong>1) Create</strong>
          <span>Create a free account / create your Navatar</span>
        </div>
        <div className={styles.arrow}>↓</div>
        <div className={styles.flowCard}>
          <strong>2) Pick a hub</strong>
          <span>
            <Link to="/worlds">Worlds</Link> • <Link to="/zones">Zones</Link> • <Link to="/marketplace">Marketplace</Link>
          </span>
        </div>
        <div className={styles.arrow}>↓</div>
        <div className={styles.flowCard}>
          <strong>3) Play · Learn · Earn</strong>
          <span>Explore, meet characters, earn badges</span>
          <small>(Natur Coin — coming soon)</small>
        </div>

        {!loading && !user && (
          <div className={styles.bottomCtas}>
            <Link className={styles.btn} to="/auth">Get started</Link>
            <Link className={styles.btnSecondary} to="/auth/google">Continue with Google</Link>
          </div>
        )}
      </section>
    </main>
  )
}
