import styles from './NavBar.module.css';
import { useAuth } from '../auth/AuthContext';

function CartIcon() {
  return <span aria-hidden>🛒</span>;
}

export default function NavBar() {
  const { session } = useAuth();
  return (
    <header className={styles.wrap}>
      <a href="/" className={styles.brand}>Naturverse</a>
      <nav className={styles.tools}>
        <a href="/cart" aria-label="Cart"><CartIcon /></a>
        {session && (
          <a href="/profile" aria-label="Profile" className="profile-icon">
            <span aria-hidden>👤</span>
          </a>
        )}
        <button className={styles.menuBtn} aria-label="Menu">
          <span className={styles.iconDesktop} aria-hidden>≡</span>
          <span className={styles.iconMobile} aria-hidden>🍃</span>
        </button>
      </nav>
    </header>
  );
}
