import styles from './NavBar.module.css';

function CartIcon() {
  return <span aria-hidden>🛒</span>;
}

export default function NavBar() {
  const user = null as { email?: string } | null;
  return (
    <header className={styles.wrap}>
      <a href="/" className={styles.brand}>Naturverse</a>
      <nav className={styles.tools}>
        {user?.email && <span className={styles.userPill}>{user.email}</span>}
        <a href="/cart" aria-label="Cart"><CartIcon /></a>
        <button className={styles.menuBtn} aria-label="Menu">
          <span className={styles.iconDesktop} aria-hidden>≡</span>
          <span className={styles.iconMobile} aria-hidden>🍃</span>
        </button>
      </nav>
    </header>
  );
}
