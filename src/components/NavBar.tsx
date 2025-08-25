'use client';
import { Link } from 'react-router-dom';
import styles from './NavBar.module.css';
import { useAuth } from '@/lib/auth-context';

export default function NavBar() {
  const { ready, user } = useAuth();
  const emoji =
    (user?.user_metadata?.navemoji as string) ??
    (user?.user_metadata?.avatar_emoji as string) ??
    '🧑';

  return (
    <header className={styles.wrap}>
      <Link to="/" className={styles.brand}>
        🌿 Naturverse
      </Link>
      <div className={styles.icons} key={user?.id ?? 'anon'}>
        {ready && user ? (
          <>
            <Link to="/cart" aria-label="Cart" className={styles.iconBtn}>
              🛒
            </Link>
            <Link to="/profile" aria-label="Profile" className={styles.iconBtn}>
              <span className={styles.avatarEmoji}>{emoji}</span>
            </Link>
          </>
        ) : null}
      </div>
    </header>
  );
}
