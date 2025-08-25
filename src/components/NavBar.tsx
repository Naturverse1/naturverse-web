'use client';
import { Link } from 'react-router-dom';
import styles from './NavBar.module.css';
import { useAuthState } from '../lib/auth-context';
import { useProfileEmoji } from '../lib/use-profile-emoji';

export default function NavBar() {
  const { loading, signedIn } = useAuthState();
  const emoji = useProfileEmoji();

  return (
    <header className={styles.wrap}>
      <Link to="/" className={styles.brand}>🌿 Naturverse</Link>
      <nav className={styles.icons}>
        {signedIn && !loading && (
          <>
            <Link to="/cart" aria-label="Cart" className={styles.iconBtn}>🛒</Link>
            <Link to="/profile" aria-label="Profile" className={styles.iconBtn}>
              <span className={styles.avatarEmoji}>{emoji}</span>
            </Link>
          </>
        )}
        <button className={styles.menuBtn} aria-label="Menu">≡</button>
      </nav>
    </header>
  );
}
