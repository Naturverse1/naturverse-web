import styles from './Header.module.css'

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.shell}>
        {/* Brand */}
        <a href="/" className={styles.brand}>
          <img src="/logo-32.png" alt="" className={styles.brandIcon} />
          <span className={styles.brandText}>The Naturverse</span>
        </a>

        {/* Right actions (always visible) */}
        <div className={styles.actions}>
          {/* profile/avatar slot */}
          <div id="header-profile-slot" />
          {/* cart slot */}
          <div id="header-cart-slot" />
          {/* mobile overflow menu (≤1024) */}
          <button className={styles.overflowBtn} aria-label="Menu">⋯</button>
        </div>
      </div>

      {/* Desktop nav only (hidden on mobile) */}
      <nav className={styles.desktopNav} aria-label="Primary">
        <a href="/worlds">Worlds</a>
        <a href="/zones">Zones</a>
        <a href="/quests">Quests</a>
        <a href="/marketplace">Marketplace</a>
        <a href="/wishlist">Wishlist</a>
        <a href="/naturversity">Naturversity</a>
        <a href="/naturbank">NaturBank</a>
        <a href="/navatar">Navatar</a>
        <a href="/passport">Passport</a>
      </nav>
    </header>
  )
}

