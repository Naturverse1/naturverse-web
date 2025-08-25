'use client';
import { Link } from 'react-router-dom';
import styles from './NavBar.module.css';
import { useAuthState } from '../lib/auth-context';
import { useProfileEmoji } from '../lib/use-profile-emoji';

export default function NavbarRight() {
  const { loading, signedIn, email, version } = useAuthState();
  const emoji = useProfileEmoji();

  // Do not render any placeholder while loading or signed out — avoids the "little line"
  if (loading || !signedIn) return null;

  // Key forces a clean remount whenever auth flips (fixes first-load stale UI)
  return (
    <div key={`${version}-${email ?? ''}`} className={styles.icons}>
      <Link to="/cart" aria-label="Cart" className={styles.iconBtn}>🛒</Link>
      <Link to="/profile" aria-label="Profile" className={styles.iconBtn}>
        <span className={styles.avatarEmoji}>{emoji}</span>
      </Link>
    </div>
  );
}
