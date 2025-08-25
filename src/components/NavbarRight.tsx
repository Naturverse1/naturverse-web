'use client';
import { Link } from 'react-router-dom';
import styles from './NavBar.module.css';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase-client';

export default function NavbarRight() {
  type SBUser = NonNullable<
    Awaited<ReturnType<typeof supabase.auth.getSession>>['data']['session']
  >['user'];
  const [user, setUser] = useState<SBUser | null>(null);
  const [displayEmoji, setDisplayEmoji] = useState('🧑');

  // On mount, read current session and subscribe to auth changes
  useEffect(() => {
    let isMounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!isMounted) return;
      setUser(data.session?.user ?? null);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return;
      setUser(session?.user ?? null);
    });

    return () => {
      isMounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  // Reflect custom emoji stored in user metadata
  useEffect(() => {
    const emoji =
      (user?.user_metadata &&
        (user.user_metadata.navemoji || user.user_metadata.avatar_emoji)) ||
      '🧑';
    setDisplayEmoji(emoji);
  }, [user]);

  // Do not render any placeholder while signed out
  if (!user) return null;

  return (
    <div key={user.id} className={styles.icons}>
      <Link to="/cart" aria-label="Cart" className={styles.iconBtn}>
        🛒
      </Link>
      <Link to="/profile" aria-label="Profile" className={styles.iconBtn}>
        <span className={styles.avatarEmoji}>{displayEmoji}</span>
      </Link>
    </div>
  );
}
